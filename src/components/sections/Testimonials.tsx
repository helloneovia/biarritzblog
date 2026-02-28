import { Star } from "lucide-react"
import { prisma } from "@/lib/prisma"

// Fallback reviews if DB has none yet
const FALLBACK_REVIEWS = [
    {
        author: "SARAH M.",
        content: "I suffered from plantar fasciitis for 3 years. These insoles changed my life within a week. I can finally walk my dog without crying in pain.",
        rating: 5,
        isVerified: true,
    },
    {
        author: "DAVID K.",
        content: "Working 10-hour shifts on concrete floors ruined my knees. StepPrs completely absorbed the shock. Highly recommended!",
        rating: 5,
        isVerified: true,
    },
    {
        author: "EMMA L.",
        content: "I was skeptical, but the arch support is incredible. They fit perfectly into my running shoes right out of the box.",
        rating: 5,
        isVerified: true,
    }
]

export async function Testimonials() {
    // Fetch real reviews from DB
    const dbReviews = await prisma.review.findMany({
        where: { isVerified: true },
        orderBy: { createdAt: 'desc' },
        take: 6,
    })

    const reviews = dbReviews.length >= 3 ? dbReviews : FALLBACK_REVIEWS

    const totalReviews = await prisma.review.count()
    const avgRating = dbReviews.length > 0
        ? dbReviews.reduce((sum, r) => sum + r.rating, 0) / dbReviews.length
        : 4.9

    const displayCount = totalReviews > 0 ? totalReviews.toLocaleString('fr-FR') : '3,450+'
    const displayRating = avgRating.toFixed(1)

    return (
        <section id="reviews" className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                        Trusted By 50,000+ Customers
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <span className="text-4xl font-extrabold">{displayRating}</span>
                        <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => <Star key={i} className="h-6 w-6 fill-current" />)}
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-2 font-medium">Based on {displayCount} Reviews</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.slice(0, 3).map((review, idx) => (
                        <div key={idx} className="bg-muted/40 p-8 rounded-3xl border">
                            <div className="flex text-yellow-500 mb-4">
                                {[...Array(review.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                            </div>
                            <p className="italic text-muted-foreground mb-6 min-h-[80px]">&quot;{review.content}&quot;</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {review.author.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{review.author}</p>
                                    {review.isVerified && (
                                        <p className="text-xs text-green-600 flex items-center gap-1">✔ Verified Buyer</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
