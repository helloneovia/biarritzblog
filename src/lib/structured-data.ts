/**
 * Structured Data (JSON-LD) for SEO
 * Generates rich snippets for search engines
 */

export interface ProductStructuredData {
  "@context": string
  "@type": string
  name: string
  description: string
  image: string[]
  brand: {
    "@type": string
    name: string
  }
  offers: {
    "@type": string
    url: string
    priceCurrency: string
    price: string
    priceValidUntil: string
    availability: string
  }
  aggregateRating: {
    "@type": string
    ratingValue: string
    reviewCount: string
  }
}

export function generateProductSchema(locale: string = "en"): ProductStructuredData {
  const priceMap = {
    en: "49.99",
    fr: "49.99",
    es: "49.99",
  }

  const descriptionMap = {
    en: "Premium orthopaedic insoles with magnetic acupressure technology. Clinically proven to reduce plantar fasciitis, heel pain, and improve posture. Features 450+ magnetic acupressure points and medical-grade EVA foam.",
    fr: "Semelles orthopédiques premium avec technologie d'acupression magnétique. Cliniquement prouvées pour réduire l'aponévrosite plantaire et améliorer la posture. 450+ points d'acupression magnétique et mousse EVA médicale.",
    es: "Plantillas ortopédicas premium con tecnología de acupresión magnética. Clínicamente probadas para reducir la fascitis plantar y mejorar la postura. 450+ puntos de acupresión magnética y espuma EVA médica.",
  }

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: "Biarritz Signature Orthopaedic Insoles",
    description: descriptionMap[locale as keyof typeof descriptionMap] || descriptionMap.en,
    image: [
      "https://biarritz.blog/assets/authentic_hero.jpg",
      "https://biarritz.blog/assets/authentic_science.jpg",
      "https://biarritz.blog/assets/authentic_flex.jpg",
      "https://biarritz.blog/assets/authentic_shoe.jpg",
    ],
    brand: {
      "@type": "Brand",
      name: "Biarritz",
    },
    offers: {
      "@type": "Offer",
      url: "https://biarritz.blog/product",
      priceCurrency: "EUR",
      price: priceMap[locale as keyof typeof priceMap] || "49.99",
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "3450",
    },
  }
}

export interface OrganizationSchema {
  "@context": string
  "@type": string
  name: string
  url: string
  logo: string
  description: string
  sameAs: string[]
  contactPoint: {
    "@type": string
    telephone: string
    contactType: string
  }
}

export function generateOrganizationSchema(): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Biarritz",
    url: "https://biarritz.blog",
    logo: "https://biarritz.blog/favicon.svg",
    description: "Premium orthopaedic insoles with magnetic acupressure technology for pain relief and posture correction.",
    sameAs: [
      "https://www.facebook.com/biarritzblog",
      "https://www.instagram.com/biarritzblog",
      "https://www.twitter.com/biarritzblog",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+33-1-XX-XX-XX-XX",
      contactType: "Customer Support",
    },
  }
}

export interface FAQSchema {
  "@context": string
  "@type": string
  mainEntity: Array<{
    "@type": string
    name: string
    acceptedAnswer: {
      "@type": string
      text: string
    }
  }>
}

export function generateFAQSchema(locale: string = "en"): FAQSchema {
  const faqMap = {
    en: [
      {
        question: "Do Biarritz insoles fit all shoe types?",
        answer: "Yes, Biarritz insoles are universally sized and can be trimmed along dotted lines to fit any shoe size from EU 35 to EU 48.",
      },
      {
        question: "How long does it take to feel relief?",
        answer: "Most users experience noticeable relief within 24-48 hours of first wear. Full benefits are typically realized within 2-3 weeks.",
      },
      {
        question: "Can I wash my Biarritz insoles?",
        answer: "Yes, simply hand wash with soap and water, then air dry naturally. Do not machine wash or use a dryer.",
      },
      {
        question: "What is your money-back guarantee?",
        answer: "We offer a 90-day money-back guarantee. If you're not satisfied, return them for a full refund, no questions asked.",
      },
    ],
    fr: [
      {
        question: "Les semelles Biarritz s'adaptent-elles à tous les types de chaussures ?",
        answer: "Oui, les semelles Biarritz sont de taille universelle et peuvent être découpées selon les lignes pointillées pour s'adapter à n'importe quelle pointure de l'EU 35 à l'EU 48.",
      },
      {
        question: "Combien de temps faut-il pour ressentir un soulagement ?",
        answer: "La plupart des utilisateurs ressentent un soulagement notable dans les 24 à 48 heures suivant le premier port. Les bénéfices complets sont généralement réalisés dans les 2 à 3 semaines.",
      },
      {
        question: "Puis-je laver mes semelles Biarritz ?",
        answer: "Oui, lavez simplement à la main avec du savon et de l'eau, puis laissez sécher naturellement. Ne pas laver en machine ni utiliser de sèche-linge.",
      },
      {
        question: "Quelle est votre garantie de remboursement ?",
        answer: "Nous offrons une garantie de remboursement de 90 jours. Si vous n'êtes pas satisfait, renvoyez-les pour un remboursement complet, sans poser de questions.",
      },
    ],
    es: [
      {
        question: "¿Las plantillas Biarritz se adaptan a todos los tipos de zapatos?",
        answer: "Sí, las plantillas Biarritz son de tamaño universal y se pueden recortar a lo largo de las líneas punteadas para adaptarse a cualquier tamaño de zapato de EU 35 a EU 48.",
      },
      {
        question: "¿Cuánto tiempo tarda en sentir alivio?",
        answer: "La mayoría de los usuarios experimentan alivio notable dentro de 24-48 horas del primer uso. Los beneficios completos se realizan típicamente dentro de 2-3 semanas.",
      },
      {
        question: "¿Puedo lavar mis plantillas Biarritz?",
        answer: "Sí, simplemente lava a mano con agua y jabón, luego deja secar naturalmente. No lavar a máquina ni usar secadora.",
      },
      {
        question: "¿Cuál es su garantía de devolución de dinero?",
        answer: "Ofrecemos una garantía de devolución de dinero de 90 días. Si no está satisfecho, devuelva las plantillas para obtener un reembolso completo, sin hacer preguntas.",
      },
    ],
  }

  const faqs = faqMap[locale as keyof typeof faqMap] || faqMap.en

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}
