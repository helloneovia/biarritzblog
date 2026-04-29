import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { getStripe, getStripeKeys } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { sendAccountCreatedEmail, sendOrderConfirmationEmail } from "@/lib/email"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    const { webhookSecret } = await getStripeKeys()
    const stripe = await getStripe()

    const logs = (global as any).__WEBHOOK_LOGS__ || [];
    (global as any).__WEBHOOK_LOGS__ = logs;

    const log = (msg: string) => {
        logs.unshift(`[${new Date().toISOString()}] ${msg}`);
        if (logs.length > 50) logs.pop();
        console.log(msg);
    }

    log("Webhook triggered");

    if (!webhookSecret && process.env.NODE_ENV !== "development") {
        log("Webhook secret missing");
        return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 })
    }
    try {
        const body = await req.text()
        const h = await headers()
        const signature = h.get("Stripe-Signature") as string

        let event: any;

        try {
            if (process.env.NODE_ENV === "development" && !signature) {
                event = JSON.parse(body); // Local test bypass
            } else {
                event = stripe.webhooks.constructEvent(body, signature, webhookSecret!);
            }
            log(`Signature verified. Event: ${event.type}`);
        } catch (err: any) {
            log(`Webhook signature verification failed. ${err.message}`);
            console.error(`Webhook signature verification failed. ${err.message}`)
            return NextResponse.json({ error: err.message }, { status: 400 })
        }

        if (event.type === "checkout.session.completed") {
            const rawSession = event.data.object as any

            // Re-fetch session to expand discounts and get the promotion code used
            const session = await stripe.checkout.sessions.retrieve(rawSession.id, {
                expand: ['total_details.breakdown.discounts.discount.promotion_code']
            })

            // 1. Retrieve items from metadata
            const items = JSON.parse(session.metadata?.items || "[]")
            let email = session.customer_details?.email;

            if (!email) {
                log(`No email provided by Stripe. Generating fallback email for session ${session.id}`);
                email = `client-${session.id.slice(-8).toLowerCase()}@biarritz.blog`;
            }

            log(`Processing checkout.session.completed for ${email}`);

            // Generate a deterministic temporary password if the user needs to be created
            const tempPassword = `Biarritz-${session.id.slice(-6)}`;

            const bcrypt = require("bcryptjs");
            const hashedPassword = await bcrypt.hash(tempPassword, 10);
            log(`Password hashed`);

            // 2. Save order to database via Prisma & Upsert User
            let user = await prisma.user.findUnique({ where: { email } });
            let isNewUser = false;

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        name: session.customer_details?.name || "Client",
                        role: "USER"
                    }
                });
                isNewUser = true;
            }

            const firstName = session.customer_details?.name?.split(' ')[0] || '';
            const lastName = session.customer_details?.name?.split(' ').slice(1).join(' ') || '';
            const fullAddress = [
                session.customer_details?.address?.line1,
                session.customer_details?.address?.postal_code,
                session.customer_details?.address?.city,
                session.customer_details?.address?.country,
            ].filter(Boolean).join(', ');

            log(`Creating order in DB... User Id: ${user.id}`);

            const order = await prisma.order.create({
                data: {
                    email,
                    firstName,
                    lastName,
                    address: session.customer_details?.address?.line1 || '',
                    city: session.customer_details?.address?.city || '',
                    postalCode: session.customer_details?.address?.postal_code || '',
                    country: session.customer_details?.address?.country || 'FR',
                    totalAmount: (session.amount_total || 0) / 100,
                    status: "PAID",
                    stripeSession: session.id,
                    userId: user.id,
                    items: {
                        create: items.map((item: any) => ({
                            product: {
                                connectOrCreate: {
                                    where: { id: item.id?.toString() || "default" },
                                    create: {
                                        id: item.id?.toString() || "default",
                                        name: `Bundle ${item.id}`,
                                        description: "Generated from checkout",
                                        price: Number(item.p) || 0,
                                    }
                                }
                            },
                            quantity: item.q || 1,
                            price: Number(item.p) || 0,
                            size: item.size || ''
                        }))
                    }
                }
            })

            log(`Order created: ${order.id}`)

            // 2.5 Affiliate Commission Logic
            const discounts = session.total_details?.breakdown?.discounts as any[];
            let appliedPromoCodeStr = null;

            if (discounts && discounts.length > 0) {
                const discountObj = discounts[0].discount;
                if (discountObj && discountObj.promotion_code) {
                    appliedPromoCodeStr = discountObj.promotion_code.code;
                }
            }

            if (appliedPromoCodeStr) {
                log(`Promo code used: ${appliedPromoCodeStr}`);

                // Find PromoCode in DB and check if it belongs to an Affiliate
                const promoCode = await prisma.promoCode.findUnique({
                    where: { code: appliedPromoCodeStr },
                    include: { affiliate: true }
                });

                if (promoCode) {
                    // Update usage count and link to order
                    await prisma.promoCode.update({
                        where: { id: promoCode.id },
                        data: { usageCount: { increment: 1 } }
                    });

                    await prisma.order.update({
                        where: { id: order.id },
                        data: { promoCodeId: promoCode.id }
                    });

                    if (promoCode.affiliateId && promoCode.affiliate) {
                        log(`Affiliate ${promoCode.affiliateId} found for promo code ${appliedPromoCodeStr}`);

                        // Calculate dynamic commission based on affiliate's commissionRate
                        // Note: totalAmount is already net of discounts from Stripe
                        const rate = promoCode.affiliate.commissionRate / 100;
                        const commissionAmount = order.totalAmount * rate;

                        // Create Commission record
                        await prisma.commission.create({
                            data: {
                                affiliateId: promoCode.affiliateId,
                                orderId: order.id,
                                amount: commissionAmount,
                                status: "PENDING"
                            }
                        });

                        // Add to Affiliate balance
                        await prisma.affiliateProfile.update({
                            where: { id: promoCode.affiliateId },
                            data: {
                                balance: { increment: commissionAmount },
                                totalEarned: { increment: commissionAmount }
                            }
                        });

                        log(`Credited ${commissionAmount}€ to affiliate ${promoCode.affiliateId}`);
                    }
                }
            }

            // 3. Send emails
            const orderItemsForEmail = items.map((item: any) => ({
                name: `Semelles Biarritz (Bundle ${item.id})`,
                quantity: item.q || 1,
                price: Number(item.p) || 0,
                size: item.size || '',
            }))

            // Send order confirmation to everyone
            await sendOrderConfirmationEmail({
                email,
                name: session.customer_details?.name || 'Client',
                orderId: order.id.slice(-8).toUpperCase(),
                orderItems: orderItemsForEmail,
                totalAmount: (session.amount_total || 0) / 100,
                address: fullAddress,
            })

            // Send account creation email only for new users
            if (isNewUser) {
                await sendAccountCreatedEmail({
                    email,
                    name: firstName || 'Client',
                    tempPassword,
                    orderId: order.id.slice(-8).toUpperCase(),
                })
            }

            log(`Emails sent. Order ${order.id} processed for ${email}. New User: ${isNewUser}`)
        } else if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object as any

            // Try to extract email
            let email = paymentIntent.receipt_email;
            if (!email && paymentIntent.payment_method) {
                try {
                    const pm = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
                    email = pm.billing_details?.email;
                } catch(e) {}
            }
            if (!email) {
                log(`No email provided. Generating fallback email for PI ${paymentIntent.id}`);
                email = `client-${paymentIntent.id.slice(-8).toLowerCase()}@biarritz.blog`;
            }

            const items = JSON.parse(paymentIntent.metadata?.items || "[]")
            const tempPassword = `Biarritz-${paymentIntent.id.slice(-6)}`;
            const bcrypt = require("bcryptjs");
            const hashedPassword = await bcrypt.hash(tempPassword, 10);
            
            let user = await prisma.user.findUnique({ where: { email } });
            let isNewUser = false;
            
            const shipping = paymentIntent.shipping || {};
            const customerName = shipping.name || "Client";
            const address = shipping.address || {};

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        name: customerName,
                        role: "USER"
                    }
                });
                isNewUser = true;
            }

            const firstName = customerName.split(' ')[0] || '';
            const lastName = customerName.split(' ').slice(1).join(' ') || '';
            const fullAddress = [
                address.line1,
                address.postal_code,
                address.city,
                address.country,
            ].filter(Boolean).join(', ');

            log(`Creating order in DB for PI... User Id: ${user.id}`);

            const order = await prisma.order.create({
                data: {
                    email,
                    firstName,
                    lastName,
                    address: address.line1 || '',
                    city: address.city || '',
                    postalCode: address.postal_code || '',
                    country: address.country || 'FR',
                    totalAmount: (paymentIntent.amount || 0) / 100,
                    status: "PAID",
                    stripeSession: paymentIntent.id,
                    userId: user.id,
                    items: {
                        create: items.map((item: any) => ({
                            product: {
                                connectOrCreate: {
                                    where: { id: item.id?.toString() || "default" },
                                    create: {
                                        id: item.id?.toString() || "default",
                                        name: `Bundle ${item.id}`,
                                        description: "Generated from checkout",
                                        price: Number(item.p) || 0,
                                    }
                                }
                            },
                            quantity: item.q || 1,
                            price: Number(item.p) || 0,
                            size: item.size || ''
                        }))
                    }
                }
            })

            const orderItemsForEmail = items.map((item: any) => ({
                name: `Semelles Biarritz (Bundle ${item.id})`,
                quantity: item.q || 1,
                price: Number(item.p) || 0,
                size: item.size || '',
            }))

            await sendOrderConfirmationEmail({
                email,
                name: customerName,
                orderId: order.id.slice(-8).toUpperCase(),
                orderItems: orderItemsForEmail,
                totalAmount: (paymentIntent.amount || 0) / 100,
                address: fullAddress,
            })

            if (isNewUser) {
                await sendAccountCreatedEmail({
                    email,
                    name: firstName || 'Client',
                    tempPassword,
                    orderId: order.id.slice(-8).toUpperCase(),
                })
            }

            log(`PI Emails sent. Order ${order.id} processed for ${email}. New User: ${isNewUser}`)
        }

        return NextResponse.json({ received: true })

    } catch (error: any) {
        ((global as any).__WEBHOOK_LOGS__ || []).unshift(`[${new Date().toISOString()}] STRIPE_WEBHOOK_ERROR: ${error.message || error}`);
        console.error("STRIPE_WEBHOOK_ERROR", error)
        return NextResponse.json({ error: error.message || "Webhook handler failed" }, { status: 500 })
    }
}
