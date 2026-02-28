import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const config = await prisma.siteConfig.findUnique({ where: { id: "global" } })
    if (config && config.texts) {
        const texts: any = { ...config.texts as any }
        if (texts.heroImage && texts.heroImage.includes("unsplash.com/photo-1608231387042")) {
            texts.heroImage = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2620&auto=format&fit=crop"
            await prisma.siteConfig.update({
                where: { id: "global" },
                data: { texts }
            })
            console.log("Fixed SiteConfig heroImage")
        }
    }

    const products = await prisma.product.findMany()
    for (const p of products) {
        const validImages = p.images.filter((img) => img && img.trim() !== '')
        if (validImages.length !== p.images.length) {
            await prisma.product.update({
                where: { id: p.id },
                data: { images: validImages }
            })
            console.log(`Fixed Product ${p.id} images: removed empty strings`)
        }
    }

    console.log("DB Fix Complete")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
