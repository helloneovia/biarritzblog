import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

// Avoid crashing during static Next.js builds if the DB is offline by only instantiating
// Prisma when actually called or if in development/runtime.
let prismaInstance: PrismaClient;

try {
    prismaInstance = globalForPrisma.prisma || new PrismaClient();
} catch (e) {
    console.warn("Prisma failed to instantiate globally (likely during build). Mocking it.");
    prismaInstance = {} as PrismaClient; // Fallback mock for type safety during static builds
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
