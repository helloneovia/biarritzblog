"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/lib/store/CartContext"
import { ShoppingCart, X, ChevronDown } from "lucide-react"
import Image from "next/image"

interface Bundle {
    id: number | string
    name: string
    price: number
    original: number
    subtitle: string
    badge?: string
}

export function StickyAddToCart({ bundles, dbProduct }: { bundles: Bundle[]; dbProduct: any }) {
    const [visible, setVisible] = useState(false)
    const [dismissed, setDismissed] = useState(false)
    const [size, setSize] = useState("EU 40-41")
    const [bundle, setBundle] = useState<number | string>(bundles[1]?.id ?? bundles[0]?.id ?? 2)
    const [added, setAdded] = useState(false)
    const { addToCart, items } = useCart()

    const sizes = ["EU 35-37", "EU 38-39", "EU 40-41", "EU 42-43", "EU 44-45", "EU 46-48"]
    const activeBundle = bundles.find(b => b.id === bundle) ?? bundles[0]

    // Show sticky bar when user scrolls past 800px, hide if dismissed
    useEffect(() => {
        const handleScroll = () => {
            if (!dismissed && window.scrollY > 800) {
                setVisible(true)
            } else if (window.scrollY <= 800) {
                setVisible(false)
            }
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [dismissed])

    const handleAdd = () => {
        addToCart({
            productId: activeBundle.id,
            name: dbProduct?.name || "Semelles Magnétiques d'Acupression",
            image: dbProduct?.images?.[0] || "/temu-product.jpg",
            bundle: activeBundle.name,
            size,
            price: activeBundle.price,
            quantity: 1,
        } as any)
        setAdded(true)
        setTimeout(() => setAdded(false), 2500)
    }

    if (!visible || dismissed) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
            <div className="bg-white border-t-2 border-primary shadow-2xl">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        {/* Product mini info */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden border">
                                <Image
                                    src={dbProduct?.images?.[0] || "/temu-product.jpg"}
                                    alt="Product"
                                    width={48}
                                    height={48}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="min-w-0">
                                <p className="font-black text-sm truncate">{dbProduct?.name || "Semelles de Biarritz"}</p>
                                <p className="text-xs text-primary font-bold">€{activeBundle?.price.toFixed(2)} <span className="text-gray-400 line-through font-normal">€{activeBundle?.original.toFixed(2)}</span></p>
                            </div>
                        </div>

                        {/* Size selector */}
                        <div className="relative shrink-0">
                            <select
                                value={size}
                                onChange={e => setSize(e.target.value)}
                                className="appearance-none border border-gray-200 rounded-xl px-3 py-2 pr-8 text-sm font-semibold bg-gray-50 focus:outline-none focus:border-primary"
                            >
                                {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Pack selector */}
                        <div className="relative shrink-0">
                            <select
                                value={String(bundle)}
                                onChange={e => {
                                    const found = bundles.find(b => String(b.id) === e.target.value)
                                    if (found) setBundle(found.id)
                                }}
                                className="appearance-none border border-gray-200 rounded-xl px-3 py-2 pr-8 text-sm font-semibold bg-gray-50 focus:outline-none focus:border-primary"
                            >
                                {bundles.map(b => <option key={String(b.id)} value={String(b.id)}>{b.name} — €{b.price}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>

                        {/* CTA */}
                        <button
                            onClick={handleAdd}
                            className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm uppercase tracking-wide transition-all ${
                                added
                                    ? "bg-green-500 text-white"
                                    : "bg-primary text-white hover:bg-primary/90 shadow-[0_4px_15px_rgba(255,102,0,0.4)]"
                            }`}
                        >
                            <ShoppingCart className="h-4 w-4" />
                            {added ? "Ajouté ✓" : "Ajouter au panier"}
                        </button>

                        {/* Dismiss */}
                        <button
                            onClick={() => setDismissed(true)}
                            className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Fermer"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
