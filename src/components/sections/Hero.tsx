import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star } from "lucide-react"
import { OpenCartButton } from "@/components/ui/OpenCartButton"

export function Hero({ texts = {}, dbProduct }: { texts?: any, dbProduct?: any }) {
    // Priority: 1) CMS heroImage (set by admin), 2) DB product image, 3) generic fallback
    let heroSrc: string;

    if (texts?.heroImage && texts.heroImage.trim() !== "") {
        heroSrc = texts.heroImage;
    } else if (dbProduct?.images?.[0] && dbProduct.images[0].trim() !== "") {
        heroSrc = dbProduct.images[0];
    } else {
        heroSrc = "/hero_premium_insole.png";
    }

    const isVideo = heroSrc.match(/\.(mp4|webm)$/i);
    const ytMatch = heroSrc.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
    const ytId = ytMatch ? ytMatch[1] : null;

    return (
        <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pt-24 pb-32 w-full">
            {/* Background ambient light */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
            <div className="absolute top-1/2 left-0 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] opacity-40 pointer-events-none" />
            
            <div className="w-full max-w-7xl px-4 md:px-6 mx-auto relative z-10">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
                    <div className="flex flex-col justify-center space-y-8 text-center lg:text-left w-full min-w-0">
                        <div className="space-y-4">
                            <div className="inline-flex items-center rounded-full border border-primary/20 px-4 py-1.5 text-xs font-black uppercase text-primary bg-primary/5 mb-4 shadow-sm backdrop-blur-md">
                                {texts?.heroBadge || "🎉 Nouvelle Technologie 2024"}
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter sm:text-5xl xl:text-7xl break-words drop-shadow-sm">
                                {texts?.heroTitle || "Marchez Sans Douleur."}<br />
                                <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent drop-shadow-md">{texts?.heroTitleHighlight || "Dès Aujourd'hui."}</span>
                            </h1>
                            <p className="w-full text-muted-foreground text-sm md:text-base xl:text-xl/relaxed mx-auto lg:mx-0 font-medium">
                                {texts?.heroSubtitle || "Semelles orthopédiques premium conçues pour réaligner votre posture, absorber les chocs et éliminer instantanément les douleurs aux pieds, aux genoux et au dos."}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pb-2 justify-center lg:justify-start flex-wrap">
                            <div className="flex flex-col">
                                <span className="text-4xl sm:text-5xl font-black text-primary drop-shadow-sm">24,99€</span>
                                <span className="text-base sm:text-lg font-black line-through text-muted-foreground decoration-foreground/40 hidden sm:block">49,99€</span>
                            </div>
                            <div className="bg-gradient-to-br from-black to-zinc-800 text-white font-black px-4 py-2 rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-lg flex flex-col items-center shrink-0 border border-white/10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-150%] animate-[shimmer_2s_infinite]" />
                                <span>-50% DE RÉDUCTION</span>
                                <span className="text-primary text-xs font-bold">OFFRE LIMITÉE</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row justify-center lg:justify-start pt-2">
                            <Button size="lg" className="rounded-2xl font-black uppercase tracking-wider h-14 sm:h-16 px-6 sm:px-10 text-lg sm:text-xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-600 border-none shadow-[0_8px_30px_rgb(255,102,0,0.4)] hover:shadow-[0_12px_40px_rgb(255,102,0,0.6)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto" asChild>
                                <OpenCartButton>
                                    Commander Maintenant <ArrowRight className="ml-2 h-5 w-5" />
                                </OpenCartButton>
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-2xl font-black uppercase h-12 sm:h-16 px-6 sm:px-8 text-base sm:text-lg w-full sm:w-auto border-2 hover:bg-muted/50 backdrop-blur-sm transition-colors duration-300" asChild>
                                <Link href="#faq">Questions ?</Link>
                            </Button>
                        </div>

                        <div className="flex justify-center lg:justify-start pt-2">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 px-5 py-2.5 rounded-2xl shadow-sm backdrop-blur-md">
                                    <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full p-1.5 shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                    </div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-sm font-black uppercase tracking-tight">{texts?.heroGuarantee || "Garantie 30 Jours"}</span>
                                        <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Satisfait ou Remboursé</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center lg:justify-start gap-4 text-muted-foreground opacity-70 grayscale hover:grayscale-0 transition-all duration-300 cursor-default overflow-hidden px-2">
                                    <div className="flex items-center gap-2 border-r pr-4 border-muted-foreground/20">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                                        <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Paiement Sécurisé</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18l-3-3 3-3" /><path d="M2 15h20l-3 3 3-3" /><path d="M19 12l3 3-3 3" /></svg>
                                        <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Livraison Suivie</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start pt-6 mb-4 gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="w-12 h-12 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden z-20 shadow-md transform hover:scale-110 transition-transform duration-300" style={{ zIndex: 10 - i }}>
                                        <Image src={`https://i.pravatar.cc/100?img=${i + 15}`} alt={`Customer ${i}`} width={48} height={48} className="object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col text-sm text-center sm:text-left">
                                <div className="flex text-yellow-400 mb-1 justify-center sm:justify-start gap-1 drop-shadow-sm">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                                </div>
                                <div className="font-black text-base">{texts?.customersCount || "800,000+ Clients Satisfaits"}</div>
                                <div className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Note de 4.9/5 sur Trustpilot</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none aspect-square lg:aspect-[4/3] overflow-hidden lg:overflow-visible pb-6 lg:pb-0 perspective-[1000px]">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-purple-500/20 rounded-[3rem] -mt-6 lg:ml-10 transform rotate-6 blur-md opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-transparent rounded-[3rem] transform -rotate-3 blur-sm" />
                        
                        <div className="relative h-full w-full rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-4 border-white/50 bg-white/10 backdrop-blur-sm flex items-center justify-center transition-transform duration-700 hover:rotate-0 hover:scale-[1.02]">
                            {ytId ? (
                                <iframe 
                                    className="w-full h-full object-cover scale-[1.35] pointer-events-none" 
                                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1`}
                                    allow="autoplay; encrypted-media; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : isVideo ? (
                                <video src={heroSrc} className="object-cover w-full h-full" autoPlay loop muted playsInline />
                            ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={heroSrc}
                                    alt="Premium Orthopaedic Insoles"
                                    className="object-cover w-full h-full"
                                />
                            )}
                            
                            {/* Glass overlay reflection */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 pointer-events-none" />
                        </div>

                        <div className="absolute bottom-6 left-2 lg:-bottom-6 lg:-left-6 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-2xl shadow-2xl p-4 border border-white/20 flex items-center gap-4 hover:-translate-y-2 transition-transform duration-300">
                            <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-2.5 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </div>
                            <div>
                                <p className="text-sm font-black text-foreground">{texts?.topSeller || "N°1 des Ventes"}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{texts?.topSellerSub || "Recommandé par les experts"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
