import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 403 }
            );
        }

        const { status, trackingNumber, trackingUrl } = await req.json();

        const order = await prisma.order.update({
            where: {
                id: (await params).id,
            },
            data: {
                status,
                trackingNumber,
                trackingUrl,
            },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error("Order update error:", error);
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour de la commande" },
            { status: 500 }
        );
    }
}
