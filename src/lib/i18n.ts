import { prisma } from "@/lib/prisma"

export type Locale = "EN" | "FR" | "ES"
export const SUPPORTED_LOCALES: Locale[] = ["EN", "FR", "ES"]
export const DEFAULT_LOCALE: Locale = "EN"

// Currency symbols
export const CURRENCY_SYMBOLS: Record<string, string> = {
    EUR: "€", USD: "$", GBP: "£", CHF: "CHF"
}

// Default text keys per language (fallback)
const DEFAULTS: Record<Locale, Record<string, string>> = {
    EN: {
        heroBadge: "🎉 New 2024 Design Released",
        heroTitle: "Walk Pain-Free.",
        heroTitleHighlight: "Every Single Step.",
        heroSubtitle: "Premium orthopaedic insoles engineered to realign your posture, cushion your heels, and eliminate foot, knee, and back pain instantly.",
        heroImage: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        heroButton: "Shop Now — Pain-Free in 24h",
        featuresTitle: "Why Choose Biarritz?",
        featuresSubtitle: "Built with advanced podiatric technology, our insoles target the root cause of foot and back pain.",
        f1Title: "Instant Pain Relief", f1Desc: "Clinically proven to reduce plantar fasciitis, heel and metatarsalgia pain from day one.",
        f2Title: "Posture Realignment", f2Desc: "Corrects overpronation and flat feet, aligning your entire body from the ground up.",
        f3Title: "All-Day Comfort", f3Desc: "Medical-grade EVA foam with targeted cushioning zones for maximum shock absorption.",
        ctaTitle: "Ready to Take Your Life Back?",
        ctaSubtitle: "Join 50,000+ others who found instant pain relief with Biarritz.",
        ctaButton: "Get Your Pair Now",
        ctaGuarantee: "30-Day Money-Back Guarantee",
        navBlog: "Blog", navBenefits: "Benefits", navReviews: "Reviews", navFaq: "FAQ",
    },
    FR: {
        heroBadge: "🎉 Nouvelle collection 2024",
        heroTitle: "Marchez sans douleur.",
        heroTitleHighlight: "Chaque pas compte.",
        heroSubtitle: "Semelles orthopédiques premium conçues pour réaligner votre posture, amortir vos talons et éliminer instantanément les douleurs.",
        heroImage: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        heroButton: "Commander — Sans douleur en 24h",
        featuresTitle: "Pourquoi Biarritz ?",
        featuresSubtitle: "Conçues avec une technologie podiatrique avancée, nos semelles ciblent la cause des douleurs.",
        f1Title: "Soulagement immédiat", f1Desc: "Cliniquement prouvé pour réduire la fasciite plantaire et les douleurs dès le premier jour.",
        f2Title: "Réalignement postural", f2Desc: "Corrige la pronation et les pieds plats, alignant todo ton corps depuis le sol.",
        f3Title: "Confort toute la journée", f3Desc: "Mousse EVA médicale avec zones de coussin ciblées pour une absorption maximale.",
        ctaTitle: "Reprenez votre vie en main !",
        ctaSubtitle: "Rejoignez 50 000+ personnes qui ont trouvé un soulagement instantané avec Biarritz.",
        ctaButton: "Obtenir ma paire",
        ctaGuarantee: "Garantie 30 jours Satisfait ou Remboursé",
        navBlog: "Blog", navBenefits: "Bénéfices", navReviews: "Avis", navFaq: "FAQ",
    },
    ES: {
        heroBadge: "🎉 Nuevo diseño 2024",
        heroTitle: "Camina sin dolor.",
        heroTitleHighlight: "Cada paso importa.",
        heroSubtitle: "Plantillas ortopédicas premium diseñadas para realinear tu postura, amortiguar tus talones y eliminar el dolor al instante.",
        heroImage: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        heroButton: "Comprar ahora — Sin dolor en 24h",
        featuresTitle: "¿Por qué Biarritz?",
        featuresSubtitle: "Diseñadas con tecnología podátrica avanzada, nuestras plantillas atacan la causa del dolor.",
        f1Title: "Alivio instantáneo", f1Desc: "Clínicamente probado para reducir la fascitis plantar y el dolor desde el primer día.",
        f2Title: "Realineación postural", f2Desc: "Corrige la pronación y los pies planos, alineando todo tu cuerpo desde el suelo.",
        f3Title: "Comodidad todo el día", f3Desc: "Espuma EVA médica con zonas de amortiguación para máxima absorción de impacto.",
        ctaTitle: "¡Recupera tu vida!",
        ctaSubtitle: "Únete a 50,000+ personas que encontraron alivio instantáneo con Biarritz.",
        ctaButton: "Obtener mi par",
        ctaGuarantee: "Garantía de devolución de 30 días",
        navBlog: "Blog", navBenefits: "Beneficios", navReviews: "Reseñas", navFaq: "FAQ",
    },
}

export async function getSiteConfig() {
    let config = await prisma.siteConfig.findFirst()
    if (!config) {
        config = await prisma.siteConfig.create({
            data: {
                currencyCode: "EUR",
                language: "EN",
                contactEmail: "support@biarritz.blog",
                homeTitle: "Biarritz – Premium Orthopaedic Insoles",
                texts: DEFAULTS,
            }
        })
    }
    return config
}

export function getTexts(config: { texts: any; language: string }, locale?: Locale): Record<string, string> {
    const effectiveLocale = (locale || config.language || DEFAULT_LOCALE) as Locale
    const stored = config.texts?.[effectiveLocale] || {}
    const defaults = DEFAULTS[effectiveLocale] || DEFAULTS[DEFAULT_LOCALE]
    return { ...defaults, ...stored }
}

export function formatPrice(amount: number, currencyCode: string): string {
    try {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 2,
        }).format(amount)
    } catch {
        return `${CURRENCY_SYMBOLS[currencyCode] || currencyCode}${amount.toFixed(2)}`
    }
}
