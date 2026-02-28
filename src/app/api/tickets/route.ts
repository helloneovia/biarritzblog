import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    try {
        const { subject, message } = await req.json()

        if (!subject?.trim() || !message?.trim()) {
            return NextResponse.json({ error: "Sujet et message requis" }, { status: 400 })
        }

        const ticket = await prisma.ticket.create({
            data: {
                subject: subject.trim(),
                status: "OPEN",
                userId: session.user.id,
                messages: {
                    create: {
                        content: message.trim(),
                        senderId: session.user.id,
                    }
                }
            },
            include: {
                messages: true,
            }
        })

        return NextResponse.json({
            ...ticket,
            updatedAt: ticket.updatedAt.toISOString(),
            messages: ticket.messages.map(m => ({
                ...m,
                createdAt: m.createdAt.toISOString(),
            }))
        })

    } catch (error: any) {
        console.error("Ticket creation error:", error)
        return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 })
    }
}

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const tickets = await prisma.ticket.findMany({
        where: { userId: session.user.id },
        orderBy: { updatedAt: 'desc' },
        include: { messages: true }
    })

    return NextResponse.json(tickets.map(t => ({
        ...t,
        updatedAt: t.updatedAt.toISOString(),
        messages: t.messages.map(m => ({ ...m, createdAt: m.createdAt.toISOString() }))
    })))
}
