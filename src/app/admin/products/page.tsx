import { prisma } from "@/lib/prisma"
import { SingleProductManager } from "@/components/admin/SingleProductManager"

export const dynamic = "force-dynamic"

export const metadata = { title: "Produit - Admin Biarritz" }

export default async function AdminProductsPage() {
    // Fetch the primary product
    const product = await prisma.product.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { variants: true },
    })
    
    // Fetch all bundles (e.g. quantities 1, 2, 3)
    const bundles = await prisma.bundle.findMany({
        orderBy: { quantity: 'asc' },
    })

    // Fetch site config for stripe cross-sell ID
    const siteConfig = await prisma.siteConfig.findUnique({
        where: { id: "global" }
    })
    const texts = (siteConfig?.texts as Record<string, any>) || {}

    const serializedProduct = product ? {
        ...product,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        variants: product.variants.map(v => ({
            ...v,
            createdAt: v.createdAt.toISOString(),
            updatedAt: v.updatedAt.toISOString(),
        }))
    } : null

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Paramètres du Produit</h1>
                <p className="text-muted-foreground mt-1">Gérez les informations de votre produit unique, les prix dégressifs et l'upsell Stripe.</p>
            </div>
            <SingleProductManager 
                initialProduct={serializedProduct} 
                initialBundles={bundles} 
                initialUpsell={{
                    active: texts?.upsellActive ?? false,
                    title: texts?.upsellTitle || "Livraison Express",
                    price: texts?.upsellPrice || 9.99
                }}
            />
        </div>
    )
}
