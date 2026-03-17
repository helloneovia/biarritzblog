"use client"

const profiles = [
    {
        emoji: "🏃",
        label: "Sportif",
        benefits: ["Amorti des chocs", "Maintien arc plantaire", "Performance décuplée"],
        color: "bg-blue-50 border-blue-100 hover:border-blue-300",
        pillColor: "bg-blue-100 text-blue-700",
    },
    {
        emoji: "👩‍⚕️",
        label: "Infirmière / Soignant",
        benefits: ["Debout 8–12h", "Sols durs", "Zéro douleur en fin de service"],
        color: "bg-pink-50 border-pink-100 hover:border-pink-300",
        pillColor: "bg-pink-100 text-pink-700",
    },
    {
        emoji: "🏗️",
        label: "Travailleur de Chantier",
        benefits: ["Bottes de sécurité", "Sol béton", "Genoux protégés"],
        color: "bg-yellow-50 border-yellow-100 hover:border-yellow-300",
        pillColor: "bg-yellow-100 text-yellow-700",
    },
    {
        emoji: "🚶",
        label: "Marcheur / Randonneur",
        benefits: ["Fasciite plantaire", "Longues distances", "Stabilité accrue"],
        color: "bg-green-50 border-green-100 hover:border-green-300",
        pillColor: "bg-green-100 text-green-700",
    },
    {
        emoji: "💼",
        label: "Bureau & Commerce",
        benefits: ["Chaussures de ville", "Dos soulagé", "Journées au top"],
        color: "bg-purple-50 border-purple-100 hover:border-purple-300",
        pillColor: "bg-purple-100 text-purple-700",
    },
    {
        emoji: "⛳",
        label: "Golfeur",
        benefits: ["Meilleure posture", "18 trous sans douleur", "Équilibre optimal"],
        color: "bg-emerald-50 border-emerald-100 hover:border-emerald-300",
        pillColor: "bg-emerald-100 text-emerald-700",
    },
    {
        emoji: "👴",
        label: "Senior Actif",
        benefits: ["Confort au quotidien", "Prévention des chutes", "Autonomie retrouvée"],
        color: "bg-orange-50 border-orange-100 hover:border-orange-300",
        pillColor: "bg-orange-100 text-orange-700",
    },
]

export function UseCases() {
    return (
        <section className="py-20 bg-muted/20 border-y">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <span className="inline-block text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
                        Pour Tous les Profils
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                        Fabriquées para Tous, Chaque Jour
                    </h2>
                    <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                        Que vous soyez sportif, professionnel de santé, ou simplement actif au quotidien — nos semelles s&apos;adaptent à votre vie.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {profiles.map((p, i) => (
                        <div
                            key={i}
                            className={`rounded-2xl border-2 p-5 transition-all duration-200 cursor-default ${p.color}`}
                        >
                            <div className="text-3xl mb-3">{p.emoji}</div>
                            <p className="font-black text-sm mb-3 text-gray-800">{p.label}</p>
                            <ul className="space-y-1.5">
                                {p.benefits.map((b, j) => (
                                    <li key={j} className={`text-xs font-semibold px-2 py-1 rounded-full inline-block mr-1 mb-1 ${p.pillColor}`}>
                                        ✓ {b}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    {/* CTA card */}
                    <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 flex flex-col items-center justify-center text-center hover:border-primary transition-all duration-200">
                        <span className="text-3xl mb-3">🧡</span>
                        <p className="font-black text-sm text-primary mb-1">Votre profil ici ?</p>
                        <p className="text-xs text-muted-foreground">Tout le monde mérite des pieds sans douleur.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
