import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") return null
    return session
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ productId: string }> }
) {
    if (!await requireAdmin()) return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    const { productId } = await params
    try {
        const body = await req.json()
        const product = await prisma.product.update({
            where: { id: productId },
            data: {
                ...(body.name !== undefined && { name: body.name }),
                ...(body.description !== undefined && { description: body.description }),
                ...(body.price !== undefined && { price: body.price }),
                ...(body.compareAt !== undefined && { compareAt: body.compareAt }),
                ...(body.images !== undefined && { images: body.images }),
                ...(body.features !== undefined && { features: body.features }),
                ...(body.isPopular !== undefined && { isPopular: body.isPopular }),
                ...(body.type !== undefined && { type: body.type }),
            },
            include: { variants: true }
        })
        revalidatePath("/product", "page")
        return NextResponse.json(product)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ productId: string }> }
) {
    if (!await requireAdmin()) return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    const { productId } = await params
    try {
        await prisma.product.delete({ where: { id: productId } })
        return NextResponse.json({ ok: true })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
