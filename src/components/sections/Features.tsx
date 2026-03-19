import { ShieldCheck, Activity, Footprints } from "lucide-react"

export function Features({ texts = {} }: { texts?: any }) {
    const features = [
        {
            title: texts?.f1Title || "Soulagement Immédiat",
            description: texts?.f1Desc || "Prouvé cliniquement pour réduire l'aponévrosite plantaire, les douleurs au talon et la métatarsalgie dès le premier jour.",
            icon: Activity,
        },
        {
            title: texts?.f2Title || "Réalignement Actif",
            description: texts?.f2Desc || "Corrige la pronation excessive et les pieds plats, alignant tout votre corps depuis la base jusqu'en haut.",
            icon: Footprints,
        },
        {
            title: texts?.f3Title || "Coussinet Gel Anti-Choc",
            description: texts?.f3Desc || "Mousse EVA médicale respirante avec coussinets de gel ciblés pour une absorption maximale des chocs.",
            icon: ShieldCheck,
        }
    ]

    return (
        <section id="benefits" className="py-24 bg-background relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-3xl font-black tracking-tight sm:text-5xl text-foreground drop-shadow-sm">
                        {texts?.featuresTitle || "Pourquoi Choisir nos Semelles ?"}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-medium whitespace-pre-wrap">
                        {texts?.featuresSubtitle || "Conçues avec une technologie podologique avancée pour cibler la cause profonde de vos douleurs."}
                    </p>
                </div>

                <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {features.map((feature, idx) => (
                        <div key={idx} className="group flex flex-col items-center text-center p-8 rounded-3xl bg-white/50 dark:bg-black/20 backdrop-blur-xl border border-primary/10 shadow-lg hover:shadow-[0_20px_50px_rgba(255,102,0,0.15)] transition-all duration-500 hover:-translate-y-2 cursor-pointer relative overflow-hidden">
                            {/* Card Hover Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-8 text-primary shadow-inner group-hover:scale-110 transition-transform duration-500">
                                <feature.icon className="h-10 w-10 drop-shadow-sm" />
                            </div>
                            <h3 className="relative text-2xl font-black mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                            <p className="relative text-muted-foreground leading-relaxed font-medium">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
