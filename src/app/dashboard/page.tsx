import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { prisma } from "@/lib/prisma"
import { DashboardOrdersClient } from "./DashboardOrdersClient"

export const dynamic = "force-dynamic"

export default async function DashboardOrdersPage() {
    const session = await getServerSession(authOptions)

    const orders = await prisma.order.findMany({
        where: { userId: session?.user?.id },
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } } }
    })

    return (
        <DashboardOrdersClient
            orders={orders.map(o => ({
                id: o.id,
                status: o.status,
                totalAmount: o.totalAmount,
                createdAt: o.createdAt.toISOString(),
                trackingNumber: o.trackingNumber ?? undefined,
                trackingUrl: o.trackingUrl ?? undefined,
                address: o.address,
                city: o.city,
                postalCode: o.postalCode,
                country: o.country,
                items: o.items.map(i => ({
                    id: i.id,
                    quantity: i.quantity,
                    price: i.price,
                    size: i.size ?? undefined,
                    color: i.color ?? undefined,
                    product: { name: i.product.name, description: i.product.description }
                }))
            }))}
        />
    )
}
