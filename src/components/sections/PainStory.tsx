import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function PainStory() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center rounded-full border border-red-300 px-4 py-1.5 text-xs font-black uppercase text-red-600 bg-red-50 dark:bg-red-900/20 shadow-sm">
            Vous reconnaissez-vous ?
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Chaque matin, le même <span className="text-red-500">supplice</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Pain side */}
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-3xl p-8 space-y-5">
            <h3 className="font-black text-xl text-red-700 dark:text-red-400">😣 Avant Biarritz</h3>
            <ul className="space-y-4">
              {[
                "Vous posez le pied par terre le matin et une douleur fulgurante vous réveille brutalement.",
                "Vous évitez les sorties, les promenades, les activités que vous aimiez.",
                "Vous avez dépensé des centaines d'euros chez le podologue sans résultat durable.",
                "Vous rentrez du travail épuisé, les pieds en feu, le dos cassé.",
                "Vous avez essayé des semelles génériques qui n'ont rien changé.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-red-800 dark:text-red-300 font-medium">
                  <span className="text-red-500 font-black text-base shrink-0 mt-0.5">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Relief side */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-3xl p-8 space-y-5">
            <h3 className="font-black text-xl text-emerald-700 dark:text-emerald-400">😌 Avec Biarritz</h3>
            <ul className="space-y-4">
              {[
                "Vous vous levez le matin et posez le pied par terre sans aucune douleur.",
                "Vous reprenez vos promenades, vos sports, votre vie d'avant.",
                "Une solution à 24,99€ qui remplace des consultations à 200€+.",
                "Vous terminez vos journées de travail avec de l'énergie à revendre.",
                "Une technologie d'acupression magnétique cliniquement prouvée.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-emerald-800 dark:text-emerald-300 font-medium">
                  <span className="text-emerald-500 font-black text-base shrink-0 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Emotional CTA */}
        <div className="text-center space-y-6">
          <blockquote className="text-2xl sm:text-3xl font-black text-foreground leading-snug max-w-2xl mx-auto">
            &ldquo;Vous méritez de marcher sans douleur. <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">Chaque jour.</span>&rdquo;
          </blockquote>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Plus de 50 000 personnes ont déjà retrouvé leur liberté de mouvement. Rejoignez-les aujourd&apos;hui.
          </p>
          <Link href="/product" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-orange-500 text-white font-black uppercase tracking-wider px-8 py-4 rounded-2xl shadow-[0_8px_30px_rgba(255,102,0,0.4)] hover:shadow-[0_12px_40px_rgba(255,102,0,0.6)] hover:-translate-y-1 transition-all duration-300 text-sm">
            Je veux marcher sans douleur <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-xs text-muted-foreground font-bold">Résultats visibles dès le 1er port · Garantie 30 jours</p>
        </div>
      </div>
    </section>
  )
}
