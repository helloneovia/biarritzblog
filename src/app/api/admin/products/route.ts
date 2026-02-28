import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

async function requireAdmin() {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") return null
    return session
}

export async function GET() {
    if (!await requireAdmin()) return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: { variants: true }
    })
    return NextResponse.json(products)
}

export async function POST(req: Request) {
    if (!await requireAdmin()) return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    try {
        const { name, description, price, compareAt, images, features, isPopular } = await req.json()
        if (!name || !price) return NextResponse.json({ error: "Nom et prix requis" }, { status: 400 })

        const product = await prisma.product.create({
            data: { name, description: description || "", price, compareAt: compareAt ?? null, images: images || [], features: features || [], isPopular: isPopular ?? false },
            include: { variants: true }
        })
        return NextResponse.json(product)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
