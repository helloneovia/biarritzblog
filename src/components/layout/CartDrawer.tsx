"use client"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function CartDrawer({ t }: { t: Record<string, string> }) {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // Dummy cart state for visuals
    const cartItems = [
        {
            id: 1,
            name: "Biarritz Orthopaedic Insoles",
            bundle: "2 Pairs (Most Popular)",
            size: "EU 40-41",
            price: 59.00,
            image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
        }
    ]
    const total = cartItems.reduce((acc, item) => acc + item.price, 0)

    const handleCheckout = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                        id: item.id,
                        name: item.name,
                        image: item.image,
                        bundle: item.bundle,
                        size: item.size,
                        price: item.price,
                        quantity: 1
                    }))
                })
            })

            const data = await response.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                alert(data.error || "Checkout failed")
            }
        } catch (error) {
            console.error("Checkout error:", error)
            alert("An error occurred during checkout")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                    <span className="sr-only">Cart</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                    <SheetTitle>{t.cartTitle || "Your Cart"} ({cartItems.length})</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-6">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4 border-b pb-4">
                            <div className="h-20 w-20 rounded-xl overflow-hidden bg-muted border">
                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-1 flex-col justify-between">
                                <div>
                                    <div className="flex justify-between font-semibold">
                                        <h3 className="line-clamp-1">{item.name}</h3>
                                        <span>€{item.price.toFixed(2)}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{item.bundle}</p>
                                    <p className="text-sm text-muted-foreground text-xs">{item.size}</p>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex items-center border rounded-md">
                                        <button className="px-2 py-1 hover:bg-muted text-sm">-</button>
                                        <span className="text-sm font-medium px-2">1</span>
                                        <button className="px-2 py-1 hover:bg-muted text-sm">+</button>
                                    </div>
                                    <button className="text-red-500 hover:text-red-700">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-6 space-y-4">
                    <div className="flex justify-between font-medium">
                        <span>{t.cartSubtotal || "Subtotal"}</span>
                        <span>€{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-sm text-green-600">
                        <span>{t.productShipping || "Shipping"}</span>
                        <span>Free</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total</span>
                        <span>€{total.toFixed(2)}</span>
                    </div>
                    <Button className="w-full h-14 rounded-xl text-lg font-bold shadow-lg mt-4" onClick={handleCheckout} disabled={isLoading}>
                        {isLoading ? "Processing..." : (t.cartCheckout || "Proceed to Checkout")}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
