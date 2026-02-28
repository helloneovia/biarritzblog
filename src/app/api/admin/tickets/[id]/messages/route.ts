import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";

export async function POST(
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

        const { content } = await req.json();

        if (!content) {
            return NextResponse.json(
                { error: "Le contenu du message est requis" },
                { status: 400 }
            );
        }

        // Insert message
        const message = await prisma.message.create({
            data: {
                ticketId: (await params).id,
                senderId: session.user.id,
                content,
            },
        });

        // Make sure the ticket is marked OPEN if it was CLOSED and an admin replies
        await prisma.ticket.update({
            where: { id: (await params).id },
            data: {
                status: "OPEN",
                updatedAt: new Date() // Bump the exact time of last activity
            }
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error("Ticket message error:", error);
        return NextResponse.json(
            { error: "Erreur lors de l'envoi du message" },
            { status: 500 }
        );
    }
}
