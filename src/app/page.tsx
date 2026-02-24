import { Hero } from "@/components/sections/Hero"
import { Features } from "@/components/sections/Features"
import { Comparison } from "@/components/sections/Comparison"
import { Testimonials } from "@/components/sections/Testimonials"
import { Faq } from "@/components/sections/Faq"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Comparison />
      <Testimonials />

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl max-w-2xl mx-auto">
            Ready to Take Your Life Back?
          </h2>
          <p className="text-primary-foreground/80 max-w-[600px] text-lg mx-auto">
            Join 50,000+ others who have found instant pain relief with StepPrs. Your feet will thank you.
          </p>
          <Button size="lg" variant="secondary" className="rounded-full font-bold h-14 px-10 text-lg shadow-2xl" asChild>
            <Link href="/product">
              Get Your Pair Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-sm opacity-80 mt-4">30-Day Money-Back Guarantee</p>
        </div>
      </section>

      <Faq />
    </main>
  );
}
