import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { firstName, lastName, email, orderNumber, message } = body;

        if (!email || !message) {
            return NextResponse.json({ error: "Email et message requis." }, { status: 400 });
        }

        const subject = orderNumber
            ? `Message Contact - Commande ${orderNumber}`
            : `Nouveau Message Contact`;

        // Check if user exists, otherwise create a stub account for the ticket system
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-10), 10);
            user = await prisma.user.create({
                data: {
                    email,
                    name: `${firstName || ''} ${lastName || ''}`.trim() || 'Guest User',
                    password: randomPassword,
                    role: "USER"
                }
            });
        }

        // Create the Support Ticket
        const ticket = await prisma.ticket.create({
            data: {
                userId: user.id,
                subject: subject,
                status: "OPEN",
                messages: {
                    create: {
                        senderId: user.id,
                        content: message
                    }
                }
            }
        });

        return NextResponse.json({ success: true, ticketId: ticket.id });
    } catch (error) {
        console.error("Contact API Error:", error);
        return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
    }
}
