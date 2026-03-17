"use client"

import { CheckCircle, Shield, Zap, Hand, Award } from "lucide-react"

const points = [
    {
        number: "01",
        icon: <Zap className="h-6 w-6 text-primary" />,
        title: "Un soulagement instantané dès le Premier Port",
        content: "Contrairement aux orthèses sur mesure qui nécessitent des semaines d'adaptation, nos semelles sont conçues pour une efficacité quasi-immédiate. L'association d'un coussin haute densité et d'un soutien structurel délivre une liberté immédiate contre la douleur lancinante au talon — dès la première heure."
    },
    {
        number: "02",
        icon: <Shield className="h-6 w-6 text-primary" />,
        title: "Validées Cliniquement : Vraiment Approuvées par des Orthopédistes",
        content: "Le scepticisme face aux remèdes en ligne est légitime. C'est pourquoi nos semelles ont été testées cliniquement et approuvées par des professionnels de santé. Matériaux, conception et mécanismes sont ingéniérés pour corriger la racine biomécanique de la fasciite plantaire — pas seulement masquer la douleur."
    },
    {
        number: "03",
        icon: <Award className="h-6 w-6 text-primary" />,
        title: "Un Soutien de la Voûte Avancé qui Restaure la Stabilité Structurelle",
        content: "Le problème central de la fasciite plantaire est souvent une voûte plantaire affaissée qui provoque l'étirement et la déchirure du fascia. Nos semelles intègrent un soutien de la voûte stratégique, calibré pour soulever et stabiliser la structure naturelle du pied, permettant aux tissus de se reposer et de guérir durablement."
    },
    {
        number: "04",
        icon: <Hand className="h-6 w-6 text-primary" />,
        title: "Des Points de Massage Ciblés qui Soulagent le Fascia à Chaque Pas",
        content: "Des points de massage propriétaires sont intégrés dans la conception pour stimuler doucement les tissus inflammés à chaque pas. Cette stimulation augmente la circulation sanguine et réduit la tension locale dans le fascia — transformant votre marche quotidienne en une vraie séance thérapeutique."
    },
    {
        number: "05",
        icon: <CheckCircle className="h-6 w-6 text-primary" />,
        title: "Garantie 90 Jours Satisfait ou Remboursé — Risque Zéro",
        content: "Nous comprenons que vous avez besoin de preuves, pas de promesses. La garantie de 90 jours agit comme votre période d'essai sans risque. Si vous ne constatez pas une amélioration significative de votre mobilité quotidienne dans les 90 jours, nous remboursons intégralement. Le seul risque, c'est de ne rien faire."
    },
]

export function PlantarFasciitisArticle() {
    return (
        <section className="py-20 bg-background border-y">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                {/* Article header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-primary text-white px-3 py-1 rounded-full">
                            OrthoInsider Exclusif
                        </span>
                        <span className="text-xs text-muted-foreground">Par Dr. M. Laurent · Mis à jour Mars 2026</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
                        Fasciite Plantaire : Pourquoi les Experts Orthopédiques Changent leurs Recommandations
                    </h2>
                    <p className="text-muted-foreground text-base leading-relaxed border-l-4 border-primary pl-4">
                        Les 2 millions de personnes souffrant des douleurs lancinantes de la fasciite plantaire savent que trouver un soulagement ressemble à un parcours du combattant. Les semelles bon marché échouent ; la douleur revient au premier pas le matin. Ce cycle frustrant prend fin maintenant.
                    </p>
                </div>

                {/* 5 Points */}
                <div className="space-y-8">
                    {points.map((p) => (
                        <div key={p.number} className="flex gap-5 items-start group">
                            <div className="shrink-0 flex flex-col items-center gap-2 pt-1">
                                <div className="bg-primary/10 rounded-xl p-2.5 group-hover:bg-primary/20 transition-colors">
                                    {p.icon}
                                </div>
                                <span className="text-[10px] font-black text-primary/40">{p.number}</span>
                            </div>
                            <div>
                                <h3 className="font-black text-lg mb-2 text-foreground">{p.title}</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">{p.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Closing statement */}
                <div className="mt-12 bg-primary/5 border border-primary/20 rounded-3xl p-8 text-center">
                    <p className="font-black text-xl mb-3">Le choix orthopédique est clair.</p>
                    <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                        L&apos;approbation clinique, le soulagement instantané, la confiance de plus de 50 000 clients français, et le filet de sécurité 90 jours. Le seul risque restant est de ne rien faire.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm font-bold">
                        <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Soulagement Instantané</span>
                        <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Approuvé par Orthopédistes</span>
                        <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Garantie 90 Jours</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
