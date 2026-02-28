"use client"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ShoppingBag, X, Plus, Minus, CreditCard, Lock } from "lucide-react"
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/store/CartContext";
import { useState } from "react"

export function CartDrawer({ t }: { t: Record<string, string> }) {
    const { items, removeFromCart, updateQuantity, isCartOpen, setCartOpen, totalAmount } = useCart();
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items })
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || "Checkout failed");
            }
        } catch (error) {
            console.error(error);
            alert("Error trying to checkout");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
                <button
                    className="relative p-2 text-foreground/80 hover:text-foreground transition-colors"
                    aria-label={t.navCart || "Cart"}
                >
                    <ShoppingBag className="h-6 w-6" />
                    {items.length > 0 && (
                        <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center translate-x-1 -translate-y-1">
                            {items.reduce((acc, item) => acc + item.quantity, 0)}
                        </span>
                    )}
                </button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                    <SheetTitle>{t.cartTitle || "Your Cart"} ({items.reduce((acc, item) => acc + item.quantity, 0)})</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                            <ShoppingBag className="h-12 w-12 opacity-20" />
                            <p>{t.cartEmpty || "Your cart is empty"}</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 border-b pb-4 mb-4">
                                <div className="h-20 w-20 rounded-xl overflow-hidden bg-muted border shrink-0">
                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex flex-1 flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between font-semibold">
                                            <h3 className="line-clamp-1">{item.name}</h3>
                                            <span>€{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{item.bundle}</p>
                                        <p className="text-sm text-muted-foreground text-xs">{item.size}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex items-center border rounded-md">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 hover:bg-muted text-sm"><Minus className="h-3 w-3" /></button>
                                            <span className="text-sm font-medium px-2">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 hover:bg-muted text-sm"><Plus className="h-3 w-3" /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="border-t pt-6 space-y-4">
                        <div className="flex justify-between font-medium">
                            <span>{t.cartSubtotal || "Subtotal"}</span>
                            <span>€{totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium text-sm text-green-600">
                            <span>{t.productShipping || "Shipping"}</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total</span>
                            <span>€{totalAmount.toFixed(2)}</span>
                        </div>
                        <Button className="w-full h-14 rounded-xl text-lg font-bold shadow-lg mt-4" onClick={handleCheckout} disabled={isLoading}>
                            {isLoading ? "Processing..." : (t.cartCheckout || "Proceed to Checkout")}
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
