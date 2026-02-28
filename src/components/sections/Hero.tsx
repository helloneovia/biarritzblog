import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"

export function Hero({ texts = {}, dbProduct }: { texts?: any, dbProduct?: any }) {
    const defaultWhiteShoeId = "1608231387042-66d1773070a5";
    const hasCustomHeroImage = texts?.heroImage && !texts.heroImage.includes(defaultWhiteShoeId);

    // Prioritize the actual product image over the generic white shoe placeholder
    let heroSrc = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2620&auto=format&fit=crop"; // Zen generic

    if (hasCustomHeroImage) {
        heroSrc = texts.heroImage;
    } else if (dbProduct?.images?.[0] && dbProduct.images[0].trim() !== "") {
        heroSrc = dbProduct.images[0];
    }

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background pt-24 pb-32">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
                    <div className="flex flex-col justify-center space-y-8 text-center lg:text-left">
                        <div className="space-y-4">
                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-primary bg-primary/10 mb-4 transition-colors">
                                {texts?.heroBadge || "🎉 New 2024 Design Released"}
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none">
                                {texts?.heroTitle || "Walk Pain-Free."}<br />
                                <span className="text-primary">{texts?.heroTitleHighlight || "Every Single Step."}</span>
                            </h1>
                            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto lg:mx-0 whitespace-pre-wrap">
                                {texts?.heroSubtitle || "Premium orthopaedic insoles engineered to realign your posture, cushion your heels, and eliminate foot, knee, and back pain instantly."}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start pt-4">
                            <Button size="lg" className="rounded-full font-semibold h-12 px-8" asChild>
                                <Link href="/product">
                                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-full h-12 px-8" asChild>
                                <Link href="#how-it-works">Learn More</Link>
                            </Button>
                        </div>

                        <div className="flex items-center justify-center lg:justify-start pt-4">
                            <div className="flex -space-x-2 mr-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt={`Customer ${i}`} />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col text-sm text-left">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                                </div>
                                <span className="font-medium">Over 50,000+ happy feet</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none aspect-square lg:aspect-[4/3]">
                        <div className="absolute inset-0 bg-primary/5 rounded-[3rem] -mt-4 lg:ml-8 transform rotate-3" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[3rem] transform -rotate-2" />
                        <div className="relative h-full w-full rounded-[3rem] overflow-hidden shadow-2xl border bg-white flex items-center justify-center">
                            <img
                                src={heroSrc}
                                alt="Premium Orthopaedic Insoles"
                                className="object-cover w-full h-full"
                            />
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -left-6 bg-background rounded-2xl shadow-xl p-4 border flex items-center gap-4 animate-bounce-slow">
                            <div className="bg-green-100 text-green-700 p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold">Recommended</p>
                                <p className="text-xs text-muted-foreground">by Podiatrists</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
