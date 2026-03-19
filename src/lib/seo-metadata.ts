import { Metadata } from "next"

export interface SEOMetadata {
  title: string
  description: string
  keywords: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonical?: string
  locale?: string
}

export const seoMetadata: Record<string, Record<string, SEOMetadata>> = {
  EN: {
    home: {
      title: "Biarritz Premium Orthopaedic Insoles | Pain Relief & Posture Correction",
      description: "Discover Biarritz magnetic acupressure insoles for instant foot pain relief, posture correction, and all-day comfort. Clinically proven. 90-day guarantee. Shop now!",
      keywords: [
        "orthopaedic insoles",
        "magnetic insoles",
        "acupressure insoles",
        "foot pain relief",
        "plantar fasciitis relief",
        "posture correction insoles",
        "comfort insoles",
        "Biarritz insoles",
        "heel pain relief",
        "arch support insoles"
      ],
      ogTitle: "Biarritz Orthopaedic Insoles - Walk Pain-Free",
      ogDescription: "Premium magnetic acupressure insoles for instant pain relief and posture correction.",
      locale: "en_US"
    },
    product: {
      title: "Biarritz Signature Insoles - Magnetic Acupressure Technology | Buy Now",
      description: "Shop Biarritz Signature orthopaedic insoles with 450+ magnetic acupressure points. Clinically proven to reduce plantar fasciitis, heel pain, and back pain. Free shipping. 90-day money-back guarantee.",
      keywords: [
        "buy orthopaedic insoles",
        "magnetic insoles for sale",
        "plantar fasciitis insoles",
        "foot pain relief insoles",
        "posture correction insoles",
        "comfort insoles for work",
        "sport insoles",
        "running insoles",
        "medical grade insoles",
        "orthopedic shoe inserts"
      ],
      locale: "en_US"
    }
  },
  FR: {
    home: {
      title: "Semelles Biarritz | Soulagement Douleur Pied & Correction Posture",
      description: "Découvrez les semelles magnétiques Biarritz pour un soulagement immédiat de la douleur, la correction posture et le confort toute la journée. Cliniquement prouvé. Garantie 90 jours. Commandez maintenant !",
      keywords: [
        "semelles orthopédiques",
        "semelles magnétiques",
        "semelles acupression",
        "soulagement douleur pied",
        "fasciite plantaire",
        "correction posture",
        "semelles confort",
        "semelles Biarritz",
        "douleur talon",
        "soutien voûte plantaire"
      ],
      ogTitle: "Semelles Biarritz - Marchez sans douleur",
      ogDescription: "Semelles orthopédiques magnétiques pour un soulagement immédiat et la correction posture.",
      locale: "fr_FR"
    },
    product: {
      title: "Semelles Biarritz Signature - Technologie Acupression Magnétique | Acheter",
      description: "Achetez les semelles Biarritz Signature avec 450+ points d'acupression magnétique. Cliniquement prouvées pour réduire l'aponévrosite plantaire, la douleur au talon et au dos. Livraison gratuite. Garantie 90 jours satisfait ou remboursé.",
      keywords: [
        "acheter semelles orthopédiques",
        "semelles magnétiques vente",
        "semelles fasciite plantaire",
        "semelles soulagement douleur",
        "semelles correction posture",
        "semelles travail",
        "semelles sport",
        "semelles running",
        "semelles médicales",
        "inserts orthopédiques"
      ],
      locale: "fr_FR"
    }
  },
  ES: {
    home: {
      title: "Plantillas Biarritz | Alivio Dolor Pie & Corrección Postura",
      description: "Descubre las plantillas magnéticas Biarritz para alivio inmediato del dolor, corrección de postura y comodidad todo el día. Clínicamente probado. Garantía 90 días. ¡Compra ahora!",
      keywords: [
        "plantillas ortopédicas",
        "plantillas magnéticas",
        "plantillas acupresión",
        "alivio dolor pie",
        "fascitis plantar",
        "corrección postura",
        "plantillas confort",
        "plantillas Biarritz",
        "dolor talón",
        "soporte arco"
      ],
      ogTitle: "Plantillas Biarritz - Camina sin dolor",
      ogDescription: "Plantillas ortopédicas magnéticas para alivio inmediato y corrección de postura.",
      locale: "es_ES"
    },
    product: {
      title: "Plantillas Biarritz Signature - Tecnología Acupresión Magnética | Comprar",
      description: "Compra plantillas Biarritz Signature con 450+ puntos de acupresión magnética. Clínicamente probadas para reducir fascitis plantar, dolor de talón y espalda. Envío gratis. Garantía 90 días devolución de dinero.",
      keywords: [
        "comprar plantillas ortopédicas",
        "plantillas magnéticas venta",
        "plantillas fascitis plantar",
        "plantillas alivio dolor",
        "plantillas corrección postura",
        "plantillas trabajo",
        "plantillas deporte",
        "plantillas running",
        "plantillas médicas",
        "insertos ortopédicos"
      ],
      locale: "es_ES"
    }
  }
}

export function generateSEOMetadata(locale: string, page: string): Metadata {
  const meta = seoMetadata[locale as keyof typeof seoMetadata]?.[page] || seoMetadata.EN.home

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.ogTitle || meta.title,
      description: meta.ogDescription || meta.description,
      url: "https://biarritz.blog",
      siteName: "Biarritz",
      locale: meta.locale,
      type: "website",
    },
    alternates: {
      canonical: meta.canonical || "https://biarritz.blog",
    },
  }
}
