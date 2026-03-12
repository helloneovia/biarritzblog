"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ShoppingCart, ShieldCheck, Truck, RotateCcw } from "lucide-react"
import { useCart } from "@/lib/store/CartContext"

interface Bundle {
    id: number | string
    name: string
    price: number
    original: number
    subtitle: string
    badge?: string
}

export function ProductForm({
    bundles,
    t,
    dbProduct
}: {
    bundles: Bundle[],
    t: Record<string, string>,
    dbProduct?: any
}) {
    const [size, setSize] = useState<string>("EU 40-41")
    const [bundle, setBundle] = useState<number | string>(bundles[1]?.id ?? bundles[0]?.id ?? 2) // Default to 2nd bundle (Most Popular)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [timeLeft, setTimeLeft] = useState(14 * 60 + 32); // 14 mins 32 seconds

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
        return () => clearInterval(timer);
    }, []);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const sizes = ["EU 35-37", "EU 38-39", "EU 40-41", "EU 42-43", "EU 44-45", "EU 46-48"]

    const activeBundle = bundles.find(b => b.id === bundle) ?? bundles[0]
    const { addToCart } = useCart()


    const handleCheckout = () => {
        setIsLoading(true)

        // Add to cart state
        addToCart({
            productId: activeBundle.id,
            name: dbProduct?.name || "Semelles Magnétiques d'Acupression",
            image: dbProduct?.images?.[0] || "/temu-product.jpg",
            bundle: activeBundle.name,
            size: size,
            price: activeBundle.price,
            quantity: 1
        })

        setIsLoading(false)
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tighter mb-2 text-primary leading-tight text-balance">{dbProduct?.name || t.heroTitle || "Acupression Magnétique Premium"}</h1>
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex text-primary text-base gap-0.5">★★★★★</div>
                    <span className="text-sm text-muted-foreground underline cursor-pointer font-semibold">4.9 (3 450 Avis)</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold">€{activeBundle.price}</span>
                        <span className="text-lg text-muted-foreground line-through">€{activeBundle.original}</span>
                    </div>
                    <div className="flex flex-col sm:ml-2">
                        <span className="text-sm font-semibold text-green-600">
                            🔥 En Stock - Expédition immédiate
                        </span>
                        <span className="text-sm font-bold text-red-600 mt-1">
                            ⏱️ OFFRE SPÉCIALE: Expire dans <span className="font-mono bg-red-100 px-1 rounded">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
                        </span>
                    </div>
                </div>

                {/* Additional Trust Signals */}
                <div className="flex gap-2 sm:gap-4 mt-6">
                    <div className="flex flex-row items-center justify-center bg-muted/50 p-2 sm:p-3 rounded-xl flex-1 text-center border gap-2 shrink-0">
                        <span className="text-lg">⚕️</span>
                        <span className="text-[10px] sm:text-xs font-bold leading-tight">Recommandé Kiné</span>
                    </div>
                    <div className="flex flex-row items-center justify-center bg-muted/50 p-2 sm:p-3 rounded-xl flex-1 text-center border gap-2 shrink-0">
                        <span className="text-lg">👥</span>
                        <span className="text-[10px] sm:text-xs font-bold leading-tight">+10 000 Soulagés</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{t.productSelectSize || "Sélectionnez votre taille"}</h3>
                    <span className="text-sm text-primary underline cursor-pointer">Guide des tailles</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {sizes.map((s) => (
                        <button
                            key={s}
                            onClick={() => setSize(s)}
                            className={cn(
                                "py-3 rounded-xl border text-sm font-medium transition-all",
                                size === s
                                    ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                                    : "hover:border-foreground/30 hover:bg-muted"
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="font-black text-base uppercase tracking-wide">Choisissez votre Pack</h3>
                <div className="flex flex-col gap-3">
                    {bundles.map((b, i) => {
                        const isSelected = bundle === b.id;
                        const isMostPopular = i === 1; // Default 2nd bundle = Most Popular
                        return (
                            <button
                                key={b.id}
                                onClick={() => setBundle(b.id)}
                                className={cn(
                                    "relative flex justify-between items-center p-4 rounded-xl border-2 text-left transition-all overflow-hidden",
                                    isSelected
                                        ? "border-primary bg-primary/5 shadow-md"
                                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                                )}
                            >
                                {/* Most Popular badge */}
                                {isMostPopular && (
                                    <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-black px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                                        🔥 Le Plus Populaire
                                    </div>
                                )}
                                {/* Radio indicator */}
                                <div className={cn(
                                    "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 flex items-center justify-center",
                                    isSelected ? "border-primary" : "border-muted-foreground/40"
                                )}>
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                                </div>
                                <div className="pl-8">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-black leading-tight">{b.name}</span>
                                        {b.badge && (
                                            <span className="bg-black text-white text-[10px] font-black px-2 py-0.5 rounded uppercase whitespace-nowrap">
                                                {b.badge}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-muted-foreground leading-tight mt-0.5 block">{b.subtitle}</span>
                                </div>
                                <div className="text-right pl-3 shrink-0">
                                    <div className="font-black text-xl text-primary">€{b.price}</div>
                                    <div className="text-sm text-muted-foreground line-through">€{b.original}</div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <Button
                size="lg"
                className="w-full h-14 sm:h-16 rounded-xl text-base sm:text-lg font-black uppercase tracking-widest shadow-[0_8px_30px_rgba(255,102,0,0.45)] hover:shadow-[0_12px_40px_rgba(255,102,0,0.65)] hover:-translate-y-0.5 transition-all"
                style={{ cursor: 'pointer' }}
                onClick={handleCheckout}
                disabled={isLoading}
            >
                {isLoading ? "Traitement..." : (
                    <div className="flex items-center justify-center gap-2">
                        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                        <span>🔒 Commander – €{activeBundle.price}</span>
                    </div>
                )}
            </Button>

            {/* 3-cell trust grid */}
            <div className="grid grid-cols-3 gap-2 py-4 border-y mt-2">
                <div className="flex flex-col items-center gap-2 text-center">
                    <RotateCcw className="h-7 w-7 text-primary" />
                    <span className="text-[11px] sm:text-xs font-black uppercase leading-tight">Essai<br />90 Jours</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                    <Truck className="h-7 w-7 text-primary" />
                    <span className="text-[11px] sm:text-xs font-black uppercase leading-tight">Livraison<br />Assurée</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                    <ShieldCheck className="h-7 w-7 text-primary" />
                    <span className="text-[11px] sm:text-xs font-black uppercase leading-tight">Paiement<br />Sécurisé</span>
                </div>
            </div>

            <div className="text-sm prose prose-sm text-muted-foreground overflow-hidden break-words max-w-full [&_img]:max-w-full [&_img]:h-auto">
                <div dangerouslySetInnerHTML={{ __html: dbProduct?.description || "Soulagement Immédiat pour la voûte plantaire et les douleurs au talon. L'acupression magnétique calme profondément le système nerveux tout en stimulant la circulation sanguine de vos pieds." }} />
                <ul className="mt-2 space-y-1">
                    {dbProduct?.features?.length > 0 ? (
                        dbProduct.features.map((feature: string, index: number) => (
                            <li key={index}>✔ <span dangerouslySetInnerHTML={{ __html: feature }} /></li>
                        ))
                    ) : (
                        <>
                            <li>✔ Design ergonomique en matériau EVA extra-doux et respirant</li>
                            <li>✔ Nœuds magnétiques stratégiques pour une voûte soutenue</li>
                            <li>✔ Découpe DIY universelle : s'adapte à 100% de vos chaussures</li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    )
}
