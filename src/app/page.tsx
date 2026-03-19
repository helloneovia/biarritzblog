import { Hero } from "@/components/sections/Hero"
import { Features } from "@/components/sections/Features"
import { BeforeAfter } from "@/components/sections/BeforeAfter"
import { Testimonials } from "@/components/sections/Testimonials"
import { ReasonsToBuy } from "@/components/sections/ReasonsToBuy"
import { InsoleGallery } from "@/components/sections/InsoleGallery"
import { getSiteConfig, getTexts, Locale } from "@/lib/i18n"
import { cookies } from "next/headers"
import { CheckCircle2 } from "lucide-react"
import { ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
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
      <section className="py-24 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          {(texts.scienceBgImage || "/insole-science_tech.png").match(/\.(mp4|webm)$/i) ? (
            <video src={texts.scienceBgImage} className="w-full h-full object-cover" autoPlay loop muted playsInline />
          ) : (
            <img src={texts.scienceBgImage || "/insole_science_tech.png"} alt="Background Texture" className="w-full h-full object-cover" />
          )}
        </div>
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl leading-tight drop-shadow-md">
                {texts.scienceTitle || "L'art ancien de la guérison, modernisé."}
              </h2>
              <p className="text-xl text-white/80 leading-relaxed font-medium">
                {texts.scienceDesc || "Nos semelles fusionnent les théories séculaires d'acupression magnétique avec la podiatrie biomécanique moderne. Ciblant plus de 400 points de réflexologie sur votre pied, elles réduisent l'inflammation de manière sûre et naturelle en agissant directement sur votre système nerveux central."}
              </p>
              <ul className="space-y-4 mt-6">
                {[
                  texts.scienceB1 || 'Élimine l\'aponévrosite plantaire',
                  texts.scienceB2 || 'Corrige la posture instantanément',
                  texts.scienceB3 || 'Favorise un sommeil profond et réparateur'
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm shadow-lg hover:bg-white/10 transition-colors">
                    <div className="bg-emerald-500/20 p-2 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                    </div>
                    <span className="font-bold text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] aspect-square md:aspect-[4/3] border border-white/10 group perspective-[1000px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />
              {(localOrFallback(texts.scienceImage, "/insole_science_tech.png")).match(/\.(mp4|webm)$/i) ? (
                <video src={texts.scienceImage} className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105" autoPlay loop muted playsInline />
              ) : (
                <img src={localOrFallback(texts.scienceImage, "/insole_science_tech.png")} alt="Acupressure visual" className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105" />
              )}
            </div>
          </div>
        </div>
      </section>

      <BeforeAfter texts={texts} />

      {/* Lifestyle Grid Section */}
      <section className="py-20 border-y bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black text-center mb-12 uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground drop-shadow-sm">
            {texts.lifestyleTitle || "Tous les jours. Toutes les Chaussures."}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { img: localOrFallback(texts.lifestyle1, "/lifestyle_running_new.png"), label: texts.lifestyle1Label || "Sport & Running" },
              { img: localOrFallback(texts.lifestyle2, "/lifestyle_daily_new.png"), label: texts.lifestyle2Label || "Marche Quotidienne" },
              { img: localOrFallback(texts.lifestyle3, "/lifestyle_work_new.png"), label: texts.lifestyle3Label || "Travail & Bureau" }
            ].map((item, i) => (
              <div key={i} className="group aspect-[4/3] relative rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/50">
                {item.img.match(/\.(mp4|webm)$/i) ? (
                  <video src={item.img} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000" autoPlay loop muted playsInline />
                ) : (
                  <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/10 backdrop-blur-md text-white font-black px-4 py-2.5 rounded-xl uppercase tracking-widest border border-white/20 shadow-lg group-hover:-translate-y-2 transition-transform duration-500 text-center">
                        {item.label}
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ReasonsToBuy texts={texts} />
      <InsoleGallery texts={texts} />
      <Testimonials />

      {/* 30-Day Money-Back Guarantee Section */}
      <section className="py-24 bg-gradient-to-br from-[#061810] to-[#0a2e1f] text-white relative overflow-hidden border-t border-green-500/10">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/20 rounded-full blur-[120px]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-16 lg:gap-24">
            <div className="flex-shrink-0 relative group">
              <div className="absolute inset-0 bg-green-500/30 rounded-full blur-3xl animate-pulse group-hover:bg-green-400/40 transition-colors duration-500" />
              <div className="relative flex items-center justify-center w-56 h-56 rounded-full bg-gradient-to-br from-[#11402c] to-[#0a2e1f] border-[8px] border-[#1b5e3a] shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                <div className="absolute inset-2 rounded-full border border-green-500/20" />
                <div className="text-center transform group-hover:scale-110 transition-transform duration-500">
                  <p className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-green-400 drop-shadow-lg">30</p>
                  <p className="text-base font-black text-green-200 uppercase tracking-[0.3em] -mt-1">JOURS</p>
                  <p className="text-xs font-bold text-green-500 uppercase tracking-tight mt-2 bg-green-500/10 py-1 px-3 rounded-full border border-green-500/20">Garantie</p>
                </div>
              </div>
            </div>

            <div className="text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 text-xs font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-full mb-8 border border-green-500/30 backdrop-blur-sm shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                <CheckCircle2 className="w-5 h-5" /> 100% Sans Risque
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight drop-shadow-sm">
                {texts?.guaranteeTitle || "Satisfait ou Intégralement Remboursé"}
              </h2>
              <p className="text-green-50/80 text-lg md:text-xl font-medium leading-relaxed mb-10">
                {texts?.guaranteeDesc || "Nous ne prenons pas votre confiance à la légère. Utilisez nos semelles pendant un mois complet. Si vous n'êtes pas absolument stupéfait par la réduction de vos douleurs, renvoyez-les. Nous vous remboursons chaque centime, sans poser une seule question."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-green-500/20">
                {[
                  { label: "Remboursement Cash", sub: "Sous 48h ouvrées" },
                  { label: "Aucun Justificatif", sub: "Liberté totale" },
                  { label: "Retour Facile", sub: "Étiquette prépayée" }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5 hover:bg-white/10 transition-colors shadow-lg">
                    <p className="font-black text-green-400 flex items-center gap-2 justify-center md:justify-start uppercase text-xs tracking-wider mb-2">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> {item.label}
                    </p>
                    <p className="text-[10px] text-green-100/60 font-bold uppercase tracking-widest block">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-gradient-to-tr from-primary via-orange-500 to-amber-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay pointer-events-none" />
        <div className="absolute top-0 right-0 w-full h-[300px] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 text-center space-y-10 relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter max-w-4xl mx-auto drop-shadow-xl leading-tight">
            {texts.ctaTitle || "Prêt à retrouver une vie sans douleur ?"}
          </h2>
          <p className="text-white/90 max-w-2xl text-xl md:text-2xl mx-auto font-medium drop-shadow-sm whitespace-pre-wrap">
            {texts.ctaSubtitle || "Rejoignez plus de 50 000 personnes qui ont trouvé un soulagement instantané avec nos semelles. Vos pieds vous remercieront."}
          </p>
          
          <div className="flex flex-col items-center gap-4 pt-6 pb-2">
            <div className="group relative flex items-center gap-6 bg-white/10 backdrop-blur-xl px-10 py-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/20 transform transition-transform hover:scale-105 duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-150%] animate-[shimmer_2s_infinite]" />
              <div className="flex flex-col items-end leading-none">
                <span className="text-xl line-through opacity-70 font-bold">49,99€</span>
                <span className="text-sm uppercase tracking-wider text-orange-200 font-bold">Prix Spécial</span>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <span className="text-5xl font-black drop-shadow-lg text-white">24,99€</span>
              <div className="absolute -top-4 -right-4 bg-white text-orange-600 font-black px-4 py-2 rounded-full uppercase tracking-widest text-sm shadow-xl transform rotate-12 group-hover:rotate-6 transition-transform">
                -50%
              </div>
            </div>
            <p className="text-lg md:text-xl font-bold text-yellow-300 drop-shadow-sm bg-black/20 px-6 py-2 rounded-full inline-flex md:animate-pulse mt-4">
              {texts.ctaOffer || "🔥 Offre Spéciale : Achetez-en 2, Obtenez-en 1 GRATUITE !"}
            </p>
          </div>
          
          <Button size="lg" variant="secondary" className="rounded-2xl font-black h-16 sm:h-20 px-10 sm:px-14 text-xl sm:text-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-2 transition-all duration-300 bg-white text-orange-600 hover:bg-gray-50 border-none w-full sm:w-auto overflow-hidden group" asChild>
            <Link href="/product">
              <span className="relative z-10 flex items-center text-center">
                 {texts.ctaButton || "Obtenir ma paire avec -50%"} 
                 <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Link>
          </Button>
          
          <div className="flex flex-col items-center gap-3 mt-8">
            <p className="text-sm font-black bg-white/10 backdrop-blur-md text-white px-5 py-2.5 rounded-full border border-white/20 shadow-sm inline-flex items-center gap-2 uppercase tracking-wide">
              <CheckCircle2 className="w-5 h-5 text-green-300" />
              {texts.ctaGuarantee || "Garantie Satisfait ou Remboursé de 30 Jours"}
            </p>
            <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Sans risque, retour facile et gratuit.</p>
          </div>
        </div>
      </section>

      <Faq />
    </main>
  );
}
