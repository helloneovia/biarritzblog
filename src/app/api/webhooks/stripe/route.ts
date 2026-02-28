import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { sendAccountCreatedEmail, sendOrderConfirmationEmail } from "@/lib/email"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

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
            const session = event.data.object as any

            // 1. Retrieve items from metadata
            const items = JSON.parse(session.metadata?.items || "[]")
            const email = session.customer_details?.email;

            if (!email) {
                return NextResponse.json({ error: "No email provided by Stripe" }, { status: 400 })
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
                    totalAmount: session.amount_total / 100,
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
                totalAmount: session.amount_total / 100,
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
        }

        return NextResponse.json({ received: true })

    } catch (error: any) {
        ((global as any).__WEBHOOK_LOGS__ || []).unshift(`[${new Date().toISOString()}] STRIPE_WEBHOOK_ERROR: ${error.message || error}`);
        console.error("STRIPE_WEBHOOK_ERROR", error)
        return NextResponse.json({ error: error.message || "Webhook handler failed" }, { status: 500 })
    }
}
