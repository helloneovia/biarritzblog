import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => {
    // During the static Next.js build phase on deployment platforms (Vercel, Dokploy, etc.),
    // DATABASE_URL is frequently missing. Thus, Prisma throws an initialization error.
    // We return a dummy Proxy object to let Next.js safely evaluate server code without connecting to a DB.
    if (process.env.npm_lifecycle_event === "build" || process.env.NEXT_PHASE === "phase-production-build") {
        console.warn("⚠️ Mocking Prisma instantiation during static build phase");
        return new Proxy({}, {
            get: () => {
                return new Proxy({}, { get: () => Promise.resolve() });
            }
        }) as unknown as PrismaClient
    }

    return new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    } as any)
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
