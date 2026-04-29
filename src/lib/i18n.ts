import { prisma } from "@/lib/prisma"
import { unstable_cache } from "next/cache"

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
        heroImage: "/assets/videos/hero_product.mp4",
        heroButton: "Shop Now — Pain-Free in 24h",
        featuresTitle: "Why Choose Biarritz?",
        featuresSubtitle: "Built with advanced podiatric technology, our insoles target the root cause of foot and back pain.",
        f1Title: "Instant Pain Relief", f1Desc: "Clinically proven to reduce plantar fasciitis, heel and metatarsalgia pain from day one.",
        f2Title: "Posture Realignment", f2Desc: "Corrects overpronation and flat feet, aligning your entire body from the ground up.",
        f3Title: "All-Day Comfort", f3Desc: "Medical-grade EVA foam with targeted cushioning zones for maximum shock absorption.",
        ctaTitle: "Ready to Take Your Life Back?",
        ctaSubtitle: "Join 50,000+ others who found instant pain relief with Biarritz.",
        ctaButton: "Get Your Pair Now",
        ctaGuarantee: "90-Day Money-Back Guarantee",
        navBlog: "Blog", navBenefits: "Benefits", navReviews: "Reviews", navFaq: "FAQ",
        navLogin: "Login", navDashboard: "Dashboard", navAdmin: "Admin", navShop: "Shop Now",
        cartTitle: "Your Cart", cartEmpty: "Your cart is empty.", cartCheckout: "Proceed to Checkout", cartSubtotal: "Subtotal",
        productAddToCart: "Add to Cart", productSelectSize: "Select Size", productOutOfStock: "Out of Stock",
        productIncluded: "Included in every order:", productGuarantee: "90-Day Money-Back Guarantee", productShipping: "Free Express Shipping",
        footerContact: "Contact", footerShipping: "Shipping Policy", footerRefunds: "Refund Policy", footerPrivacy: "Privacy Policy", footerTerms: "Terms of Service",
        contactTitle: "Contact Us", contactName: "Name", contactEmail: "Email", contactMessage: "Message", contactSend: "Send Message",
        contactSuccessTitle: "Message Sent!", contactSuccessDesc: "We'll get back to you as soon as possible. Usually within 24h.",
        widgetTitle: "Need help?", widgetMessage: "Leave us a message", widgetWhatsapp: "Chat on WhatsApp",
        scienceTitle: "The ancient art of healing, modernized.",
        scienceDesc: "Our insoles merge centuries-old magnetic acupressure theories with modern biomechanical podiatry. Targeting over 400 reflexology points on your foot, they reduce inflammation safely and naturally by acting directly on your central nervous system.",
        scienceB1: "Eliminates plantar fasciitis",
        scienceB2: "Instantly corrects posture",
        scienceB3: "Promotes deep, restorative sleep",
        customersCount: "Over 50,000+ happy customers",
        topSeller: "Best Seller", topSellerSub: "Recommended by experts",
        scienceImage: "/assets/videos/tech_xray.mp4",
        scienceBgImage: "/assets/ref_tech_xray.jpg",
        lifestyleTitle: "Every Day. Every Shoe.",
        lifestyle1Label: "Sport & Running",
        lifestyle2Label: "Daily Walking",
        lifestyle3Label: "Work & Office",
        lifestyle1: "/assets/lifestyle_sport.jpg",
        lifestyle2: "/assets/lifestyle_walk.jpg",
        lifestyle3: "/assets/lifestyle_work.jpg",
        ctaOffer: "🔥 Special Offer: Buy 2, Get 1 FREE!",
        // Clinical stats section
        clinicalBadge: "Clinically Validated",
        clinicalTitle: "The Future Is Foot Pain-Free",
        clinicalSubtitle: "Results from clinical and consumer studies conducted on our orthopaedic insoles.",
        clinical1Percent: "95%", clinical1Label: "Reduced Foot Pain", clinical1Desc: "Arch support & cushioning significantly help foot pain.",
        clinical2Percent: "94%", clinical2Label: "Improved Comfort", clinical2Desc: "Comfort with every step, minimizing fatigue & discomfort.",
        clinical3Percent: "90%", clinical3Label: "Reduced Injury Risk", clinical3Desc: "Cushioning & support helps reduce the risk of foot injuries.",
        clinicalNote: "* Results based on clinical and consumer satisfaction studies.",
        // Use cases section
        usecasesBadge: "For All Profiles",
        usecasesTitle: "Made for Everyone, Every Day",
        usecasesSubtitle: "Whether you're an athlete, a healthcare worker, or simply active daily — our insoles adapt to your life.",
        usecasesCta: "Your profile here?",
        usecasesCtaDesc: "Everyone deserves pain-free feet.",
        // Expert endorsement
        expertBadge: "Expert Opinions",
        expertTitle: "Recommended by Healthcare Professionals",
        expertSubtitle: "Podiatrists and physiotherapists attest to the effectiveness of our insoles.",
        expertVerified: "Verified Professional",
        // La Différence section
        differenceBadge: "Our Difference",
        differenceTitle: "The Biarritz Difference",
        differenceSubtitle: "A design crafted for your daily comfort, whatever activities you pursue.",
        difference1Title: "Improves Posture", difference1Desc: "Arch support promotes better spinal alignment.",
        difference2Title: "Boosts Performance", difference2Desc: "Each step gains cushioning, making walking and running lighter.",
        difference3Title: "Adjustable Size", difference3Desc: "Simply cut along the dotted lines for a perfect fit.",
        difference4Title: "Easily Washable", difference4Desc: "Hand wash with soap and water — air dry in a few hours.",
        // Plantar Fasciitis article
        plantarBadge: "OrthoInsider Exclusive",
        plantarAuthor: "By Dr. M. Laurent · Updated March 2026",
        plantarTitle: "Plantar Fasciitis: Why Orthopaedic Experts Are Shifting Their Recommendations",
        plantarIntro: "The 2 million people suffering the stabbing agony of Plantar Fasciitis know finding relief is a nightmare. Cheap insoles fail; the pain returns with your first step in the morning. This cycle ends now.",
        plantar1Title: "Instant Relief in Just One Wear", plantar1Desc: "Unlike prescription orthotics requiring weeks of adjustment, our insoles deliver near-instant relief. The combination of high-density cushioning and structural support provides immediate freedom from stabbing heel pain.",
        plantar2Title: "Clinically Validated: Truly Orthopaedic Approved", plantar2Desc: "Scepticism about online remedies is valid. That's why our insoles have been clinically tested and approved by healthcare professionals. Materials, design, and mechanisms are engineered to correct the biomechanical root of plantar fasciitis.",
        plantar3Title: "Advanced Arch Support Restores Structural Stability", plantar3Desc: "The primary issue in plantar fasciitis is often a failing arch that allows the fascia to overstretch and tear. Our insoles incorporate strategically calibrated arch support to lift and stabilise your foot's natural structure.",
        plantar4Title: "Targeted Massage Points Soothe the Fascia With Every Step", plantar4Desc: "Integrated massage points gently stimulate the inflamed tissue with every step, increasing blood circulation and reducing localised tension in the fascia — turning your daily walk into a therapeutic session.",
        plantar5Title: "Full 90-Day Money-Back Guarantee Removes All Risk", plantar5Desc: "We understand you need proof, not promises. The 90-Day Money-Back Guarantee acts as your zero-risk trial period. If you don't experience significant relief within 90 days, we'll issue a full refund.",
        plantarClose: "The orthopaedic choice is clear.",
        plantarCloseDesc: "Clinical approval, instant relief, the trust of 50,000+ customers, and a 90-day safety net. The only risk is doing nothing.",
        // Coin flip game
        coinBadge: "🎮 Mini-Game",
        coinTitle: "Heads or Tails — Will You Buy?",
        coinSubtitle: "Undecided? Let fate decide. Pick your side, then flip the coin!",
        coinHeadsLabel: "Heads", coinHeadsDesc: "= I'm buying!",
        coinTailsLabel: "Tails", coinTailsDesc: "= I'll think about it",
        coinQuestion: "Which side do you pick?",
        coinFlipping: "The coin is in the air... 🎲",
        coinChose: "You picked:",
        // Sticky CTA
        stickyAddToCart: "Add to Cart",
        stickyAdded: "Added ✓",
        // Dashboard
        dashOrders: "My Orders",
        dashSupport: "Support Tickets",
        dashSettings: "Settings",
        dashMember: "Member",
        dashSignOut: "Sign Out",
        dashAffiliate: "Affiliate Dashboard",
        dashBecomeAffiliate: "Become Affiliate (-15%)",
    },
    FR: {
        heroBadge: "🎉 Nouvelle collection 2024",
        heroTitle: "Marchez vers la Sérénité.",
        heroTitleHighlight: "Chaque pas compte.",
        heroSubtitle: "Découvrez le pouvoir de guérison de l'acupression magnétique à chaque pas.",
        heroImage: "/assets/videos/hero_product.mp4",
        heroButton: "Commander — Sans douleur en 24h",
        featuresTitle: "Pourquoi Biarritz ?",
        featuresSubtitle: "Conçues avec une technologie podiatrique avancée, nos semelles ciblent la cause des douleurs.",
        f1Title: "Soulagement immédiat", f1Desc: "Cliniquement prouvé pour réduire la fasciite plantaire et les douleurs dès le premier jour.",
        f2Title: "Réalignement postural", f2Desc: "Corrige la pronation et les pieds plats, alignant tout votre corps depuis le sol.",
        f3Title: "Confort toute la journée", f3Desc: "Mousse EVA médicale avec zones de coussin ciblées pour une absorption maximale.",
        ctaTitle: "Reprenez votre vie en main !",
        ctaSubtitle: "Rejoignez 50 000+ personnes qui ont trouvé un soulagement instantané avec Biarritz.",
        ctaButton: "Obtenir ma paire",
        ctaGuarantee: "Garantie 90 jours Satisfait ou Remboursé",
        navBlog: "Blog", navBenefits: "Bénéfices", navReviews: "Avis", navFaq: "FAQ",
        navLogin: "Connexion", navDashboard: "Espace Client", navAdmin: "Admin", navShop: "Acheter",
        cartTitle: "Votre Panier", cartEmpty: "Votre panier est vide.", cartCheckout: "Passer à la caisse", cartSubtotal: "Sous-total",
        productAddToCart: "Ajouter au panier", productSelectSize: "Choisir la taille", productOutOfStock: "Rupture de stock",
        productIncluded: "Inclus dans chaque commande :", productGuarantee: "Garantie 90 Jours Satisfait ou Remboursé", productShipping: "Livraison Express Gratuite",
        footerContact: "Contact", footerShipping: "Livraison", footerRefunds: "Remboursements", footerPrivacy: "Politique de confidentialité", footerTerms: "CGV",
        contactTitle: "Nous Contacter", contactName: "Nom", contactEmail: "Email", contactMessage: "Message", contactSend: "Envoyer le message",
        contactSuccessTitle: "Message Envoyé !", contactSuccessDesc: "Nous vous répondrons le plus rapidement possible. En général sous 24h.",
        widgetTitle: "Besoin d'aide ?", widgetMessage: "Laissez-nous un message", widgetWhatsapp: "Discuter sur WhatsApp",
        scienceTitle: "L'art ancien de la guérison, modernisé.",
        scienceDesc: "Nos semelles fusionnent les théories séculaires d'acupression magnétique avec la podiatrie biomécanique moderne. Ciblant plus de 400 points de réflexologie sur votre pied, elles réduisent l'inflammation de manière sûre et naturelle en agissant directement sur votre système nerveux central.",
        scienceB1: "Élimine l'aponévrosite plantaire",
        scienceB2: "Corrige la posture instantanément",
        scienceB3: "Favorise un sommeil profond et réparateur",
        customersCount: "Plus de 50 000+ clients satisfaits",
        topSeller: "N°1 des Ventes", topSellerSub: "Recommandé par les experts",
        scienceImage: "/assets/videos/tech_xray.mp4",
        scienceBgImage: "/assets/ref_tech_xray.jpg",
        lifestyleTitle: "Tous les jours. Toutes les Chaussures.",
        lifestyle1Label: "Sport & Running",
        lifestyle2Label: "Marche Quotidienne",
        lifestyle3Label: "Travail & Bureau",
        lifestyle1: "/assets/lifestyle_sport.jpg",
        lifestyle2: "/assets/lifestyle_walk.jpg",
        lifestyle3: "/assets/lifestyle_work.jpg",
        ctaOffer: "🔥 Offre Spéciale : Achetez-en 2, Obtenez-en 1 GRATUITE !",
        // Clinical stats section
        clinicalBadge: "Validé Cliniquement",
        clinicalTitle: "L'avenir, c'est des pieds sans douleur",
        clinicalSubtitle: "Résultats issus d'études cliniques et consommateurs réalisées sur nos semelles orthopédiques.",
        clinical1Percent: "95%", clinical1Label: "Réduction de la douleur", clinical1Desc: "Le soutien de la voûte et l'amortissement soulagent significativement la douleur.",
        clinical2Percent: "94%", clinical2Label: "Amélioration du confort", clinical2Desc: "Un confort renforcé à chaque pas, réduisant la fatigue et l'inconfort.",
        clinical3Percent: "90%", clinical3Label: "Réduction du risque de blessure", clinical3Desc: "L'amortissement et le soutien aident à réduire les risques de blessures.",
        clinicalNote: "* Résultats basés sur des études cliniques et de satisfaction consommateurs.",
        // Use cases section
        usecasesBadge: "Pour Tous les Profils",
        usecasesTitle: "Fabriquées pour Tous, Chaque Jour",
        usecasesSubtitle: "Que vous soyez sportif, professionnel de santé, ou simplement actif au quotidien — nos semelles s'adaptent à votre vie.",
        usecasesCta: "Votre profil ici ?",
        usecasesCtaDesc: "Tout le monde mérite des pieds sans douleur.",
        // Expert endorsement
        expertBadge: "Avis Experts",
        expertTitle: "Recommandé par les Professionnels de Santé",
        expertSubtitle: "Des podologues et kinésithérapeutes reconnus attestent de l'efficacité de nos semelles.",
        expertVerified: "Professionnel Vérifié",
        // La Différence section
        differenceBadge: "Notre Différence",
        differenceTitle: "La Différence Biarritz",
        differenceSubtitle: "Une conception pensée pour votre confort au quotidien, quelles que soient vos activités.",
        difference1Title: "Améliore la Posture", difference1Desc: "Le soutien de la voûte favorise un meilleur alignement de la colonne vertébrale.",
        difference2Title: "Booste les Performances", difference2Desc: "Chaque pas gagne en amorti, rendant la marche et la course plus légères.",
        difference3Title: "Taille Ajustable", difference3Desc: "Découpez simplement le long des lignes pointillées pour un ajustement parfait.",
        difference4Title: "Facilement Lavables", difference4Desc: "Lavage à la main avec de l'eau et du savon — séchage naturel en quelques heures.",
        // Plantar Fasciitis article
        plantarBadge: "OrthoInsider Exclusif",
        plantarAuthor: "Par Dr. M. Laurent · Mis à jour Mars 2026",
        plantarTitle: "Fasciite Plantaire : Pourquoi les Experts Orthopédiques Changent leurs Recommandations",
        plantarIntro: "Les 2 millions de personnes souffrant des douleurs lancinantes de la fasciite plantaire savent que trouver un soulagement ressemble à un parcours du combattant. Les semelles bon marché échouent ; la douleur revient au premier pas le matin. Ce cycle frustrant prend fin maintenant.",
        plantar1Title: "Un soulagement instantané dès le Premier Port", plantar1Desc: "Contrairement aux orthèses sur mesure qui nécessitent des semaines d'adaptation, nos semelles sont conçues pour une efficacité quasi-immédiate. L'association d'un coussin haute densité et d'un soutien structurel délivre une liberté immédiate contre la douleur lancinante au talon.",
        plantar2Title: "Validées Cliniquement : Vraiment Approuvées par des Orthopédistes", plantar2Desc: "Le scepticisme face aux remèdes en ligne est légitime. C'est pourquoi nos semelles ont été testées cliniquement et approuvées par des professionnels de santé. Matériaux, conception et mécanismes sont ingéniérés pour corriger la racine biomécanique de la fasciite plantaire.",
        plantar3Title: "Un Soutien de la Voûte Avancé qui Restaure la Stabilité Structurelle", plantar3Desc: "Le problème central de la fasciite plantaire est souvent une voûte plantaire affaissée qui provoque l'étirement et la déchirure du fascia. Nos semelles intègrent un soutien de la voûte stratégique, calibré pour soulever et stabiliser la structure naturelle du pied.",
        plantar4Title: "Des Points de Massage Ciblés qui Soulagent le Fascia à Chaque Pas", plantar4Desc: "Des points de massage propriétaires sont intégrés dans la conception pour stimuler doucement les tissus inflammés à chaque pas. Cette stimulation augmente la circulation sanguine et réduit la tension locale dans le fascia.",
        plantar5Title: "Garantie 90 Jours Satisfait ou Remboursé — Risque Zéro", plantar5Desc: "Nous comprenons que vous avez besoin de preuves, pas de promesses. La garantie de 90 jours agit comme votre période d'essai sans risque. Si vous ne constatez pas une amélioration significative dans les 90 jours, nous remboursons intégralement.",
        plantarClose: "Le choix orthopédique est clair.",
        plantarCloseDesc: "L'approbation clinique, le soulagement instantané, la confiance de plus de 50 000 clients français, et le filet de sécurité 90 jours. Le seul risque restant est de ne rien faire.",
        // Coin flip game
        coinBadge: "🎮 Mini-Jeu",
        coinTitle: "Pile ou Face — Tu Achètes ?",
        coinSubtitle: "Indécis ? Laisse le destin décider. Choisis ton côté, puis lance la pièce !",
        coinHeadsLabel: "Pile", coinHeadsDesc: "= J'achète !",
        coinTailsLabel: "Face", coinTailsDesc: "= Je réfléchis encore",
        coinQuestion: "Quel côté choisis-tu ?",
        coinFlipping: "La pièce est en l'air... 🎲",
        coinChose: "Tu as choisi :",
        // Sticky CTA
        stickyAddToCart: "Ajouter au panier",
        stickyAdded: "Ajouté ✓",
        // Dashboard
        dashOrders: "Mes Commandes",
        dashSupport: "Tickets Support",
        dashSettings: "Paramètres",
        dashMember: "Membre",
        dashSignOut: "Déconnexion",
        dashAffiliate: "Tableau de Bord Affilié",
        dashBecomeAffiliate: "Devenir Affilié (-15%)",
    },
    ES: {
        heroBadge: "🎉 Nuevo diseño 2024",
        heroTitle: "Camina hacia la Serenidad.",
        heroTitleHighlight: "Cada paso importa.",
        heroSubtitle: "Descubre el poder curativo de la acupresión magnética con cada paso.",
        heroImage: "/assets/videos/hero_product.mp4",
        heroButton: "Comprar ahora — Sin dolor en 24h",
        featuresTitle: "¿Por qué Biarritz?",
        featuresSubtitle: "Diseñadas con tecnología podiátrica avanzada, nuestras plantillas atacan la causa del dolor.",
        f1Title: "Alivio instantáneo", f1Desc: "Clínicamente probado para reducir la fascitis plantar y el dolor desde el primer día.",
        f2Title: "Realineación postural", f2Desc: "Corrige la pronación y los pies planos, alineando todo tu cuerpo desde el suelo.",
        f3Title: "Comodidad todo el día", f3Desc: "Espuma EVA médica con zonas de amortiguación para máxima absorción de impacto.",
        ctaTitle: "¡Recupera tu vida!",
        ctaSubtitle: "Únete a 50,000+ personas que encontraron alivio instantáneo con Biarritz.",
        ctaButton: "Obtener mi par",
        ctaGuarantee: "Garantía de devolución de 90 días",
        navBlog: "Blog", navBenefits: "Beneficios", navReviews: "Reseñas", navFaq: "FAQ",
        navLogin: "Iniciar sesión", navDashboard: "Mi Cuenta", navAdmin: "Admin", navShop: "Comprar ahora",
        cartTitle: "Tu Carrito", cartEmpty: "Tu carrito está vacío.", cartCheckout: "Finalizar compra", cartSubtotal: "Subtotal",
        productAddToCart: "Añadir al carrito", productSelectSize: "Seleccionar talla", productOutOfStock: "Agotado",
        productIncluded: "Incluido en cada pedido:", productGuarantee: "Garantía de 90 días", productShipping: "Envío exprés gratuito",
        footerContact: "Contacto", footerShipping: "Envíos", footerRefunds: "Reembolsos", footerPrivacy: "Privacidad", footerTerms: "Términos",
        contactTitle: "Contáctanos", contactName: "Nombre", contactEmail: "Correo", contactMessage: "Mensaje", contactSend: "Enviar mensaje",
        contactSuccessTitle: "¡Mensaje enviado!", contactSuccessDesc: "Te responderemos lo antes posible. Usualmente dentro de 24h.",
        widgetTitle: "¿Necesitas ayuda?", widgetMessage: "Déjanos un mensaje", widgetWhatsapp: "Chat en WhatsApp",
        scienceTitle: "El antiguo arte de curar, modernizado.",
        scienceDesc: "Nuestras plantillas fusionan teorías seculares de acupresión magnética con podología biomecánica moderna. Dirigiéndose a más de 400 puntos de reflexología en tu pie, reducen la inflamación de forma segura y natural actuando directamente sobre tu sistema nervioso central.",
        scienceB1: "Elimina la fascitis plantar",
        scienceB2: "Corrige la postura al instante",
        scienceB3: "Promueve un sueño profundo y reparador",
        customersCount: "Más de 50,000+ clientes satisfechos",
        topSeller: "Más Vendido", topSellerSub: "Recomendado por expertos",
        scienceImage: "/assets/videos/tech_xray.mp4",
        scienceBgImage: "/assets/ref_tech_xray.jpg",
        lifestyleTitle: "Todos los días. Todos los zapatos.",
        lifestyle1Label: "Deporte y Running",
        lifestyle2Label: "Caminata Diaria",
        lifestyle3Label: "Trabajo y Oficina",
        lifestyle1: "/assets/lifestyle_sport.jpg",
        lifestyle2: "/assets/lifestyle_walk.jpg",
        lifestyle3: "/assets/lifestyle_work.jpg",
        ctaOffer: "🔥 Oferta Especial: ¡Compra 2, llévate 1 GRATIS!",
        // Clinical stats section
        clinicalBadge: "Validado Clínicamente",
        clinicalTitle: "El futuro es un pie sin dolor",
        clinicalSubtitle: "Resultados de estudios clínicos y de consumidores realizados con nuestras plantillas ortopédicas.",
        clinical1Percent: "95%", clinical1Label: "Reducción del dolor", clinical1Desc: "El soporte del arco y la amortiguación alivian significativamente el dolor de pies.",
        clinical2Percent: "94%", clinical2Label: "Mejora del confort", clinical2Desc: "Comodidad en cada paso, minimizando la fatiga y el malestar.",
        clinical3Percent: "90%", clinical3Label: "Reducción del riesgo de lesiones", clinical3Desc: "La amortiguación y el soporte ayudan a reducir el riesgo de lesiones en los pies.",
        clinicalNote: "* Resultados basados en estudios clínicos y de satisfacción del consumidor.",
        // Use cases
        usecasesBadge: "Para Todos los Perfiles",
        usecasesTitle: "Fabricadas para Todos, Cada Día",
        usecasesSubtitle: "Ya seas deportista, profesional de la salud o simplemente activo a diario — nuestras plantillas se adaptan a tu vida.",
        usecasesCta: "¿Tu perfil aquí?",
        usecasesCtaDesc: "Todo el mundo merece pies sin dolor.",
        // Expert endorsement
        expertBadge: "Opinión de Expertos",
        expertTitle: "Recomendado por Profesionales de la Salud",
        expertSubtitle: "Podólogos y fisioterapeutas reconocidos avalan la eficacia de nuestras plantillas.",
        expertVerified: "Profesional Verificado",
        // La Différence
        differenceBadge: "Nuestra Diferencia",
        differenceTitle: "La Diferencia Biarritz",
        differenceSubtitle: "Un diseño pensado para tu comodidad diaria, sea cual sea tu actividad.",
        difference1Title: "Mejora la Postura", difference1Desc: "El soporte del arco favorece un mejor alineamiento de la columna vertebral.",
        difference2Title: "Aumenta el Rendimiento", difference2Desc: "Cada paso gana amortiguación, haciendo más ligero caminar y correr.",
        difference3Title: "Talla Ajustable", difference3Desc: "Simplemente corta a lo largo de las líneas punteadas para un ajuste perfecto.",
        difference4Title: "Fácil de Lavar", difference4Desc: "Lavado a mano con agua y jabón — secado natural en pocas horas.",
        // Plantar fasciitis article
        plantarBadge: "OrthoInsider Exclusivo",
        plantarAuthor: "Por Dr. M. Laurent · Actualizado Marzo 2026",
        plantarTitle: "Fascitis Plantar: Por Qué los Expertos Ortopédicos Están Cambiando sus Recomendaciones",
        plantarIntro: "Los 2 millones de personas que sufren la agonía punzante de la fascitis plantar saben que encontrar alivio es una pesadilla. Las plantillas baratas fallan; el dolor vuelve con el primer paso de la mañana. Este ciclo frustrante termina ahora.",
        plantar1Title: "Alivio inmediato desde el primer uso", plantar1Desc: "A diferencia de las ortesis prescritas que requieren semanas de ajuste, nuestras plantillas están diseñadas para una eficacia casi inmediata, combinando amortiguación de alta densidad y soporte estructural.",
        plantar2Title: "Validado clínicamente: Realmente aprobado por ortopedistas", plantar2Desc: "El escepticismo ante los remedios en línea es válido. Por eso, nuestras plantillas han sido testadas clínicamente y aprobadas por profesionales de la salud.",
        plantar3Title: "Soporte de arco avanzado que restaura la estabilidad estructural", plantar3Desc: "El problema central de la fascitis plantar suele ser un arco deficiente que permite que la fascia se estire y se desgarre. Nuestras plantillas incorporan soporte de arco calibrado estratégicamente.",
        plantar4Title: "Puntos de masaje dirigidos que alivian la fascia con cada paso", plantar4Desc: "Los puntos de masaje integrados estimulan suavemente el tejido inflamado con cada paso, aumentando la circulación sanguínea y reduciendo la tensión en la fascia.",
        plantar5Title: "Garantía total de 90 días sin riesgo", plantar5Desc: "Entendemos que necesitas pruebas, no promesas. La garantía de 90 días actúa como tu período de prueba sin riesgo. Si no experimentas una mejora significativa, emitiremos un reembolso completo.",
        plantarClose: "La elección ortopédica es clara.",
        plantarCloseDesc: "Aprobación clínica, alivio instantáneo, la confianza de más de 50,000 clientes, y la red de seguridad de 90 días. El único riesgo es no hacer nada.",
        // Coin flip
        coinBadge: "🎮 Mini-Juego",
        coinTitle: "Cara o Cruz — ¿Compras?",
        coinSubtitle: "¿Indeciso? Deja que el destino decida. ¡Elige tu lado y lanza la moneda!",
        coinHeadsLabel: "Cara", coinHeadsDesc: "= ¡Compro!",
        coinTailsLabel: "Cruz", coinTailsDesc: "= Lo sigo pensando",
        coinQuestion: "¿Qué lado eliges?",
        coinFlipping: "La moneda está en el aire... 🎲",
        coinChose: "Elegiste:",
        // Sticky CTA
        stickyAddToCart: "Añadir al carrito",
        stickyAdded: "Añadido ✓",
        // Dashboard
        dashOrders: "Mis Pedidos",
        dashSupport: "Tickets de Soporte",
        dashSettings: "Configuración",
        dashMember: "Miembro",
        dashSignOut: "Cerrar Sesión",
        dashAffiliate: "Panel de Afiliado",
        dashBecomeAffiliate: "Convertirse en Afiliado (-15%)",
    },
}


