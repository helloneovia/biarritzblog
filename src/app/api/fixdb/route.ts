import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const messages: string[] = []

    try {
        const config = await prisma.siteConfig.findUnique({ where: { id: "global" } })
        if (config && config.texts) {
            const texts: any = { ...config.texts as any }
            if (texts.heroImage && texts.heroImage.includes("unsplash.com/photo-1608231387042")) {
                texts.heroImage = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2620&auto=format&fit=crop"
                await prisma.siteConfig.update({
                    where: { id: "global" },
                    data: { texts }
                })
                messages.push("Fixed SiteConfig heroImage")
            }
        }

        const products = await prisma.product.findMany()
        for (const p of products) {
            const validImages = p.images.filter((img) => img && img.trim() !== '' && !img.includes('unsplash.com/photo-1608231387042'))
            const finalImages = validImages.length > 0 ? validImages : ["https://images.unsplash.com/photo-1545648583-b26a5c102c91?q=80&w=2160&auto=format&fit=crop"]
            if (finalImages.length !== p.images.length || p.images.includes('')) {
                await prisma.product.update({
                    where: { id: p.id },
                    data: { images: finalImages }
                })
                messages.push(`Fixed Product ${p.id} images`)
            }
        }

        return NextResponse.json({ success: true, messages })
    } catch (err: any) {
        return NextResponse.json({ error: err.message })
    }
}
