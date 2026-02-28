import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET() {
    try {
        const email = "admin@biarritz.blog"
        const password = "AdminPassword123!"
        const hashedPassword = await bcrypt.hash(password, 10)

        const admin = await prisma.user.upsert({
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

        await prisma.siteConfig.upsert({
            where: { id: 'global' },
            update: {},
            create: {
                id: 'global',
            }
        })

        return NextResponse.json({ message: "Admin and Config synced successfully", email })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
