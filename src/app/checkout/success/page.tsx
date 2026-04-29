import Link from 'next/link'
import { CheckCircle2, UserCircle, Key, Package, ShoppingBag, MapPin, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { PurchaseTracker } from '@/components/tracking/PurchaseTracker'
import { AutoLoginButton } from '@/components/checkout/AutoLoginButton'

export const dynamic = 'force-dynamic'

export default async function CheckoutSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id?: string, payment_intent?: string }>
}) {
    const params = await searchParams
    const sessionId = params.session_id || params.payment_intent

    const tempPassword = sessionId ? `Biarritz-${sessionId.slice(-6)}` : null

    // Fetch the order created by the webhook for this session
    let order: any = null
    let email: string | null = null
    if (sessionId) {
        // Retry up to 5 times (webhook may take a second or two to fire)
        for (let i = 0; i < 5; i++) {
            order = await prisma.order.findFirst({
                where: { stripeSession: sessionId },
                include: { items: { include: { product: true } } },
            })
            if (order) break
            await new Promise(r => setTimeout(r, 1000))
        }

        // Fallback: If webhook completely failed (or wasn't configured for payment_intent.succeeded),
        // manually sync it here on the server side.
        if (!order && sessionId.startsWith('pi_')) {
            const { syncPaymentIntent } = await import('@/lib/stripe-sync');
            try {
                order = await syncPaymentIntent(sessionId);
            } catch (e) {
                console.error("Manual sync failed:", e);
            }
        }

        email = order?.email ?? null
    }

    const orderRef = order?.id?.slice(-8).toUpperCase() ?? null

    return (
        <div className="min-h-screen bg-gray-50 py-12 sm:py-24">
            <PurchaseTracker order={order} />
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto space-y-6">

                    {/* Success Header Card */}
                    <div className="bg-white rounded-3xl p-8 sm:p-12 text-center shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600" />
                        <div className="mx-auto w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black mb-4 text-gray-900 tracking-tight">Paiement Réussi !</h1>
                        <p className="text-gray-500 text-lg mb-6 max-w-lg mx-auto">
                            Merci pour votre confiance. Votre commande est confirmée et sera expédiée dans les plus brefs délais.
                        </p>
                        
                        {orderRef && (
                            <div className="inline-flex items-center gap-3 bg-gray-50 border px-6 py-3 rounded-2xl">
                                <Package className="w-5 h-5 text-gray-400" />
                                <div className="text-left">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Numéro de commande</p>
                                    <p className="font-mono font-black text-gray-900">#{orderRef}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Shipping details */}
                        {order && (
                            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <h2 className="font-black text-xl text-gray-900">Livraison</h2>
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                    <p className="font-bold text-gray-900 mb-1">{order.firstName} {order.lastName}</p>
                                    <p className="text-gray-600">{order.address}</p>
                                    <p className="text-gray-600">{order.postalCode} {order.city}</p>
                                    <p className="text-gray-600 font-medium mt-1">{order.country}</p>
                                </div>
                            </div>
                        )}

                        {/* Account details */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                    <UserCircle className="w-5 h-5" />
                                </div>
                                <h2 className="font-black text-xl text-gray-900">Votre Compte</h2>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email (Identifiant)</p>
                                        <p className="font-medium text-gray-900 word-break-all">{email || "Non renseigné"}</p>
                                        <p className="text-xs text-gray-500 mt-1">Un récapitulatif a été envoyé à cette adresse.</p>
                                    </div>
                                </div>
                                
                                {tempPassword && (
                                    <div className="flex items-start gap-3 pt-3 border-t">
                                        <Key className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                                        <div className="w-full">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Mot de passe temporaire</p>
                                            <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-mono font-bold text-gray-900 text-sm select-all">
                                                {tempPassword}
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-1.5">Un espace client a été créé pour suivre votre commande.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order summary */}
                    {order && order.items?.length > 0 && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <h2 className="font-black text-xl text-gray-900">Résumé de la commande</h2>
                            </div>
                            <div className="space-y-4">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 border">
                                            {item.product?.images?.[0] && (
                                                <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">
                                                {item.product?.name || 'Article Biarritz'}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                <span>Qté: {item.quantity}</span>
                                                {item.size && (
                                                    <>
                                                        <span>·</span>
                                                        <span>{item.size}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-black text-gray-900">{(item.price * item.quantity).toFixed(2)} €</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-100">
                                <span className="font-black text-gray-900 text-lg">Total Payé</span>
                                <span className="font-black text-2xl text-gray-900">{order.totalAmount?.toFixed(2)} €</span>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="pt-4 space-y-4 sm:space-y-0 sm:flex sm:gap-4 max-w-2xl mx-auto">
                        <div className="flex-1">
                            {email ? (
                                <AutoLoginButton email={email} password={tempPassword} />
                            ) : (
                                <Link href="/login" className="block">
                                    <Button size="lg" className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 uppercase tracking-wider">
                                        Accéder à mon espace <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                        <Link href="/" className="block sm:w-1/3">
                            <Button variant="outline" size="lg" className="w-full rounded-xl font-bold uppercase tracking-wider border-2 hover:bg-gray-50">
                                Boutique
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}
