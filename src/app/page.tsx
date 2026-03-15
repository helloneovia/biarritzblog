import { Hero } from "@/components/sections/Hero"
import { Features } from "@/components/sections/Features"
import { Testimonials } from "@/components/sections/Testimonials"
import { ReasonsToBuy } from "@/components/sections/ReasonsToBuy"
import { InsoleGallery } from "@/components/sections/InsoleGallery"
import { getSiteConfig, getTexts, Locale } from "@/lib/i18n"
import { cookies } from "next/headers"
import { CheckCircle2 } from "lucide-react"
import { ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { unstable_cache } from "next/cache"
import dynamic from "next/dynamic"

const Faq = dynamic(() => import("@/components/sections/Faq").then(mod => mod.Faq))

export const revalidate = 60 // ISR: regenerate every 60s instead of force-dynamic

const getCachedHomeProduct = unstable_cache(
  async () => {
    return prisma.product.findFirst({
      orderBy: { createdAt: 'desc' }
    }).catch(() => null);
  },
  ["home-product"],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ["products"]
  }
)

export default async function Home() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || "EN") as Locale
  const config = await getSiteConfig()
  const texts = getTexts(config, locale)

  // Fetch primary product to dynamize the Hero image (avoiding static shoes)
  const dbProduct = await getCachedHomeProduct();

  // Helper: use CMS value if it's any valid URL or local path, not an empty string
  const localOrFallback = (cmsVal: string | undefined, fallback: string) =>
    cmsVal && cmsVal.trim() !== ''
      ? cmsVal
      : fallback

  return (
    <main>
      <Hero texts={texts} dbProduct={dbProduct} />
      <Features texts={texts} />

      {/* Visual Break - Science section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay">
          {(texts.scienceBgImage || "/insole-science.png").match(/\.(mp4|webm)$/i) ? (
            <video src={texts.scienceBgImage} className="w-full h-full object-cover" autoPlay loop muted playsInline />
          ) : (
            <Image src={texts.scienceBgImage || "/insole-science.png"} alt="Background Texture" fill sizes="100vw" className="object-cover" />
          )}
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{texts.scienceTitle || "L'art ancien de la guérison, modernisé."}</h2>
              <p className="text-lg opacity-90 leading-relaxed">
                {texts.scienceDesc || "Nos semelles fusionnent les théories séculaires d'acupression magnétique avec la podiatrie biomécanique moderne. Ciblant plus de 400 points de réflexologie sur votre pied, elles réduisent l'inflammation de manière sûre et naturelle en agissant directement sur votre système nerveux central."}
              </p>
              <ul className="space-y-3 mt-4">
                {[
                  texts.scienceB1 || 'Élimine l\'aponévrosite plantaire',
                  texts.scienceB2 || 'Corrige la posture instantanément',
                  texts.scienceB3 || 'Favorise un sommeil profond et réparateur'
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-300" />
                    <span className="font-medium text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square md:aspect-[4/3]">
              {(localOrFallback(texts.scienceImage, "/insole-science.png")).match(/\.(mp4|webm)$/i) ? (
                <video src={texts.scienceImage} className="w-full h-full object-cover" autoPlay loop muted playsInline />
              ) : (
                <Image src={localOrFallback(texts.scienceImage, "/insole-science.png")} alt="Acupressure visual" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle Grid Section (Added to Homepage) */}
      <section className="py-12 border-y bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-black text-center mb-8 uppercase tracking-wide">
            {texts.lifestyleTitle || "Tous les jours. Toutes les Chaussures."}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { img: localOrFallback(texts.lifestyle1, "/insole-running.png"), label: texts.lifestyle1Label || "Sport & Running" },
              { img: localOrFallback(texts.lifestyle2, "/insole-daily.png"), label: texts.lifestyle2Label || "Marche Quotidienne" },
              { img: localOrFallback(texts.lifestyle3, "/insole-work.png"), label: texts.lifestyle3Label || "Travail & Bureau" }
            ].map((item, i) => (
              <div key={i} className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {item.img.match(/\.(mp4|webm)$/i) ? (
                  <video src={item.img} className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" autoPlay loop muted playsInline />
                ) : (
                  <Image src={item.img} alt={item.label} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover hover:scale-105 transition-transform duration-700" />
                )}
                <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs font-black px-3 py-1 rounded uppercase tracking-wider">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ReasonsToBuy texts={texts} />
      <InsoleGallery texts={texts} />
      <Testimonials />

      {/* 30-Day Money-Back Guarantee Section (ACCENTUATED) */}
      <section className="py-24 bg-[#0a2e1f] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-green-500/30" />
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">
            <div className="flex-shrink-0 relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative flex items-center justify-center w-48 h-48 rounded-full bg-[#11402c] border-[6px] border-[#1b5e3a] shadow-2xl">
                <div className="text-center">
                  <p className="text-6xl font-black text-green-400">30</p>
                  <p className="text-sm font-black text-green-200 uppercase tracking-widest -mt-1">JOURS</p>
                  <p className="text-[10px] font-bold text-green-500 uppercase tracking-tight mt-1">Garantie</p>
                </div>
              </div>
            </div>

            <div className="text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 text-xs font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6 border border-green-500/30">
                <CheckCircle2 className="w-5 h-5" /> 100% Sans Risque
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 leading-tight">
                {texts?.guaranteeTitle || "Satisfait ou Intégralement Remboursé"}
              </h2>
              <p className="text-green-50/70 text-lg leading-relaxed mb-8">
                {texts?.guaranteeDesc || "Nous ne prenons pas votre confiance à la légère. Utilisez nos semelles pendant un mois complet. Si vous n'êtes pas absolument stupéfait par la réduction de vos douleurs, renvoyez-les. Nous vous remboursons chaque centime, sans poser une seule question."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-green-500/20">
                {[
                  { label: "Remboursement Cash", sub: "Sous 48h ouvrées" },
                  { label: "Aucun Justificatif", sub: "Liberté totale" },
                  { label: "Retour Facile", sub: "Étiquette prépayée" }
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <p className="font-black text-green-400 flex items-center gap-2 justify-center md:justify-start uppercase text-xs tracking-wider">
                      <CheckCircle2 className="w-4 h-4" /> {item.label}
                    </p>
                    <p className="text-[10px] text-green-100/50 font-bold uppercase tracking-widest">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl max-w-2xl mx-auto">
            {texts.ctaTitle || "Prêt à retrouver une vie sans douleur ?"}
          </h2>
          <p className="text-primary-foreground/80 max-w-[600px] text-lg mx-auto whitespace-pre-wrap">
            {texts.ctaSubtitle || "Rejoignez plus de 50 000 personnes qui ont trouvé un soulagement instantané avec nos semelles. Vos pieds vous remercieront."}
          </p>
          <div className="flex flex-col items-center gap-2 pt-4 pb-2">
            <div className="flex items-center gap-4 bg-white/15 px-8 py-3 rounded-2xl shadow-inner border border-white/20">
              <span className="text-3xl font-black">24,99€</span>
              <span className="text-xl line-through opacity-70">49,99€</span>
              <span className="text-sm font-extrabold bg-white text-primary px-3 py-1 rounded-md ml-2 uppercase tracking-wider">-50% OFF</span>
            </div>
            <p className="text-lg font-bold text-yellow-300 animate-pulse mt-2">{texts.ctaOffer || "🔥 Offre Spéciale : Achetez-en 2, Obtenez-en 1 GRATUITE !"}</p>
          </div>
          <Button size="lg" variant="secondary" className="rounded-full font-bold h-14 px-10 text-lg shadow-2xl hover:scale-105 transition-transform" asChild>
            <Link href="/product">
              {texts.ctaButton || "Obtenir ma paire avec -50%"} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <div className="flex flex-col items-center gap-2 mt-4">
            <p className="text-sm font-bold bg-green-500/20 text-green-300 px-4 py-1.5 rounded-full inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {texts.ctaGuarantee || "Garantie Satisfait ou Remboursé de 30 Jours"}
            </p>
            <p className="text-xs opacity-70">Sans risque, retour facile et gratuit.</p>
          </div>
        </div>
      </section>

      <Faq />
    </main>
  );
}
