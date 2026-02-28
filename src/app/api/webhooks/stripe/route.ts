import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret && process.env.NODE_ENV !== "development") {
        return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 })
    }
    try {
        const body = await req.text()
        const h = await headers()
        const signature = h.get("Stripe-Signature") as string

        let event

        try {
            if (process.env.NODE_ENV === "development" && !signature) {
                event = JSON.parse(body); // Local test bypass
            } else {
                event = stripe.webhooks.constructEvent(body, signature, webhookSecret!);
            }
        } catch (err: any) {
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

            // Generate a deterministic temporary password if the user needs to be created
            const tempPassword = `Biarritz-${session.id.slice(-6)}`;

            // We use dynamic import for bcrypt to avoid Next.js edge runtime issues just in case,
            // though Stripe webhooks should be Node.js runtime.
            const bcrypt = require("bcryptjs");
            const hashedPassword = await bcrypt.hash(tempPassword, 10);

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

            await prisma.order.create({
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
                            productId: item.id,
                            quantity: item.q,
                            size: item.size
                        }))
                    }
                }
            })

            // 3. Send email confirmation (via Resend/Nodemailer)
            console.log(`Order ${session.id} processed for ${email}. New User: ${isNewUser}`)
        }

        return NextResponse.json({ received: true })

    } catch (error: any) {
        console.error("STRIPE_WEBHOOK_ERROR", error)
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
    }
}
