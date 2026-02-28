import { ShieldCheck, Activity, Footprints } from "lucide-react"

export function Features({ texts = {} }: { texts?: any }) {
    const features = [
        {
            title: texts?.f1Title || "Instant Pain Relief",
            description: texts?.f1Desc || "Clinically proven to reduce plantar fasciitis, heel pain, and metatarsalgia from day one.",
            icon: Activity,
        },
        {
            title: texts?.f2Title || "Posture Realignment",
            description: texts?.f2Desc || "Corrects overpronation and flat feet, aligning your entire body from the ground up.",
            icon: Footprints,
        },
        {
            title: texts?.f3Title || "All-Day Comfort",
            description: texts?.f3Desc || "Medical-grade EVA foam with targeted cushioning zones for maximum shock absorption.",
            icon: ShieldCheck,
        }
    ]

    return (
        <section id="benefits" className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                        {texts?.featuresTitle || "Why Choose StepPrs?"}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg whitespace-pre-wrap">
                        {texts?.featuresSubtitle || "Built with advanced podiatric technology, our insoles target the root cause of foot and back pain."}
                    </p>
                </div>

                <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center p-6 rounded-3xl bg-muted/30 border transition-all hover:bg-muted/50 cursor-pointer">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                <feature.icon className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
