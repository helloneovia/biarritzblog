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
    let dbProduct: any = null;
    let dbBundles: any[] = [];

    try {
        const prod = await prisma.product.findFirst();
        if (prod) {
            dbProduct = prod;
            const bundles = await prisma.bundle.findMany({ orderBy: { quantity: 'asc' } });
            dbBundles = bundles || [];
        }
    } catch (e) {
        console.error("Failed to load product from DB:", e);
    }

    const bundles = dbBundles.length > 0
        ? dbBundles.map(b => ({
            id: b.quantity,
            name: b.quantity === 1 ? "1 Paire" : `${b.quantity} Paires`,
            price: b.price,
            original: b.compareAt ?? Math.round(b.price * 1.5),
            subtitle: b.badge || '',
            badge: b.discount > 0 ? `ÉCONOMISEZ ${Math.round(b.discount)}%` : undefined,
        }))
        : [
            { id: 1, name: "1 Paire", price: 39, original: 59, subtitle: "Idéal pour essayer", badge: undefined },
            { id: 2, name: "2 Paires", price: 59, original: 118, subtitle: "Recommandé / Maison & Extérieur", badge: "ÉCONOMISEZ 50%" },
            { id: 3, name: "3 Paires", price: 75, original: 177, subtitle: "Cure intégrale de la famille", badge: "ÉCONOMISEZ 57%" }
        ]

    const productImages = dbProduct?.images?.length ? dbProduct.images : [
        "/temu-product.jpg",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1474631245212-f5627e62d5c0?q=80&w=1200&auto=format&fit=crop"
    ]

    const lsImg1 = t.lifestyle1 || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop";
    const lsImg2 = t.lifestyle2 || "https://images.unsplash.com/photo-1474631245212-f5627e62d5c0?q=80&w=1200&auto=format&fit=crop";
    const lsImg3 = t.lifestyle3 || "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1200&auto=format&fit=crop";

    return (
        <main className="py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-24">
                    {/* Left Column: Gallery */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <ProductGallery productImages={productImages} />
                    </div>

                    {/* Right Column: Details & Form */}
                    <div>
                        <ProductForm bundles={bundles} t={t} dbProduct={dbProduct} />
                    </div>
                </div>
            </div>

            {/* Lifestyle Image Grid - Insole themed */}
            <section className="py-12 border-y bg-muted/20 mb-24">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-black text-center mb-8 uppercase tracking-wide">
                        {t.lifestyleTitle || "Tous les jours. Toutes les Chaussures."}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            {lsImg1.match(/\.(mp4|webm)$/i) ? (
                                <video src={lsImg1} className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" autoPlay loop muted playsInline />
                            ) : (
                                <img src={lsImg1} alt="Semelles sport" className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" />
                            )}
                            <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs font-black px-3 py-1 rounded uppercase tracking-wider">
                                {t.lifestyle1Label || "Sport & Running"}
                            </div>
                        </div>
                        <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            {lsImg2.match(/\.(mp4|webm)$/i) ? (
                                <video src={lsImg2} className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" autoPlay loop muted playsInline />
                            ) : (
                                <img src={lsImg2} alt="Semelles quotidien" className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" />
                            )}
                            <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs font-black px-3 py-1 rounded uppercase tracking-wider">
                                {t.lifestyle2Label || "Marche Quotidienne"}
                            </div>
                        </div>
                        <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            {lsImg3.match(/\.(mp4|webm)$/i) ? (
                                <video src={lsImg3} className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" autoPlay loop muted playsInline />
                            ) : (
                                <img src={lsImg3} alt="Semelles travail" className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" />
                            )}
                            <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs font-black px-3 py-1 rounded uppercase tracking-wider">
                                {t.lifestyle3Label || "Travail & Bureau"}
                            </div>
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
