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
            console.error("CHECKOUT_ERROR: STRIPE_SECRET_KEY is not configured in .env")
            return NextResponse.json({ error: "Le paiement n'est pas encore configuré. Veuillez contacter le support." }, { status: 500 })
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://biarritz.blog"

        // Typical Stripe Checkout Flow
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            billing_address_collection: "required",
            shipping_address_collection: {
                allowed_countries: ["FR", "BE", "CH", "US", "GB", "DE", "IT", "ES"],
            },
            customer_email: email,
            line_items: items.map((item: any) => {
                // Stripe only accepts HTTPS public URLs for images
                const isValidImage = item.image &&
                    typeof item.image === 'string' &&
                    item.image.startsWith('https://');
                return {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: item.name,
                            ...(isValidImage ? { images: [item.image] } : {}),
                            description: `${item.bundle} | Taille: ${item.size}`,
                        },
                        unit_amount: Math.round(item.price * 100),
                    },
                    quantity: item.quantity || 1,
                };
            }),
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
        console.error("STRIPE_CHECKOUT_ERROR:", error?.message || error)
        const message = error?.message?.includes("No such api_key")
            ? "Clé Stripe invalide. Vérifiez votre configuration."
            : "Une erreur est survenue lors du paiement. Réessayez."
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
