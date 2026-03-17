"use client";

import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Tag, UploadCloud, Video, X } from "lucide-react";
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(
    async () => {
        const { default: RQ } = await import("react-quill-new");
        return function Comp({ forwardedRef, ...props }: any) {
            return <RQ ref={forwardedRef} {...props} />;
        };
    },
    { ssr: false }
);
type Product = {
    id: string; name: string; description: string; price: number; compareAt: number | null;
    images: string[]; features: string[]; isPopular: boolean;
};
type Bundle = {
    id: string; name: string; quantity: number; price: number; compareAt: number | null;
    discount: number; badge: string | null;
};

export function SingleProductManager({ initialProduct, initialBundles, initialUpsellProducts }: {
    initialProduct: any; 
    initialBundles: any[]; 
    initialUpsellProducts: any[];
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

    // Upsell Products state
    const [upsells, setUpsells] = useState(initialUpsellProducts?.map(u => ({
        id: u.id,
        name: u.name || "",
        price: u.price ? String(u.price) : "",
        compareAt: u.compareAt ? String(u.compareAt) : "",
        image: u.images?.[0] || "",
        _clientKey: Math.random().toString(36)
    })) || []);

    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const quillRef = useRef<any>(null);

    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
        
        input.onchange = async () => {
            const file = input.files ? input.files[0] : null;
            if (!file) return;

            setUploading(true);
            const formData = new FormData();
            formData.append("file", file);

            try {
                const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                if (!res.ok) throw new Error("Upload failed");
                const data = await res.json();
                
                const editor = quillRef.current?.getEditor();
                if (editor) {
                    const range = editor.getSelection();
                    editor.insertEmbed(range?.index || 0, "image", data.url);
                }
            } catch {
                alert("Erreur lors de l'upload de l'image.");
            } finally {
                setUploading(false);
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image", "video"],
                ["clean"]
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), []);

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

    const handleUpsellImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            const newUpsells = [...upsells];
            newUpsells[index].image = data.url;
            setUpsells(newUpsells);
        } catch {
            alert("Erreur lors de l'upload.");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const addUpsell = () => setUpsells(prev => [...prev, { id: "", name: "", price: "", compareAt: "", image: "", _clientKey: Math.random().toString() }]);
    
    const removeUpsell = async (index: number) => {
        const u = upsells[index];
        if (u.id) {
            if (!confirm("Supprimer cet upsell ?")) return;
            await fetch(`/api/admin/products/${u.id}`, { method: "DELETE" });
        }
        setUpsells(prev => prev.filter((_, i) => i !== index));
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
                images: pImages, features: pFeatures.split("\n").map((s: string) => s.trim()).filter(Boolean),
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

            // 3. Save Upsells
            const newUpsells = [...upsells];
            for (let i = 0; i < newUpsells.length; i++) {
                const u = newUpsells[i];
                if (u.name && u.price) {
                    const uBody = {
                        name: u.name,
                        price: parseFloat(u.price),
                        compareAt: u.compareAt ? parseFloat(u.compareAt) : null,
                        images: u.image ? [u.image] : [],
                        type: "UPSELL"
                    };
                    const uUrl = u.id ? `/api/admin/products/${u.id}` : "/api/admin/products";
                    const uMethod = u.id ? "PATCH" : "POST";
                    const uRes = await fetch(uUrl, { method: uMethod, headers: { "Content-Type": "application/json" }, body: JSON.stringify(uBody) });
                    if (!uRes.ok) throw new Error(`Erreur upsell ${u.name}`);
                    const uData = await uRes.json();
                    if (!u.id) newUpsells[i].id = uData.id;
                }
            }
            setUpsells(newUpsells);

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
                                        forwardedRef={quillRef}
                                        theme="snow" 
                                        value={pDesc} 
                                        onChange={setPDesc} 
                                        modules={modules}
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

                    {/* Local Upsells */}
                    <div className="bg-gradient-to-b from-orange-50/50 to-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden sticky top-28">
                        <div className="bg-orange-50/80 px-6 py-4 flex items-center justify-between border-b border-orange-100">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-xl shadow-sm"><Tag className="h-5 w-5 text-orange-600" /></div>
                                <div>
                                    <h3 className="font-bold text-lg text-orange-900">Produits Upsells</h3>
                                    <p className="text-xs text-orange-600/70">Proposés avant le paiement</p>
                                </div>
                            </div>
                            <Button size="sm" onClick={addUpsell} className="bg-orange-600 hover:bg-orange-700 text-white font-bold h-8 text-xs">
                                + Ajouter
                            </Button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            {upsells.length === 0 && <p className="text-sm text-gray-500 text-center italic">Aucun upsell configuré. Ajoutez-en un pour la modale Pre-Checkout.</p>}
                            {upsells.map((upsell, index) => (
                                <div key={upsell._clientKey} className="p-4 rounded-xl border border-orange-200 bg-white shadow-sm space-y-3 relative">
                                    <button onClick={() => removeUpsell(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-600"><X className="h-4 w-4" /></button>
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 shrink-0 border rounded-xl overflow-hidden bg-gray-50 relative group">
                                            {upsell.image ? (
                                                <img src={upsell.image} className="w-full h-full object-cover" alt="upsell" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400"><Tag className="h-6 w-6" /></div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <label className="cursor-pointer bg-white text-xs font-bold px-2 py-1 rounded">
                                                    Img
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpsellImageUpload(e, index)} />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div>
                                                <Input className="h-8 text-sm font-bold bg-white text-gray-900" placeholder="Nom (ex: Toe Spacers)" value={upsell.name} onChange={e => {
                                                    const newU = [...upsells]; newU[index].name = e.target.value; setUpsells(newU);
                                                }} />
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <Input className="h-8 text-xs bg-white text-gray-900" type="number" step="0.01" placeholder="Prix final (€)" value={upsell.price} onChange={e => {
                                                        const newU = [...upsells]; newU[index].price = e.target.value; setUpsells(newU);
                                                    }} />
                                                </div>
                                                <div className="flex-1">
                                                    <Input className="h-8 text-xs bg-white text-gray-500" type="number" step="0.01" placeholder="Prix barré (€)" value={upsell.compareAt} onChange={e => {
                                                        const newU = [...upsells]; newU[index].compareAt = e.target.value; setUpsells(newU);
                                                    }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
