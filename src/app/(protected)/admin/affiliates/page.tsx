import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminPayoutActions from "./AdminPayoutActions";
import AdminAffiliateEditDialog from "./AdminAffiliateEditDialog";

export const dynamic = "force-dynamic";

export default async function AdminAffiliatesPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    const affiliates = await prisma.affiliateProfile.findMany({
        include: {
            user: true,
            promoCode: true,
            _count: {
                select: { commissions: true }
            }
        },
        orderBy: {
            totalEarned: 'desc'
        }
    });

    const pendingPayouts = await prisma.payoutRequest.findMany({
        where: {
            status: "PENDING"
        },
        include: {
            affiliate: {
                include: { user: true }
            }
        },
        orderBy: {
            createdAt: 'asc'
        }
    });

    return (
        <div className="space-y-8 p-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Gestion des Affiliés</h1>
                <p className="text-muted-foreground mt-2">
                    Gérez les demandes de virement et consultez les performances des affiliés.
                </p>
            </div>

            <div className="space-y-6">
                <Card className="border-orange-500/20 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-orange-600">Demandes de Virement en Attente ({pendingPayouts.length})</CardTitle>
                        <CardDescription>
                            Vérifiez les IBAN et marquez comme "Payé" après avoir effectué le virement.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {pendingPayouts.length === 0 ? (
                            <p className="text-muted-foreground">Aucune demande en attente.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Affilié</TableHead>
                                            <TableHead>Montant</TableHead>
                                            <TableHead>IBAN</TableHead>
                                            <TableHead>BIC</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingPayouts.map(payout => (
                                            <TableRow key={payout.id}>
                                                <TableCell className="font-medium">
                                                    {payout.affiliate.user.name || payout.affiliate.user.email}
                                                </TableCell>
                                                <TableCell className="font-bold text-green-600">
                                                    {formatCurrency(payout.amount)}
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">{payout.iban}</TableCell>
                                                <TableCell className="font-mono text-sm">{payout.bic}</TableCell>
                                                <TableCell>
                                                    {new Date(payout.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <AdminPayoutActions payoutId={payout.id} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Liste des Affiliés</CardTitle>
                        <CardDescription>
                            Toutes les personnes inscrites au programme d'affiliation.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {affiliates.length === 0 ? (
                            <p className="text-muted-foreground">Aucun affilié pour le moment.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nom</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Code Promo</TableHead>
                                            <TableHead>Taux (Comm / Réd)</TableHead>
                                            <TableHead>Utilisations</TableHead>
                                            <TableHead>Ventes Générées</TableHead>
                                            <TableHead>Gains Totaux</TableHead>
                                            <TableHead className="text-right">Solde Dû</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {affiliates.map(affiliate => (
                                            <TableRow key={affiliate.id}>
                                                <TableCell className="font-medium">
                                                    {affiliate.user.name || "N/A"}
                                                </TableCell>
                                                <TableCell>{affiliate.user.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="font-mono">
                                                        {affiliate.promoCode?.code || "Aucun"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col text-xs text-muted-foreground">
                                                        <span>Comm: {affiliate.commissionRate}%</span>
                                                        <span>Réduc: {affiliate.promoCode?.discount || 0}%</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{affiliate.promoCode?.usageCount || 0}</TableCell>
                                                <TableCell>{affiliate._count.commissions}</TableCell>
                                                <TableCell className="text-green-600">
                                                    {formatCurrency(affiliate.totalEarned)}
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-orange-600">
                                                    {formatCurrency(affiliate.balance)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <AdminAffiliateEditDialog
                                                        affiliateId={affiliate.id}
                                                        currentCommission={affiliate.commissionRate}
                                                        currentDiscount={affiliate.promoCode?.discount || 0}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
