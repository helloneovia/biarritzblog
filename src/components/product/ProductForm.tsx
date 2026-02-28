"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ShoppingCart, ShieldCheck } from "lucide-react"
import { useCart } from "@/lib/store/CartContext"

interface Bundle {
    id: number
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
    const [bundle, setBundle] = useState<number>(bundles[1]?.id ?? bundles[0]?.id ?? 2) // Default to 2nd bundle (Most Popular)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const sizes = ["EU 35-37", "EU 38-39", "EU 40-41", "EU 42-43", "EU 44-45", "EU 46-48"]

    const activeBundle = bundles.find(b => b.id === bundle) ?? bundles[0]
    const { addToCart } = useCart()


    const handleCheckout = () => {
        setIsLoading(true)

        // Add to cart state
        addToCart({
            productId: activeBundle.id,
            name: dbProduct?.name || "Premium Acupressure Zen Insoles",
            image: dbProduct?.images?.[0] || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2620&auto=format&fit=crop",
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
                <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-primary">{dbProduct?.name || t.heroTitle || "Step Into Serenity."}</h1>
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex text-yellow-500 text-sm">★★★★★</div>
                    <span className="text-sm text-muted-foreground underline cursor-pointer">4.9 (3,450 Reviews)</span>
                </div>
                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold">€{activeBundle.price}</span>
                    <span className="text-lg text-muted-foreground line-through">€{activeBundle.original}</span>
                    <span className="text-sm font-semibold text-green-600 ml-2">
                        In Stock - Ready to Ship
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{t.productSelectSize || "Select Size"}</h3>
                    <span className="text-sm text-primary underline cursor-pointer">Size Guide</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
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

            <div className="space-y-4">
                <h3 className="font-semibold">Choose Your Bundle</h3>
                <div className="flex flex-col gap-3">
                    {bundles.map((b) => (
                        <button
                            key={b.id}
                            onClick={() => setBundle(b.id)}
                            className={cn(
                                "relative flex justify-between items-center p-4 rounded-2xl border-2 text-left transition-all overflow-hidden",
                                bundle === b.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-foreground/30"
                            )}
                        >
                            {bundle === b.id && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />}
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">{b.name}</span>
                                    {b.badge && (
                                        <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                            {b.badge}
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm text-muted-foreground">{b.subtitle}</span>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-lg">€{b.price}</div>
                                <div className="text-sm text-muted-foreground line-through">€{b.original}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <Button size="lg" className="w-full h-14 rounded-full text-lg font-bold shadow-xl" onClick={handleCheckout} disabled={isLoading}>
                {isLoading ? "Processing..." : (
                    <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {t.productAddToCart || "Add to Cart"} - €{activeBundle.price}
                    </>
                )}
            </Button>

            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground py-4 border-y">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" />
                    {t.productGuarantee || "30-Day Guarantee"}
                </div>
                <div className="flex items-center gap-2">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l5 5l10 -10" /></svg>
                    Secure Checkout
                </div>
            </div>

            <div className="text-sm prose prose-sm text-muted-foreground">
                <p><strong>Instant Zen & Pain Relief</strong> for planar fasciitis, flat feet, and heel pain. The magnetic acupressure deeply calms the nervous system while providing targeted support.</p>
                <ul className="mt-2 space-y-1">
                    <li>✔ Fits any shoe (sneakers, boots, dress)</li>
                    <li>✔ Magnetic nodes for enhanced blood flow</li>
                    <li>✔ Designed by Zen masters and podiatrists</li>
                </ul>
            </div>
        </div>
    )
}
