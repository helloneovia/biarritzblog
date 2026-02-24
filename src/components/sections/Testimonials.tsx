import { Star } from "lucide-react"

export function Testimonials() {
    const reviews = [
        {
            name: "SARAH M.",
            verified: true,
            text: "I suffered from plantar fasciitis for 3 years. These insoles changed my life within a week. I can finally walk my dog without crying in pain.",
        },
        {
            name: "DAVID K.",
            verified: true,
            text: "Working 10-hour shifts on concrete floors ruined my knees. StepPrs completely absorbed the shock. Recommended!",
        },
        {
            name: "EMMA L.",
            verified: true,
            text: "I was skeptical, but the arch support is incredible. They fit perfectly into my running shoes right out of the box.",
        }
    ]

    return (
        <section id="reviews" className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                        Trusted By 50,000+ Customers
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <span className="text-4xl font-extrabold">4.9</span>
                        <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => <Star key={i} className="h-6 w-6 fill-current" />)}
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-2 font-medium">Based on 3,450+ Reviews</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.map((review, idx) => (
                        <div key={idx} className="bg-muted/40 p-8 rounded-3xl border">
                            <div className="flex text-yellow-500 mb-4">
                                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                            </div>
                            <p className="italic text-muted-foreground mb-6 min-h-[80px]">"{review.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{review.name}</p>
                                    {review.verified && <p className="text-xs text-green-600 flex items-center gap-1">✔ Verified Buyer</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
