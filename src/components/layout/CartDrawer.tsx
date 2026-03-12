"use client"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ShoppingBag, X, Plus, Minus, Truck, ShieldCheck, Users, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/store/CartContext";
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function CartDrawer({ t }: { t: Record<string, string> }) {
    const { items, removeFromCart, updateQuantity, isCartOpen, setCartOpen, totalAmount } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [countdown, setCountdown] = useState(4 * 60 + 48); // 4 min 48 sec
    const [step, setStep] = useState<"cart" | "upsell">("cart");
    const [upsell, setUpsell] = useState<{ active: boolean, title: string, price: number } | null>(null);

    useEffect(() => {
        const timer = setInterval(() => setCountdown(prev => prev > 0 ? prev - 1 : 0), 1000);
        fetch("/api/config/upsell").then(r => r.json()).then(data => setUpsell(data)).catch(() => {});
        return () => clearInterval(timer);
    }, []);

    const mins = Math.floor(countdown / 60);
    const secs = countdown % 60;

    const totalOriginal = items.reduce((acc, item) => {
        // Estimate original as 2x price if no original price stored
        return acc + (item.price * item.quantity * 2);
    }, 0);
    const savings = totalOriginal - totalAmount;

    const proceedToStripe = async (withUpsell: boolean) => {
        setIsLoading(true);
        try {
            const finalItems = [...items]
            if (withUpsell && upsell) {
                finalItems.push({
                    id: "upsell-bump",
                    name: upsell.title,
                    price: upsell.price,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1580828369019-2228f4fff605?w=500&q=80",
                    bundle: "Vente Additionnelle",
                    size: "Unique"
                } as any)
            }
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: finalItems, email: "guest@example.com" })
            });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
            else { toast.error(data.error || "Erreur de paiement checkout"); setIsLoading(false); }
        } catch { toast.error("Erreur de connexion"); setIsLoading(false); }
    };

    const handleCheckoutClick = () => {
        if (upsell?.active && !items.find(i => i.id === "upsell-bump")) setStep("upsell");
        else proceedToStripe(false);
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={(open) => {
            if (!open) setTimeout(() => setStep("cart"), 300);
            setCartOpen(open);
        }}>
            <SheetTrigger asChild>
                <button
                    className="relative p-2 text-foreground/80 hover:text-foreground transition-colors"
                    aria-label={t.navCart || "Cart"}
                >
                    <ShoppingBag className="h-6 w-6" />
                    {items.length > 0 && (
                        <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center translate-x-1 -translate-y-1">
                            {items.reduce((acc, item) => acc + item.quantity, 0)}
                        </span>
                    )}
                </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-md flex flex-col p-0 gap-0">
                {step === "upsell" ? (
                    <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-center bg-gray-50 relative h-full">
                        <button onClick={() => setStep("cart")} className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-800">
                            <span className="text-xs font-bold font-mono">← RETOUR</span>
                        </button>
                        <div className="text-center space-y-3 mt-4">
                            <h2 className="text-2xl font-black text-orange-600 uppercase tracking-tight">ATTENDEZ ! OFFRE EXCLUSIVE 🎁</h2>
                            <p className="font-medium text-gray-700 leading-snug">Ajoutez <span className="font-black">"{upsell?.title}"</span> à votre commande avant de valider.</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border-2 border-orange-500 shadow-[0_0_20px_rgba(255,102,0,0.1)] relative mt-8">
                             <div className="absolute -top-3 right-4 bg-orange-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">+ {upsell?.price}€ seulement</div>
                             <div className="flex gap-4 items-center">
                                 <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center border border-orange-200 shrink-0">
                                     <Truck className="h-8 w-8 text-orange-500" />
                                 </div>
                                 <p className="text-xs text-gray-600 font-medium leading-relaxed">Bénéficiez d'une livraison prioritaire et assurée pour recevoir votre commande plus rapidement et en toute sécurité.</p>
                             </div>
                        </div>
                        <div className="space-y-4 pt-10 mt-auto mb-8">
                            <Button 
                                className="w-full h-16 rounded-xl text-lg font-black uppercase tracking-widest shadow-[0_8px_30px_rgba(255,102,0,0.4)] hover:shadow-[0_12px_40px_rgba(255,102,0,0.6)]" 
                                onClick={() => proceedToStripe(true)} disabled={isLoading} style={{ cursor: 'pointer' }}>
                                {isLoading ? "Redirection..." : `OUI, J'AJOUTE POUR ${upsell?.price}€`}
                            </Button>
                            <button
                                className="w-full py-2 text-xs font-bold text-gray-400 underline hover:text-gray-700 text-center"
                                onClick={() => proceedToStripe(false)} disabled={isLoading} style={{ cursor: 'pointer' }}
                            >
                                Non merci, je finalise ma commande sans cette offre
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Countdown Reservation Banner */}
                        {items.length > 0 && (
                    <div className="bg-black text-white text-sm font-black text-center py-2.5 px-4 flex items-center justify-center gap-2 shrink-0">
                        🔒 Panier réservé pour{" "}
                        <span className="font-mono bg-primary text-white px-2 py-0.5 rounded">
                            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                        </span>
                    </div>
                )}

                <SheetHeader className="px-6 pt-5 pb-4 border-b shrink-0">
                    <SheetTitle className="text-xl font-black">
                        {t.cartTitle || "Votre Panier"}{" "}
                        <span className="text-muted-foreground font-medium text-base">
                            ({items.reduce((acc, item) => acc + item.quantity, 0)} article{items.reduce((acc, item) => acc + item.quantity, 0) > 1 ? 's' : ''})
                        </span>
                    </SheetTitle>
                </SheetHeader>

                {/* Trust Badge Trio */}
                <div className="grid grid-cols-3 gap-1 px-4 py-3 bg-muted/30 border-b shrink-0 text-center">
                    <div className="flex flex-col items-center gap-1 text-[10px] font-bold text-foreground/70">
                        <Truck className="h-4 w-4 text-primary" />
                        <span>Livraison<br />Suivie</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-[10px] font-bold text-foreground/70">
                        <Users className="h-4 w-4 text-primary" />
                        <span>800 000+<br />Clients</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-[10px] font-bold text-foreground/70">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span>Remboursement<br />100%</span>
                    </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4 py-16">
                            <ShoppingBag className="h-16 w-16 opacity-15" />
                            <p className="font-bold text-lg">{t.cartEmpty || "Votre panier est vide"}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 border rounded-xl p-3">
                                    <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted border shrink-0">
                                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between font-bold">
                                                <h3 className="line-clamp-1 text-sm">{item.name}</h3>
                                                <span className="text-primary shrink-0 ml-2">€{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5">{item.bundle?.replace("Pairs", "Paires").replace("1 Pair", "1 Paire")}</p>
                                            <p className="text-xs text-muted-foreground">{item.size}</p>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="flex items-center border rounded-lg overflow-hidden">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2.5 py-1.5 hover:bg-muted text-sm font-bold"><Minus className="h-3 w-3" /></button>
                                                <span className="text-sm font-bold px-3 border-x">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1.5 hover:bg-muted text-sm font-bold"><Plus className="h-3 w-3" /></button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer: Summary + Checkout */}
                {items.length > 0 && (
                    <div className="border-t px-6 pb-6 pt-4 space-y-3 shrink-0 bg-background">
                        {/* Savings highlight */}
                        {savings > 0 && (
                            <div className="flex justify-between font-black text-base">
                                <span className="text-primary">Vous économisez</span>
                                <span className="text-primary">€{savings.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm text-green-600 font-semibold">
                            <span>{t.productShipping || "Livraison"}</span>
                            <span>{t.productShippingFree || "✓ Gratuite"}</span>
                        </div>
                        <div className="flex justify-between font-black text-2xl border-t pt-3">
                            <span>Total</span>
                            <span>€{totalAmount.toFixed(2)}</span>
                        </div>

                        {/* Checkout Button */}
                        <Button
                            className="w-full h-14 rounded-xl text-lg font-black uppercase tracking-widest shadow-[0_8px_30px_rgba(255,102,0,0.5)] hover:shadow-[0_12px_40px_rgba(255,102,0,0.65)] hover:-translate-y-0.5 transition-all"
                            style={{ cursor: 'pointer' }}
                            onClick={handleCheckoutClick}
                            disabled={isLoading}
                        >
                            {isLoading ? "Traitement..." : (
                                <span className="flex items-center gap-3">
                                    🔒 {t.cartCheckout || "Passer la Commande"}
                                </span>
                            )}
                        </Button>

                        {/* Payment icons */}
                        <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                            {["Visa", "MC", "Amex", "Apple Pay", "Google Pay", "PayPal"].map((pm) => (
                                <span key={pm} className="text-[10px] font-bold px-2 py-0.5 border rounded bg-muted text-muted-foreground">{pm}</span>
                            ))}
                        </div>
                    </div>
                )}
                </>
                )}
            </SheetContent>
        </Sheet>
    )
}
