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
  const config = await prisma.siteConfig.findUnique({ where: { id: "global" } });
  const texts = (config?.texts as any) || {};
  // Assuming 't' is meant to be 'texts' based on the original code's context
  // If 't' is meant to come from i18n, the setup for 't' would need to be added here.
  // For now, I'll use 'texts' where 't' was indicated in the provided snippet,
  // and keep the original 'texts' variable for the CTA section.

  return (
    <main>
      <Hero texts={texts} />
      <Features texts={texts} /> {/* Changed 't' to 'texts' for consistency with current file logic */}

      {/* Visual Break - Science section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay">
          <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2400&auto=format&fit=crop" alt="Background Texture" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">The ancient art of healing, modernized.</h2>
              <p className="text-lg opacity-90 leading-relaxed">
                Our insoles merge centuries-old magnetic acupressure theories with modern biomechanical podiatry.
                Targeting 400+ reflexology points on your foot, they reduce inflammation safely and naturally mapping directly to your central nervous system.
              </p>
              <ul className="space-y-3 mt-4">
                {['Eliminates Plantar Fasciitis', 'Corrects Posture Instantly', 'Promotes deep, calm sleep'].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-300" />
                    <span className="font-medium text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square md:aspect-[4/3]">
              <img src="https://images.unsplash.com/photo-1620056910398-35ed5f6d7dd0?q=80&w=1200&auto=format&fit=crop" alt="Acupressure visual" className="w-full h-full object-cover" />
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
            {texts.ctaTitle || "Ready to Take Your Life Back?"}
          </h2>
          <p className="text-primary-foreground/80 max-w-[600px] text-lg mx-auto whitespace-pre-wrap">
            {texts.ctaSubtitle || "Join 50,000+ others who have found instant pain relief with Biarritz. Your feet will thank you."}
          </p>
          <Button size="lg" variant="secondary" className="rounded-full font-bold h-14 px-10 text-lg shadow-2xl" asChild>
            <Link href="/product">
              {texts.ctaButton || "Get Your Pair Now"} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-sm opacity-80 mt-4">{texts.ctaGuarantee || "30-Day Money-Back Guarantee"}</p>
        </div>
      </section>

      <Faq />
    </main>
  );
}
