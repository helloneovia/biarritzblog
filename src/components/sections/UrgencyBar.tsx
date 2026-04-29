"use client"

import { useState, useEffect } from "react"
import { Flame, Clock, Package, Zap } from "lucide-react"
import Link from "next/link"

export function UrgencyBar() {
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 47, s: 33 })
  const [stock, setStock] = useState(17)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev
        s--
        if (s < 0) { s = 59; m-- }
        if (m < 0) { m = 59; h-- }
        if (h < 0) { h = 2; m = 47; s = 33 } // loop
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Simulate stock decreasing slowly
  useEffect(() => {
    const stockTimer = setInterval(() => {
      setStock(prev => prev > 7 ? prev - 1 : prev)
    }, 45000) // decrease every 45s
    return () => clearInterval(stockTimer)
  }, [])

  if (!visible) return null

  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <div className="relative bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white text-xs sm:text-sm font-black overflow-hidden">
      {/* Animated shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-[shimmer_3s_ease-in-out_infinite]" />
      
      <div className="relative z-10 flex items-center justify-between px-4 py-2.5 max-w-7xl mx-auto gap-2">
        {/* Left: Stock */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Package className="w-4 h-4 animate-pulse" />
          <span className="uppercase tracking-wider">
            <span className="text-yellow-300">{stock} paires</span> restantes
          </span>
        </div>

        {/* Center: Main message */}
        <Link href="/product" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center hover:underline underline-offset-2 flex-1 justify-center">
          <div className="flex items-center justify-center gap-1">
            <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 shrink-0 animate-pulse" />
            <span className="uppercase tracking-wider text-[10px] sm:text-sm font-black leading-tight">
              Offre Flash : <span className="text-yellow-300">-50% + 1 offerte</span>
            </span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="hidden sm:inline uppercase tracking-wider">— Expire dans</span>
            <span className="bg-black/30 rounded px-1.5 py-0.5 sm:px-2 sm:py-0.5 font-mono text-yellow-300 text-[10px] sm:text-sm tabular-nums ml-1">
              {pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}
            </span>
          </div>
        </Link>

        {/* Right: CTA */}
        <Link href="/product" className="hidden sm:flex items-center gap-1.5 bg-white text-red-600 rounded-full px-4 py-1.5 uppercase tracking-wider text-xs font-black hover:bg-yellow-100 transition-colors shrink-0 shadow-lg">
          <Zap className="w-3.5 h-3.5" /> J&apos;en profite
        </Link>
      </div>
    </div>
  )
}
