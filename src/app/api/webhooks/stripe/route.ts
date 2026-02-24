import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
// import prisma from "@/lib/prisma" // uncomment when DB is connected

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
    try {
        const body = await req.text()
        const h = await headers()
        const signature = h.get("Stripe-Signature") as string

        let event

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
        } catch (err: any) {
            console.error(`Webhook signature verification failed. ${err.message}`)
            return NextResponse.json({ error: err.message }, { status: 400 })
        }

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as any

            // 1. Retrieve items from metadata
            const items = JSON.parse(session.metadata?.items || "[]")

            // 2. Save order to database via Prisma
            // await prisma.order.create({
            //   data: {
            //     email: session.customer_details?.email,
            //     firstName: session.customer_details?.name?.split(' ')[0] || '',
            //     lastName: session.customer_details?.name?.split(' ').slice(1).join(' ') || '',
            //     address: session.customer_details?.address?.line1 || '',
            //     city: session.customer_details?.address?.city || '',
            //     postalCode: session.customer_details?.address?.postal_code || '',
            //     country: session.customer_details?.address?.country || 'FR',
            //     totalAmount: session.amount_total / 100,
            //     status: "COMPLETED",
            //     stripeSession: session.id,
            //     items: {
            //       create: items.map((item: any) => ({
            //         productId: item.id,
            //         quantity: item.q,
            //         size: item.size
            //       }))
            //     }
            //   }
            // })

            // 3. Send email confirmation (via Resend/Nodemailer)
            console.log(`Order ${session.id} processed for ${session.customer_details?.email}`)
        }

        return NextResponse.json({ received: true })

    } catch (error: any) {
        console.error("STRIPE_WEBHOOK_ERROR", error)
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
    }
}
