import { prisma } from "@/lib/prisma"
import { SingleProductManager } from "@/components/admin/SingleProductManager"
import Link from "next/link"

export const dynamic = "force-dynamic"

export const metadata = { title: "Produits - Admin Biarritz" }

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
    // Resolve searchParams (Next.js 15+ requires awaiting searchParams)
    const params = await searchParams;
    const selectedId = params?.id;

    // Fetch ALL primary products
    let allProducts = await prisma.product.findMany({
        where: { type: "MAIN" },
        orderBy: { createdAt: 'asc' },
    })

    // Auto-create the Orange Edition if it doesn't exist yet
    const hasOrange = allProducts.some(p => p.name.includes("Orange"));
    if (!hasOrange) {
        const orangeProduct = await prisma.product.create({
            data: {
                name: "Semelles Biarritz - Édition Orange",
                description: "<p>Nouvelle édition Orange dynamique.</p>",
                price: 29.90,
                compareAt: 49.90,
                images: [],
                type: "MAIN"
            }
        });
        allProducts.push(orangeProduct);
    }

    const targetId = selectedId || allProducts[0]?.id;

    // Fetch the specific product to edit
    const product = targetId ? await prisma.product.findUnique({
        where: { id: targetId },
        include: { variants: true },
    }) : null;
    
    // Fetch Upsell products
    const upsells = await prisma.product.findMany({
        where: { type: "UPSELL" },
        orderBy: { createdAt: 'asc' },
    })
    
    // Fetch all bundles (e.g. quantities 1, 2, 3)
    const bundles = await prisma.bundle.findMany({
        orderBy: { quantity: 'asc' },
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

    const serializedUpsells = upsells.map(u => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
    }))

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Paramètres du Produit & Upsells</h1>
                <p className="text-muted-foreground mt-1">Gérez le catalogue, les prix dégressifs et les multiples offres complémentaires.</p>
            </div>

            {allProducts.length > 1 && (
                <div className="bg-white p-4 rounded-2xl border shadow-sm flex items-center gap-4">
                    <label className="font-semibold text-sm text-gray-700">Produit en cours d'édition :</label>
                    <div className="flex flex-wrap gap-2">
                        {allProducts.map(p => (
                            <Link 
                                key={p.id} 
                                href={`/admin/products?id=${p.id}`}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                    p.id === targetId 
                                    ? 'bg-indigo-600 text-white shadow-md' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {p.name || 'Produit sans nom'}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {serializedProduct ? (
                <SingleProductManager 
                    key={serializedProduct.id}
                    initialProduct={serializedProduct} 
                    initialBundles={bundles} 
                    initialUpsellProducts={serializedUpsells}
                />
            ) : (
                <div className="text-center p-12 bg-white rounded-3xl border text-muted-foreground">
                    Aucun produit principal trouvé.
                </div>
            )}
        </div>
    )
}
