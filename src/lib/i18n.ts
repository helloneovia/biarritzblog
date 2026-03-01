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
        // Additional UI elements
        navLogin: "Login", navDashboard: "Dashboard", navAdmin: "Admin", navShop: "Shop Now",
        cartTitle: "Your Cart", cartEmpty: "Your cart is empty.", cartCheckout: "Proceed to Checkout", cartSubtotal: "Subtotal",
        productAddToCart: "Add to Cart", productSelectSize: "Select Size", productOutOfStock: "Out of Stock",
        productIncluded: "Included in every order:", productGuarantee: "30-Day Money-Back Guarantee", productShipping: "Free Express Shipping",
        footerContact: "Contact", footerShipping: "Shipping Policy", footerRefunds: "Refund Policy", footerPrivacy: "Privacy Policy", footerTerms: "Terms of Service",
        contactTitle: "Contact Us", contactName: "Name", contactEmail: "Email", contactMessage: "Message", contactSend: "Send Message",
        contactSuccessTitle: "Message Sent!", contactSuccessDesc: "We'll get back to you as soon as possible. Usually within 24h.",
        widgetTitle: "Need help?", widgetMessage: "Leave us a message", widgetWhatsapp: "Chat on WhatsApp",
    },
    FR: {
        heroBadge: "🎉 Nouvelle collection 2024",
        heroTitle: "Marchez vers la Sérénité.",
        heroTitleHighlight: "Chaque pas compte.",
        heroSubtitle: "Découvrez le pouvoir de guérison de l'acupression magnétique à chaque pas.",
        heroImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2620&auto=format&fit=crop",
        heroButton: "Commander — Sans douleur en 24h",
        featuresTitle: "Pourquoi Biarritz ?",
        featuresSubtitle: "Conçues avec une technologie podiatrique avancée, nos semelles ciblent la cause des douleurs.",
        f1Title: "Soulagement immédiat", f1Desc: "Cliniquement prouvé pour réduire la fasciite plantaire et les douleurs dès le premier jour.",
        f2Title: "Réalignement postural", f2Desc: "Corrige la pronation et les pieds plats, alignant tout votre corps depuis le sol.",
        f3Title: "Confort toute la journée", f3Desc: "Mousse EVA médicale avec zones de coussin ciblées pour une absorption maximale.",
        ctaTitle: "Reprenez votre vie en main !",
        ctaSubtitle: "Rejoignez 50 000+ personnes qui ont trouvé un soulagement instantané avec Biarritz.",
        ctaButton: "Obtenir ma paire",
        ctaGuarantee: "Garantie 30 jours Satisfait ou Remboursé",
        navBlog: "Blog", navBenefits: "Bénéfices", navReviews: "Avis", navFaq: "FAQ",
        // Additional UI elements
        navLogin: "Connexion", navDashboard: "Espace Client", navAdmin: "Admin", navShop: "Acheter",
        cartTitle: "Votre Panier", cartEmpty: "Votre panier est vide.", cartCheckout: "Passer à la caisse", cartSubtotal: "Sous-total",
        productAddToCart: "Ajouter au panier", productSelectSize: "Choisir la taille", productOutOfStock: "Rupture de stock",
        productIncluded: "Inclus dans chaque commande :", productGuarantee: "Garantie 30 Jours Relax", productShipping: "Livraison Express Gratuite",
        footerContact: "Contact", footerShipping: "Livraison", footerRefunds: "Remboursements", footerPrivacy: "Politique de confidentialité", footerTerms: "CGV",
        contactTitle: "Nous Contacter", contactName: "Nom", contactEmail: "Email", contactMessage: "Message", contactSend: "Envoyer le message",
        contactSuccessTitle: "Message Envoyé !", contactSuccessDesc: "Nous vous répondrons le plus rapidement possible. En général sous 24h.",
        widgetTitle: "Besoin d'aide ?", widgetMessage: "Laissez-nous un message", widgetWhatsapp: "Discuter sur WhatsApp",
    },
    ES: {
        heroBadge: "🎉 Nuevo diseño 2024",
        heroTitle: "Camina hacia la Serenidad.",
        heroTitleHighlight: "Cada paso importa.",
        heroSubtitle: "Descubre el poder curativo de la acupresión magnética con cada paso.",
        heroImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2620&auto=format&fit=crop",
        heroButton: "Comprar ahora — Sin dolor en 24h",
        featuresTitle: "¿Por qué Biarritz?",
        featuresSubtitle: "Diseñadas con tecnología podiátrica avanzada, nuestras plantillas atacan la causa del dolor.",
        f1Title: "Alivio instantáneo", f1Desc: "Clínicamente probado para reducir la fascitis plantar y el dolor desde el primer día.",
        f2Title: "Realineación postural", f2Desc: "Corrige la pronación y los pies planos, alineando todo tu cuerpo desde el suelo.",
        f3Title: "Comodidad todo el día", f3Desc: "Espuma EVA médica con zonas de amortiguación para máxima absorción de impacto.",
        ctaTitle: "¡Recupera tu vida!",
        ctaSubtitle: "Únete a 50,000+ personas que encontraron alivio instantáneo con Biarritz.",
        ctaButton: "Obtener mi par",
        ctaGuarantee: "Garantía de devolución de 30 días",
        navBlog: "Blog", navBenefits: "Beneficios", navReviews: "Reseñas", navFaq: "FAQ",
        // Additional UI elements
        navLogin: "Iniciar sesión", navDashboard: "Mi Cuenta", navAdmin: "Admin", navShop: "Comprar ahora",
        cartTitle: "Tu Carrito", cartEmpty: "Tu carrito está vacío.", cartCheckout: "Finalizar compra", cartSubtotal: "Subtotal",
        productAddToCart: "Añadir al carrito", productSelectSize: "Seleccionar talla", productOutOfStock: "Agotado",
        productIncluded: "Incluido en cada pedido:", productGuarantee: "Garantía de 30 días", productShipping: "Envío exprés gratuito",
        footerContact: "Contacto", footerShipping: "Envíos", footerRefunds: "Reembolsos", footerPrivacy: "Privacidad", footerTerms: "Términos",
        contactTitle: "Contáctanos", contactName: "Nombre", contactEmail: "Correo", contactMessage: "Mensaje", contactSend: "Enviar mensaje",
        contactSuccessTitle: "¡Mensaje enviado!", contactSuccessDesc: "Te responderemos lo antes posible. Usualmente dentro de 24h.",
        widgetTitle: "¿Necesitas ayuda?", widgetMessage: "Déjanos un mensaje", widgetWhatsapp: "Chat en WhatsApp",
    },
}

export async function getSiteConfig() {
    try {
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
    } catch (error) {
        console.error("Prisma error in getSiteConfig, returning fallback");
        return {
            currencyCode: "EUR",
            language: "FR",
            texts: DEFAULTS,
        }
    }
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
