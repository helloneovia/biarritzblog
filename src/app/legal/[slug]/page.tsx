import { notFound } from "next/navigation"

const policies: Record<string, { title: string, content: React.ReactNode }> = {
    "terms": {
        title: "Terms and Conditions (CGV)",
        content: (
            <>
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <h2>1. Introduction</h2>
                <p>Welcome to StepPrs. By accessing our website and purchasing our orthopaedic insoles, you agree to these Terms and Conditions.</p>
                <h2>2. Purchases and Payment</h2>
                <p>All payments are securely processed via Stripe. Prices are subject to change, but changes will not affect orders that have already been accepted.</p>
                <h2>3. Shipping</h2>
                <p>We aim to dispatch all orders within 24-48 hours. Delivery times vary based on your location but typically take 3-7 business days.</p>
                <h2>4. Returns</h2>
                <p>Please refer to our Returns Policy for detailed information on our 30-day money-back guarantee.</p>
            </>
        )
    },
    "privacy": {
        title: "Privacy Policy",
        content: (
            <>
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <h2>1. Data Collection</h2>
                <p>We collect essential information (name, email, shipping address) necessary to process your order and provide customer support.</p>
                <h2>2. Data Usage</h2>
                <p>Your data is exclusively used for fulfilling orders, sending tracking information, and optionally for marketing if you subscribe to our newsletter.</p>
                <h2>3. Third Parties</h2>
                <p>We do not sell your data. We share necessary data with trusted partners like Stripe (for payments) and shipping providers.</p>
                <h2>4. Cookies</h2>
                <p>We use cookies (Google Analytics 4, Meta Pixel) to track site performance and measure marketing effectiveness. You can opt-out via your browser settings.</p>
            </>
        )
    },
    "returns": {
        title: "Returns and Refund Policy",
        content: (
            <>
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <h2>30-Day Comfort Guarantee</h2>
                <p>We want you to be completely satisfied with your StepPrs insoles. If you do not experience the pain relief and comfort you expected, you may return them within 30 days of delivery.</p>
                <h2>Condition of Returns</h2>
                <p>Insoles can be returned even if they have been worn or trimmed to fit your shoes, provided they are clean and accompanied by the original packaging.</p>
                <h2>How to initiate a return</h2>
                <p>Please contact our support team at support@steppprs.com with your order number. We will provide you with a return shipping label and instructions.</p>
                <h2>Refund Processing</h2>
                <p>Once we receive your return, refunds are processed back to the original method of payment within 5-7 business days.</p>
            </>
        )
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const p = await params;
    const policy = policies[p.slug]
    if (!policy) return { title: "Not Found" }
    return { title: `${policy.title} - StepPrs` }
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
    const p = await params;
    const policy = policies[p.slug]

    if (!policy) {
        notFound()
    }

    return (
        <div className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
            <h1 className="text-4xl font-extrabold tracking-tight mb-8">{policy.title}</h1>
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:mt-8 prose-p:text-muted-foreground prose-a:text-primary">
                {policy.content}
            </div>
        </div>
    )
}
