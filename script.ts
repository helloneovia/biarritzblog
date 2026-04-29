import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const orange = await prisma.product.create({
    data: {
      name: "Semelles Biarritz - Édition Orange",
      description: "<p>Nouvelle édition Orange dynamique pour un confort optimal.</p>",
      price: 29.90,
      compareAt: 49.90,
      images: ["/product/orange-1.png"],
      type: "MAIN",
      features: ["✔ Design respirant", "✔ Absorption des chocs"]
    }
  })
  console.log("Created:", orange)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
