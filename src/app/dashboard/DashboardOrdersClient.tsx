"use client"
import { useState } from "react"
import { Package, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"

interface OrderItem {
    id: string
    quantity: number
    price: number
    size?: string
    color?: string
    product: { name: string; description: string }
}

interface Order {
    id: string
    status: string
    totalAmount: number
    createdAt: string
    trackingNumber?: string
    trackingUrl?: string
    address: string
    city: string
    postalCode: string
    country: string
    items: OrderItem[]
}

function OrderCard({ order }: { order: Order }) {
    const [open, setOpen] = useState(false)

    const statusColors: Record<string, string> = {
        DELIVERED: 'bg-green-100 text-green-700',
        SHIPPED: 'bg-blue-100 text-blue-700',
        PAID: 'bg-yellow-100 text-yellow-700',
        PENDING: 'bg-gray-100 text-gray-700',
        CANCELED: 'bg-red-100 text-red-700',
        REFUNDED: 'bg-purple-100 text-purple-700',
    }

    return (
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
            {/* Header — always visible */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full p-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center text-left hover:bg-muted/20 transition-colors"
            >
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-lg">Commande #{order.id.slice(-8).toUpperCase()}</h3>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                            {order.status}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        {' · '}{order.items.length} article(s)
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-2xl font-bold">€{order.totalAmount.toFixed(2)}</p>
                    {open ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                </div>
            </button>

            {/* Expanded details */}
            {open && (
                <div className="border-t px-6 pb-6 pt-4 space-y-4">
                    {/* Items */}
                    <div>
                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-3">Articles commandés</p>
                        <div className="space-y-2">
                            {order.items.map(item => (
                                <div key={item.id} className="flex justify-between items-center bg-muted/30 rounded-xl px-4 py-3">
                                    <div>
                                        <p className="font-semibold text-sm">{item.product?.name || 'Semelles Biarritz'}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.size && `Taille: ${item.size}`}
                                            {item.size && item.color && ' · '}
                                            {item.color && `Couleur: ${item.color}`}
                                            {' · '}Qté: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-bold text-sm text-indigo-600">€{(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery address */}
                    <div className="bg-muted/30 rounded-xl px-4 py-3">
                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-1">Adresse de livraison</p>
                        <p className="text-sm">{order.address}, {order.postalCode} {order.city}, {order.country}</p>
                    </div>

                    {/* Tracking */}
                    {order.trackingNumber && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase text-blue-600 tracking-wider mb-0.5">Numéro de suivi</p>
                                <p className="font-mono font-bold text-sm">{order.trackingNumber}</p>
                            </div>
                            {order.trackingUrl && (
                                <a href={order.trackingUrl} target="_blank" rel="noreferrer"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors">
                                    <ExternalLink className="h-4 w-4" /> Suivre
                                </a>
                            )}
                        </div>
                    )}

                    {!order.trackingNumber && order.status === 'PAID' && (
                        <p className="text-sm text-muted-foreground bg-muted/30 rounded-xl px-4 py-3">
                            📦 Votre commande est en cours de préparation. Un numéro de suivi vous sera communiqué par email.
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

export function DashboardOrdersClient({ orders }: { orders: Order[] }) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-extrabold mb-2">Mes Commandes</h1>
                <p className="text-muted-foreground">Suivez le statut de vos achats et accédez aux informations de livraison.</p>
            </div>

            {orders.length === 0 ? (
                <div className="bg-card rounded-3xl p-12 mt-8 text-center border shadow-sm flex flex-col items-center justify-center">
                    <div className="h-16 w-16 bg-muted text-muted-foreground rounded-full flex items-center justify-center mb-4">
                        <Package className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Aucune commande</h3>
                    <p className="text-muted-foreground">Vous n&apos;avez pas encore passé de commande avec ce compte.</p>
                </div>
            ) : (
                <div className="space-y-4 mt-2">
                    {orders.map(order => <OrderCard key={order.id} order={order} />)}
                </div>
            )}
        </div>
    )
}
