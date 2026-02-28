import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { prisma } from "@/lib/prisma"
import { SupportPageClient } from "./SupportPageClient"

export const dynamic = "force-dynamic"

export default async function SupportPage() {
    const session = await getServerSession(authOptions)

    const tickets = await prisma.ticket.findMany({
        where: { userId: session?.user?.id },
        orderBy: { updatedAt: 'desc' },
        include: { messages: true }
    })

    return (
        <SupportPageClient
            tickets={tickets.map(t => ({
                ...t,
                updatedAt: t.updatedAt.toISOString(),
                messages: t.messages.map(m => ({ ...m, createdAt: m.createdAt.toISOString() }))
            }))}
            userId={session?.user?.id || ""}
        />
    )
}
