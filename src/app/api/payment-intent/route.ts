import { NextResponse } from "next/server"
import { getStripe, getStripeKeys } from "@/lib/stripe"
import { UAParser } from "ua-parser-js"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { items } = body

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
        }

        const stripe = await getStripe();
        const { publicKey, secretKey } = await getStripeKeys();

        if (!secretKey || secretKey === "dummy_key_for_build") {
            return NextResponse.json({ error: "Stripe non configuré" }, { status: 500 })
        }

        // Compute total amount in cents
        const amount = Math.round(
            items.reduce((sum: number, item: any) => sum + item.price * (item.quantity || 1), 0) * 100
        )

        const userAgentString = req.headers.get("user-agent") || "";
        const parser = new UAParser(userAgentString);
        const browser = parser.getBrowser().name || "Unknown";
        const os = parser.getOS().name || "Unknown";
        const deviceType = parser.getDevice().type || "Desktop";

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "eur",
            automatic_payment_methods: { enabled: true },
            metadata: {
                items: JSON.stringify(
                    items.map((i: any) => ({ id: i.id, name: i.name, size: i.size, q: i.quantity || 1, p: i.price }))
                ),
                device: deviceType,
                os: os,
                browser: browser
            },
        })

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            publicKey,
            amount,
        })
    } catch (error: any) {
        console.error("PAYMENT_INTENT_ERROR:", error?.message || error)
        return NextResponse.json({ error: error?.message || "Erreur lors de la création du paiement" }, { status: 500 })
    }
}
