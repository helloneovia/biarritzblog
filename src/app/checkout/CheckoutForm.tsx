"use client"
import { useState } from "react"
import { useStripe, useElements, PaymentElement, AddressElement } from "@stripe/react-stripe-js"
import { useCart } from "@/lib/store/CartContext"
import { Lock, ArrowRight } from "lucide-react"

export function CheckoutForm({ items, totalAmount }: { items: any[], totalAmount: number }) {
    const stripe = useStripe()
    const elements = useElements()
    const { clearCart } = useCart()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const appUrl = typeof window !== "undefined" ? window.location.origin : "https://biarritz.blog"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!stripe || !elements) return

        setIsLoading(true)
        setErrorMsg("")

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${appUrl}/checkout/success`,
            },
        })

        if (error) {
            setErrorMsg(error.message || "Une erreur est survenue lors du paiement.")
            setIsLoading(false)
        }
        // If no error, Stripe redirects to return_url automatically
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping address */}
            <div>
                <label className="block text-sm font-black mb-3 uppercase tracking-wide">Adresse de livraison</label>
                <AddressElement
                    options={{
                        mode: "shipping",
                        defaultValues: { address: { country: "FR" } },
                        fields: { phone: "always" },
                        validation: { phone: { required: "always" } },
                    }}
                />
            </div>

            {/* Payment */}
            <div>
                <label className="block text-sm font-black mb-3 uppercase tracking-wide">Moyen de paiement</label>
                <PaymentElement
                    options={{
                        layout: "tabs",
                        paymentMethodOrder: ["card", "paypal", "klarna", "apple_pay", "google_pay"],
                    }}
                />
            </div>

            {/* Error message */}
            {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold">
                    ⚠️ {errorMsg}
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={isLoading || !stripe || !elements}
                className="w-full h-16 bg-primary text-white text-lg font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(255,102,0,0.45)] hover:shadow-[0_12px_40px_rgba(255,102,0,0.65)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
                <Lock className="h-5 w-5" />
                {isLoading ? "Traitement en cours..." : `Payer €${totalAmount.toFixed(2)}`}
                {!isLoading && <ArrowRight className="h-5 w-5" />}
            </button>

            <p className="text-center text-xs text-muted-foreground">
                🔒 Paiement crypté SSL · Géré par{" "}
                <span className="font-bold">Stripe</span> — certifié PCI DSS Level 1
            </p>
        </form>
    )
}
