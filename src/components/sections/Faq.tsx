import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function Faq() {
    const faqs = [
        {
            question: "Do these fit in any type of shoe?",
            answer: "Yes! StepPrs are designed to fit effortlessly into most footwear, including sneakers, work boots, casual shoes, and even some dress shoes. If they are slightly too long, you can easily trim the front edge with scissors.",
        },
        {
            question: "How long does it take to feel relief?",
            answer: "Many of our customers report feeling immediate relief as soon as they put them on. For structural issues like plantar fasciitis, we recommend wearing them daily for at least 7-14 days to allow your foot to fully realign.",
        },
        {
            question: "Can I wash my StepPrs insoles?",
            answer: "Absolutely. We recommend hand-washing them with warm water and mild soap. Let them air dry completely before putting them back into your shoes. Do not machine wash or dry.",
        },
        {
            question: "What if they don't work for me?",
            answer: "We offer a 30-day comfort guarantee. If you're not experiencing the pain relief you hoped for, simply return them within 30 days for a full refund—no questions asked.",
        }
    ]

    return (
        <section id="faq" className="py-24 bg-muted/20">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground mt-4">
                        Everything you need to know about the product and billing.
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
