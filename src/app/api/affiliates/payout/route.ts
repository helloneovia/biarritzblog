import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || session.user.role !== "AFFILIATE") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
        }

        const { amount, iban, bic } = await req.json();

        if (!amount || amount < 50) {
            return NextResponse.json({ error: "Le montant minimum de retrait est de 50€" }, { status: 400 });
        }

        const profile = await prisma.affiliateProfile.findUnique({
            where: { userId: session.user.id }
        });

        if (!profile) {
            return NextResponse.json({ error: "Profil affilié introuvable" }, { status: 404 });
        }

        if (profile.balance < amount) {
            return NextResponse.json({ error: "Solde insuffisant" }, { status: 400 });
        }

        // Perform payout request in a transaction
        const payout = await prisma.$transaction(async (tx) => {
            // Deduct balance AND update IBAN details if provided
            await tx.affiliateProfile.update({
                where: { id: profile.id },
                data: {
                    balance: { decrement: amount },
                    ...(iban && { iban }),
                    ...(bic && { bic })
                }
            });

            // Create Payout Request
            return await tx.payoutRequest.create({
                data: {
                    affiliateId: profile.id,
                    amount,
                    status: "PENDING",
                    iban: iban || profile.iban,
                    bic: bic || profile.bic
                }
            });
        });

        return NextResponse.json({ success: true, payout });

    } catch (error: any) {
        console.error("PAYOUT_REQUEST_ERROR:", error);
        return NextResponse.json(
            { error: error.message || "Erreur lors de la demande de virement" },
            { status: 500 }
        );
    }
}
