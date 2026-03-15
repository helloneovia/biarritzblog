import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star } from "lucide-react"

export function Hero({ texts = {}, dbProduct }: { texts?: any, dbProduct?: any }) {
    // Priority: 1) CMS heroImage (set by admin), 2) DB product image, 3) generic fallback
    let heroSrc: string;

    if (texts?.heroImage && texts.heroImage.trim() !== "") {
        heroSrc = texts.heroImage;
    } else if (dbProduct?.images?.[0] && dbProduct.images[0].trim() !== "") {
        heroSrc = dbProduct.images[0];
    } else {
        heroSrc = "/temu-product.jpg";
    }

    const isVideo = heroSrc.match(/\.(mp4|webm)$/i);

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background pt-24 pb-32 w-full">
            <div className="w-full max-w-7xl px-4 md:px-6 mx-auto">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
                    <div className="flex flex-col justify-center space-y-8 text-center lg:text-left w-full min-w-0">
                        <div className="space-y-4">
                            <div className="inline-flex items-center rounded-sm border px-3 py-1 text-xs font-black uppercase text-primary bg-primary/10 mb-4 transition-colors">
                                {texts?.heroBadge || "🎉 Nouvelle Technologie 2024"}
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter sm:text-5xl xl:text-7xl break-words">
                                {texts?.heroTitle || "Marchez Sans Douleur."}<br />
                                <span className="text-primary">{texts?.heroTitleHighlight || "Dès Aujourd'hui."}</span>
                            </h1>
                            <p className="w-full text-muted-foreground text-sm md:text-base xl:text-xl/relaxed mx-auto lg:mx-0">
                                {texts?.heroSubtitle || "Semelles orthopédiques premium conçues pour réaligner votre posture, absorber les chocs et éliminer instantanément les douleurs aux pieds, aux genoux et au dos."}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pb-2 justify-center lg:justify-start flex-wrap">
                            <div className="flex flex-col">
                                <span className="text-4xl sm:text-5xl font-black text-primary">24,99€</span>
                                <span className="text-base sm:text-lg font-black line-through text-muted-foreground decoration-foreground/40">49,99€</span>
                            </div>
                            <div className="bg-black text-white font-black px-3 py-2 rounded-sm text-xs sm:text-sm uppercase tracking-wider animate-pulse flex flex-col items-center shrink-0">
                                <span>-50% DE RÉDUCTION</span>
                                <span className="text-primary text-xs">OFFRE LIMITÉE</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row justify-center lg:justify-start pt-2">
                            <Button size="lg" className="rounded-xl font-black uppercase tracking-wider h-14 sm:h-16 px-6 sm:px-10 text-lg sm:text-xl shadow-[0_8px_30px_rgb(255,102,0,0.4)] hover:shadow-[0_8px_30px_rgb(255,102,0,0.6)] hover:-translate-y-1 transition-all w-full sm:w-auto" asChild>
                                <Link href="/product">
                                    Commander Maintenant <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-xl font-black uppercase h-12 sm:h-16 px-6 sm:px-8 text-base sm:text-lg w-full sm:w-auto border-2 hover:bg-muted" asChild>
                                <Link href="#faq">Questions ?</Link>
                            </Button>
                        </div>

                        <div className="flex justify-center lg:justify-start pt-2">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 bg-green-500/10 border-2 border-green-500/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-xl shadow-sm">
                                    <div className="bg-green-500 text-white rounded-full p-1.5 shrink-0 shadow-lg shadow-green-200/50">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                    </div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-sm font-black uppercase tracking-tight">{texts?.heroGuarantee || "Garantie 30 Jours"}</span>
                                        <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Satisfait ou Remboursé</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-muted-foreground opacity-60 grayscale hover:grayscale-0 transition-all cursor-default overflow-hidden px-1">
                                    <div className="flex items-center gap-1.5 border-r pr-4 border-muted-foreground/20">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                                        <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Paiement Sécurisé</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18l-3-3 3-3" /><path d="M2 15h20l-3 3 3-3" /><path d="M19 12l3 3-3 3" /></svg>
                                        <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Livraison Suivie</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start pt-6 mb-4 gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden z-20" style={{ zIndex: 10 - i }}>
                                        <Image src={`https://i.pravatar.cc/100?img=${i + 15}`} alt={`Customer ${i}`} width={48} height={48} className="object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col text-sm text-center sm:text-left">
                                <div className="flex text-primary mb-1 justify-center sm:justify-start gap-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                                </div>
                                <div className="font-black text-base">{texts?.customersCount || "800,000+ Clients Satisfaits"}</div>
                                <div className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Note de 4.9/5 sur Trustpilot</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none aspect-square lg:aspect-[4/3]">
                        <div className="absolute inset-0 bg-primary/5 rounded-[3rem] -mt-4 lg:ml-8 transform rotate-3" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[3rem] transform -rotate-2" />
                        <div className="relative h-full w-full rounded-[3rem] overflow-hidden shadow-2xl border bg-white flex items-center justify-center">
                            {isVideo ? (
                                <video src={heroSrc} className="object-cover w-full h-full" autoPlay loop muted playsInline />
                            ) : (
                                <Image
                                    src={heroSrc}
                                    alt="Premium Orthopaedic Insoles"
                                    fill
                                    sizes="(max-width: 1024px) 500px, 50vw"
                                    className="object-cover"
                                    priority
                                />
                            )}
                        </div>

                        <div className="absolute -bottom-6 -left-6 bg-background rounded-2xl shadow-xl p-4 border flex items-center gap-4 animate-bounce-slow">
                            <div className="bg-green-100 text-green-700 p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold">{texts?.topSeller || "N°1 des Ventes"}</p>
                                <p className="text-xs text-muted-foreground">{texts?.topSellerSub || "Recommandé par les experts"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
