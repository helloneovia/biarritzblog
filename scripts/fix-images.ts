import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const config = await prisma.siteConfig.findUnique({ where: { id: 'global' } })
    if (!config) {
        console.log('No SiteConfig found, skipping.')
        return
    }

    const existingTexts = (config.texts as Record<string, string>) || {}

    const updatedTexts = {
        ...existingTexts,
        lifestyle1: '/insole-running.png',
        lifestyle2: '/insole-daily.png',
        lifestyle3: '/insole-work.png',
        scienceImage: '/insole-science.png',
    }

    await prisma.siteConfig.update({
        where: { id: 'global' },
        data: { texts: updatedTexts },
    })

    console.log('Updated lifestyle1, lifestyle2, lifestyle3, scienceImage to local images.')
    await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
