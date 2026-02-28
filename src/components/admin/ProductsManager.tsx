"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
    Plus, Edit, Trash2, Package, Tag, Star, AlertTriangle, UploadCloud, Image as ImageIcon, Video, X
} from "lucide-react";

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
    if (total === 0) return <Badge variant="destructive" className="bg-red-500">Rupture</Badge>;
    if (total < 10) return <Badge className="bg-orange-500 hover:bg-orange-600">{total} restants</Badge>;
    return <Badge className="bg-emerald-500 hover:bg-emerald-600">En stock ({total})</Badge>;
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
    const [uploading, setUploading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [tab, setTab] = useState<"products" | "bundles">("products");

    // Product form state
    const [pName, setPName] = useState("");
    const [pDesc, setPDesc] = useState("");
    const [pPrice, setPPrice] = useState("");
    const [pCompare, setPCompare] = useState("");
    const [pImages, setPImages] = useState<string[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const openEditProduct = (p: Product) => {
        setEditProduct(p);
        setPName(p.name); setPDesc(p.description);
        setPPrice(String(p.price)); setPCompare(p.compareAt ? String(p.compareAt) : "");
        setPImages(p.images || []);
    };

    const openNewProduct = () => {
        setEditProduct(null); setNewProduct(true);
        setPName(""); setPDesc(""); setPPrice(""); setPCompare(""); setPImages([]);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            setPImages(prev => [...prev, data.url]);
        } catch {
            alert("Erreur lors de l'upload.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeImage = (index: number) => {
        setPImages(prev => prev.filter((_, i) => i !== index));
    };

    const saveProduct = async () => {
        setSaving(true);
        const body = {
            name: pName, description: pDesc,
            price: parseFloat(pPrice), compareAt: pCompare ? parseFloat(pCompare) : null,
            images: pImages,
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
        } catch { alert("Erreur."); }
    };

    const saveBundle = async () => {
        if (!editBundle) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/bundles/${editBundle.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editBundle.name, price: editBundle.price,
                    compareAt: editBundle.compareAt, discount: editBundle.discount, badge: editBundle.badge,
                }),
            });
            if (!res.ok) throw new Error("Erreur");
            const data = await res.json();
            setBundles(bundles.map(b => b.id === data.id ? data : b));
            setEditBundle(null);
        } catch { alert("Erreur."); }
        setSaving(false);
    };

    const totalStock = (p: Product) => p.variants.reduce((s, v) => s + v.stock, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Elegant Tab Switcher */}
            <div className="flex p-1 bg-muted/40 backdrop-blur-md border border-gray-200/50 rounded-2xl w-max shadow-sm">
                <button
                    onClick={() => setTab("products")}
                    className={`flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${tab === "products" ? "bg-white text-indigo-900 shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-gray-100/50"}`}
                >
                    <Package className="h-4 w-4 mr-2" />
                    Catalogue Produits
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">{products.length}</span>
                </button>
                <button
                    onClick={() => setTab("bundles")}
                    className={`flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${tab === "bundles" ? "bg-white text-indigo-900 shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-gray-100/50"}`}
                >
                    <Tag className="h-4 w-4 mr-2" />
                    Gestion des Offres
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">{bundles.length}</span>
                </button>
            </div>

            {/* === PRODUCTS TAB === */}
            {tab === "products" && (
                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Produits</h2>
                            <p className="text-muted-foreground text-sm mt-1">Éditez votre catalogue principal, photos et vidéos.</p>
                        </div>
                        <Button onClick={openNewProduct} className="rounded-xl shadow-md hover:shadow-lg transition-all bg-indigo-600 hover:bg-indigo-700">
                            <Plus className="h-4 w-4 mr-2" /> Ajouter un produit
                        </Button>
                    </div>

                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                            <Package className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-bold text-gray-900">Catalogue vide</h3>
                            <p className="text-gray-500 max-w-sm mt-2 mb-6">Vous n&apos;avez pas encore de produit. Commencez par en créer un pour lancer vos ventes.</p>
                            <Button onClick={openNewProduct} variant="outline" className="rounded-full">Créer le premier produit</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {products.map(p => (
                                <div key={p.id} className="group bg-white border border-gray-200 hover:border-indigo-200 rounded-2xl p-4 flex gap-5 transition-all shadow-sm hover:shadow-md">
                                    <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200/60">
                                        {p.images[0] ? (
                                            p.images[0].match(/\.(mp4|webm)$/i) ? (
                                                <video src={p.images[0]} className="w-full h-full object-cover" muted loop playsInline />
                                            ) : (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                                            )
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center"><ImageIcon className="h-8 w-8 text-gray-300" /></div>
                                        )}
                                        {p.isPopular && <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm"><Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" /></div>}
                                    </div>
                                    <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-bold text-lg text-gray-900 truncate pr-2">{p.name}</h3>
                                                <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => openEditProduct(p)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50" onClick={() => setDeleteConfirm(p.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{p.description}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-bold text-xl text-gray-900">€{p.price.toFixed(2)}</span>
                                                {p.compareAt && <span className="text-sm text-gray-400 line-through">€{p.compareAt.toFixed(2)}</span>}
                                            </div>
                                            <StockBadge total={totalStock(p)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* === BUNDLES TAB === */}
            {tab === "bundles" && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Offres et Packs</h2>
                        <p className="text-muted-foreground text-sm mt-1">Modifiez les bundles affichés sur la page produit pour augmenter l&apos;AOV.</p>
                    </div>
                    <div className="grid gap-4 max-w-4xl">
                        {bundles.length === 0 ? (
                            <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-3xl bg-gray-50/50">Aucun bundle configuré.</div>
                        ) : (
                            bundles.map(b => (
                                <div key={b.id} className="bg-white border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-indigo-50 h-14 w-14 rounded-xl flex items-center justify-center shrink-0">
                                            <span className="font-bold text-xl text-indigo-700">{b.quantity}x</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-lg">{b.name}</h3>
                                                {b.badge && <Badge className="bg-indigo-100 text-indigo-800 border-none font-bold uppercase tracking-wider text-[10px]">{b.badge}</Badge>}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-gray-900">€{b.price.toFixed(2)}</span>
                                                {b.compareAt && <span className="text-sm text-gray-400 line-through">€{b.compareAt.toFixed(2)}</span>}
                                                <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-md font-medium">-{b.discount}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="secondary" className="w-full sm:w-auto rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900" onClick={() => setEditBundle({ ...b })}>
                                        <Edit className="h-4 w-4 mr-2" /> Modifier l&apos;offre
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* === EDIT/CREATE PRODUCT MODAL === */}
            <Dialog open={!!(editProduct || newProduct)} onOpenChange={(o) => { if (!o) { setEditProduct(null); setNewProduct(false); } }}>
                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-3xl">
                    <div className="px-6 py-5 border-b bg-gray-50/80">
                        <DialogTitle className="text-xl font-bold">{editProduct ? "Modifier le produit" : "Créer un produit"}</DialogTitle>
                        <DialogDescription className="mt-1">Détails, prix et médias (images/vidéos).</DialogDescription>
                    </div>

                    <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-1.5">Nom du produit</label>
                                <Input className="rounded-xl border-gray-300 focus:ring-indigo-500 h-11" value={pName} onChange={e => setPName(e.target.value)} placeholder="Ex: Semelles Biarritz Premium" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-1.5">Description complète</label>
                                <textarea
                                    className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3 text-sm outline-none resize-none min-h-[100px]"
                                    value={pDesc} onChange={e => setPDesc(e.target.value)} placeholder="Description complète et détaillée du produit..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1.5">Prix (€)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-gray-500 font-medium">€</span>
                                        <Input className="pl-8 rounded-xl border-gray-300 h-11" type="number" step="0.01" value={pPrice} onChange={e => setPPrice(e.target.value)} placeholder="0.00" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1.5 ">Prix barré (€)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-gray-400 font-medium">€</span>
                                        <Input className="pl-8 rounded-xl border-gray-300 h-11" type="number" step="0.01" value={pCompare} onChange={e => setPCompare(e.target.value)} placeholder="0.00" />
                                    </div>
                                </div>
                            </div>

                            {/* MEDIA UPLOAD SECTION */}
                            <div className="pt-2">
                                <label className="text-sm font-bold text-gray-700 block mb-3">Images et Vidéos</label>

                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                                    {pImages.map((src, i) => (
                                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group bg-gray-50">
                                            {src.match(/\.(mp4|webm)$/i) ? (
                                                <div className="relative w-full h-full">
                                                    <video src={src} className="w-full h-full object-cover" muted />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Video className="text-white h-6 w-6" /></div>
                                                </div>
                                            ) : (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={src} alt="media" className="w-full h-full object-cover" />
                                            )}
                                            <button
                                                onClick={() => removeImage(i)}
                                                className="absolute top-1 right-1 bg-white/90 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-gray-500 hover:text-indigo-600"
                                    >
                                        {uploading ? (
                                            <div className="h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <UploadCloud className="h-6 w-6" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Ajouter</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*,video/mp4,video/webm"
                                    onChange={handleFileUpload}
                                />
                                <p className="text-xs text-gray-500">Formats supportés: JPG, PNG, WEBP, MP4.</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 rounded-b-3xl">
                        <Button variant="outline" className="rounded-xl font-medium" onClick={() => { setEditProduct(null); setNewProduct(false); }}>Annuler</Button>
                        <Button className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700" onClick={saveProduct} disabled={saving || !pName || !pPrice}>
                            {saving ? "Sauvegarde en cours..." : "Sauvegarder les modifications"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* === EDIT BUNDLE MODAL === */}
            <Dialog open={!!editBundle} onOpenChange={(o) => { if (!o) setEditBundle(null); }}>
                <DialogContent className="sm:max-w-[420px] rounded-3xl p-0 overflow-hidden">
                    <div className="px-6 py-5 border-b bg-gray-50/80">
                        <DialogTitle className="text-xl font-bold">Modifier l&apos;offre</DialogTitle>
                    </div>
                    {editBundle && (
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-1.5">Nom public</label>
                                <Input className="rounded-xl h-11" value={editBundle.name} onChange={e => setEditBundle({ ...editBundle, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-1.5">Badge accrocheur (facultatif)</label>
                                <Input className="rounded-xl h-11" placeholder="Ex: Populaire, Best Value..." value={editBundle.badge ?? ""} onChange={e => setEditBundle({ ...editBundle, badge: e.target.value || null })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1.5">Prix final (€)</label>
                                    <Input className="rounded-xl h-11" type="number" value={editBundle.price} onChange={e => setEditBundle({ ...editBundle, price: parseFloat(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1.5">Prix barré (€)</label>
                                    <Input className="rounded-xl h-11" type="number" value={editBundle.compareAt ?? ""} onChange={e => setEditBundle({ ...editBundle, compareAt: parseFloat(e.target.value) || null })} />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-1.5">Remise affichée (%)</label>
                                <Input className="rounded-xl h-11" type="number" value={editBundle.discount} onChange={e => setEditBundle({ ...editBundle, discount: parseFloat(e.target.value) })} />
                            </div>
                        </div>
                    )}
                    <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 rounded-b-3xl">
                        <Button variant="outline" className="rounded-xl" onClick={() => setEditBundle(null)}>Annuler</Button>
                        <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold" onClick={saveBundle} disabled={saving}>
                            {saving ? "Sauvegarde..." : "Modifer l'offre"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* === DELETE CONFIRM === */}
            <Dialog open={!!deleteConfirm} onOpenChange={(o) => { if (!o) setDeleteConfirm(null); }}>
                <DialogContent className="sm:max-w-[380px] rounded-3xl p-6">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="flex flex-col items-center gap-3 text-red-600 text-center">
                            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            Supprimer ce produit ?
                        </DialogTitle>
                        <DialogDescription className="text-center pt-2 text-gray-600 text-base">
                            Cette action est irréversible. Toutes les données, variantes et images associées seront supprimées définitivement.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 pt-2">
                        <Button variant="destructive" className="rounded-xl py-6 font-bold text-base" onClick={() => deleteConfirm && deleteProduct(deleteConfirm)}>
                            Oui, supprimer définitivement
                        </Button>
                        <Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setDeleteConfirm(null)}>
                            Annuler et conserver
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
