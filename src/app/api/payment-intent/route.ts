import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { items } = body

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
        }

        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "dummy_key_for_build") {
            return NextResponse.json({ error: "Stripe non configuré" }, { status: 500 })
        }

        // Compute total amount in cents
        const amount = Math.round(
            items.reduce((sum: number, item: any) => sum + item.price * (item.quantity || 1), 0) * 100
        )

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "eur",
            automatic_payment_methods: { enabled: true },
            metadata: {
                items: JSON.stringify(
                    items.map((i: any) => ({ id: i.id, name: i.name, size: i.size, q: i.quantity || 1, p: i.price }))
                ),
            },
        })

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            amount,
        })
    } catch (error: any) {
        console.error("PAYMENT_INTENT_ERROR:", error?.message || error)
        return NextResponse.json({ error: error?.message || "Erreur lors de la création du paiement" }, { status: 500 })
    }
}
