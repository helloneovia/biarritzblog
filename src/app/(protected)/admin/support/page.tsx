import { prisma } from "@/lib/prisma";
import { TicketsManager } from "@/components/admin/TicketsManager";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
    const tickets = await prisma.ticket.findMany({
        orderBy: {
            updatedAt: 'desc'
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            messages: {
                orderBy: {
                    createdAt: 'asc'
                }
            }
        }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Support Client</h1>
                <p className="text-muted-foreground mt-2">
                    Gérez l'ensemble des tickets de support, répondez aux clients et clôturez les demandes.
                </p>
            </div>

            <TicketsManager initialTickets={tickets} />
        </div>
    );
}
