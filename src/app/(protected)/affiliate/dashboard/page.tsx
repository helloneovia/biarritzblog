import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Gift, CreditCard, ExternalLink, Euro } from "lucide-react";
import AffiliateWithdrawForm from "./AffiliateWithdrawForm";
import CopyToClipboard from "@/components/ui/CopyToClipboard";

export const dynamic = "force-dynamic";

export default async function AffiliateDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    const profile = await prisma.affiliateProfile.findUnique({
        where: { userId: session.user.id },
        include: {
            promoCode: true,
            commissions: {
                orderBy: { createdAt: 'desc' },
                take: 10,
                include: { order: true }
            },
            payouts: {
                orderBy: { createdAt: 'desc' },
                take: 5
            }
        }
    });

    if (!profile) {
        redirect("/affiliate/register");
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto p-4 py-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord Affilié</h1>
                <p className="text-muted-foreground mt-2">
                    Suivez vos performances, vos commissions et demandez vos paiements.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Solde Disponible</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{formatCurrency(profile.balance)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Prêt à être viré</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Gains Totaux (Historique)</CardTitle>
                        <Euro className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{formatCurrency(profile.totalEarned)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Depuis votre inscription</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-primary/20 bg-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-primary">Votre Code Promo (15%)</CardTitle>
                        <Gift className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary flex items-center justify-between">
                            {profile.promoCode?.code || "Aucun"}
                            {profile.promoCode?.code && (
                                <CopyToClipboard text={profile.promoCode.code} />
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Utilisé {profile.promoCode?.usageCount || 0} fois
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Demander un virement</CardTitle>
                            <CardDescription>
                                Vous pouvez demander un virement dès 50€ de solde.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AffiliateWithdrawForm
                                balance={profile.balance}
                                initialIban={profile.iban || ""}
                                initialBic={profile.bic || ""}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Dernières demandes de virement</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {profile.payouts.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Aucune demande pour le moment.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {profile.payouts.map(payout => (
                                        <div key={payout.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                                            <div>
                                                <p className="font-semibold">{formatCurrency(payout.amount)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(payout.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Badge variant={
                                                payout.status === "PAID" ? "default" :
                                                    payout.status === "REJECTED" ? "destructive" : "secondary"
                                            }>
                                                {payout.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dernières Commissions</CardTitle>
                            <CardDescription>Historique des 10 dernières ventes générées</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {profile.commissions.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Package className="w-12 h-12 mx-auto text-gray-200 mb-3" />
                                    Aucune vente pour l'instant. Partagez votre code !
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {profile.commissions.map(comm => (
                                        <div key={comm.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                            <div>
                                                <p className="font-medium">Client anonyme</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(comm.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-green-600">+{formatCurrency(comm.amount)}</p>
                                                <Badge variant="outline" className="text-xs mt-1 bg-gray-50">{comm.status}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Temporary import for icon (since Package icon isn't imported at the top)
import { Package } from "lucide-react";
