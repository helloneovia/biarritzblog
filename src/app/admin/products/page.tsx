import { prisma } from "@/lib/prisma"
import { SingleProductManager } from "@/components/admin/SingleProductManager"

export const dynamic = "force-dynamic"

export const metadata = { title: "Produit - Admin Biarritz" }

export default async function AdminProductsPage() {
    // Fetch the primary product and the first bundle (upsell)
    const product = await prisma.product.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { variants: true },
    })
    
    // We assume the upsell is either the first bundle, or you specifically want to target a quantity. We'll pick the the highest discount or first one.
    const bundle = await prisma.bundle.findFirst({
        orderBy: { quantity: 'asc' }, // usually the first one is the lowest quantity upsell
        skip: product ? 0 : 0 // just simple findFirst
    })

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
                <p className="text-muted-foreground mt-1">Gérez les informations de votre produit unique et de son upsell.</p>
            </div>
            <SingleProductManager initialProduct={serializedProduct} initialBundle={bundle} />
        </div>
    )
}
