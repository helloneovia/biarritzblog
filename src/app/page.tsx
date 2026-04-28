import { Hero } from "@/components/sections/Hero"
import { Features } from "@/components/sections/Features"
import { BeforeAfter } from "@/components/sections/BeforeAfter"
import { ReasonsToBuy } from "@/components/sections/ReasonsToBuy"
import { InsoleGallery } from "@/components/sections/InsoleGallery"
import { PainStory } from "@/components/sections/PainStory"
import { ComparisonTable } from "@/components/sections/ComparisonTable"
import { BundleOffer } from "@/components/sections/BundleOffer"
import { SocialProofStrip } from "@/components/sections/SocialProofStrip"
import { StickyCTA } from "@/components/sections/StickyCTA"
import { getSiteConfig, getTexts, Locale } from "@/lib/i18n"
import { cookies } from "next/headers"
import { CheckCircle2, ArrowRight, Users, TrendingUp, Award } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { unstable_cache } from "next/cache"
import dynamic from "next/dynamic"
import { OpenCartButton } from "@/components/ui/OpenCartButton"

const Faq = dynamic(() => import("@/components/sections/Faq").then(mod => mod.Faq))

export const revalidate = 60

const getCachedHomeProduct = unstable_cache(
  async () => {
    return prisma.product.findFirst({
      orderBy: { createdAt: 'desc' }
    }).catch(() => null);
  },
  ["home-product"],
  { revalidate: 3600, tags: ["products"] }
)

