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
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

export function CartDrawer({ t }: { t: Record<string, string> }) {
    const { items, removeFromCart, updateQuantity, isCartOpen, setCartOpen, totalAmount } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [countdown, setCountdown] = useState(4 * 60 + 48); // 4 min 48 sec
    const [upsells, setUpsells] = useState<any[]>([]);
    const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);
    const [upsellQtys, setUpsellQtys] = useState<Record<string, number>>({});
    const [upsellsAdded, setUpsellsAdded] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const timer = setInterval(() => setCountdown(prev => prev > 0 ? prev - 1 : 0), 1000);
        fetch("/api/config/upsell").then(r => r.json()).then(data => {
            if (Array.isArray(data)) {
                setUpsells(data);
                const initQtys: Record<string, number> = {};
                data.forEach(u => initQtys[u.id] = 1);
                setUpsellQtys(initQtys);
            }
        }).catch(() => {});
        return () => clearInterval(timer);
    }, []);

    const mins = Math.floor(countdown / 60);
    const secs = countdown % 60;

    const totalOriginal = items.reduce((acc, item) => {
        // Estimate original as 2x price if no original price stored
        return acc + (item.price * item.quantity * 2);
    }, 0);
    const savings = totalOriginal - totalAmount;

    const proceedToStripe = async (withUpsells: boolean) => {
        setIsLoading(true);
        try {
            const finalItems = [...items]
            if (withUpsells) {
                upsells.forEach(u => {
                    if (upsellsAdded[u.id]) {
                        finalItems.push({
                            id: `upsell-${u.id}`,
                            name: u.name,
                            price: u.price,
                            quantity: upsellQtys[u.id] || 1,
                            image: u.image || "https://images.unsplash.com/photo-1580828369019-2228f4fff605?w=500&q=80",
                            bundle: "Vente Additionnelle",
                            size: "Unique"
                        } as any)
                    }
                })
            }
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: finalItems })
            });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
            else { toast.error(data.error || "Erreur de paiement checkout"); setIsLoading(false); }
        } catch { toast.error("Erreur de connexion"); setIsLoading(false); }
    };

    const handleCheckoutClick = () => {
        if (upsells.length > 0) {
            setCartOpen(false);
            setIsUpsellModalOpen(true);
        } else {
            proceedToStripe(false);
        }
    };

    const handleAddUpsell = (id: string) => {
        setUpsellsAdded(prev => ({ ...prev, [id]: true }));
        toast.success("Article ajouté à votre commande !");
    };

    return (
        <>
        <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
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
            </SheetContent>
        </Sheet>

        {/* Upsell Dialog Modal */}
        <Dialog open={isUpsellModalOpen} onOpenChange={setIsUpsellModalOpen}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden border-orange-200" showCloseButton={false}>
                <DialogTitle className="sr-only">Upsell Offers</DialogTitle>
                <DialogDescription className="sr-only">Special offers before checkout</DialogDescription>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-black uppercase tracking-tight text-center flex-1">COMPLETE YOUR RELIEF KIT</h2>
                    <button onClick={() => proceedToStripe(false)} className="p-2 shrink-0 hover:bg-muted rounded-full transition-colors">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
                
                <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
                    {upsells.map((u) => {
                        const savings = u.compareAt ? u.compareAt - u.price : 0;
                        return (
                            <div key={u.id} className="flex gap-4 md:gap-6 items-center">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 border bg-muted">
                                    <img src={u.image} alt={u.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <h3 className="font-bold text-base sm:text-lg leading-tight">{u.name}</h3>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {u.compareAt && <span className="text-sm text-gray-400 line-through">€{u.compareAt.toFixed(2)}</span>}
                                        <span className="font-black text-lg">€{u.price.toFixed(2)}</span>
                                        {savings > 0 && <span className="text-xs font-bold text-orange-600">€{savings.toFixed(2)} Savings</span>}
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-2">Parfait pour compléter votre commande et accroître votre confort quotidien.</p>
                                </div>
                                <div className="flex flex-col gap-2 shrink-0 items-end">
                                    <div className="flex items-center border rounded-lg overflow-hidden shrink-0 w-[100px]">
                                        <button onClick={() => setUpsellQtys(p => ({...p, [u.id]: Math.max(1, p[u.id] - 1)}))} className="flex-1 py-1.5 hover:bg-muted text-sm font-bold flex justify-center"><Minus className="h-3 w-3" /></button>
                                        <span className="text-sm font-bold px-3 border-x">{upsellQtys[u.id] || 1}</span>
                                        <button onClick={() => setUpsellQtys(p => ({...p, [u.id]: (p[u.id] || 1) + 1}))} className="flex-1 py-1.5 hover:bg-muted text-sm font-bold flex justify-center"><Plus className="h-3 w-3" /></button>
                                    </div>
                                    {upsellsAdded[u.id] ? (
                                        <Button disabled className="w-[100px] h-9 text-xs font-bold bg-green-600 text-white rounded-lg">Ajouté ✓</Button>
                                    ) : (
                                        <Button onClick={() => handleAddUpsell(u.id)} className="w-[100px] h-9 text-xs font-black bg-[#FF6600] hover:bg-[#e65c00] text-white rounded-lg uppercase tracking-wider">Add to order</Button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="p-4 sm:p-6 bg-gray-50 border-t flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <button 
                        onClick={() => proceedToStripe(false)}
                        className="text-sm font-medium text-gray-500 hover:text-gray-800 underline order-2 sm:order-1"
                        disabled={isLoading}
                    >
                        Decline this offer
                    </button>
                    <Button 
                        onClick={() => proceedToStripe(true)}
                        className="w-full sm:w-auto px-12 h-12 rounded-xl text-base font-black bg-[#FF6600] hover:bg-[#e65c00] text-white uppercase tracking-widest shadow-lg shadow-orange-500/30 order-1 sm:order-2"
                        disabled={isLoading}
                    >
                        {isLoading ? "PROCESING..." : "CONTINUE"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
}
