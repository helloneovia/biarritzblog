import { prisma } from "@/lib/prisma";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            items: {
                include: {
                    product: true
                }
            },
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true
                }
            }
        }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Gestion des Commandes</h1>
                <p className="text-muted-foreground mt-2">
                    Suivez et mettez à jour l'évolution des commandes (expéditions, numéros de suivi).
                </p>
            </div>

            <OrdersTable initialOrders={orders} />
        </div>
    );
}
