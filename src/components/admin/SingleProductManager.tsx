"use client";

import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Tag, UploadCloud, Video, X } from "lucide-react";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css'; // Use react-quill-new to avoid old deps problems, wait actually let's try standard react-quill if it installed correctly

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });


type Product = {
    id: string; name: string; description: string; price: number; compareAt: number | null;
    images: string[]; features: string[]; isPopular: boolean;
};
type Bundle = {
    id: string; name: string; quantity: number; price: number; compareAt: number | null;
    discount: number; badge: string | null;
};

export function SingleProductManager({ initialProduct, initialBundles, initialUpsell }: {
    initialProduct: Product | null; 
    initialBundles: Bundle[]; 
    initialUpsell: { active: boolean, title: string, price: number };
}) {
    // Product state
    const [productId, setProductId] = useState(initialProduct?.id || null);
    const [pName, setPName] = useState(initialProduct?.name || "");
    const [pDesc, setPDesc] = useState(initialProduct?.description || "");
    const [pPrice, setPPrice] = useState(initialProduct?.price ? String(initialProduct.price) : "");
    const [pCompare, setPCompare] = useState(initialProduct?.compareAt ? String(initialProduct.compareAt) : "");
    const [pImages, setPImages] = useState<string[]>(initialProduct?.images || []);
    const [pFeatures, setPFeatures] = useState(initialProduct?.features?.join("\n") || "");

    // Bundles state (Quantity Packs)
    const [packs, setPacks] = useState([1, 2, 3].map(q => {
        const b = initialBundles?.find(x => x.quantity === q);
        return {
            quantity: q, 
            id: b?.id || "", 
            name: b?.name || `${q} Paire${q>1?'s':''}`,
            price: b?.price ? String(b.price) : "",
            compareAt: b?.compareAt ? String(b.compareAt) : "",
            discount: b?.discount ? String(b.discount) : "",
            badge: b?.badge || ""
        };
    }));

    // Local Upsell state
    const [upsellActive, setUpsellActive] = useState(initialUpsell?.active ?? false);
    const [upsellTitle, setUpsellTitle] = useState(initialUpsell?.title || "Livraison Express");
    const [upsellPrice, setUpsellPrice] = useState(String(initialUpsell?.price || 9.99));

    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const saveAll = async () => {
        setSaving(true);
        try {
            // 1. Save Product
            const productBody = {
                name: pName, description: pDesc,
                price: parseFloat(pPrice), compareAt: pCompare ? parseFloat(pCompare) : null,
                images: pImages, features: pFeatures.split("\n").map(s => s.trim()).filter(Boolean),
            };
            
            const pUrl = productId ? `/api/admin/products/${productId}` : "/api/admin/products";
            const pMethod = productId ? "PATCH" : "POST";
            const pRes = await fetch(pUrl, { method: pMethod, headers: { "Content-Type": "application/json" }, body: JSON.stringify(productBody) });
            if (!pRes.ok) throw new Error("Erreur produit");
            const pData = await pRes.json();
            if (!productId) setProductId(pData.id);

            // 2. Save Bundles
            const newPacks = [...packs];
            for (let i = 0; i < newPacks.length; i++) {
                const pack = newPacks[i];
                if (pack.price) {
                    const bundleBody = {
                        name: pack.name, price: parseFloat(pack.price), quantity: pack.quantity,
                        compareAt: pack.compareAt ? parseFloat(pack.compareAt) : null, discount: pack.discount ? parseFloat(pack.discount) : 0, badge: pack.badge || null,
                    };
                    const bUrl = pack.id ? `/api/admin/bundles/${pack.id}` : "/api/admin/bundles";
                    const bMethod = pack.id ? "PATCH" : "POST";
                    const bRes = await fetch(bUrl, { method: bMethod, headers: { "Content-Type": "application/json" }, body: JSON.stringify(bundleBody) });
                    if (!bRes.ok) throw new Error(`Erreur offre ${pack.quantity}`);
                    const bData = await bRes.json();
                    if (!pack.id) {
                        newPacks[i].id = bData.id;
                    }
                }
            }
            setPacks(newPacks);

            // 3. Save Custom Upsell Config
            const sRes = await fetch("/api/admin/stripe-upsell", { 
                method: "POST", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify({ 
                    upsellActive, 
                    upsellTitle, 
                    upsellPrice: parseFloat(upsellPrice) 
                }) 
            });
            if (!sRes.ok) throw new Error("Erreur enregistrement de l'Upsell");

            alert("Modifications sauvegardées avec succès !");
        } catch (e: any) { 
            alert(e.message || "Erreur lors de la sauvegarde."); 
        }
        setSaving(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
            
            {/* Header Actions */}
            <div className="flex justify-between items-center bg-white/80 backdrop-blur-md p-5 rounded-3xl border shadow-sm sticky top-4 z-50">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-gray-900">Édition du Catalogue</h2>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Modifiez les informations qui apparaitront sur votre boutique.</p>
                </div>
                <Button className="rounded-2xl shadow-lg shadow-indigo-200 font-bold bg-indigo-600 hover:bg-indigo-700 px-8 py-6 text-base transition-all hover:-translate-y-0.5" onClick={saveAll} disabled={saving || !pName || !pPrice}>
                    {saving ? "Sauvegarde en cours..." : "Enregistrer les modifications"}
                </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* --- PRODUCT SECTION --- */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="bg-gray-50/80 px-6 py-4 border-b flex items-center gap-3">
                            <div className="bg-white p-2 rounded-xl shadow-sm"><Package className="h-5 w-5 text-indigo-600" /></div>
                            <h3 className="font-bold text-lg text-gray-900">Produit Principal</h3>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-1.5">Nom du produit</label>
                                <Input className="rounded-xl border-gray-300 h-12 text-gray-900 bg-white font-medium shadow-sm" value={pName} onChange={e => setPName(e.target.value)} placeholder="Ex: Semelles Biarritz Premium" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-1.5">Description complète</label>
                                <div className="bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-shadow">
                                    <ReactQuill 
                                        theme="snow" 
                                        value={pDesc} 
                                        onChange={setPDesc} 
                                        className="text-gray-900 min-h-[150px] [&_.ql-editor]:min-h-[150px] [&_.ql-toolbar]:bg-gray-50/80 [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-200 [&_.ql-container]:border-none [&_.ql-container]:bg-white"
                                        placeholder="Description complète et détaillée du produit..."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-1.5">Points de vente / Avantages (1 par ligne, HTML supporté)</label>
                                <textarea
                                    className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-4 font-medium text-sm outline-none resize-none min-h-[120px] text-gray-900 bg-white shadow-sm"
                                    value={pFeatures} onChange={e => setPFeatures(e.target.value)} placeholder={`✔ <strong>Design ergonomique</strong>...\n✔ <span style="color: green">Soulage les douleurs</span>...`}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-2">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1.5">Prix de vente (€)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-gray-500 font-bold">€</span>
                                        <Input className="pl-9 rounded-xl border-gray-300 h-12 text-gray-900 bg-white font-bold text-lg shadow-sm" type="number" step="0.01" value={pPrice} onChange={e => setPPrice(e.target.value)} placeholder="0.00" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1.5">Prix barré originel (€)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-gray-400 font-bold">€</span>
                                        <Input className="pl-9 rounded-xl border-gray-300 h-12 text-gray-500 bg-white font-medium shadow-sm" type="number" step="0.01" value={pCompare} onChange={e => setPCompare(e.target.value)} placeholder="0.00" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MEDIA EDIT SECTION */}
                    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="bg-gray-50/80 px-6 py-4 border-b">
                            <h3 className="font-bold text-lg">Galerie Médias</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-3">
                                {pImages.map((src, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group bg-gray-50">
                                        {src.match(/\.(mp4|webm)$/i) ? (
                                            <div className="relative w-full h-full">
                                                <video src={src} className="w-full h-full object-cover" muted />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Video className="text-white h-6 w-6" /></div>
                                            </div>
                                        ) : (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={src} alt={`media-${i}`} className="w-full h-full object-cover" />
                                        )}
                                        <button
                                            onClick={() => removeImage(i)}
                                            className="absolute top-1 right-1 bg-white/90 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                        <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                                            {i === 0 ? "PRINCIPALE" : `#${i+1}`}
                                        </div>
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
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-center px-1">Ajouter<br/>Média</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/mp4,video/webm" onChange={handleFileUpload} />
                        </div>
                    </div>
                </div>

                {/* --- PACKS & UPSELL SECTION --- */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Tarifs Dégressifs */}
                    <div className="bg-gradient-to-b from-indigo-50/50 to-white rounded-3xl border border-indigo-100 shadow-sm overflow-hidden">
                        <div className="bg-indigo-50/80 px-6 py-4 flex items-center gap-3 border-b border-indigo-100">
                            <div className="bg-white p-2 rounded-xl shadow-sm"><Package className="h-5 w-5 text-indigo-600" /></div>
                            <div>
                                <h3 className="font-bold text-lg text-indigo-900">Tarifs Dégressifs</h3>
                                <p className="text-xs text-indigo-600/70">Packs de 1, 2 et 3 paires</p>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            {packs.map((pack, index) => (
                                <div key={pack.quantity} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm space-y-3">
                                    <h4 className="font-black text-sm text-gray-900 flex justify-between items-center">
                                        Pack {pack.quantity} {pack.quantity > 1 ? "Paires" : "Paire"}
                                    </h4>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Nom affiché</label>
                                            <Input className="h-8 text-xs bg-white text-gray-900" placeholder="Ex: 2 Paires" value={pack.name} onChange={e => {
                                                const newPacks = [...packs]; newPacks[index].name = e.target.value; setPacks(newPacks);
                                            }} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Badge</label>
                                            <Input className="h-8 text-xs bg-white text-gray-900" placeholder="Ex: ÉCONOMISEZ 50%" value={pack.badge} onChange={e => {
                                                const newPacks = [...packs]; newPacks[index].badge = e.target.value; setPacks(newPacks);
                                            }} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Prix (€)</label>
                                            <Input className="h-8 text-xs bg-white font-bold text-gray-900" type="number" step="0.01" value={pack.price} onChange={e => {
                                                const newPacks = [...packs]; newPacks[index].price = e.target.value; setPacks(newPacks);
                                            }} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Prix barré</label>
                                            <Input className="h-8 text-xs bg-white text-gray-500" type="number" step="0.01" value={pack.compareAt} onChange={e => {
                                                const newPacks = [...packs]; newPacks[index].compareAt = e.target.value; setPacks(newPacks);
                                            }} />
                                        </div>
                                    </div>
                                    {pack.quantity > 1 && (
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">% Remise</label>
                                            <Input className="h-8 text-xs bg-white" type="number" placeholder="Ex: 50" value={pack.discount} onChange={e => {
                                                const newPacks = [...packs]; newPacks[index].discount = e.target.value; setPacks(newPacks);
                                            }} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Local Upsell / Order Bump */}
                    <div className="bg-gradient-to-b from-orange-50/50 to-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden sticky top-28">
                        <div className="bg-orange-50/80 px-6 py-4 flex items-center justify-between border-b border-orange-100">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-xl shadow-sm"><Tag className="h-5 w-5 text-orange-600" /></div>
                                <div>
                                    <h3 className="font-bold text-lg text-orange-900">Vente additionnelle</h3>
                                    <p className="text-xs text-orange-600/70">Avant le paiement (Order Bump)</p>
                                </div>
                            </div>
                            <label className="flex items-center cursor-pointer">
                                <span className="mr-2 text-xs font-bold text-orange-900">Activer</span>
                                <input type="checkbox" className="sr-only peer" checked={upsellActive} onChange={e => setUpsellActive(e.target.checked)} />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500 relative"></div>
                            </label>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-1.5">Que proposez-vous ? (Titre)</label>
                                <Input className="rounded-xl border-gray-300 bg-white text-gray-900 text-sm shadow-sm" placeholder="Ex: Livraison Express & Assurée" value={upsellTitle} onChange={e => setUpsellTitle(e.target.value)} disabled={!upsellActive} />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-1.5">Prix supplémentaire (€)</label>
                                <Input className="rounded-xl border-gray-300 bg-white text-gray-900 text-sm shadow-sm" type="number" step="0.01" placeholder="Ex: 9.99" value={upsellPrice} onChange={e => setUpsellPrice(e.target.value)} disabled={!upsellActive} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
