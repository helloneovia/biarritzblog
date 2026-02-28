import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function GET() {
    try {
        const localPrisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                },
            },
        } as any)

        const testQuery = await localPrisma.user.findFirst()
        await localPrisma.$disconnect()

        return NextResponse.json({ status: "success", user: testQuery })
    } catch (e: any) {
        return NextResponse.json({ status: "failed", error: e.message, stack: e.stack })
    }
}
