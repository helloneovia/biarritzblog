import { Hero } from "@/components/sections/Hero"
import { Features } from "@/components/sections/Features"
import { Testimonials } from "@/components/sections/Testimonials"
import { Faq } from "@/components/sections/Faq"
import { getSiteConfig, getTexts, Locale } from "@/lib/i18n"
import { cookies } from "next/headers"
import { CheckCircle2 } from "lucide-react"
import { ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Image from "next/image" // Added as per instruction
import { Button } from "@/components/ui/button" // Re-added as it's used in CTA
import Link from "next/link" // Re-added as it's used in CTA

export default async function Home() {
  const config = await prisma.siteConfig.findUnique({ where: { id: "global" } }).catch(() => null);
  const texts = (config?.texts as any) || {};

  // Fetch primary product to dynamize the Hero image (avoiding static shoes)
  const dbProduct = await prisma.product.findFirst({
    orderBy: { createdAt: 'desc' }
  }).catch(() => null);

  // Assuming 't' is meant to be 'texts' based on the original code's context
  // If 't' is meant to come from i18n, the setup for 't' would need to be added here.
  // For now, I'll use 'texts' where 't' was indicated in the provided snippet,
  // and keep the original 'texts' variable for the CTA section.

  return (
    <main>
      <Hero texts={texts} dbProduct={dbProduct} />
      <Features texts={texts} /> {/* Changed 't' to 'texts' for consistency with current file logic */}

      {/* Visual Break - Science section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay">
          <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2400&auto=format&fit=crop" alt="Background Texture" className="w-full h-full object-cover" />
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
              <img src="https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1200&auto=format&fit=crop" alt="Acupressure visual" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
      {/* The provided Code Edit had <Testimonials /> duplicated, keeping only one as per original structure */}

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
            <p className="text-lg font-bold text-yellow-300 animate-pulse mt-2">🔥 Offre Spéciale : Achetez-en 2, Obtenez-en 1 GRATUITE !</p>
          </div>
          <Button size="lg" variant="secondary" className="rounded-full font-bold h-14 px-10 text-lg shadow-2xl hover:scale-105 transition-transform" asChild>
            <Link href="/product">
              {texts.ctaButton || "Obtenir ma paire avec -50%"} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-sm opacity-80 mt-4">{texts.ctaGuarantee || "Garantie Satisfait ou Remboursé de 30 Jours"}</p>
        </div>
      </section>

      <Faq />
    </main>
  );
}
