import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { prisma } from "@/lib/prisma"
import { MessageCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function SupportPage() {
    const session = await getServerSession(authOptions)

    // Fetch tickets for this user
    const tickets = await prisma.ticket.findMany({
        where: { userId: session?.user?.id },
        orderBy: { updatedAt: 'desc' },
        include: { messages: true }
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center sm:flex-row flex-col sm:gap-0 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold mb-2">Support Tickets</h1>
                    <p className="text-muted-foreground">Open a new ticket or check the status of your existing requests.</p>
                </div>
                <Button className="rounded-xl font-bold">
                    <Plus className="mr-2 h-4 w-4" /> New Request
                </Button>
            </div>

            {tickets.length === 0 ? (
                <div className="bg-card rounded-3xl p-12 mt-8 text-center border shadow-sm flex flex-col items-center justify-center">
                    <div className="h-16 w-16 bg-muted text-muted-foreground rounded-full flex items-center justify-center mb-4">
                        <MessageCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No active tickets</h3>
                    <p className="text-muted-foreground">You don't have any support requests. Click "New Request" if you need help.</p>
                </div>
            ) : (
                <div className="space-y-4 mt-8">
                    {tickets.map((ticket: any) => (
                        <div key={ticket.id} className="bg-card rounded-2xl border shadow-sm p-6 cursor-pointer hover:border-primary/50 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold text-lg">{ticket.subject}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? 'bg-gray-100 text-gray-700' :
                                        'bg-green-100 text-green-700'
                                        }`}>
                                        {ticket.status}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Last message: {ticket.messages.length > 0 ? new Date(ticket.messages[ticket.messages.length - 1].createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>

                            <div className="text-sm font-medium text-muted-foreground bg-muted px-4 py-2 rounded-lg text-center">
                                {ticket.messages.length} message(s)
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
