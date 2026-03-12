import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
        }

        const resolvedParams = await params;
        const { status, trackingInfo } = await req.json();

        if (status !== "PAID" && status !== "REJECTED") {
            return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
        }

        const payout = await prisma.payoutRequest.findUnique({
            where: { id: resolvedParams.id }
        });

        if (!payout) {
            return NextResponse.json({ error: "Demande de virement introuvable" }, { status: 404 });
        }

        if (payout.status !== "PENDING") {
            return NextResponse.json({ error: "Cette demande a déjà été traitée" }, { status: 400 });
        }

        await prisma.$transaction(async (tx) => {
            await tx.payoutRequest.update({
                where: { id: payout.id },
                data: {
                    status,
                    notes: trackingInfo || null,
                    transactionId: status === "PAID" ? trackingInfo : null
                }
            });

            // If rejected, refund the affiliate's balance
            if (status === "REJECTED") {
                await tx.affiliateProfile.update({
                    where: { id: payout.affiliateId },
                    data: {
                        balance: { increment: payout.amount }
                    }
                });
            }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("ADMIN_PAYOUT_UPDATE_ERROR:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
