"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard, Save, Lock, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { saveStripeKeys } from "./actions"

export function PaymentsClient({ initialConfig }: { initialConfig: any }) {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        try {
            await saveStripeKeys(formData)
            toast.success("Clés Stripe mises à jour avec succès")
        } catch (error: any) {
            toast.error(error.message || "Une erreur est survenue")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <CreditCard className="w-8 h-8 text-primary" />
                    Modes de Paiement
                </h1>
                <p className="text-gray-500 mt-2">
                    Configurez vos clés d'API Stripe pour accepter les paiements. Laissez vide pour utiliser la configuration `.env` par défaut.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
                <form action={handleSubmit} className="space-y-6">
                    
                    <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex gap-3 text-sm border border-blue-100">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold mb-1">Comment obtenir vos clés Stripe ?</p>
                            <p>Rendez-vous sur votre tableau de bord Stripe, dans l'onglet "Développeurs" &gt; "Clés API". Vous pouvez utiliser les clés de test (commençant par <code className="bg-white px-1 py-0.5 rounded text-xs">pk_test_</code>) pour vérifier que tout fonctionne, puis passer aux clés en direct (<code className="bg-white px-1 py-0.5 rounded text-xs">pk_live_</code>) pour lancer votre boutique.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Clé Publique (Publishable Key)</label>
                            <Input
                                name="stripePublicKey"
                                defaultValue={initialConfig?.stripePublicKey || ""}
                                placeholder="pk_test_... ou pk_live_..."
                                className="font-mono"
                            />
                            <p className="text-xs text-gray-500 mt-1">Sera utilisée par le navigateur client.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                                Clé Secrète (Secret Key)
                                <Lock className="w-4 h-4 text-gray-400" />
                            </label>
                            <Input
                                name="stripeSecretKey"
                                type="password"
                                defaultValue={initialConfig?.stripeSecretKey || ""}
                                placeholder="sk_test_... ou sk_live_..."
                                className="font-mono"
                            />
                            <p className="text-xs text-gray-500 mt-1">Sera utilisée par le serveur pour valider les paiements. Gardez-la strictement confidentielle.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                                Secret Webhook (Webhook Secret)
                                <Lock className="w-4 h-4 text-gray-400" />
                            </label>
                            <Input
                                name="stripeWebhookSecret"
                                type="password"
                                defaultValue={initialConfig?.stripeWebhookSecret || ""}
                                placeholder="whsec_..."
                                className="font-mono"
                            />
                            <p className="text-xs text-gray-500 mt-1">Créez un webhook pointant vers <code className="bg-gray-100 px-1 py-0.5 rounded">/api/webhooks/stripe</code> et écoutez l'événement <code className="bg-gray-100 px-1 py-0.5 rounded">checkout.session.completed</code>.</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <Button type="submit" disabled={loading} className="w-full md:w-auto">
                            {loading ? (
                                "Sauvegarde..."
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Enregistrer la configuration Stripe
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
