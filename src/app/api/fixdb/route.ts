import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const messages: string[] = []

    try {
        const config = await prisma.siteConfig.findUnique({ where: { id: "global" } })
        if (config && config.texts) {
            const texts: any = { ...config.texts as any }

            // Fix old broken heroImage URL
            if (texts.heroImage && texts.heroImage.includes("unsplash.com/photo-1608231387042")) {
                texts.heroImage = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2620&auto=format&fit=crop"
                messages.push("Fixed SiteConfig heroImage")
            }

            // Strip base64 data URLs from all locales — they bloat the DB and slow all page loads.
            // Components will fall back to their default URLs automatically.
            let strippedCount = 0;
            for (const locale of ["EN", "FR", "ES"]) {
                if (texts[locale] && typeof texts[locale] === "object") {
                    for (const [key, value] of Object.entries(texts[locale] as Record<string, string>)) {
                        if (typeof value === "string" && value.startsWith("data:")) {
                            (texts[locale] as any)[key] = "";
                            strippedCount++;
                        }
                    }
                }
            }
            // Also check top-level keys (older schema format)
            for (const [key, value] of Object.entries(texts)) {
                if (typeof value === "string" && value.startsWith("data:")) {
                    texts[key] = "";
                    strippedCount++;
                }
            }

            if (strippedCount > 0) {
                await prisma.siteConfig.update({ where: { id: "global" }, data: { texts } })
                messages.push(`Stripped ${strippedCount} base64 data URLs from SiteConfig.texts`)
            }
        }

        const products = await prisma.product.findMany()
        for (const p of products) {
            const validImages = p.images.filter((img) => img && img.trim() !== '' && !img.includes('unsplash.com/photo-1608231387042'))
            const finalImages = validImages.length > 0 ? validImages : ["https://images.unsplash.com/photo-1545648583-b26a5c102c91?q=80&w=2160&auto=format&fit=crop"]
            if (finalImages.length !== p.images.length || p.images.includes('')) {
                await prisma.product.update({ where: { id: p.id }, data: { images: finalImages } })
                messages.push(`Fixed Product ${p.id} images`)
            }
        }

        return NextResponse.json({ success: true, messages })
    } catch (err: any) {
        return NextResponse.json({ error: err.message })
    }
}
