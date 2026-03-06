import { CheckCircle } from "lucide-react"

export function ReasonsToBuy({ texts = {} }: { texts?: any }) {
    const reasons = [
        {
            title: texts?.rtb1Title || "Soulagement Immédiat de la Douleur",
            desc: texts?.rtb1Desc || "Conçues pour soulager l'aponévrosite plantaire, les douleurs au talon et les pieds plats dès la première utilisation."
        },
        {
            title: texts?.rtb2Title || "Recommandées par les Podologues",
            desc: texts?.rtb2Desc || "Développées en collaboration avec des experts de la santé du pied pour garantir un soutien optimal."
        },
        {
            title: texts?.rtb3Title || "Matériaux Premium & Respirants",
            desc: texts?.rtb3Desc || "Fabriquées avec une mousse EVA médicale et un tissu anti-odeur pour un confort tout au long de la journée."
        },
        {
            title: texts?.rtb4Title || "Adaptables à Toutes Vos Chaussures",
            desc: texts?.rtb4Desc || "Design fin et découpable pour s'insérer parfaitement dans vos baskets, chaussures de ville ou bottes."
        },
        {
            title: texts?.rtb5Title || "Correction de la Posture",
            desc: texts?.rtb5Desc || "Réalignent le pied pour réduire la tension sur les genoux, les hanches et le bas du dos."
        },
        {
            title: texts?.rtb6Title || "Garantie Satisfait ou Remboursé",
            desc: texts?.rtb6Desc || "Essayez nos semelles pendant 30 jours sans aucun risque. Si vous n'êtes pas convaincu, nous vous remboursons."
        }
    ]

    return (
        <section className="py-24 bg-muted/10 border-t border-b">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                        {texts?.rtbTitle || "6 Raisons de Faire le Bon Choix"}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        {texts?.rtbSubtitle || "Découvrez pourquoi plus de 50 000 clients ont choisi nos semelles pour retrouver le sourire."}
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reasons.map((reason, idx) => (
                        <div key={idx} className="flex gap-4 items-start p-6 bg-background rounded-3xl border shadow-sm hover:shadow-md transition-shadow">
                            <div className="shrink-0 mt-1">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-2">{reason.title}</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    {reason.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