const getCachedSiteConfig = unstable_cache(
    async () => {
        try {
            const config = await prisma.siteConfig.findFirst()
            if (config) return config
        } catch (e) {
            console.error("Database connection failed or config missing, using defaults.", e)
        }
        return null;
    },
    ["site-config"],
    {
        revalidate: 3600, // Cache for 1 hour
        tags: ["site-config"]
    }
)

export async function getSiteConfig() {
    const config = await getCachedSiteConfig()
    if (config) return config

    // Safe fallback if DB is offline
    return {
        currencyCode: "EUR",
        language: "FR",
        texts: DEFAULTS,
    }
}

/**
 * Strip base64 data URLs from texts to prevent massive HTML payloads.
 * Base64 images (up to 2MB each) stored in SiteConfig.texts were being
 * serialized into every page response, causing 17MB+ HTML pages.
 * We replace them with empty strings so the fallback URL gets used instead.
 */
function stripBase64FromTexts(texts: Record<string, string>): Record<string, string> {
    const cleaned: Record<string, string> = {}
    for (const [key, value] of Object.entries(texts)) {
        if (typeof value === "string" && value.startsWith("data:")) {
            // Strip base64 data URL — the component will use its fallback URL
            cleaned[key] = ""
        } else {
            cleaned[key] = value
        }
    }
    return cleaned
}

export function getTexts(config: { texts: any; language: string }, locale?: Locale): Record<string, string> {
    const effectiveLocale = (locale || config.language || DEFAULT_LOCALE) as Locale
    const stored = config.texts?.[effectiveLocale] || {}
    const defaults = DEFAULTS[effectiveLocale] || DEFAULTS[DEFAULT_LOCALE]
    return stripBase64FromTexts({ ...defaults, ...stored })
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
