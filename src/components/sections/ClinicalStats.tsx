import { TrendingUp, Smile, ShieldCheck } from "lucide-react"

const stats = [
    {
        percent: "95%",
        icon: <TrendingUp className="h-7 w-7 text-primary" />,
        label: "Réduction de la douleur aux pieds",
        desc: "Le soutien de la voûte et l'amortissement soulagent significativement la douleur.",
    },
    {
        percent: "94%",
        icon: <Smile className="h-7 w-7 text-primary" />,
        label: "Amélioration du confort",
        desc: "Un confort renforcé à chaque pas, réduisant la fatigue et l'inconfort.",
    },
    {
        percent: "90%",
        icon: <ShieldCheck className="h-7 w-7 text-primary" />,
        label: "Réduction du risque de blessure",
        desc: "L'amortissement et le soutien aident à réduire les risques de blessures au pied.",
    },
]

export function ClinicalStats() {
    return (
        <section className="py-20 bg-primary/5 border-y border-primary/10">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <span className="inline-block text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
                        Validé Cliniquement
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                        L&apos;avenir, c&apos;est des pieds sans douleur
                    </h2>
                    <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                        Résultats issus d&apos;études cliniques et consommateurs réalisées sur nos semelles orthopédiques.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {stats.map((s, i) => (
                        <div key={i} className="flex flex-col items-center text-center bg-white rounded-3xl border border-primary/10 p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-primary/10 rounded-2xl p-4 mb-4">
                                {s.icon}
                            </div>
                            <span className="text-5xl font-black text-primary mb-2">{s.percent}</span>
                            <p className="font-bold text-lg mb-2">{s.label}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>

                <p className="text-center text-xs text-muted-foreground mt-8">
                    * Résultats basés sur des études cliniques et de satisfaction consommateurs.
                </p>
            </div>
        </section>
    )
}
