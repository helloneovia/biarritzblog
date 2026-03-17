"use client"

const BADGES = [
    { emoji: "🌍", text: "Livraison Suivie & Assurée" },
    { emoji: "😊", text: "50 000+ Clients Satisfaits" },
    { emoji: "🛡️", text: "Garantie 90 Jours Remboursement" },
    { emoji: "⚡", text: "Expédition Express 24-48h" },
    { emoji: "🏅", text: "Certifié par des Podologues" },
    { emoji: "💳", text: "Paiement Sécurisé" },
    { emoji: "🌍", text: "Livraison Suivie & Assurée" },
    { emoji: "😊", text: "50 000+ Clients Satisfaits" },
    { emoji: "🛡️", text: "Garantie 90 Jours Remboursement" },
    { emoji: "⚡", text: "Expédition Express 24-48h" },
    { emoji: "🏅", text: "Certifié par des Podologues" },
    { emoji: "💳", text: "Paiement Sécurisé" },
]

export function TrustBar() {
    return (
        <div className="relative overflow-hidden bg-primary py-3 select-none">
            <div
                className="flex gap-0 animate-marquee whitespace-nowrap"
                style={{ animation: "marquee 28s linear infinite" }}
            >
                {BADGES.map((b, i) => (
                    <span key={i} className="inline-flex items-center gap-2 text-white text-sm font-semibold px-8">
                        <span className="text-lg">{b.emoji}</span>
                        {b.text}
                        <span className="mx-4 opacity-30">|</span>
                    </span>
                ))}
            </div>
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    )
}
