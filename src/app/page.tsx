import { Hero } from "@/components/sections/Hero"
import { Features } from "@/components/sections/Features"
import { Comparison } from "@/components/sections/Comparison"
import { Testimonials } from "@/components/sections/Testimonials"
import { Faq } from "@/components/sections/Faq"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function Home() {
  const config = await prisma.siteConfig.findUnique({ where: { id: "global" } });
  const texts = (config?.texts as any) || {};

  return (
    <main>
      <Hero texts={texts} />
      <Features texts={texts} />
      <Comparison />
      <Testimonials />

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl max-w-2xl mx-auto">
            {texts.ctaTitle || "Ready to Take Your Life Back?"}
          </h2>
          <p className="text-primary-foreground/80 max-w-[600px] text-lg mx-auto whitespace-pre-wrap">
            {texts.ctaSubtitle || "Join 50,000+ others who have found instant pain relief with StepPrs. Your feet will thank you."}
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
