import Stripe from "stripe"

// Remove strict throw for Next.js build compatibility when missing keys
// if (!process.env.STRIPE_SECRET_KEY) {
//     throw new Error("Missing STRIPE_SECRET_KEY in environment variables.")
// }

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_key_for_build", {
    apiVersion: "2026-01-28.clover" as any, // Using latest stable version
    appInfo: {
        name: "StepPrs Store",
        version: "0.1.0",
    },
})
