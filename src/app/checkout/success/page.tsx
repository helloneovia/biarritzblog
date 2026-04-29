import Link from 'next/link'
import { CheckCircle, UserCircle, Key, Package, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { PurchaseTracker } from '@/components/tracking/PurchaseTracker'

export const dynamic = 'force-dynamic'

export default async function CheckoutSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id?: string }>
}) {
    // Next.js 15+: searchParams is a Promise
    const params = await searchParams
    const sessionId = params.session_id

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
        email = order?.email ?? null
    }

    const orderRef = order?.id?.slice(-8).toUpperCase() ?? null

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen mt-16 flex flex-col items-center justify-center">
            <PurchaseTracker order={order} />
            <div className="max-w-lg w-full">

                {/* Success Header */}
                <div className="bg-card rounded-3xl p-8 text-center shadow-xl border mb-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-extrabold mb-3">Paiement Réussi !</h1>
                    <p className="text-muted-foreground mb-2">
                        Merci pour votre achat ! Votre commande est en cours de traitement.
                    </p>
                    {orderRef && (
                        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full font-mono font-bold text-sm mt-2">
                            <Package className="w-4 h-4" />
                            Commande #{orderRef}
                        </div>
                    )}
                </div>

                {/* Order summary */}
                {order && order.items?.length > 0 && (
                    <div className="bg-card rounded-3xl p-6 shadow border mb-4">
                        <div className="flex items-center gap-2 mb-4 font-semibold text-foreground">
                            <ShoppingBag className="w-5 h-5 text-indigo-600" />
                            <span>Récapitulatif de commande</span>
                        </div>
                        <div className="space-y-3">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                                    <div>
                                        <p className="font-medium text-sm">{item.product?.name || 'Semelles Biarritz'}</p>
                                        {item.size && <p className="text-xs text-muted-foreground">Taille: {item.size}</p>}
                                        <p className="text-xs text-muted-foreground">Qté: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-indigo-600">{(item.price * item.quantity).toFixed(2)} €</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center pt-3 mt-2 border-t font-bold text-lg">
                            <span>Total</span>
                            <span className="text-indigo-600">{order.totalAmount?.toFixed(2)} €</span>
                        </div>
                        {email && (
                            <p className="text-xs text-muted-foreground mt-3 text-center">
                                Un email de confirmation a été envoyé à <strong>{email}</strong>
                            </p>
                        )}
                    </div>
                )}

                {/* Account created info */}
                {tempPassword && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 mb-4">
                        <div className="flex items-center gap-2 mb-2 text-indigo-900 font-semibold">
                            <UserCircle className="w-5 h-5" />
                            <span>Votre Espace Client A Été Créé</span>
                        </div>
                        <p className="text-sm text-indigo-700 mb-4">
                            Un compte a été créé automatiquement avec l&apos;email utilisé lors du paiement
                            {email ? ` (${email})` : ''}.
                        </p>
                        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border mb-1">
                            <Key className="w-5 h-5 text-gray-400 shrink-0" />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium">Mot de passe temporaire :</p>
                                <p className="font-mono text-sm font-bold tracking-tight select-all">{tempPassword}</p>
                            </div>
                        </div>
                        <p className="text-xs text-indigo-600 mt-2 opacity-80">
                            Modifiez ce mot de passe après votre première connexion dans les Paramètres.
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                    <Link href={`/login?callbackUrl=/dashboard`} className="block">
                        <Button size="lg" className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white">
                            Suivre ma commande →
                        </Button>
                    </Link>
                    <Link href="/" className="block">
                        <Button variant="outline" size="lg" className="w-full rounded-xl">
                            Retour à la boutique
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    )
}
