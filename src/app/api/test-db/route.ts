import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function GET() {
    try {
        const localPrisma = new PrismaClient()

        const testQuery = await localPrisma.user.findFirst()
        const recentOrders = await localPrisma.order.findMany({ take: 5, orderBy: { createdAt: 'desc' } })

        // Ensure global logs trace exists
        const logs = (global as any).__WEBHOOK_LOGS__ || [];

        await localPrisma.$disconnect()

        return NextResponse.json({
            status: "success",
            user: testQuery,
            recentOrders,
            webhookLogs: logs
        })
    } catch (e: any) {
        return NextResponse.json({ status: "failed", error: e.message, stack: e.stack })
    }
}