export default async function Home() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || "EN") as Locale
  const config = await getSiteConfig()
  const texts = getTexts(config, locale)
  const dbProduct = await getCachedHomeProduct();

  const localOrFallback = (cmsVal: string | undefined, fallback: string) =>
    cmsVal && cmsVal.trim() !== '' ? cmsVal : fallback

  return (
    <main>
      {/* ① HERO — Accroche + ancrage de prix + preuve sociale immédiate */}
      <Hero texts={texts} dbProduct={dbProduct} />

      {/* ② SOCIAL PROOF NUMBERS — Chiffres clés pour rassurer immédiatement */}
      <section className="py-10 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <Users className="w-6 h-6 text-primary mx-auto mb-2" />, value: "50 000+", label: "Clients Satisfaits" },
              { icon: <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />, value: "95%", label: "Réduction de la douleur" },
              { icon: <Award className="w-6 h-6 text-primary mx-auto mb-2" />, value: "4.9/5", label: "Note Trustpilot" },
              { icon: <CheckCircle2 className="w-6 h-6 text-primary mx-auto mb-2" />, value: "30 Jours", label: "Garantie Remboursement" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center p-4 rounded-2xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                {stat.icon}
                <span className="text-2xl sm:text-3xl font-black text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ③ PAIN STORY — Storytelling émotionnel : identification du problème */}
      <PainStory />

      {/* ④ FEATURES — Bénéfices produit */}
      <Features texts={texts} />

      {/* ⑤ SCIENCE SECTION — Crédibilité & technologie */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          {(texts.scienceBgImage || "/insole-science_tech.png").match(/\.(mp4|webm)$/i) ? (
            <video src={texts.scienceBgImage} className="w-full h-full object-cover" autoPlay loop muted playsInline />
          ) : (
            <img src={texts.scienceBgImage || "/insole_science_tech.png"} alt="Background Texture" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-emerald-500/30 px-4 py-1.5 text-xs font-black uppercase text-emerald-400 bg-emerald-500/10 shadow-sm">
                🔬 Technologie Brevetée
              </div>
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl leading-tight drop-shadow-md">
                {texts.scienceTitle || "L'art ancien de la guérison, modernisé."}
              </h2>
              <p className="text-xl text-white/80 leading-relaxed font-medium">
                {texts.scienceDesc || "Nos semelles fusionnent les théories séculaires d'acupression magnétique avec la podiatrie biomécanique moderne. Ciblant plus de 400 points de réflexologie sur votre pied, elles réduisent l'inflammation de manière sûre et naturelle."}
              </p>
              <ul className="space-y-4 mt-6">
                {[
                  texts.scienceB1 || "Élimine l'aponévrosite plantaire",
                  texts.scienceB2 || "Corrige la posture instantanément",
                  texts.scienceB3 || "Favorise un sommeil profond et réparateur"
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
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] aspect-square md:aspect-[4/3] border border-white/10 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />
              {(localOrFallback(texts.scienceImage, "/insole_science_tech.png")).match(/\.(mp4|webm)$/i) ? (
                <video src={texts.scienceImage} className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105" autoPlay loop muted playsInline />
              ) : (
                <img src={localOrFallback(texts.scienceImage, "/insole_science_tech.png")} alt="Technologie acupression magnétique Biarritz" className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ⑥ BEFORE/AFTER — Preuve visuelle de transformation */}
      <BeforeAfter texts={texts} />

      {/* ⑦ COMPARISON TABLE — Démonstration de supériorité vs concurrents */}
      <ComparisonTable />

      {/* ⑧ LIFESTYLE GRID — Universalité du produit */}
      <section className="py-20 border-y bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl font-black text-center uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground drop-shadow-sm">
              {texts.lifestyleTitle || "Tous les jours. Toutes les Chaussures."}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Que vous couriez, marchiez ou travailliez — Biarritz s&apos;adapte à votre vie.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { img: localOrFallback(texts.lifestyle1, "/lifestyle_running_new.png"), label: texts.lifestyle1Label || "Sport & Running", desc: "Performances décuplées" },
              { img: localOrFallback(texts.lifestyle2, "/lifestyle_daily_new.png"), label: texts.lifestyle2Label || "Marche Quotidienne", desc: "Confort toute la journée" },
              { img: localOrFallback(texts.lifestyle3, "/lifestyle_work_new.png"), label: texts.lifestyle3Label || "Travail & Bureau", desc: "Fin des douleurs au bureau" }
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
                  <p className="text-white/70 text-xs text-center mt-2 font-bold uppercase tracking-wider">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑨ BUNDLE OFFER — Offres groupées + ancrage de prix */}
      <BundleOffer />

      {/* ⑩ REASONS TO BUY — Arguments rationnels d'achat */}
      <ReasonsToBuy texts={texts} />

      {/* ⑪ GALLERY — Galerie produit premium */}
      <InsoleGallery texts={texts} />

      {/* ⑫ SOCIAL PROOF — Témoignages style réseau social + notifications d'achats */}
      <SocialProofStrip />

      {/* ⑬ GUARANTEE — Réduction du risque perçu */}
      <section className="py-24 bg-gradient-to-br from-[#061810] to-[#0a2e1f] text-white relative overflow-hidden border-t border-green-500/10">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/20 rounded-full blur-[120px]" />
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
              <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 text-xs font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-full mb-8 border border-green-500/30 backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5" /> 100% Sans Risque
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
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

      {/* ⑭ FINAL CTA — Dernier appel à l'action avec offre et urgence */}
      <section className="py-28 bg-gradient-to-tr from-primary via-orange-500 to-amber-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay pointer-events-none" />
        <div className="absolute top-0 right-0 w-full h-[300px] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 text-center space-y-10 relative z-10">
          <div className="inline-flex items-center gap-2 bg-black/20 text-yellow-300 text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-full border border-yellow-300/30 backdrop-blur-sm">
            ⏰ Offre limitée — Stock en cours d&apos;épuisement
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter max-w-4xl mx-auto drop-shadow-xl leading-tight">
            {texts.ctaTitle || "Prêt à retrouver une vie sans douleur ?"}
          </h2>
          <p className="text-white/90 max-w-2xl text-xl md:text-2xl mx-auto font-medium drop-shadow-sm">
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
            <OpenCartButton>
              <span className="relative z-10 flex items-center text-center">
                {texts.ctaButton || "Obtenir ma paire avec -50%"}
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </OpenCartButton>
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

      {/* ⑮ STICKY CTA — Barre flottante avec FOMO (apparaît au scroll) */}
      <StickyCTA />
    </main>
  );
}
