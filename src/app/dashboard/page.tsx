import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { Package, ExternalLink } from "lucide-react"

export default async function DashboardOrdersPage() {
    const session = await getServerSession(authOptions)

    // Fetch orders for this user
    const orders = await prisma.order.findMany({
        where: { userId: session?.user?.id },
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } } }
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-extrabold mb-2">My Orders</h1>
                <p className="text-muted-foreground">Track the status of your recent purchases and access your tracking information.</p>
            </div>

            {orders.length === 0 ? (
                <div className="bg-card rounded-3xl p-12 mt-8 text-center border shadow-sm flex flex-col items-center justify-center">
                    <div className="h-16 w-16 bg-muted text-muted-foreground rounded-full flex items-center justify-center mb-4">
                        <Package className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No orders found</h3>
                    <p className="text-muted-foreground">It looks like you haven't placed an order using this account yet.</p>
                </div>
            ) : (
                <div className="space-y-4 mt-8">
                    {orders.map((order: any) => (
                        <div key={order.id} className="bg-card rounded-2xl border shadow-sm p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-lg">Order #{order.id.slice(-8).toUpperCase()}</h3>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>

                                {order.trackingNumber && (
                                    <div className="bg-muted px-4 py-3 rounded-xl border flex items-center gap-4 inline-flex">
                                        <div className="text-sm">
                                            <span className="text-muted-foreground block text-xs uppercase font-bold tracking-wider mb-0.5">Tracking Number</span>
                                            <span className="font-mono font-medium">{order.trackingNumber}</span>
                                        </div>
                                        {order.trackingUrl && (
                                            <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="bg-primary/10 text-primary p-2 rounded-lg hover:bg-primary/20 transition-colors">
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="text-right w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0">
                                <p className="text-2xl font-bold">€{order.totalAmount.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">{order.items.length} item(s)</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
