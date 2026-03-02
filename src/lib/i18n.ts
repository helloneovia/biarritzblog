import { prisma } from "@/lib/prisma"

export type Locale = "EN" | "FR" | "ES"
export const SUPPORTED_LOCALES: Locale[] = ["EN", "FR", "ES"]
export const DEFAULT_LOCALE: Locale = "FR"

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
        heroImage: "/temu-product.jpg",
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
        // Homepage additions
        scienceTitle: "The ancient art of healing, modernized.",
        scienceDesc: "Our insoles merge centuries-old magnetic acupressure theories with modern biomechanical podiatry. Targeting over 400 reflexology points on your foot, they reduce inflammation safely and naturally by acting directly on your central nervous system.",
        scienceB1: "Eliminates plantar fasciitis",
        scienceB2: "Instantly corrects posture",
        scienceB3: "Promotes deep, restorative sleep",
        customersCount: "Over 50,000+ happy customers",
        topSeller: "Best Seller", topSellerSub: "Recommended by experts",
        scienceImage: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1200&auto=format&fit=crop",
    },
    FR: {
        heroBadge: "🎉 Nouvelle collection 2024",
        heroTitle: "Marchez vers la Sérénité.",
        heroTitleHighlight: "Chaque pas compte.",
        heroSubtitle: "Découvrez le pouvoir de guérison de l'acupression magnétique à chaque pas.",
        heroImage: "/temu-product.jpg",
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
        // Homepage additions
        scienceTitle: "L'art ancien de la guérison, modernisé.",
        scienceDesc: "Nos semelles fusionnent les théories séculaires d'acupression magnétique avec la podiatrie biomécanique moderne. Ciblant plus de 400 points de réflexologie sur votre pied, elles réduisent l'inflammation de manière sûre et naturelle en agissant directement sur votre système nerveux central.",
        scienceB1: "Élimine l'aponévrosite plantaire",
        scienceB2: "Corrige la posture instantanément",
        scienceB3: "Favorise un sommeil profond et réparateur",
        customersCount: "Plus de 50 000+ clients satisfaits",
        topSeller: "N°1 des Ventes", topSellerSub: "Recommandé par les experts",
        scienceImage: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1200&auto=format&fit=crop",
    },
    ES: {
        heroBadge: "🎉 Nuevo diseño 2024",
        heroTitle: "Camina hacia la Serenidad.",
        heroTitleHighlight: "Cada paso importa.",
        heroSubtitle: "Descubre el poder curativo de la acupresión magnética con cada paso.",
        heroImage: "/temu-product.jpg",
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
        // Homepage additions
        scienceTitle: "El antiguo arte de curar, modernizado.",
        scienceDesc: "Nuestras plantillas fusionan teorías seculares de acupresión magnética con podología biomecánica moderna. Dirigiéndose a más de 400 puntos de reflexología en tu pie, reducen la inflamación de forma segura y natural actuando directamente sobre tu sistema nervioso central.",
        scienceB1: "Elimina la fascitis plantar",
        scienceB2: "Corrige la postura al instante",
        scienceB3: "Promueve un sueño profundo y reparador",
        customersCount: "Más de 50,000+ clientes satisfechos",
        topSeller: "Más Vendido", topSellerSub: "Recomendado por expertos",
        scienceImage: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1200&auto=format&fit=crop",
    },
}

export async function getSiteConfig() {
    try {
        const config = await prisma.siteConfig.findFirst()
        if (config) return config
    } catch (e) {
        console.error("Database connection failed or config missing, using defaults.", e)
    }

    // Safe fallback if DB is offline
    return {
        currencyCode: "EUR",
        language: "FR",
        texts: DEFAULTS,
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
