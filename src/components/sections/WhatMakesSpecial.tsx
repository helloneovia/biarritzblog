const pillars = [
    {
        emoji: "🧬",
        title: "Technologie Brevetée",
        desc: "450+ points d'acupression magnétique ciblant les méridiens réflexologiques clés du pied.",
    },
    {
        emoji: "🩺",
        title: "Recommandé par des Médecins",
        desc: "Validées par des podologues et kinésithérapeutes spécialisés en biomécanique du pied.",
    },
    {
        emoji: "⚡",
        title: "Résultats dès le 1er Port",
        desc: "La majorité de nos clients ressentent un soulagement immédiat dès le premier port.",
    },
    {
        emoji: "♻️",
        title: "Matériaux Premium",
        desc: "Mousse EVA médicale multicouche avec revêtement antibactérien et anti-transpiration.",
    },
    {
        emoji: "✂️",
        title: "Taille Universelle",
        desc: "S'adapte à toutes les pointures grâce aux lignes de découpe millimétrées.",
    },
    {
        emoji: "💚",
        title: "Engagement Qualité",
        desc: "Chaque paire est fabriquée avec un contrôle qualité rigoureux pour durer des années.",
    },
]

export function WhatMakesSpecial() {
    return (
        <section className="py-24 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-14">
                    <span className="inline-block text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
                        Notre Philosophie
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
                        Ce Qui Nous Rend{" "}
                        <span className="text-primary">Uniques</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                        Nous nous consacrons à votre confort et à votre satisfaction. Notre mission est de faire une vraie différence dans votre vie quotidienne — un pas à la fois.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-14">
                    {pillars.map((p, i) => (
                        <div
                            key={i}
                            className="group bg-white border border-border rounded-3xl p-7 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                {p.emoji}
                            </div>
                            <h3 className="font-black text-lg mb-2 text-gray-900">{p.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Central CTA strip */}
                <div className="max-w-3xl mx-auto bg-primary rounded-3xl p-8 text-center text-white">
                    <p className="text-2xl font-black mb-2">
                        🧡 Soulagement de la douleur &amp; fatigue
                    </p>
                    <p className="text-2xl font-black mb-2">
                        🧡 Soutien de la voûte &amp; points de massage
                    </p>
                    <p className="text-2xl font-black mb-2">
                        🧡 Régulation thermique &amp; ventilation
                    </p>
                    <p className="text-2xl font-black mb-6">
                        🧡 Élimination des mauvaises odeurs
                    </p>
                    <a
                        href="#product-form"
                        className="inline-block bg-white text-primary font-black px-8 py-4 rounded-2xl text-lg hover:bg-primary-foreground transition-colors"
                    >
                        Commander Maintenant →
                    </a>
                </div>
            </div>
        </section>
    )
}
