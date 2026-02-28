import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ ticketId: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { ticketId } = await params

    // Ensure ticket belongs to this user
    const ticket = await prisma.ticket.findFirst({
        where: { id: ticketId, userId: session.user.id },
    })
    if (!ticket) {
        return NextResponse.json({ error: "Ticket non trouvé" }, { status: 404 })
    }

    try {
        const { content } = await req.json()
        if (!content?.trim()) {
            return NextResponse.json({ error: "Message vide" }, { status: 400 })
        }

        const message = await prisma.message.create({
            data: {
                ticketId,
                senderId: session.user.id,
                content: content.trim(),
            },
        })

        // Reopen ticket if resolved/closed
        if (ticket.status !== "OPEN") {
            await prisma.ticket.update({
                where: { id: ticketId },
                data: { status: "OPEN" },
            })
        }

        return NextResponse.json({
            ...message,
            createdAt: message.createdAt.toISOString(),
        })
    } catch (error: any) {
        console.error("Message creation error:", error)
        return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 })
    }
}
