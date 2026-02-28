import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function GET() {
    // Prevent Next.js from crashing the build if it tries to statically evaluate this route
    if (!process.env.DATABASE_URL) {
        return NextResponse.json({ error: "No database configured" }, { status: 500 })
    }

    const localPrisma = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    } as any)

    try {
        const email = "admin@biarritz.blog"
        const password = "AdminPassword123!"
        const hashedPassword = await bcrypt.hash(password, 10)

        const admin = await localPrisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                role: 'ADMIN',
            },
            create: {
                email,
                password: hashedPassword,
                name: 'Super Admin',
                role: 'ADMIN',
            },
        })

        await localPrisma.siteConfig.upsert({
            where: { id: 'global' },
            update: {},
            create: {
                id: 'global',
            }
        })

        return NextResponse.json({ message: "Admin and Config synced successfully", email })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    } finally {
        await localPrisma.$disconnect()
    }
}
