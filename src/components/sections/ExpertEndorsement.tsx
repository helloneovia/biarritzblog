import { Quote, BadgeCheck } from "lucide-react"
import Image from "next/image"

const experts = [
    {
        name: "Dr. Sophie Marchand",
        title: "Podologue — Paris, France",
        avatar: "https://i.pravatar.cc/120?img=47",
        quote: "En tant que podologue avec plus de 12 ans d'expérience, je recommande vivement les semelles de Biarritz. Leur conception innovante fournit un soulagement ciblé des voûtes plantaires, aide à distribuer la pression équitablement et réduit la tension sur le fascia plantaire. Après quelques semaines d'utilisation régulière, mes patients constatent une amélioration significative de leurs symptômes.",
    },
    {
        name: "Dr. Jean-Pierre Leroy",
        title: "Kinésithérapeute — Lyon, France",
        avatar: "https://i.pravatar.cc/120?img=12",
        quote: "Je prescris régulièrement des semelles orthopédiques à mes patients souffrant de douleurs aux genoux, aux hanches et au bas du dos. Les semelles de Biarritz se distinguent par leur excellent rapport qualité-prix et leur efficacité dans la correction de la posture et la réduction des chocs. Un produit que je recommande avec confiance.",
    },
]

export function ExpertEndorsement() {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <span className="inline-block text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
                        Avis Experts
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                        Recommandé par les Professionnels de Santé
                    </h2>
                    <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                        Des podologues et kinésithérapeutes reconnus attestent de l&apos;efficacité de nos semelles.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {experts.map((expert, i) => (
                        <div key={i} className="bg-muted/30 rounded-3xl p-8 border relative">
                            <Quote className="h-8 w-8 text-primary/20 absolute top-6 right-6" />
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-primary/20 shrink-0">
                                    <Image src={expert.avatar} alt={expert.name} width={64} height={64} className="object-cover" />
                                </div>
                                <div>
                                    <p className="font-black text-base">{expert.name}</p>
                                    <p className="text-sm text-muted-foreground">{expert.title}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <BadgeCheck className="h-4 w-4 text-primary" />
                                        <span className="text-xs font-bold text-primary">Professionnel Vérifié</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-muted-foreground italic leading-relaxed text-sm">
                                &quot;{expert.quote}&quot;
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
