import { prisma } from "@/lib/prisma"
import { Testimonials } from "@/components/sections/Testimonials"
import { getSiteConfig, getTexts, Locale } from "@/lib/i18n"
import { cookies } from "next/headers"
import { unstable_cache } from "next/cache"
import Image from "next/image"
import dynamic from "next/dynamic"

const ProductGallery = dynamic(
    () => import("@/components/product/ProductGallery").then(m => m.ProductGallery),
    { loading: () => <div className="aspect-square bg-muted/30 rounded-3xl animate-pulse" /> }
)
const ProductForm = dynamic(
    () => import("@/components/product/ProductForm").then(m => m.ProductForm),
    { loading: () => <div className="h-[600px] bg-muted/30 rounded-3xl animate-pulse" /> }
)
const Faq = dynamic(() => import("@/components/sections/Faq").then(m => m.Faq))
const ClinicalStats = dynamic(() => import("@/components/sections/ClinicalStats").then(m => m.ClinicalStats))
const UseCases = dynamic(() => import("@/components/sections/UseCases").then(m => m.UseCases))
const ExpertEndorsement = dynamic(() => import("@/components/sections/ExpertEndorsement").then(m => m.ExpertEndorsement))
const PlantarFasciitisArticle = dynamic(() => import("@/components/sections/PlantarFasciitisArticle").then(m => m.PlantarFasciitisArticle))
const CoinFlipGame = dynamic(() => import("@/components/sections/CoinFlipGame").then(m => m.CoinFlipGame))
const StickyAddToCart = dynamic(() => import("@/components/product/StickyAddToCart").then(m => m.StickyAddToCart))
const TrustBar = dynamic(() => import("@/components/sections/TrustBar").then(m => m.TrustBar))
const WhatMakesSpecial = dynamic(() => import("@/components/sections/WhatMakesSpecial").then(m => m.WhatMakesSpecial))
const SocialProofFeed = dynamic(() => import("@/components/sections/SocialProofFeed").then(m => m.SocialProofFeed))
const FreeEbook = dynamic(() => import("@/components/sections/FreeEbook").then(m => m.FreeEbook))

export const revalidate = 60 // ISR: regenerate every 60s instead of force-dynamic

const getCachedProductData = unstable_cache(
    async () => {
        try {
            const prod = await prisma.product.findFirst({ where: { type: "MAIN" }, orderBy: { createdAt: 'desc' } });
            if (prod) {
                const bundles = await prisma.bundle.findMany({ orderBy: { quantity: 'asc' } });
                return { dbProduct: prod, dbBundles: bundles || [] };
            }
        } catch (e) {
            console.error("Failed to load product from DB:", e);
        }
        return { dbProduct: null, dbBundles: [] };
    },
    ["product-orange-page-data"],
    {
        revalidate: 60, // Match page ISR — updates appear within 60s
        tags: ["products", "bundles"]
    }
)

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
    const { dbProduct, dbBundles } = await getCachedProductData();

    const bundles = dbBundles.length > 0
        ? dbBundles.map(b => ({
            id: b.id || b.quantity,
            name: b.name || (b.quantity === 1 ? "1 Paire" : `${b.quantity} Paires`),
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

    const productImages = [
        "/product-orange/chaussures_biarritz_1080.png",
        "/product-orange/semelle_biarritz_1080.png",
        "/product-orange/semelle_biarritz_1080_massage.png",
        "/product-orange/semelle_biarritz_1080_trimmable.png",
        "/product-orange/0b1b47319db40461fef06ec0fba5965bf160c9febbf261ea21e6a3c4ae75183b.mp4",
        "/product-orange/8ce75cf067ac96e28800238a3a85ef31d1a38d409b0ba5f528ef0fc42453baf7.mp4",
        "/product-orange/fa5fe2d95b32cc92aecf4f51df2e7dff41f56be7aad359defe86709bf2b2d3b9.mp4"
    ]


    return (
        <main className="py-12 md:py-24">
            {/* Trust badges scrolling bar */}
            <TrustBar />
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-24 overflow-hidden">
                    {/* Left Column: Gallery */}
                    <div className="lg:sticky lg:top-24 h-fit min-w-0 overflow-hidden">
                        <ProductGallery productImages={productImages} />
                    </div>

                    {/* Right Column: Details & Form */}
                    <div className="min-w-0">
                        <ProductForm bundles={bundles} t={t} dbProduct={dbProduct} />
                    </div>
                </div>
            </div>

            {/* Lifestyle Image Grid - Insole themed */}
            <section className="py-12 border-y bg-muted/20 mb-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-black text-center mb-8 uppercase tracking-wide">
                        {t.lifestyleTitle || "Tous les jours. Toutes les Chaussures."}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <Image src="/insole-running.png" alt="Semelles sport" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover hover:scale-105 transition-transform duration-700" />
                            <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs font-black px-3 py-1 rounded uppercase tracking-wider">Sport &amp; Running</div>
                        </div>
                        <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <Image src="/insole-daily.png" alt="Semelles quotidien" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover hover:scale-105 transition-transform duration-700" />
                            <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs font-black px-3 py-1 rounded uppercase tracking-wider">Marche Quotidienne</div>
                        </div>
                        <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <Image src="/insole-work.png" alt="Semelles travail" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover hover:scale-105 transition-transform duration-700" />
                            <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs font-black px-3 py-1 rounded uppercase tracking-wider">Travail &amp; Bureau</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* La Différence Biarritz — 4 pillars */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <span className="inline-block text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
                            Notre Différence
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                            La Différence Biarritz
                        </h2>
                        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                            Une conception pensée pour votre confort au quotidien, quelles que soient vos activités.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {[
                            { emoji: "🦴", title: "Améliore la Posture", desc: "Le soutien de la voûte favorise un meilleur alignement de la colonne vertébrale." },
                            { emoji: "⚡", title: "Booste les Performances", desc: "Chaque pas gagne en amorti, rendant la marche et la course plus légères." },
                            { emoji: "✂️", title: "Taille Ajustable", desc: "Découpez simplement le long des lignes pointillées pour un ajustement parfait." },
                            { emoji: "💧", title: "Facilement Lavables", desc: "Lavage à la main avec de l'eau et du savon — séchage naturel en quelques heures." },
                        ].map((item, i) => (
                            <div key={i} className="bg-muted/30 rounded-3xl p-6 border text-center hover:shadow-md transition-shadow">
                                <div className="text-4xl mb-4">{item.emoji}</div>
                                <h3 className="font-black text-base mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Clinical Stats */}
            <ClinicalStats />

            {/* Use Cases - Profiles */}
            <UseCases />

            {/* Expert Endorsement */}
            <ExpertEndorsement />

            {/* What Makes Us Special — 6 pillars + benefits list */}
            <WhatMakesSpecial />

            {/* Plantar Fasciitis Article - Medical Authority Content */}
            <PlantarFasciitisArticle />

            {/* Social Proof */}
            <Testimonials />

            {/* Social Feed - real persona testimonials */}
            <SocialProofFeed />

            {/* Free eBook offer */}
            <FreeEbook />

            {/* Coin Flip Mini-Game */}
            <CoinFlipGame />

            {/* FAQ */}
            <Faq />

            {/* Sticky bottom add-to-cart bar */}
            <StickyAddToCart bundles={bundles} dbProduct={dbProduct} />
        </main>
    )
}
