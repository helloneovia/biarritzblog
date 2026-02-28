import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";
import { sendTicketStatusEmail } from "@/lib/email";

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

        const { status } = await req.json();

        const ticket = await prisma.ticket.update({
            where: {
                id: (await params).id,
            },
            data: {
                status,
            },
            include: {
                user: true
            }
        });

        // Send an email if the status is resolved or closed
        if ((status === "RESOLVED" || status === "CLOSED") && ticket.user?.email) {
            sendTicketStatusEmail(ticket.user.email, ticket.id, status).catch(console.error);
        }

        return NextResponse.json(ticket);
    } catch (error) {
        console.error("Ticket update error:", error);
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour du ticket" },
            { status: 500 }
        );
    }
}
