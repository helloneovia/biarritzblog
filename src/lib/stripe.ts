import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY in environment variables.")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-01-28.clover" as any, // Using latest stable version
    appInfo: {
        name: "StepPrs Store",
        version: "0.1.0",
    },
})
