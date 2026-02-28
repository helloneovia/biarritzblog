import { prisma } from "@/lib/prisma"
import { ProductGallery } from "@/components/product/ProductGallery"
import { ProductForm } from "@/components/product/ProductForm"
import { Testimonials } from "@/components/sections/Testimonials"
import { Faq } from "@/components/sections/Faq"

export const dynamic = "force-dynamic"

export const metadata = {
    title: "Premium Orthopaedic Insoles - Biarritz",
    description: "Buy the #1 rated orthopaedic insoles for pain relief.",
}

export default async function ProductPage() {
    // Fetch real bundles from DB
    const dbBundles = await prisma.bundle.findMany({
        orderBy: { quantity: 'asc' },
    })

    // Convert to ProductForm format, fallback if DB is empty
    const bundles = dbBundles.length > 0
        ? dbBundles.map(b => ({
            id: b.quantity,
            name: b.name,
            price: b.price,
            original: b.compareAt ?? Math.round(b.price * 1.5),
            subtitle: b.badge || '',
            badge: b.discount > 0 ? `SAVE ${Math.round(b.discount)}%` : undefined,
        }))
        : [
            { id: 1, name: "1 Pair", price: 39, original: 59, subtitle: "Try it out", badge: undefined },
            { id: 2, name: "2 Pairs", price: 59, original: 118, subtitle: "Most Popular", badge: "SAVE 50%" },
            { id: 3, name: "3 Pairs", price: 75, original: 177, subtitle: "Best Value", badge: "SAVE 57%" }
        ]

    return (
        <main className="py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-24">
                    {/* Left Column: Gallery */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <ProductGallery />
                    </div>

                    {/* Right Column: Details & Form */}
                    <div>
                        <ProductForm bundles={bundles} />
                    </div>
                </div>
            </div>

            {/* Social Proof & FAQ */}
            <Testimonials />
            <Faq />
        </main>
    )
}
