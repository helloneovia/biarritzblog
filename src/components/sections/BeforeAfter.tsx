import { CheckCircle2, XCircle } from "lucide-react"

export function BeforeAfter({ texts }: { texts?: any }) {
  return (
    <section className="py-24 bg-gradient-to-br from-background via-muted/20 to-background border-y border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-sm">
            {texts?.beforeAfterTitle || "Voyez la Différence. Ressentez le Soulagement."}
          </h2>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            {texts?.beforeAfterDesc || "Une mauvaise posture crée des déséquilibres dans tout votre corps. Nos semelles réalignent votre fondation dès le premier pas."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Avant */}
          <div className="group relative rounded-[2.5rem] p-1 bg-red-500/10 hover:bg-red-500/20 transition-colors duration-500 overflow-hidden shadow-xl border border-red-500/20">
            <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full font-black uppercase tracking-wider text-sm shadow-lg">
              <XCircle className="w-5 h-5" /> AVANT
            </div>
            <div className="relative aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden">
              <img 
                src="/assets/authentic_science.jpg" 
                alt="Avant: Douleur plantaire et mauvaise posture - Semelles Biarritz" 
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-red-950/90 py-8 px-6 via-red-900/40 to-transparent">
                <ul className="space-y-3 mt-12">
                  <li className="flex items-center gap-3 text-red-50 font-bold text-lg drop-shadow-md">
                    <XCircle className="w-5 h-5 text-red-400" /> Douleurs plantaires aiguës
                  </li>
                  <li className="flex items-center gap-3 text-red-50 font-bold text-lg drop-shadow-md">
                    <XCircle className="w-5 h-5 text-red-400" /> Posture affaissée
                  </li>
                  <li className="flex items-center gap-3 text-red-50 font-bold text-lg drop-shadow-md">
                    <XCircle className="w-5 h-5 text-red-400" /> Fatigue constante
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Après */}
          <div className="group relative rounded-[2.5rem] p-1 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors duration-500 overflow-hidden shadow-[0_20px_50px_rgba(16,185,129,0.2)] border border-emerald-500/30">
            <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-full font-black uppercase tracking-wider text-sm shadow-lg">
              <CheckCircle2 className="w-5 h-5" /> APRÈS
            </div>
            <div className="relative aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden">
              <img 
                src="/assets/authentic_science.jpg" 
                alt="Après: Soulagement immédiat et alignement postural avec les semelles Biarritz" 
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-950/90 py-8 px-6 via-emerald-900/40 to-transparent">
                <ul className="space-y-3 mt-12">
                  <li className="flex items-center gap-3 text-emerald-50 font-bold text-lg drop-shadow-md">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Soulagement immédiat
                  </li>
                  <li className="flex items-center gap-3 text-emerald-50 font-bold text-lg drop-shadow-md">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Alignement parfait du corps
                  </li>
                  <li className="flex items-center gap-3 text-emerald-50 font-bold text-lg drop-shadow-md">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Énergie retrouvée
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
