"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Flame, Clock } from "lucide-react"

export function AnnouncementBar({ t }: { t?: Record<string, string> }) {
    const [timeLeft, setTimeLeft] = useState({ h: 2, m: 47, s: 33 })
    const [stock] = useState(17)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)

    const pad = (n: number) => String(n).padStart(2, "0")

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { h, m, s } = prev
                s--
                if (s < 0) { s = 59; m-- }
                if (m < 0) { m = 59; h-- }
                if (h < 0) { h = 2; m = 47; s = 33 }
                return { h, m, s }
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const announcements = [
        <div key="1" className="flex items-center flex-wrap justify-center gap-1">
            <Flame className="inline w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 animate-pulse shrink-0" />
            <span>Offre Flash :</span>
            <span className="text-yellow-300 font-black">-50% + 1 offerte</span>
            <span className="hidden sm:inline">— Il reste</span>
            <span className="hidden sm:inline text-yellow-300 font-black">{stock} paires</span>
            <span className="hidden sm:inline">— Expire dans</span>
            <span className="font-mono text-yellow-300 font-black">
                {pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}
            </span>
        </div>,
        <div key="2" className="flex items-center flex-wrap justify-center gap-1">
            <span>📦</span>
            <span className="text-yellow-300 font-black">Livraison express gratuite</span>
            <span className="hidden sm:inline">en France métropolitaine 🇫🇷</span>
        </div>,
        <div key="3" className="flex items-center flex-wrap justify-center gap-1">
            <span>⭐</span>
            <span className="text-yellow-300 font-black">50 000+ clients satisfaits</span>
            <span className="hidden sm:inline">· Note 4.9/5</span>
        </div>,
        <div key="4" className="flex items-center flex-wrap justify-center gap-1">
            <span>🔒</span>
            <span className="text-yellow-300 font-black">Garantie 30 jours</span>
            <span className="hidden sm:inline">satisfait ou remboursé</span>
        </div>,
    ]

    useEffect(() => {
        const timer = setInterval(() => {
            setIsAnimating(true)
            setTimeout(() => {
                setCurrentIndex(prev => (prev + 1) % announcements.length)
                setIsAnimating(false)
            }, 300)
        }, 4500)
        return () => clearInterval(timer)
    }, [])

    return (
        <Link href="/product" className="block bg-gradient-to-r from-red-700 via-red-600 to-orange-600 text-white w-full overflow-hidden text-[11px] sm:text-sm font-bold tracking-wide relative border-b-2 border-orange-400 min-h-8 sm:min-h-10 flex items-center justify-center hover:from-red-800 hover:to-orange-700 transition-colors duration-300 py-1 sm:py-0 px-2">
            {/* Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-[shimmer_3s_ease-in-out_infinite] pointer-events-none" />
            <div
                className="w-full text-center transition-all duration-300 ease-in-out flex items-center justify-center"
                style={{
                    transform: isAnimating ? 'translateY(-20px)' : 'translateY(0)',
                    opacity: isAnimating ? 0 : 1,
                }}
            >
                {announcements[currentIndex]}
            </div>
        </Link>
    )
}
