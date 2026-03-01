import { prisma } from "@/lib/prisma"
import { ProductGallery } from "@/components/product/ProductGallery"
import { ProductForm } from "@/components/product/ProductForm"
import { Testimonials } from "@/components/sections/Testimonials"
import { Faq } from "@/components/sections/Faq"
import { getSiteConfig, getTexts, Locale } from "@/lib/i18n"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export const metadata = {
    title: "Premium Orthopaedic Insoles - Biarritz",
    description: "Buy the #1 rated orthopaedic insoles for pain relief.",
}

export default async function ProductPage() {
    const cookieStore = await cookies()
    const locale = (cookieStore.get("NEXT_LOCALE")?.value || "EN") as Locale
    const config = await getSiteConfig()
    const t = getTexts(config, locale)

    // Fetch the primary product and real bundles from DB
    const dbProduct = await prisma.product.findFirst({
        orderBy: { createdAt: 'desc' }
    }).catch(() => null)

    const dbBundles = await prisma.bundle.findMany({
        orderBy: { quantity: 'asc' },
    }).catch(() => [])

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
                        <ProductGallery productImages={dbProduct?.images} />
                    </div>

                    {/* Right Column: Details & Form */}
                    <div>
                        <ProductForm bundles={bundles} t={t} dbProduct={dbProduct} />
                    </div>
                </div>
            </div>

            {/* Lifestyle Image Grid */}
            <section className="py-12 border-y bg-slate-50 mb-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop" alt="Zen Acupressure" className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <img src="https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?q=80&w=1200&auto=format&fit=crop" alt="Spa Elements" className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <img src="https://images.unsplash.com/photo-1545648583-b26a5c102c91?q=80&w=1200&auto=format&fit=crop" alt="Natural Healing" className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof & FAQ */}
            <Testimonials />
            <Faq />
        </main>
    )
}
