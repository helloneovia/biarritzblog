"use client"

import { useEffect, useState } from "react"

export function AnnouncementBar({ t }: { t?: Record<string, string> }) {
    const defaultAnnouncements = [
        "🚀 NOUVEAU ! La technologie magnétique 2024 est enfin disponible.",
        "✨ OFFRE SPÉCIALE : 50% de réduction pour les 100 prochaines commandes !",
        "📦 Livraison express gratuite en France métropolitaine 🇫🇷",
        "⭐ Plus de 50 000 clients satisfaits !"
    ]

    const announcements = t && t.announcement1 
        ? [t.announcement1, t.announcement2, t.announcement3, t.announcement4].filter(Boolean) as string[]
        : defaultAnnouncements

    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            setIsAnimating(true)
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % announcements.length)
                setIsAnimating(false)
            }, 300)
        }, 4000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="bg-black text-white w-full overflow-hidden text-sm font-bold tracking-wide relative border-b-2 border-primary h-10 flex items-center justify-center">
            <div
                className="absolute w-full text-center px-4 transition-all duration-300 ease-in-out"
                style={{
                    transform: isAnimating ? 'translateY(-20px)' : 'translateY(0)',
                    opacity: isAnimating ? 0 : 1,
                }}
            >
                {announcements[currentIndex]}
            </div>
        </div>
    )
}
