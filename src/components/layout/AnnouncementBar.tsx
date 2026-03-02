"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const announcements = [
    "🚀 NOUVEAU ! La technologie magnétique 2024 est enfin disponible.",
    "✨ OFFRE SPÉCIALE : 50% de réduction pour les 100 prochaines commandes !",
    "📦 Livraison express gratuite en France métropolitaine 🇫🇷",
    "⭐ Plus de 50 000 clients satisfaits !"
]

export function AnnouncementBar() {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % announcements.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="bg-black text-white w-full overflow-hidden text-sm font-bold tracking-wide relative border-b-2 border-primary h-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute w-full text-center px-4"
                >
                    {announcements[currentIndex]}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
