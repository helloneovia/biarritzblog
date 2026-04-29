"use client"
import { useEffect, useState, useMemo } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, ExpressCheckoutElement } from "@stripe/react-stripe-js"
import { useCart } from "@/lib/store/CartContext"
import { CheckoutForm } from "./CheckoutForm"
import { ShieldCheck, Truck, RotateCcw, Lock, Plus, Minus, Tag } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Don't load Stripe at module level — it throws if key is missing/invalid

export default function CheckoutPage() {
    const { items, totalAmount, addToCart } = useCart()
    const [clientSecret, setClientSecret] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [upsells, setUpsells] = useState<any[]>([])
    const [upsellQtys, setUpsellQtys] = useState<Record<string, number>>({})

    // Guard: only load Stripe if we have a real key (pk_test_ or pk_live_)
    const stripePromise = useMemo(() => {
        let key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
        key = key.replace(/^=+/, "").trim() // Automatically strip accidental equals signs (e.g. KEY==pk_...)
        if (key.startsWith("pk_test_") || key.startsWith("pk_live_")) {
            return loadStripe(key)
        }
        return null
    }, [])

    const totalOriginal = items.reduce((acc, item) => acc + item.price * item.quantity * 2, 0)
    const savings = totalOriginal - totalAmount

    useEffect(() => {
        if (items.length === 0) return
        setLoading(true)
        fetch("/api/payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }),
        })
            .then(r => r.json())
            .then(data => {
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret)
                } else {
                    setError(data.error || "Erreur de configuration du paiement.")
                }
            })
            .catch(() => setError("Impossible de contacter le serveur de paiement."))
            .finally(() => setLoading(false))
    }, [items])

    useEffect(() => {
        fetch("/api/config/upsell").then(r => r.json()).then(data => {
            if (Array.isArray(data)) {
                setUpsells(data);
                const initQtys: Record<string, number> = {};
                data.forEach(u => initQtys[u.id] = 1);
                setUpsellQtys(initQtys);
            }
        }).catch(() => {});
    }, []);

    const remainingUpsells = upsells.filter(u => !items.find(i => i.id === `upsell-${u.id}`))

    const handleAddUpsell = (u: any) => {
        addToCart({
            id: `upsell-${u.id}`,
            name: u.name,
            price: u.price,
            quantity: upsellQtys[u.id] || 1,
            image: u.image || "https://images.unsplash.com/photo-1580828369019-2228f4fff605?w=500&q=80",
            bundle: "Vente Additionnelle",
            size: "Unique"
        } as any);
    };

    const appearance = {
        theme: "stripe" as const,
        variables: {
            colorPrimary: "#FF6600",
            colorBackground: "#ffffff",
            colorText: "#1a1a1a",
            colorDanger: "#df1b41",
            fontFamily: "Inter, system-ui, sans-serif",
            borderRadius: "8px",
            fontSizeBase: "15px",
        },
        rules: {
            ".Input": { border: "1.5px solid #e2e8f0", boxShadow: "none", padding: "12px" },
            ".Input:focus": { border: "1.5px solid #FF6600", boxShadow: "0 0 0 3px rgba(255,102,0,0.15)" },
            ".Label": { fontWeight: "600", fontSize: "13px", color: "#374151" },
            ".Tab": { border: "1.5px solid #e2e8f0" },
            ".Tab--selected": { border: "1.5px solid #FF6600", boxShadow: "0 0 0 2px rgba(255,102,0,0.15)" },
        }
    }



    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
            {/* Hide chat widget on checkout page */}
            <style>{`
                .support-widget, #crisp-chatbox, .crisp-client, [data-support-widget], .chat-widget-container {
                    display: none !important;
                }
            `}</style>

            <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
                {items.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-xl font-bold mb-4">Votre panier est vide.</p>
                        <Link href="/product" className="text-primary underline font-semibold">Voir les produits →</Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-[1fr_420px] gap-4 sm:gap-6 lg:gap-10 items-start">

                        {/* LEFT: Payment form */}
                        <div className="space-y-4 lg:space-y-6 min-w-0">
                            {loading ? (
                                <div className="bg-white text-slate-900 rounded-2xl border p-4 sm:p-6 shadow-sm">
                                    <h2 className="font-black text-lg mb-5 flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-primary shrink-0" /> Informations de livraison & Paiement
                                    </h2>
                                    <div className="space-y-4 animate-pulse">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="h-12 bg-gray-100 rounded-lg w-full" />
                                        ))}
                                    </div>
                                </div>
                            ) : !stripePromise ? (
                                <div className="bg-white text-slate-900 rounded-2xl border p-4 sm:p-6 shadow-sm">
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm font-semibold">
                                        ⚙️ Paiement non configuré — Ajoutez votre clé Stripe dans <code>.env</code>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="bg-white text-slate-900 rounded-2xl border p-4 sm:p-6 shadow-sm">
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-semibold">
                                        ⚠️ {error}
                                    </div>
                                </div>
                            ) : clientSecret ? (
                                /* SINGLE Elements provider for both Express + Form — fixes duplicate ID errors */
                                <Elements stripe={stripePromise} options={{ clientSecret, appearance, locale: "fr" }}>
                                    <div className="space-y-4 lg:space-y-6">
                                        {/* Express checkout */}
                                        <div className="bg-white text-slate-900 rounded-2xl border p-4 sm:p-6 shadow-sm overflow-hidden w-full">
                                            <p className="text-sm font-bold text-center text-slate-500 mb-4 uppercase tracking-wider">Paiement Express</p>
                                            <ExpressCheckoutElement onReady={() => setLoading(false)} onConfirm={async () => {}} />
                                            <div className="flex items-center gap-3 mt-5">
                                                <div className="flex-1 h-px bg-border" />
                                                <span className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase whitespace-nowrap overflow-hidden text-ellipsis">ou continuer ci-dessous</span>
                                                <div className="flex-1 h-px bg-border" />
                                            </div>
                                        </div>

                                        {/* Main form */}
                                        <div className="bg-white text-slate-900 rounded-2xl border p-4 sm:p-6 shadow-sm overflow-hidden w-full text-left">
                                            <h2 className="font-black text-lg mb-5 flex flex-wrap items-center gap-2">
                                                <Lock className="h-4 w-4 text-primary shrink-0" /> Informations de livraison & Paiement
                                            </h2>
                                            <CheckoutForm items={items} totalAmount={totalAmount} />
                                        </div>
                                    </div>
                                </Elements>
                            ) : null}
                        </div>

                        {/* RIGHT: Order summary */}
                        <div className="space-y-4 min-w-0">
                            <div className="bg-white text-slate-900 rounded-2xl border p-4 sm:p-6 shadow-sm space-y-4">
                                <h2 className="font-black text-base uppercase tracking-wide">Résumé de la commande</h2>

                                {/* Items */}
                                <div className="space-y-3">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-3 items-center">
                                            <div className="relative shrink-0">
                                                <img src={item.image} alt={item.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border" />
                                                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm line-clamp-1">{item.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{item.bundle} · {item.size}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-black text-primary text-sm sm:text-base">€{(item.price * item.quantity).toFixed(2)}</p>
                                                <p className="text-xs text-slate-500 line-through">€{(item.price * item.quantity * 2).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Discount code */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Code promo ou cadeau"
                                        className="flex-1 min-w-0 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                                    />
                                    <button className="px-3 sm:px-4 py-2 border rounded-lg text-sm font-bold hover:bg-muted transition-colors shrink-0">
                                        Appliquer
                                    </button>
                                </div>

                                {/* Totals */}
                                <div className="space-y-2 border-t pt-4">
                                    <div className="flex justify-between text-sm gap-2">
                                        <span className="text-slate-500 shrink-0">Sous-total · {items.length} article{items.length > 1 ? 's' : ''}</span>
                                        <span className="font-semibold">€{totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-green-600 font-semibold gap-2">
                                        <span className="shrink-0">Livraison</span>
                                        <span className="text-right text-xs sm:text-sm">Suivie (10 jours)</span>
                                    </div>
                                    <div className="flex justify-between font-black text-lg sm:text-xl border-t pt-3 mt-2 gap-2">
                                        <span>Total</span>
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <span className="text-xs text-slate-500 font-medium uppercase">EUR</span>
                                            <span>€{totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    {savings > 0 && (
                                        <div className="flex items-center gap-1 text-primary font-black text-sm mt-1">
                                            <Tag className="h-4 w-4 shrink-0" />
                                            <span>ÉCONOMIES TOTALES €{savings.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recommended For You / Order Bump */}
                            {remainingUpsells.length > 0 && (
                                <div className="space-y-3">
                                    <div className="text-center space-y-1">
                                        <h3 className="font-black text-[15px] uppercase">Recommandé pour vous</h3>
                                        <p className="text-xs text-slate-500">Voici quelques extras pour compléter votre commande</p>
                                    </div>
                                    {remainingUpsells.map(u => (
                                        <div key={u.id} className="bg-white text-slate-900 rounded-xl border p-3 sm:p-4 shadow-sm">
                                            <div className="flex gap-3 sm:gap-4 items-center">
                                                <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-muted rounded-lg border overflow-hidden">
                                                    <img src={u.image} alt={u.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-sm leading-tight line-clamp-2">{u.name}</h4>
                                                    <div className="flex gap-2 items-center text-xs mt-1">
                                                        <span className="font-black">€{u.price.toFixed(2)}</span>
                                                        {u.compareAt && <span className="text-gray-400 line-through">€{u.compareAt.toFixed(2)}</span>}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2 shrink-0 items-end">
                                                    <Button size="sm" onClick={() => handleAddUpsell(u)} className="h-8 px-4 sm:px-6 bg-[#FF6600] hover:bg-[#e65c00] text-white font-black text-xs uppercase tracking-wider">
                                                        Add
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="mt-3 sm:mt-4 flex gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">Variant</label>
                                                    <div className="h-9 border rounded-md px-3 flex items-center text-sm bg-gray-50 text-gray-900 font-semibold">Express 48h</div>
                                                </div>
                                                <div className="w-[100px] shrink-0">
                                                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">Quantity</label>
                                                    <div className="h-9 border rounded-md flex items-center justify-between px-2 bg-gray-50">
                                                        {u.name.toLowerCase().includes("livraison") ? (
                                                            <span className="text-xs font-bold w-full text-center">1</span>
                                                        ) : (
                                                            <>
                                                                <button onClick={() => setUpsellQtys(p => ({...p, [u.id]: Math.max(1, p[u.id] - 1)}))} className="p-1 hover:bg-gray-200 rounded"><Minus className="h-3 w-3" /></button>
                                                                <span className="text-xs font-bold">{upsellQtys[u.id] || 1}</span>
                                                                <button onClick={() => setUpsellQtys(p => ({...p, [u.id]: (p[u.id] || 1) + 1}))} className="p-1 hover:bg-gray-200 rounded"><Plus className="h-3 w-3" /></button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Trust badges */}
                            <div className="bg-white text-slate-900 rounded-2xl border p-4 sm:p-5 shadow-sm">
                                <div className="space-y-3">
                                    {[
                                        { icon: <RotateCcw className="h-5 w-5 text-primary shrink-0" />, title: "Essai 90 Jours", desc: "Remboursement complet si insatisfait" },
                                        { icon: <Truck className="h-5 w-5 text-primary shrink-0" />, title: "Livraison Suivie & Assurée", desc: "Suivi en temps réel inclus" },
                                        { icon: <ShieldCheck className="h-5 w-5 text-primary shrink-0" />, title: "Paiement 100% Sécurisé", desc: "Cryptage SSL & Stripe certifié PCI" },
                                    ].map((badge, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            {badge.icon}
                                            <div className="min-w-0">
                                                <p className="text-sm font-black">{badge.title}</p>
                                                <p className="text-xs text-slate-500">{badge.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
