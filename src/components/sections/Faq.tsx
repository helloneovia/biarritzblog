import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function Faq() {
    const faqs = [
        {
            question: "S'adaptent-elles à tout type de chaussures ?",
            answer: "Oui ! Nos semelles sont conçues pour s'adapter facilement à la plupart des chaussures, y compris les baskets, les chaussures de travail et les chaussures de ville. Si elles sont légèrement trop longues, vous pouvez facilement découper le bord avant avec des ciseaux.",
        },
        {
            question: "Combien de temps faut-il pour ressentir un soulagement ?",
            answer: "Beaucoup de nos clients ressentent un soulagement immédiat dès qu'ils les enfilent. Pour des problèmes structurels comme l'aponévrosite plantaire, nous recommandons de les porter quotidiennement pendant au moins 7 à 14 jours pour permettre à votre pied de se réaligner complètement.",
        },
        {
            question: "Puis-je laver mes semelles ?",
            answer: "Absolument. Nous recommandons de les laver à la main avec de l'eau tiède et un savon doux. Laissez-les sécher complètement à l'air libre avant de les remettre dans vos chaussures. Ne les lavez pas et ne les séchez pas en machine.",
        },
        {
            question: "Et si elles ne fonctionnent pas pour moi ?",
            answer: "Nous offrons une garantie de confort de 30 jours. Si vous ne ressentez pas le soulagement espéré, retournez-les simplement dans les 30 jours pour un remboursement complet, sans poser de questions.",
        }
    ]

    return (
        <section id="faq" className="py-24 bg-muted/20">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                        Questions Fréquemment Posées
                    </h2>
                    <p className="text-muted-foreground mt-4">
                        Tout ce que vous devez savoir sur le produit et la livraison.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, idx) => (
                        <AccordionItem key={idx} value={`item-${idx}`} className="border-b-2">
                            <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed text-base">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
