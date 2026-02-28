const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getProduct() {
    const p = await prisma.product.findFirst();
    console.log(p ? p.id : "NO_PRODUCTS");
    process.exit(0);
}
getProduct();
