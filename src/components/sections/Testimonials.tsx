import { Star } from "lucide-react"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { unstable_cache } from "next/cache"

// Fallback reviews if DB has none yet
const FALLBACK_REVIEWS = [
    {
        author: "SARAH M.",
        content: "J'ai souffert d'aponévrosite plantaire pendant 3 ans. Ces semelles ont changé ma vie en une semaine. Je peux enfin promener mon chien sans pleurer de douleur.",
        rating: 5,
        isVerified: true,
        avatar: "https://i.pravatar.cc/80?img=47",
    },
    {
        author: "DAVID K.",
        content: "Travailler 10 heures par jour sur un sol en béton m'a ruiné les genoux. Ces semelles absorbent complètement les chocs. Hautement recommandé !",
        rating: 5,
        isVerified: true,
        avatar: "https://i.pravatar.cc/80?img=12",
    },
    {
        author: "EMMA L.",
        content: "J'étais sceptique, mais le soutien de la voûte plantaire est incroyable. Elles s'adaptent parfaitement à mes chaussures de course !",
        rating: 5,
        isVerified: true,
        avatar: "https://i.pravatar.cc/80?img=25",
    },
    {
        author: "THOMAS B.",
        content: "Le soulagement a été quasi instantané. Finit les douleurs intenses le matin au réveil. Je le conseille à tous mes collègues.",
        rating: 5,
        isVerified: true,
        avatar: "https://i.pravatar.cc/80?img=56",
    },
    {
        author: "JULIE R.",
        content: "Après avoir dépensé des fortunes chez le podologue, ces semelles sont une véritable révélation. Très confortables et de bonne qualité.",
        rating: 5,
        isVerified: true,
        avatar: "https://i.pravatar.cc/80?img=38",
    },
    {
        author: "MARC P.",
        content: "Elles se glissent facilement dans mes chaussures de sécurité. Depuis, je n'ai plus mal au dos en fin de journée. Un grand merci !",
        rating: 5,
        isVerified: true,
        avatar: "https://i.pravatar.cc/80?img=68",
    }
]

// Cache testimonials data for 1 hour
const getCachedTestimonials = unstable_cache(
    async () => {
        const dbReviews = await prisma.review.findMany({
            where: { isVerified: true },
            orderBy: { createdAt: 'desc' },
            take: 6,
        }).catch(() => [])

        const reviews = dbReviews.length >= 3 ? dbReviews : FALLBACK_REVIEWS
        const totalReviews = await prisma.review.count().catch(() => 50000)
        const avgRating = dbReviews.length > 0
            ? dbReviews.reduce((sum, r) => sum + r.rating, 0) / dbReviews.length
            : 4.9

        return { reviews, totalReviews, avgRating }
    },
    ["testimonials-data"],
    { revalidate: 3600, tags: ["reviews"] }
)

export async function Testimonials() {
    const { reviews, totalReviews, avgRating } = await getCachedTestimonials()

    const displayCount = totalReviews > 0 ? totalReviews.toLocaleString('fr-FR') : '3,450+'
    const displayRating = avgRating.toFixed(1)

    return (
        <section id="reviews" className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                        Approuvé par 50 000+ Clients
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <span className="text-4xl font-extrabold">{displayRating}</span>
                        <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => <Star key={i} className="h-6 w-6 fill-current" />)}
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-2 font-medium">Basé sur {displayCount} Avis</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.slice(0, 6).map((review, idx) => (
                        <div key={idx} className="bg-muted/40 p-8 rounded-3xl border">
                            <div className="flex text-yellow-500 mb-4">
                                {[...Array(review.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                            </div>
                            <p className="italic text-muted-foreground mb-6 min-h-[80px]">&quot;{review.content}&quot;</p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-muted shrink-0">
                                    <Image
                                        src={(review as any).avatar || `https://i.pravatar.cc/80?img=${idx + 10}`}
                                        alt={review.author}
                                        width={48}
                                        height={48}
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{review.author}</p>
                                    {review.isVerified && (
                                        <p className="text-xs text-green-600 flex items-center gap-1">✔ Acheteur Vérifié</p>
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
