"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Flame, Users, Star, X } from "lucide-react"
import Link from "next/link"

export function StickyCTA() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [viewers, setViewers] = useState(47)

  useEffect(() => {
    const handleScroll = () => {
      if (!dismissed && window.scrollY > 600) setVisible(true)
      else if (window.scrollY < 600) setVisible(false)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [dismissed])

  // Simulate live viewers fluctuating
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(v => v + Math.floor(Math.random() * 5) - 2)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  if (!visible || dismissed) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-950 border-t border-border shadow-[0_-8px_30px_rgba(0,0,0,0.15)] animate-in slide-in-from-bottom-4 duration-500">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Product info */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex text-yellow-400 gap-0.5">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-xs font-black text-foreground uppercase tracking-wider">Semelles Biarritz Signature</span>
            <span className="text-[10px] text-muted-foreground font-bold">4.9/5 · 50 000+ clients</span>
          </div>
        </div>

        {/* Center: FOMO signals */}
        <div className="flex flex-col sm:flex-row items-center gap-2 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full border border-red-200 dark:border-red-800">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>Stock limité — offre -50% expire bientôt</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span><strong className="text-foreground">{viewers}</strong> personnes regardent en ce moment</span>
          </div>
        </div>

        {/* Right: Price + CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-xs line-through text-muted-foreground font-bold">49,99€</div>
            <div className="text-xl font-black text-primary leading-none">24,99€</div>
          </div>
          <Link href="/product" className="flex items-center gap-2 bg-gradient-to-r from-primary to-orange-500 text-white font-black uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-sm whitespace-nowrap">
            <ShoppingCart className="w-4 h-4" />
            Commander maintenant
          </Link>
          <button onClick={() => { setDismissed(true); setVisible(false) }} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
