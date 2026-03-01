import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Cleaning old products and bundles...")
    await prisma.orderItem.deleteMany({})
    await prisma.variant.deleteMany({})
    await prisma.review.deleteMany({})
    await prisma.product.deleteMany({})
    await prisma.bundle.deleteMany({})

    console.log("Creating new Temu Product: Semelles Magnétiques d'Acupression...")
    const product = await prisma.product.create({
        data: {
            name: "Semelles Magnétiques d'Acupression",
            description: "Semelles d'acupression magnétiques conçues pour un confort maximal. Support ergonomique de la voûte plantaire, matériau EVA souple et découpe facile à la taille de vos chaussures.",
            price: 39,
            compareAt: 59,
            images: [
                "https://img.kwcdn.com/product/fancy/836fdfd6-1245-4b68-a2d7-eee56aac0861.jpg",
                "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop", // Fallback aesthetic
                "https://images.unsplash.com/photo-1545648583-b26a5c102c91?q=80&w=1200&auto=format&fit=crop"
            ],
            features: [
                "Nœuds magnétiques stimulants",
                "Matériau EVA respirant",
                "Découpe universelle facile",
                "Support de voûte plantaire"
            ],
            isPopular: true
        }
    })

    console.log("Creating bundles...")
    await prisma.bundle.createMany({
        data: [
            {
                name: "1 Paire",
                quantity: 1,
                price: 39,
                compareAt: 59,
                discount: 33,
                badge: "Idéal pour essayer"
            },
            {
                name: "2 Paires",
                quantity: 2,
                price: 59,
                compareAt: 118,
                discount: 50,
                badge: "ÉCONOMISEZ 50%"
            },
            {
                name: "3 Paires",
                quantity: 3,
                price: 75,
                compareAt: 177,
                discount: 57,
                badge: "CURE INTÉGRALE"
            }
        ]
    })

    console.log("Success! Products seeded.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
