"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Package, Tag, Star, AlertTriangle } from "lucide-react";

type Product = {
    id: string; name: string; description: string; price: number; compareAt: number | null;
    images: string[]; features: string[]; isPopular: boolean;
    variants: { id: string; size: string | null; color: string | null; sku: string; stock: number }[];
};
type Bundle = {
    id: string; name: string; quantity: number; price: number; compareAt: number | null;
    discount: number; badge: string | null;
};

function StockBadge({ total }: { total: number }) {
    if (total === 0) return <Badge className="bg-red-100 text-red-700">Rupture</Badge>;
    if (total < 10) return <Badge className="bg-yellow-100 text-yellow-700">{total} restants</Badge>;
    return <Badge className="bg-green-100 text-green-700">En stock ({total})</Badge>;
}

export function ProductsManager({ initialProducts, initialBundles }: {
    initialProducts: Product[]; initialBundles: Bundle[];
}) {
    const [products, setProducts] = useState(initialProducts);
    const [bundles, setBundles] = useState(initialBundles);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [editBundle, setEditBundle] = useState<Bundle | null>(null);
    const [newProduct, setNewProduct] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [tab, setTab] = useState<"products" | "bundles">("products");

    // Product form state
    const [pName, setPName] = useState("");
    const [pDesc, setPDesc] = useState("");
    const [pPrice, setPPrice] = useState("");
    const [pCompare, setPCompare] = useState("");
    const [pImages, setPImages] = useState("");

    const openEditProduct = (p: Product) => {
        setEditProduct(p);
        setPName(p.name); setPDesc(p.description);
        setPPrice(String(p.price)); setPCompare(String(p.compareAt ?? ""));
        setPImages(p.images.join(", "));
    };

    const openNewProduct = () => {
        setEditProduct(null); setNewProduct(true);
        setPName(""); setPDesc(""); setPPrice(""); setPCompare(""); setPImages("");
    };

    const saveProduct = async () => {
        setSaving(true);
        const body = {
            name: pName, description: pDesc,
            price: parseFloat(pPrice), compareAt: pCompare ? parseFloat(pCompare) : null,
            images: pImages.split(",").map(s => s.trim()).filter(Boolean),
        };
        try {
            const url = editProduct ? `/api/admin/products/${editProduct.id}` : "/api/admin/products";
            const method = editProduct ? "PATCH" : "POST";
            const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            if (!res.ok) throw new Error("Erreur");
            const data = await res.json();
            if (editProduct) {
                setProducts(products.map(p => p.id === data.id ? { ...p, ...data } : p));
            } else {
                setProducts([data, ...products]);
            }
            setEditProduct(null); setNewProduct(false);
        } catch { alert("Erreur lors de la sauvegarde."); }
        setSaving(false);
    };

    const deleteProduct = async (id: string) => {
        try {
            await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
            setProducts(products.filter(p => p.id !== id));
            setDeleteConfirm(null);
        } catch { alert("Erreur lors de la suppression."); }
    };

    const saveBundle = async () => {
        if (!editBundle) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/bundles/${editBundle.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editBundle.name,
                    price: editBundle.price,
                    compareAt: editBundle.compareAt,
                    discount: editBundle.discount,
                    badge: editBundle.badge,
                }),
            });
            if (!res.ok) throw new Error("Erreur");
            const data = await res.json();
            setBundles(bundles.map(b => b.id === data.id ? data : b));
            setEditBundle(null);
        } catch { alert("Erreur lors de la sauvegarde du bundle."); }
        setSaving(false);
    };

    const totalStock = (p: Product) => p.variants.reduce((s, v) => s + v.stock, 0);

    return (
        <div className="space-y-6">
            {/* Tab switcher */}
            <div className="flex gap-2 border-b pb-4">
                <button
                    onClick={() => setTab("products")}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === "products" ? "bg-indigo-600 text-white" : "bg-muted hover:bg-muted/80 text-muted-foreground"}`}
                >
                    <Package className="h-4 w-4 inline mr-1.5" />Produits ({products.length})
                </button>
                <button
                    onClick={() => setTab("bundles")}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === "bundles" ? "bg-indigo-600 text-white" : "bg-muted hover:bg-muted/80 text-muted-foreground"}`}
                >
                    <Tag className="h-4 w-4 inline mr-1.5" />Bundles ({bundles.length})
                </button>
            </div>

            {/* === PRODUCTS TAB === */}
            {tab === "products" && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold">Catalogue Produits</h2>
                        <Button onClick={openNewProduct} className="rounded-xl">
                            <Plus className="h-4 w-4 mr-2" /> Nouveau produit
                        </Button>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground border rounded-2xl">
                            Aucun produit. Créez votre premier produit.
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {products.map(p => (
                                <div key={p.id} className="bg-card border rounded-2xl p-5 flex justify-between items-start gap-4">
                                    <div className="flex gap-4">
                                        {p.images[0] && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={p.images[0]} alt={p.name} className="w-16 h-16 rounded-xl object-cover border" />
                                        )}
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold">{p.name}</h3>
                                                {p.isPopular && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{p.description}</p>
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-indigo-700">€{p.price}</span>
                                                {p.compareAt && <span className="text-sm text-muted-foreground line-through">€{p.compareAt}</span>}
                                                <StockBadge total={totalStock(p)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <Button variant="outline" size="sm" onClick={() => openEditProduct(p)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => setDeleteConfirm(p.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* === BUNDLES TAB === */}
            {tab === "bundles" && (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold">Gestion des Offres & Bundles</h2>
                    <p className="text-sm text-muted-foreground">Modifiez les prix et noms des packs affichés sur la page produit.</p>
                    <div className="grid gap-4">
                        {bundles.length === 0 ? (
                            <p className="text-center py-8 text-muted-foreground border rounded-2xl">Aucun bundle configuré.</p>
                        ) : (
                            bundles.map(b => (
                                <div key={b.id} className="bg-card border rounded-2xl p-5 flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold">{b.name}</h3>
                                            {b.badge && <Badge className="bg-indigo-100 text-indigo-700 text-xs">{b.badge}</Badge>}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{b.quantity} paire(s) · Remise: {b.discount}%</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="font-bold text-indigo-700">€{b.price}</span>
                                            {b.compareAt && <span className="text-sm text-muted-foreground line-through">€{b.compareAt}</span>}
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => setEditBundle({ ...b })}>
                                        <Edit className="h-4 w-4 mr-1" /> Modifier
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* === EDIT/CREATE PRODUCT MODAL === */}
            <Dialog open={!!(editProduct || newProduct)} onOpenChange={(o) => { if (!o) { setEditProduct(null); setNewProduct(false); } }}>
                <DialogContent className="sm:max-w-[520px]">
                    <DialogHeader>
                        <DialogTitle>{editProduct ? "Modifier le produit" : "Nouveau produit"}</DialogTitle>
                        <DialogDescription>Remplissez les informations du produit.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div>
                            <label className="text-sm font-medium block mb-1">Nom du produit</label>
                            <Input value={pName} onChange={e => setPName(e.target.value)} placeholder="Ex: Semelles StepPrs Premium" />
                        </div>
                        <div>
                            <label className="text-sm font-medium block mb-1">Description</label>
                            <Input value={pDesc} onChange={e => setPDesc(e.target.value)} placeholder="Description courte du produit" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium block mb-1">Prix (€)</label>
                                <Input type="number" value={pPrice} onChange={e => setPPrice(e.target.value)} placeholder="39.00" />
                            </div>
                            <div>
                                <label className="text-sm font-medium block mb-1">Prix barré (€)</label>
                                <Input type="number" value={pCompare} onChange={e => setPCompare(e.target.value)} placeholder="59.00" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium block mb-1">Images (URLs séparées par des virgules)</label>
                            <Input value={pImages} onChange={e => setPImages(e.target.value)} placeholder="https://..." />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => { setEditProduct(null); setNewProduct(false); }}>Annuler</Button>
                        <Button onClick={saveProduct} disabled={saving || !pName || !pPrice}>
                            {saving ? "Sauvegarde..." : "Enregistrer"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* === EDIT BUNDLE MODAL === */}
            <Dialog open={!!editBundle} onOpenChange={(o) => { if (!o) setEditBundle(null); }}>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>Modifier le bundle</DialogTitle>
                    </DialogHeader>
                    {editBundle && (
                        <div className="space-y-4 py-2">
                            <div>
                                <label className="text-sm font-medium block mb-1">Nom</label>
                                <Input value={editBundle.name} onChange={e => setEditBundle({ ...editBundle, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-medium block mb-1">Badge (ex: Most Popular)</label>
                                <Input value={editBundle.badge ?? ""} onChange={e => setEditBundle({ ...editBundle, badge: e.target.value || null })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium block mb-1">Prix (€)</label>
                                    <Input type="number" value={editBundle.price} onChange={e => setEditBundle({ ...editBundle, price: parseFloat(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium block mb-1">Prix barré (€)</label>
                                    <Input type="number" value={editBundle.compareAt ?? ""} onChange={e => setEditBundle({ ...editBundle, compareAt: parseFloat(e.target.value) || null })} />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium block mb-1">Remise (%)</label>
                                <Input type="number" value={editBundle.discount} onChange={e => setEditBundle({ ...editBundle, discount: parseFloat(e.target.value) })} />
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setEditBundle(null)}>Annuler</Button>
                        <Button onClick={saveBundle} disabled={saving}>
                            {saving ? "Sauvegarde..." : "Enregistrer"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* === DELETE CONFIRM === */}
            <Dialog open={!!deleteConfirm} onOpenChange={(o) => { if (!o) setDeleteConfirm(null); }}>
                <DialogContent className="sm:max-w-[380px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" /> Supprimer le produit
                        </DialogTitle>
                        <DialogDescription>
                            Cette action est irréversible. Le produit sera définitivement supprimé.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
                        <Button variant="destructive" onClick={() => deleteConfirm && deleteProduct(deleteConfirm)}>
                            Supprimer définitivement
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
