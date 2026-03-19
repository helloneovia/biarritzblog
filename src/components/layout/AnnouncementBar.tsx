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
        <>
            <Flame className="inline w-4 h-4 text-yellow-400 mr-1.5 animate-pulse" />
            <span>Offre Flash : </span>
            <span className="text-yellow-300 font-black">-50% + 1 paire offerte</span>
            <span> — Il reste </span>
            <span className="text-yellow-300 font-black">{stock} paires</span>
            <span> — Expire dans </span>
            <span className="font-mono text-yellow-300 font-black">{pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}</span>
        </>,
        <>
            <span>📦 </span>
            <span className="text-yellow-300 font-black">Livraison express gratuite</span>
            <span> en France métropolitaine 🇫🇷</span>
        </>,
        <>
            <span>⭐ </span>
            <span className="text-yellow-300 font-black">50 000+ clients satisfaits</span>
            <span> · Note 4.9/5 sur Trustpilot</span>
        </>,
        <>
            <span>🔒 </span>
            <span className="text-yellow-300 font-black">Garantie 30 jours</span>
            <span> satisfait ou intégralement remboursé</span>
        </>,
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
        <Link href="/product" className="block bg-gradient-to-r from-red-700 via-red-600 to-orange-600 text-white w-full overflow-hidden text-xs sm:text-sm font-bold tracking-wide relative border-b-2 border-orange-400 h-10 flex items-center justify-center hover:from-red-800 hover:to-orange-700 transition-colors duration-300">
            {/* Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-[shimmer_3s_ease-in-out_infinite] pointer-events-none" />
            <div
                className="absolute w-full text-center px-4 transition-all duration-300 ease-in-out flex items-center justify-center gap-1"
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
