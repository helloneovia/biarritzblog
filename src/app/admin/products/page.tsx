import { prisma } from "@/lib/prisma"
import { SingleProductManager } from "@/components/admin/SingleProductManager"

export const dynamic = "force-dynamic"

export const metadata = { title: "Produit - Admin Biarritz" }

export default async function AdminProductsPage() {
    // Fetch the primary product
    const product = await prisma.product.findFirst({
        where: { type: "MAIN" },
        orderBy: { createdAt: 'desc' },
        include: { variants: true },
    })
    
    // Fetch Upsell products
    const upsells = await prisma.product.findMany({
        where: { type: "UPSELL" },
        orderBy: { createdAt: 'asc' },
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

    const serializedUpsells = upsells.map(u => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
    }))

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Paramètres du Produit & Upsells</h1>
                <p className="text-muted-foreground mt-1">Gérez le produit principal, les prix dégressifs et les multiples offres complémentaires.</p>
            </div>
            <SingleProductManager 
                initialProduct={serializedProduct} 
                initialBundles={bundles} 
                initialUpsellProducts={serializedUpsells}
            />
        </div>
    )
}
