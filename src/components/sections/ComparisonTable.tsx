import { CheckCircle2, XCircle, MinusCircle } from "lucide-react"
import Link from "next/link"

const FEATURES = [
  { label: "Acupression magnétique (400+ points)", biarritz: "full", generic: "none", podologue: "none" },
  { label: "Soulagement dès le 1er port", biarritz: "full", generic: "none", podologue: "partial" },
  { label: "Soutien de la voûte plantaire", biarritz: "full", generic: "partial", podologue: "full" },
  { label: "Correction posturale complète", biarritz: "full", generic: "none", podologue: "partial" },
  { label: "Taille universelle (adaptable)", biarritz: "full", generic: "partial", podologue: "none" },
  { label: "Compatible toutes chaussures", biarritz: "full", generic: "partial", podologue: "none" },
  { label: "Garantie satisfait ou remboursé", biarritz: "full", generic: "none", podologue: "none" },
  { label: "Prix accessible", biarritz: "full", generic: "full", podologue: "none" },
]

const Icon = ({ type }: { type: string }) => {
  if (type === "full") return <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
  if (type === "none") return <XCircle className="w-6 h-6 text-red-400 mx-auto" />
  return <MinusCircle className="w-6 h-6 text-yellow-400 mx-auto" />
}

export function ComparisonTable() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20 border-y border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center rounded-full border border-primary/20 px-4 py-1.5 text-xs font-black uppercase text-primary bg-primary/5 shadow-sm">
            Pourquoi Biarritz ?
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            La comparaison qui parle <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">d&apos;elle-même</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Pourquoi payer des centaines d&apos;euros chez le podologue quand Biarritz fait mieux, pour moins ?
          </p>
        </div>

        <div className="max-w-4xl mx-auto overflow-x-auto rounded-3xl border border-border shadow-xl">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-5 font-black text-sm text-muted-foreground uppercase tracking-wider w-[40%]">Caractéristique</th>
                {/* Biarritz column - highlighted */}
                <th className="p-5 text-center relative bg-primary/5 border-x border-primary/20">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                    ⭐ Meilleur Choix
                  </div>
                  <div className="flex flex-col items-center gap-1 pt-2">
                    <span className="font-black text-base text-foreground">Biarritz</span>
                    <span className="text-primary font-black text-lg">24,99€</span>
                  </div>
                </th>
                <th className="p-5 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-black text-base text-muted-foreground">Marques génériques</span>
                    <span className="text-muted-foreground font-bold text-sm">15–30€</span>
                  </div>
                </th>
                <th className="p-5 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-black text-base text-muted-foreground">Podologue</span>
                    <span className="text-muted-foreground font-bold text-sm">200–600€</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f, idx) => (
                <tr key={idx} className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${idx % 2 === 0 ? "bg-background" : "bg-muted/10"}`}>
                  <td className="p-4 text-sm font-bold text-foreground">{f.label}</td>
                  <td className="p-4 bg-primary/5 border-x border-primary/10">
                    <Icon type={f.biarritz} />
                  </td>
                  <td className="p-4"><Icon type={f.generic} /></td>
                  <td className="p-4"><Icon type={f.podologue} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA below table */}
        <div className="text-center mt-10">
          <Link href="/product" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-orange-500 text-white font-black uppercase tracking-wider px-8 py-4 rounded-2xl shadow-[0_8px_30px_rgba(255,102,0,0.4)] hover:shadow-[0_12px_40px_rgba(255,102,0,0.6)] hover:-translate-y-1 transition-all duration-300 text-sm">
            Choisir Biarritz — 24,99€ seulement →
          </Link>
          <p className="text-xs text-muted-foreground mt-3 font-bold">Garantie 30 jours · Livraison offerte · Paiement sécurisé</p>
        </div>
      </div>
    </section>
  )
}
