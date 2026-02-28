import { prisma } from "@/lib/prisma"
import { Package, Users, CreditCard, TrendingUp } from "lucide-react"
import Link from "next/link"
import { OrdersTable } from "@/components/admin/OrdersTable"

export const dynamic = "force-dynamic"

export const metadata = {
    title: "Admin Dashboard - Biarritz",
}

export default async function AdminDashboard() {
    // Fetch real data from DB
    const [orders, userCount, tickets] = await Promise.all([
        prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: { items: { include: { product: true } } }
        }),
        prisma.user.count({ where: { role: 'USER' } }),
        prisma.ticket.count({ where: { status: 'OPEN' } }),
    ])

    // Calculate real stats
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const ordersThisWeek = orders.filter(o => new Date(o.createdAt) >= weekAgo).length
    const revenueThisWeek = orders
        .filter(o => new Date(o.createdAt) >= weekAgo)
        .reduce((sum, o) => sum + o.totalAmount, 0)

    const stats = [
        {
            name: "Revenus totaux",
            value: `€${totalRevenue.toFixed(2)}`,
            sub: `€${revenueThisWeek.toFixed(2)} cette semaine`,
            icon: CreditCard,
            color: "text-indigo-600 bg-indigo-50"
        },
        {
            name: "Commandes cette semaine",
            value: ordersThisWeek.toString(),
            sub: `${orders.length} au total`,
            icon: Package,
            color: "text-emerald-600 bg-emerald-50"
        },
        {
            name: "Clients",
            value: userCount.toString(),
            sub: "Comptes enregistrés",
            icon: Users,
            color: "text-sky-600 bg-sky-50"
        },
        {
            name: "Tickets ouverts",
            value: tickets.toString(),
            sub: "En attente de réponse",
            icon: TrendingUp,
            color: "text-amber-600 bg-amber-50"
        },
    ]

    // Serialize orders for client component
    const serializedOrders = orders.map(o => ({
        ...o,
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
        items: o.items.map(i => ({
            ...i,
            product: { name: i.product.name }
        }))
    }))

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
                <p className="text-muted-foreground mt-1">Vue d&apos;ensemble de votre boutique en temps réel.</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-card rounded-2xl border p-6 flex items-start gap-4 shadow-sm">
                        <div className={`p-3 rounded-xl ${stat.color}`}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">{stat.name}</p>
                            <p className="text-2xl font-bold mt-0.5">{stat.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold">Commandes</h2>
                        <p className="text-sm text-muted-foreground">{orders.length} commande(s) au total</p>
                    </div>
                    <Link href="/admin/support" className="text-sm text-primary font-medium hover:underline">
                        {tickets > 0 && <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs mr-2">{tickets}</span>}
                        Support →
                    </Link>
                </div>
                <div className="p-6">
                    <OrdersTable initialOrders={serializedOrders} />
                </div>
            </div>
        </div>
    )
}
