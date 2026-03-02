"use client"
import { useEffect, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { useCart } from "@/lib/store/CartContext"
import { CheckoutForm } from "./CheckoutForm"
import { ShieldCheck, Truck, RotateCcw, Lock } from "lucide-react"
import Link from "next/link"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
    const { items, totalAmount } = useCart()
    const [clientSecret, setClientSecret] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

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
        <div className="min-h-screen bg-gray-50">
            {/* Branded Header */}
            <header className="bg-white border-b">
                <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col items-center gap-2">
                    <Link href="/">
                        <div className="bg-primary text-white font-black text-2xl tracking-tighter px-4 py-1.5 rounded-sm cursor-pointer hover:opacity-90 transition-opacity">
                            biarritz.
                        </div>
                    </Link>
                    {/* Trust strip */}
                    <div className="flex items-center gap-6 text-xs text-muted-foreground font-semibold flex-wrap justify-center">
                        <span className="flex items-center gap-1"><RotateCcw className="h-3.5 w-3.5 text-primary" /> Garantie 90 Jours</span>
                        <span className="flex items-center gap-1"><Truck className="h-3.5 w-3.5 text-primary" /> Livraison Assurée</span>
                        <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Paiement Sécurisé</span>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 py-10">
                {items.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-xl font-bold mb-4">Votre panier est vide.</p>
                        <Link href="/product" className="text-primary underline font-semibold">Voir les produits →</Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">

                        {/* LEFT: Payment form */}
                        <div className="space-y-6">
                            {/* Express checkout */}
                            <div className="bg-white rounded-2xl border p-6 shadow-sm">
                                <p className="text-sm font-bold text-center text-muted-foreground mb-4 uppercase tracking-wider">Paiement Express</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: "shop", color: "#5D36CB", textColor: "white" },
                                        { label: "PayPal", color: "#FFC439", textColor: "#003087" },
                                        { label: "G Pay", color: "#000", textColor: "white" },
                                    ].map(({ label, color, textColor }) => (
                                        <button
                                            key={label}
                                            className="h-12 rounded-lg font-black text-sm flex items-center justify-center transition-opacity hover:opacity-80"
                                            style={{ background: color, color: textColor }}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-3 mt-5">
                                    <div className="flex-1 h-px bg-border" />
                                    <span className="text-xs text-muted-foreground font-semibold uppercase">ou</span>
                                    <div className="flex-1 h-px bg-border" />
                                </div>
                            </div>

                            {/* Stripe Elements */}
                            <div className="bg-white rounded-2xl border p-6 shadow-sm">
                                <h2 className="font-black text-lg mb-5 flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-primary" /> Informations de livraison & Paiement
                                </h2>

                                {loading ? (
                                    <div className="space-y-4 animate-pulse">
                                        {[120, 200, 160, 200].map((w, i) => (
                                            <div key={i} className="h-12 bg-gray-100 rounded-lg" style={{ width: w + "px" >= "100%" ? "100%" : "100%" }} />
                                        ))}
                                    </div>
                                ) : error ? (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-semibold">
                                        ⚠️ {error}
                                    </div>
                                ) : clientSecret ? (
                                    <Elements stripe={stripePromise} options={{ clientSecret, appearance, locale: "fr" }}>
                                        <CheckoutForm items={items} totalAmount={totalAmount} />
                                    </Elements>
                                ) : null}
                            </div>
                        </div>

                        {/* RIGHT: Order summary */}
                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl border p-6 shadow-sm space-y-4">
                                <h2 className="font-black text-base uppercase tracking-wide">Résumé de la commande</h2>

                                {/* Items */}
                                <div className="space-y-3">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-3 items-center">
                                            <div className="relative shrink-0">
                                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover border" />
                                                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm line-clamp-1">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">{item.bundle} · {item.size}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-black text-primary">€{(item.price * item.quantity).toFixed(2)}</p>
                                                <p className="text-xs text-muted-foreground line-through">€{(item.price * item.quantity * 2).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Discount code */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Code promo ou cadeau"
                                        className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                                    />
                                    <button className="px-4 py-2 border rounded-lg text-sm font-bold hover:bg-muted transition-colors">
                                        Appliquer
                                    </button>
                                </div>

                                {/* Totals */}
                                <div className="space-y-2 border-t pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Sous-total</span>
                                        <span className="font-semibold">€{totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-green-600 font-semibold">
                                        <span>Livraison</span>
                                        <span>✓ Gratuite</span>
                                    </div>
                                    {savings > 0 && (
                                        <div className="flex justify-between text-primary font-black text-sm">
                                            <span>🎉 Économies totales</span>
                                            <span>€{savings.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-black text-xl border-t pt-3 mt-2">
                                        <span>Total</span>
                                        <span>€{totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Trust badges */}
                            <div className="bg-white rounded-2xl border p-5 shadow-sm">
                                <div className="space-y-3">
                                    {[
                                        { icon: <RotateCcw className="h-5 w-5 text-primary" />, title: "Essai 90 Jours", desc: "Remboursement complet si insatisfait" },
                                        { icon: <Truck className="h-5 w-5 text-primary" />, title: "Livraison Suivie & Assurée", desc: "Suivi en temps réel inclus" },
                                        { icon: <ShieldCheck className="h-5 w-5 text-primary" />, title: "Paiement 100% Sécurisé", desc: "Cryptage SSL & Stripe certifié PCI" },
                                    ].map((badge, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            {badge.icon}
                                            <div>
                                                <p className="text-sm font-black">{badge.title}</p>
                                                <p className="text-xs text-muted-foreground">{badge.desc}</p>
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
