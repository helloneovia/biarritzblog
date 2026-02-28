import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = "admin@biarritz.blog"
    const password = "AdminPassword123!"
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
