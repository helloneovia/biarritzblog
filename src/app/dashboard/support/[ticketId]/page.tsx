import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { TicketConversation } from "../TicketConversation"

export const dynamic = "force-dynamic"

export default async function TicketDetailPage({
    params,
}: {
    params: Promise<{ ticketId: string }>
}) {
    const { ticketId } = await params
    const session = await getServerSession(authOptions)

    const ticket = await prisma.ticket.findFirst({
        where: { id: ticketId, userId: session?.user?.id },
        include: {
            messages: {
                orderBy: { createdAt: 'asc' },
            },
            user: { select: { id: true, name: true } },
        },
    })

    if (!ticket) notFound()

    const messages = ticket.messages.map(m => ({
        id: m.id,
        content: m.content,
        senderId: m.senderId,
        createdAt: m.createdAt.toISOString(),
        isCurrentUser: m.senderId === session?.user?.id,
        senderName: m.senderId === session?.user?.id ? 'Vous' : 'Support StepPrs',
    }))

    const statusColors: Record<string, string> = {
        OPEN: 'bg-green-100 text-green-700',
        RESOLVED: 'bg-gray-100 text-gray-700',
        CLOSED: 'bg-gray-100 text-gray-700',
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/support" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Retour aux tickets
                </Link>
            </div>

            <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div>
                        <h1 className="text-2xl font-extrabold mb-1">{ticket.subject}</h1>
                        <p className="text-sm text-muted-foreground">
                            Ouvert le {new Date(ticket.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <span className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase self-start sm:self-auto ${statusColors[ticket.status] || 'bg-gray-100 text-gray-700'}`}>
                        {ticket.status}
                    </span>
                </div>

                <div className="p-6">
                    <TicketConversation
                        ticketId={ticket.id}
                        initialMessages={messages}
                        currentUserId={session?.user?.id || ""}
                    />
                </div>
            </div>
        </div>
    )
}
