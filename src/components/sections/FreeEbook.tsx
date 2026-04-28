import Link from "next/link"
import { BookOpen, CheckCircle } from "lucide-react"
import { OpenCartButton } from "@/components/ui/OpenCartButton"

const EBOOK_POINTS = [
    "Les 7 erreurs qui aggravent votre fasciite plantaire",
    "Protocole de rééducation express en 14 jours",
    "Exercices d'étirement guidés pour les pieds et chevilles",
    "Comment choisir les bonnes chaussures selon votre morphologie",
    "Le régime anti-inflammatoire pour les sportifs",
    "Quand consulter un podologue (et quoi lui dire)",
]

export function FreeEbook() {
    return (
        <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-primary/10 border-y border-primary/10">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    {/* Left: Book visual */}
                    <div className="flex justify-center">
                        <div className="relative">
                            {/* Shadow */}
                            <div className="absolute inset-0 translate-x-4 translate-y-4 bg-primary/20 rounded-3xl blur-xl" />

                            {/* Book */}
                            <div className="relative w-64 h-80 bg-gradient-to-br from-primary to-primary/80 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 text-white">
                                <BookOpen className="w-16 h-16 mb-4 opacity-90" />
                                <p className="text-center font-black text-xl leading-tight mb-2">
                                    Maîtrise de la Santé des Pieds
                                </p>
                                <p className="text-center text-sm opacity-80 leading-snug">
                                    Votre guide complet pour des pieds heureux et sans douleur
                                </p>
                                <div className="mt-6 bg-white text-primary text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest">
                                    GRATUIT
                                </div>
                            </div>

                            {/* Floating badge */}
                            <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1.5 rounded-full shadow-lg rotate-6">
                                🎁 Offert !
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div>
                        <span className="inline-block text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-5">
                            🎁 Cadeau Exclusif
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
                            eBook Offert avec{" "}
                            <span className="text-primary">Chaque Commande</span>
                        </h2>
                        <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                            Découvrez les secrets d&apos;une santé podiatrique optimale avec notre guide exclusif : <strong>Maîtrise de la Santé des Pieds</strong>. Valeur réelle : 29€. Offert gratuitement avec votre achat.
                        </p>

                        <ul className="space-y-3 mb-8">
                            {EBOOK_POINTS.map((pt, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <span className="text-sm leading-relaxed">{pt}</span>
                                </li>
                            ))}
                        </ul>

                        <OpenCartButton
                            className="inline-flex items-center gap-2 bg-primary text-white font-black px-8 py-4 rounded-2xl text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                        >
                            <BookOpen className="w-5 h-5" />
                            Obtenir Mon eBook Gratuit →
                        </OpenCartButton>
                        <p className="text-xs text-muted-foreground mt-3">
                            Envoyé automatiquement après votre commande. Aucune inscription requise.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
