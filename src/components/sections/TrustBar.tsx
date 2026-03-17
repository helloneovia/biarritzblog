"use client"

const BADGES = [
    { emoji: "🌍", text: "Livraison Suivie & Assurée" },
    { emoji: "😊", text: "50 000+ Clients" },
    { emoji: "🛡️", text: "Garantie 90 Jours" },
    { emoji: "⚡", text: "Expédition 24-48h" },
    { emoji: "🏅", text: "Certifié Podologues" },
    { emoji: "💳", text: "Paiement Sécurisé" },
]

// Double for seamless loop
const MARQUEE_BADGES = [...BADGES, ...BADGES]

export function TrustBar() {
    return (
        <>
            {/* Mobile: compact static 2-column icon grid */}
            <div className="md:hidden bg-primary py-4 px-4">
                <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
                    {BADGES.map((b, i) => (
                        <div key={i} className="flex items-center gap-2 text-white">
                            <span className="text-base flex-shrink-0">{b.emoji}</span>
                            <span className="text-[11px] font-semibold leading-tight">{b.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop: scrolling marquee */}
            <div className="hidden md:block relative overflow-hidden bg-primary py-3 select-none">
                <div
                    className="flex whitespace-nowrap"
                    style={{ animation: "trustbar 30s linear infinite" }}
                >
                    {MARQUEE_BADGES.map((b, i) => (
                        <span key={i} className="inline-flex items-center gap-2 text-white text-sm font-semibold px-8 flex-shrink-0">
                            <span className="text-lg">{b.emoji}</span>
                            {b.text}
                            <span className="mx-3 opacity-30">|</span>
                        </span>
                    ))}
                </div>
                <style>{`
                    @keyframes trustbar {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                `}</style>
            </div>
        </>
    )
}
