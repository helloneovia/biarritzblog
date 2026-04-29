import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

export async function getStripeKeys() {
    let dbKeys = null;
    try {
        dbKeys = await prisma.siteConfig.findUnique({ where: { id: "global" } });
    } catch (e) {
        // Fallback if DB is not reachable
    }

    const secretKey = dbKeys?.stripeSecretKey || process.env.STRIPE_SECRET_KEY || "";
    const publicKey = dbKeys?.stripePublicKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
    const webhookSecret = dbKeys?.stripeWebhookSecret || process.env.STRIPE_WEBHOOK_SECRET || "";

    return { secretKey, publicKey, webhookSecret };
}

export async function getStripe() {
    const { secretKey } = await getStripeKeys();
    return new Stripe(secretKey || "dummy_key_for_build", {
        apiVersion: "2026-01-28.clover" as any, // Using latest stable version
        appInfo: {
            name: "Biarritz Store",
            version: "0.1.0",
        },
    });
}
