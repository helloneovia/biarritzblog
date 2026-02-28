import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
// import prisma from "@/lib/prisma" // uncomment when DB is connected

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { items, email } = body

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
        }

        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "dummy_key_for_build") {
            return NextResponse.json({ error: "Checkout offline: Missing STRIPE_SECRET_KEY in production" }, { status: 500 })
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://biarritz.blog"

        // Typical Stripe Checkout Flow
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card", "paypal", "klarna"], // klarna/afterpay depending on region
            billing_address_collection: "required",
            shipping_address_collection: {
                allowed_countries: ["FR", "BE", "CH", "US", "GB", "DE", "IT", "ES"],
            },
            customer_email: email,
            line_items: items.map((item: any) => ({
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: item.name,
                        images: [item.image],
                        description: `${item.bundle} | Size: ${item.size}`,
                    },
                    unit_amount: Math.round(item.price * 100), // Stripe expects cents
                },
                quantity: item.quantity || 1,
            })),
            mode: "payment",
            success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}/cart?canceled=1`,
            allow_promotion_codes: true, // Enable native Stripe promo codes
            metadata: {
                // Will be used in webhook to create DB Order
                items: JSON.stringify(items.map((i: any) => ({ id: i.id, size: i.size, q: i.quantity || 1, p: i.price || 0 }))),
            },
        })

        return NextResponse.json({ url: session.url })

    } catch (error: any) {
        console.error("STRIPE_CHECKOUT_ERROR", error)
        return NextResponse.json({ error: "An error occurred during checkout" }, { status: 500 })
    }
}
