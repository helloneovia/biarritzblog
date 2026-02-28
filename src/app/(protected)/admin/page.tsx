import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import {
    CreditCard,
    Package,
    Users,
    TrendingUp,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    // Fetch real metrics
    const totalOrders = await prisma.order.count();

    const totalRevenueResult = await prisma.order.aggregate({
        where: {
            status: {
                in: ["PAID", "SHIPPED", "DELIVERED"],
            },
        },
        _sum: {
            totalAmount: true,
        },
    });

    const totalRevenue = totalRevenueResult._sum.totalAmount || 0;

    const totalCustomers = await prisma.user.count({
        where: {
            role: "USER"
        }
    });

    const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            user: true,
            items: {
                include: {
                    product: true
                }
            }
        }
    });

    const pendingTickets = await prisma.ticket.count({
        where: {
            status: "OPEN"
        }
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-yellow-100 text-yellow-800";
            case "PAID": return "bg-blue-100 text-blue-800";
            case "SHIPPED": return "bg-indigo-100 text-indigo-800";
            case "DELIVERED": return "bg-green-100 text-green-800";
            case "CANCELED": return "bg-red-100 text-red-800";
            case "REFUNDED": return "bg-gray-100 text-gray-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "PENDING": return "En attente";
            case "PAID": return "Payée";
            case "SHIPPED": return "Expédiée";
            case "DELIVERED": return "Livrée";
            case "CANCELED": return "Annulée";
            case "REFUNDED": return "Remboursée";
            default: return status;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
                <p className="text-muted-foreground mt-2">
                    Vue d'ensemble de l'activité de votre boutique.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Revenue Card */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Revenu Total</h3>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        +20.1% par rapport au mois dernier
                    </p>
                </div>

                {/* Orders Card */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Commandes</h3>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">+{totalOrders}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Toutes les transactions enregistrées
                    </p>
                </div>

                {/* Customers Card */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Clients Inscrits</h3>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">+{totalCustomers}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Nouveaux comptes créés
                    </p>
                </div>

                {/* Tickets Card */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Tickets Ouverts</h3>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{pendingTickets}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Demandes client en attente
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 border-b">
                        <div>
                            <h3 className="font-semibold leading-none tracking-tight">Commandes Récentes</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Vous avez {totalOrders} commandes au total.
                            </p>
                        </div>
                        <Link
                            href="/admin/orders"
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                            Voir tout <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="p-6 pt-0">
                        {recentOrders.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                Aucune commande pour le moment.
                            </div>
                        ) : (
                            <div className="space-y-8 mt-6">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center">
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {order.firstName} {order.lastName}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.email}
                                            </p>
                                        </div>
                                        <div className="ml-auto text-right">
                                            <p className="text-sm font-medium">
                                                {formatCurrency(order.totalAmount)}
                                            </p>
                                            <Badge variant="secondary" className={`${getStatusColor(order.status)} mt-1`}>
                                                {getStatusLabel(order.status)}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 border-b">
                        <h3 className="font-semibold leading-none tracking-tight">Activité Support</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Derniers messages des clients.
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="text-center py-8 text-gray-500 text-sm">
                            Module en construction
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
