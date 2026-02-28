import { prisma } from "@/lib/prisma"
import { ProductsManager } from "@/components/admin/ProductsManager"

export const dynamic = "force-dynamic"

export const metadata = { title: "Produits - Admin Biarritz" }

export default async function AdminProductsPage() {
    const [products, bundles] = await Promise.all([
        prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            include: { variants: true },
        }),
        prisma.bundle.findMany({ orderBy: { quantity: 'asc' } }),
    ])

    const serializedProducts = products.map(p => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        variants: p.variants.map(v => ({
            ...v,
            createdAt: v.createdAt.toISOString(),
            updatedAt: v.updatedAt.toISOString(),
        }))
    }))

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Produits & Offres</h1>
                <p className="text-muted-foreground mt-1">Gérez votre catalogue produits et les offres bundles.</p>
            </div>
            <ProductsManager initialProducts={serializedProducts} initialBundles={bundles} />
        </div>
    )
}
