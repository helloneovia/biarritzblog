"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { revalidatePath } from "next/cache"

export async function saveStripeKeys(formData: FormData) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        throw new Error("Non autorisé")
    }

    const stripePublicKey = formData.get("stripePublicKey") as string | null
    const stripeSecretKey = formData.get("stripeSecretKey") as string | null
    const stripeWebhookSecret = formData.get("stripeWebhookSecret") as string | null

    await prisma.siteConfig.upsert({
        where: { id: "global" },
        create: {
            id: "global",
            stripePublicKey,
            stripeSecretKey,
            stripeWebhookSecret
        },
        update: {
            stripePublicKey: stripePublicKey || null,
            stripeSecretKey: stripeSecretKey || null,
            stripeWebhookSecret: stripeWebhookSecret || null
        }
    })

    revalidatePath("/admin/payments")
    revalidatePath("/checkout")
    
    return { success: true }
}
