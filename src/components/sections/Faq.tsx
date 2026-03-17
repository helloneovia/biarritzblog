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
            answer: "Nous offrons une garantie de confort de 90 jours. Si vous ne ressentez pas le soulagement espéré, retournez-les simplement dans les 90 jours pour un remboursement complet, sans poser de questions.",
        },
        {
            question: "Ma semelle est trop grande, que faire ?",
            answer: "Si vous êtes entre deux tailles, choisissez toujours la taille supérieure et découpez la semelle le long des marquages pointillés indiqués à l'arrière. C'est simple, rapide et donne un résultat parfaitement ajusté à votre chaussure.",
        },
        {
            question: "Combien de temps durent les semelles ?",
            answer: "Nos semelles sont conçues pour durer. Avec un entretien régulier (lavage à la main), vous pouvez vous attendre à plus de 12 mois de confort et de soutien optimal. Plus vous les entretenez, plus elles durent.",
        },
        {
            question: "Aident-elles contre la fasciite plantaire et les douleurs au talon ?",
            answer: "Oui, nos semelles sont particulièrement efficaces contre les conditions comme l'aponévrosite plantaire, les douleurs d'arche, les douleurs de talon et la métatarsalgie. Le soutien ciblé aide à distribuer la pression uniformément sur toute la plante du pied.",
        },
        {
            question: "Fonctionnent-elles dans les chaussures de sécurité ou de travail ?",
            answer: "Tout à fait ! Nos semelles s'insèrent facilement dans la plupart des chaussures de sécurité, bottes de chantier, chaussures de cuisine ou d'hôpital. Elles sont particulièrement appréciées par les travailleurs qui sont debout de longues heures sur des surfaces dures.",
        },
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
