"use client"

import { useState } from "react"
import { CheckCircle2, Flame, Package, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

const BUNDLES = [
  {
    id: 1,
    name: "Pack Découverte",
    qty: "1 paire",
    price: 24.99,
    original: 49.99,
    saving: 25,
    badge: null,
    features: ["1 paire de semelles Biarritz", "Guide d'utilisation PDF", "Garantie 30 jours"],
    popular: false,
    color: "border-border",
    btnColor: "bg-muted text-foreground hover:bg-muted/80",
  },
  {
    id: 2,
    name: "Pack Famille",
    qty: "2 paires + 1 OFFERTE",
    price: 44.99,
    original: 149.97,
    saving: 105,
    badge: "🔥 Le Plus Populaire",
    features: ["3 paires de semelles Biarritz", "Livraison express offerte", "Guide d'utilisation PDF", "Garantie 30 jours", "Support prioritaire"],
    popular: true,
    color: "border-primary ring-2 ring-primary/30",
    btnColor: "bg-gradient-to-r from-primary to-orange-500 text-white shadow-[0_8px_30px_rgba(255,102,0,0.4)] hover:shadow-[0_12px_40px_rgba(255,102,0,0.6)]",
  },
  {
    id: 3,
    name: "Pack Pro",
    qty: "4 paires",
    price: 59.99,
    original: 199.96,
    saving: 140,
    badge: "💎 Meilleure Valeur",
    features: ["4 paires de semelles Biarritz", "Livraison express offerte", "Guide d'utilisation PDF", "Garantie 60 jours étendue", "Support prioritaire VIP", "Accès au programme fidélité"],
    popular: false,
    color: "border-amber-400/50",
    btnColor: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_8px_30px_rgba(245,158,11,0.4)] hover:shadow-[0_12px_40px_rgba(245,158,11,0.6)]",
  },
]

export function BundleOffer() {
  const [selected, setSelected] = useState(2)

  return (
    <section className="py-24 bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-1.5 text-xs font-black uppercase text-primary bg-primary/10 shadow-sm">
            <Flame className="w-4 h-4 animate-pulse" /> Offre Spéciale Limitée
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Plus vous commandez, <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">plus vous économisez</span>
          </h2>
          <p className="text-white/70 max-w-xl mx-auto text-lg">
            Offrez-en à votre famille, vos amis. La douleur ne devrait toucher personne.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {BUNDLES.map(bundle => (
            <div
              key={bundle.id}
              onClick={() => setSelected(bundle.id)}
              className={`relative rounded-3xl border-2 p-6 flex flex-col gap-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${bundle.color} ${selected === bundle.id ? "bg-white/10" : "bg-white/5"} backdrop-blur-sm`}
            >
              {/* Badge */}
              {bundle.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                  {bundle.badge}
                </div>
              )}

              {/* Header */}
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-5 h-5 text-primary" />
                  <span className="font-black text-lg text-white">{bundle.name}</span>
                </div>
                <p className="text-sm text-white/60 font-bold">{bundle.qty}</p>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-white">{bundle.price.toFixed(2)}€</span>
                <div className="flex flex-col leading-none mb-1">
                  <span className="text-sm line-through text-white/40 font-bold">{bundle.original.toFixed(2)}€</span>
                  <span className="text-xs text-emerald-400 font-black">-{bundle.saving}€ économisés</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2 flex-1">
                {bundle.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/80 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Stars */}
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400 gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <span className="text-xs text-white/50 font-bold">4.9/5</span>
              </div>

              {/* CTA */}
              <Link
                href="/product"
                onClick={e => e.stopPropagation()}
                className={`flex items-center justify-center gap-2 font-black uppercase tracking-wider px-6 py-3.5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 text-sm ${bundle.btnColor}`}
              >
                Choisir ce pack <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-white/50 text-xs font-bold uppercase tracking-wider">
          {["✅ Paiement 100% Sécurisé", "🚚 Livraison Suivie & Assurée", "🔒 Données Protégées", "↩️ Retour Gratuit 30 Jours"].map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
