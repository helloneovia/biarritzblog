import { Hero } from "@/components/sections/Hero"
import { Features } from "@/components/sections/Features"
import { Testimonials } from "@/components/sections/Testimonials"
import { Faq } from "@/components/sections/Faq"
import { ReasonsToBuy } from "@/components/sections/ReasonsToBuy"
import { getSiteConfig, getTexts, Locale } from "@/lib/i18n"
import { cookies } from "next/headers"
import { CheckCircle2 } from "lucide-react"
import { ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Image from "next/image" // Added as per instruction
import { Button } from "@/components/ui/button" // Re-added as it's used in CTA
import Link from "next/link" // Re-added as it's used in CTA

export const dynamic = "force-dynamic"

export default async function Home() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || "EN") as Locale
  const config = await getSiteConfig()
  const texts = getTexts(config, locale)

  // Fetch primary product to dynamize the Hero image (avoiding static shoes)
  const dbProduct = await prisma.product.findFirst({
    orderBy: { createdAt: 'desc' }
  }).catch(() => null);

  // Assuming 't' is meant to be 'texts' based on the original code's context
  // If 't' is meant to come from i18n, the setup for 't' would need to be added here.
  // For now, I'll use 'texts' where 't' was indicated in the provided snippet,
  // and keep the original 'texts' variable for the CTA section.

  // Helper: use CMS value if it's any valid URL or local path, not an empty string
  const localOrFallback = (cmsVal: string | undefined, fallback: string) =>
    cmsVal && cmsVal.trim() !== ''
      ? cmsVal
      : fallback

  return (
    <main>
      <Hero texts={texts} dbProduct={dbProduct} />
      <Features texts={texts} /> {/* Changed 't' to 'texts' for consistency with current file logic */}

      {/* Visual Break - Science section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay">
          {(texts.scienceBgImage || "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=2400&auto=format&fit=crop").match(/\.(mp4|webm)$/i) ? (
            <video src={texts.scienceBgImage} className="w-full h-full object-cover" autoPlay loop muted playsInline />
          ) : (
            <img src={texts.scienceBgImage || "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=2400&auto=format&fit=crop"} alt="Background Texture" className="w-full h-full object-cover" />
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
              {(localOrFallback(texts.scienceImage, "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop")).match(/\.(mp4|webm)$/i) ? (
                <video src={texts.scienceImage} className="w-full h-full object-cover" autoPlay loop muted playsInline />
              ) : (
                <img src={localOrFallback(texts.scienceImage, "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop")} alt="Acupressure visual" className="w-full h-full object-cover" />
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
              { img: localOrFallback(texts.lifestyle1, "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop"), label: texts.lifestyle1Label || "Sport & Running" },
              { img: localOrFallback(texts.lifestyle2, "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop"), label: texts.lifestyle2Label || "Marche Quotidienne" },
              { img: localOrFallback(texts.lifestyle3, "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"), label: texts.lifestyle3Label || "Travail & Bureau" }
            ].map((item, i) => (
              <div key={i} className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {item.img.match(/\.(mp4|webm)$/i) ? (
                  <video src={item.img} className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" autoPlay loop muted playsInline />
                ) : (
                  <img src={item.img} alt={item.label} className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" />
                )}
                <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs font-black px-3 py-1 rounded uppercase tracking-wider">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ReasonsToBuy texts={texts} />
      <Testimonials />

      {/* 30-Day Money-Back Guarantee Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-y border-green-200 dark:border-green-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="flex-shrink-0 flex items-center justify-center w-36 h-36 rounded-full bg-white dark:bg-green-900/50 border-4 border-green-400 shadow-lg shadow-green-200/50 dark:shadow-green-900">
              <div className="text-center">
                <p className="text-4xl font-black text-green-600">30</p>
                <p className="text-xs font-bold text-green-700 uppercase tracking-widest">Jours</p>
              </div>
            </div>
            <div className="text-center md:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                <CheckCircle2 className="w-4 h-4" /> Garantie Sans Risque
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
                {texts?.guaranteeTitle || "Satisfait ou Remboursé — 30 Jours"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {texts?.guaranteeDesc || "Nous sommes tellement convaincus de l'efficacité de nos semelles que nous vous offrons 30 jours pour les essayer sans aucun risque. Si vous n'êtes pas soulagé, nous vous remboursons intégralement — aucune question posée, retour simple et gratuit."}
              </p>
              <div className="flex flex-wrap gap-4 mt-5 justify-center md:justify-start">
                {["Retour 100% Gratuit", "Remboursement Rapide", "Aucune Question Posée"].map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 dark:text-green-400">
                    <CheckCircle2 className="w-4 h-4" /> {item}
                  </span>
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
