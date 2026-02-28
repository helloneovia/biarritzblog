const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const email = "admin@biarritz.blog"
    const password = "AdminPassword123!" // Super secure Default
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

    // Create default configs
    await prisma.siteConfig.upsert({
        where: { id: 'global' },
        update: {},
        create: {
            id: 'global',
        }
    })

    console.log('✅ Default Admin created:', admin.email)
    console.log('🔑 Password:', password)
    console.log('✅ Global Config initialized')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
