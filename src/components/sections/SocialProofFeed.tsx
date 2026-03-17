"use client"

import { useState } from "react"

const PROFILES = [
    {
        tag: "#FasciitePlantaire",
        name: "Marie D.",
        role: "Infirmière · 12h debout par jour",
        avatar: "👩‍⚕️",
        quote: "Après 6 mois de fasciite plantaire et des douleurs insupportables, j'ai commandé ces semelles par désespoir. Résultat : soulagement dès le 2ème jour ! Mes collègues me demandent mon secret.",
        likes: 667,
        comments: 9,
        time: "Il y a 4h",
        tag_color: "bg-red-100 text-red-700",
    },
    {
        tag: "#Facteur",
        name: "Jean-Pierre L.",
        role: "Facteur · 25 km/jour à pied",
        avatar: "👨‍💼",
        quote: "Je marche entre 20 et 30 km par jour. Avant j'avais les pieds en feu en fin de journée. Maintenant je rentre chez moi avec l'énergie pour jouer avec mes enfants. Incroyable.",
        likes: 1100,
        comments: 13,
        time: "Il y a 16h",
        tag_color: "bg-yellow-100 text-yellow-700",
    },
    {
        tag: "#Golf",
        name: "Thomas B.",
        role: "Golfeur amateur · 18 trous le weekend",
        avatar: "⛳",
        quote: "Mon médecin m'avait dit que j'avais les pieds plats et que je devais arrêter le sport. Ces semelles m'ont permis de reprendre le golf sans aucune douleur.",
        likes: 3700,
        comments: 31,
        time: "Il y a 2j",
        tag_color: "bg-green-100 text-green-700",
    },
    {
        tag: "#Basketball",
        name: "Édouard K.",
        role: "Basketteur · Entraînement 4x/semaine",
        avatar: "🏀",
        quote: "Ces semelles ont complètement changé mon jeu. Plus de douleurs aux genoux, meilleur amorti lors des sauts. Je les recommande à toute mon équipe.",
        likes: 4100,
        comments: 46,
        time: "Il y a 4j",
        tag_color: "bg-orange-100 text-orange-700",
    },
    {
        tag: "#Ouvrier",
        name: "Karim M.",
        role: "Chef de chantier · Sols durs 10h/jour",
        avatar: "👷",
        quote: "Sur le chantier on marche sur du béton toute la journée. J'avais des douleurs terribles aux talons. Depuis ces semelles, plus rien. Je les ai même recommandées au patron !",
        likes: 892,
        comments: 21,
        time: "Il y a 5j",
        tag_color: "bg-gray-100 text-gray-700",
    },
    {
        tag: "#Running",
        name: "Sophie R.",
        role: "Coureuse · Semi-marathon en préparation",
        avatar: "🏃‍♀️",
        quote: "Je préparais mon premier semi-marathon quand j'ai eu une tendinite. Ces semelles m'ont aidée à récupérer et à finir ma course. Temps : 1h58 ! Merci Biarritz !",
        likes: 2340,
        comments: 57,
        time: "Il y a 1 sem",
        tag_color: "bg-blue-100 text-blue-700",
    },
]

function HeartIcon({ filled }: { filled: boolean }) {
    return (
        <svg viewBox="0 0 24 24" className={`w-5 h-5 ${filled ? "fill-red-500 stroke-red-500" : "fill-none stroke-current"}`} strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
    )
}

export function SocialProofFeed() {
    const [liked, setLiked] = useState<Record<number, boolean>>({})

    const toggleLike = (i: number) => {
        setLiked(prev => ({ ...prev, [i]: !prev[i] }))
    }

    return (
        <section className="py-24 bg-muted/20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-14">
                    <span className="inline-block text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
                        Témoignages Réels
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
                        Ils Ont Transformé Leurs{" "}
                        <span className="text-primary">Pieds & Leur Vie</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Des vrais clients, de vraies histoires — pas des avis inventés.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {PROFILES.map((p, i) => (
                        <div key={i} className="bg-white rounded-3xl shadow-sm border border-border hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="p-5 flex items-start gap-3 border-b">
                                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                                    {p.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-sm truncate">{p.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{p.role}</p>
                                    <p className="text-[10px] text-muted-foreground">{p.time}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${p.tag_color}`}>
                                    {p.tag}
                                </span>
                            </div>

                            {/* Stars */}
                            <div className="px-5 pt-4 flex gap-0.5">
                                {[...Array(5)].map((_, s) => (
                                    <span key={s} className="text-yellow-400 text-base">★</span>
                                ))}
                            </div>

                            {/* Quote */}
                            <div className="px-5 py-3 flex-1">
                                <p className="text-sm leading-relaxed text-foreground/80 italic">
                                    &ldquo;{p.quote}&rdquo;
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="px-5 py-4 border-t flex items-center gap-5 text-xs text-muted-foreground">
                                <button
                                    onClick={() => toggleLike(i)}
                                    className={`flex items-center gap-1.5 font-semibold transition-colors ${liked[i] ? "text-red-500" : "hover:text-red-400"}`}
                                >
                                    <HeartIcon filled={!!liked[i]} />
                                    {p.likes + (liked[i] ? 1 : 0)}
                                </button>
                                <span className="flex items-center gap-1.5">
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                    </svg>
                                    {p.comments} commentaires
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
