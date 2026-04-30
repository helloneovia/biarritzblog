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
    { params }: { params: Promise<{ bundleId: string }> }
) {
    if (!await requireAdmin()) return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    const { bundleId } = await params
    try {
        const { name, price, compareAt, discount, badge } = await req.json()
        const bundle = await prisma.bundle.update({
            where: { id: bundleId },
            data: {
                ...(name !== undefined && { name }),
                ...(price !== undefined && { price }),
                ...(compareAt !== undefined && { compareAt }),
                ...(discount !== undefined && { discount }),
                ...(badge !== undefined && { badge }),
            }
        })
        revalidatePath("/product-orange", "page")
        return NextResponse.json(bundle)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
