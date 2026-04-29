import { prisma } from "@/lib/prisma"
import StatsDashboard from "./StatsDashboard"

export const dynamic = "force-dynamic"

export default async function AdminStatsPage() {
    const orders = await prisma.order.findMany({
        where: {
            status: { in: ["PAID", "SHIPPED", "DELIVERED"] } // Only successful orders
        },
        include: {
            items: {
                include: { product: true }
            }
        },
        orderBy: { createdAt: "asc" }
    })

    // Aggregations
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
    const totalOrders = orders.length

    // Revenue over time (Grouped by Day)
    const revenueByDayMap = new Map<string, number>()
    orders.forEach(o => {
        const dateStr = o.createdAt.toISOString().split("T")[0] // YYYY-MM-DD
        revenueByDayMap.set(dateStr, (revenueByDayMap.get(dateStr) || 0) + o.totalAmount)
    })
    const revenueOverTime = Array.from(revenueByDayMap.entries()).map(([date, revenue]) => ({
        date,
        revenue: Math.round(revenue * 100) / 100
    }))

    // VISITS DATA (Replaces Order data for Pie charts)
    const visits = await prisma.visit.findMany({
        orderBy: { createdAt: "desc" }
    })
    
    const totalVisits = visits.length

    // Sales/Visits by Country
    const countryMap = new Map<string, number>()
    visits.forEach(v => {
        const country = v.country || "Inconnu"
        countryMap.set(country, (countryMap.get(country) || 0) + 1)
    })
    const salesByCountry = Array.from(countryMap.entries()).map(([name, value]) => ({ name, value }))

    // Sales/Visits by Device
    const deviceMap = new Map<string, number>()
    visits.forEach(v => {
        const device = v.device || "Inconnu"
        deviceMap.set(device, (deviceMap.get(device) || 0) + 1)
    })
    const salesByDevice = Array.from(deviceMap.entries()).map(([name, value]) => ({ name, value }))

    // Sales/Visits by Browser
    const browserMap = new Map<string, number>()
    visits.forEach(v => {
        const browser = v.browser || "Inconnu"
        browserMap.set(browser, (browserMap.get(browser) || 0) + 1)
    })
    const salesByBrowser = Array.from(browserMap.entries()).map(([name, value]) => ({ name, value }))

    // Top Products/Bundles
    const productMap = new Map<string, { name: string, qty: number, revenue: number }>()
    orders.forEach(o => {
        o.items.forEach(item => {
            const pId = item.productId
            const current = productMap.get(pId) || { name: item.product.name, qty: 0, revenue: 0 }
            productMap.set(pId, {
                name: current.name,
                qty: current.qty + item.quantity,
                revenue: current.revenue + (item.price * item.quantity)
            })
        })
    })
    const topProducts = Array.from(productMap.values())
        .map(p => ({
            name: p.name,
            ventes: p.qty,
            revenu: Math.round(p.revenue * 100) / 100
        }))
        .sort((a, b) => b.revenu - a.revenu)
        .slice(0, 10)

    const statsData = {
        totalRevenue,
        totalOrders,
        totalVisits,
        revenueOverTime,
        salesByCountry,
        salesByDevice,
        salesByBrowser,
        topProducts
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Statistiques Globales</h1>
                <p className="text-muted-foreground mt-2">
                    Visualisez les performances de votre boutique, l'origine de vos clients et les appareils utilisés.
                </p>
            </div>
            
            <StatsDashboard data={statsData} />
        </div>
    )
}
