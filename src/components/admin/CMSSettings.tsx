"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Save, Globe, UploadCloud, X, Video, Image as ImageIcon } from "lucide-react";
import { useRef } from "react";

type Locale = "EN" | "FR" | "ES";
const LOCALES: { code: Locale; label: string; flag: string }[] = [
    { code: "EN", label: "English", flag: "🇬🇧" },
    { code: "FR", label: "Français", flag: "🇫🇷" },
    { code: "ES", label: "Español", flag: "🇪🇸" },
];

const DEFAULT_TEXTS: Record<Locale, Record<string, string>> = {
    EN: {
        heroBadge: "🎉 New 2024 Design Released", heroTitle: "Walk Pain-Free.", heroTitleHighlight: "Every Single Step.",
        heroSubtitle: "Premium orthopaedic insoles engineered to realign your posture, cushion your heels, and eliminate foot, knee, and back pain instantly.",
        heroImage: "/temu-product.jpg", heroButton: "Shop Now — Pain-Free in 24h",
        featuresTitle: "Why Choose Biarritz?", featuresSubtitle: "Built with advanced podiatric technology, our insoles target the root cause of foot and back pain.",
        f1Title: "Instant Pain Relief", f1Desc: "Clinically proven to reduce plantar fasciitis, heel and metatarsalgia pain from day one.",
        f2Title: "Posture Realignment", f2Desc: "Corrects overpronation and flat feet, aligning your entire body from the ground up.",
        f3Title: "All-Day Comfort", f3Desc: "Medical-grade EVA foam with targeted cushioning zones for maximum shock absorption.",
        ctaTitle: "Ready to Take Your Life Back?", ctaSubtitle: "Join 50,000+ others who found instant pain relief with Biarritz.",
        ctaButton: "Get Your Pair Now", ctaGuarantee: "30-Day Money-Back Guarantee",
        scienceTitle: "The ancient art of healing, modernized.",
        scienceDesc: "Our insoles merge centuries-old magnetic acupressure theories with modern biomechanical podiatry. Targeting over 400 reflexology points on your foot, they reduce inflammation safely and naturally by acting directly on your central nervous system.",
        scienceB1: "Eliminates plantar fasciitis", scienceB2: "Instantly corrects posture", scienceB3: "Promotes deep, restorative sleep",
        scienceImage: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1200&auto=format&fit=crop",
        scienceBgImage: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2400&auto=format&fit=crop",
        lifestyleTitle: "Every Day. Every Shoe.", lifestyle1Label: "Sport & Running", lifestyle2Label: "Daily Walking", lifestyle3Label: "Work & Office",
        lifestyle1: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
        lifestyle2: "https://images.unsplash.com/photo-1474631245212-f5627e62d5c0?q=80&w=1200&auto=format&fit=crop",
        lifestyle3: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1200&auto=format&fit=crop",
        ctaOffer: "🔥 Special Offer: Buy 2, Get 1 FREE!",
    },
    FR: {
        heroBadge: "🎉 Nouvelle collection 2024", heroTitle: "Marchez vers la Sérénité.", heroTitleHighlight: "Chaque pas compte.",
        heroSubtitle: "Découvrez le pouvoir de guérison de l'acupression magnétique à chaque pas.",
        heroImage: "/temu-product.jpg", heroButton: "Commander — Sans douleur en 24h",
        featuresTitle: "Pourquoi Biarritz ?", featuresSubtitle: "Conçues avec une technologie podiatrique avancée, nos semelles ciblent la cause des douleurs.",
        f1Title: "Soulagement immédiat", f1Desc: "Cliniquement prouvé pour réduire la fasciite plantaire et les douleurs dès le premier jour.",
        f2Title: "Réalignement postural", f2Desc: "Corrige la pronation et les pieds plats, alignant tout votre corps depuis le sol.",
        f3Title: "Confort toute la journée", f3Desc: "Mousse EVA médicale avec zones de coussin ciblées pour une absorption maximale.",
        ctaTitle: "Reprenez votre vie en main !", ctaSubtitle: "Rejoignez 50 000+ personnes qui ont trouvé un soulagement instantané avec Biarritz.",
        ctaButton: "Obtenir ma paire", ctaGuarantee: "Garantie 30 jours Satisfait ou Remboursé",
        scienceTitle: "L'art ancien de la guérison, modernisé.",
        scienceDesc: "Nos semelles fusionnent les théories séculaires d'acupression magnétique avec la podiatrie biomécanique moderne. Ciblant plus de 400 points de réflexologie sur votre pied, elles réduisent l'inflammation de manière sûre et naturelle en agissant directement sur votre système nerveux central.",
        scienceB1: "Élimine l'aponévrosite plantaire", scienceB2: "Corrige la posture instantanément", scienceB3: "Favorise un sommeil profond et réparateur",
        scienceImage: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1200&auto=format&fit=crop",
        scienceBgImage: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2400&auto=format&fit=crop",
        lifestyleTitle: "Tous les jours. Toutes les Chaussures.", lifestyle1Label: "Sport & Running", lifestyle2Label: "Marche Quotidienne", lifestyle3Label: "Travail & Bureau",
        lifestyle1: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
        lifestyle2: "https://images.unsplash.com/photo-1474631245212-f5627e62d5c0?q=80&w=1200&auto=format&fit=crop",
        lifestyle3: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1200&auto=format&fit=crop",
        ctaOffer: "🔥 Offre Spéciale : Achetez-en 2, Obtenez-en 1 GRATUITE !",
    },
    ES: {
        heroBadge: "🎉 Nuevo diseño 2024", heroTitle: "Camina hacia la Serenidad.", heroTitleHighlight: "Cada paso importa.",
        heroSubtitle: "Descubre el poder curativo de la acupresión magnética con cada paso.",
        heroImage: "/temu-product.jpg", heroButton: "Comprar ahora — Sin dolor en 24h",
        featuresTitle: "¿Por qué Biarritz?", featuresSubtitle: "Diseñadas con tecnología podiátrica avanzada, nuestras plantillas atacan la causa del dolor.",
        f1Title: "Alivio instantáneo", f1Desc: "Clínicamente probado para reducir la fascitis plantar y el dolor desde el primer día.",
        f2Title: "Realineación postural", f2Desc: "Corrige la pronación y los pies planos, alineando todo tu cuerpo desde el suelo.",
        f3Title: "Comodidad todo el día", f3Desc: "Espuma EVA médica con zonas de amortiguación para máxima absorción de impacto.",
        ctaTitle: "¡Recupera tu vida!", ctaSubtitle: "Únete a 50,000+ personas que encontraron alivio instantáneo con Biarritz.",
        ctaButton: "Obtener mi par", ctaGuarantee: "Garantía de devolución de 30 días",
        scienceTitle: "El antiguo arte de curar, modernizado.",
        scienceDesc: "Nuestras plantillas fusionan teorías seculares de acupresión magnética con podología biomecánica moderna. Dirigiéndose a más de 400 puntos de reflexología en tu pie, reducen la inflamación de forma segura y natural actuando directamente sobre tu sistema nervioso central.",
        scienceB1: "Elimina la fascitis plantar", scienceB2: "Corrige la postura al instante", scienceB3: "Promueve un sueño profundo y reparador",
        scienceImage: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1200&auto=format&fit=crop",
        scienceBgImage: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2400&auto=format&fit=crop",
        lifestyleTitle: "Todos los días. Todos los zapatos.", lifestyle1Label: "Deporte y Running", lifestyle2Label: "Caminata Diaria", lifestyle3Label: "Trabajo y Oficina",
        lifestyle1: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
        lifestyle2: "https://images.unsplash.com/photo-1474631245212-f5627e62d5c0?q=80&w=1200&auto=format&fit=crop",
        lifestyle3: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1200&auto=format&fit=crop",
        ctaOffer: "🔥 Oferta Especial: ¡Compra 2, llévate 1 GRATIS!",
    },
};

type SiteConfig = { id: string; currencyCode: string; language: string; contactEmail: string; homeTitle: string; texts: any; };

function ImageUploadField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // Convert image to base64 Data URL client-side — no server upload needed.
    // This works on Vercel and any serverless environment since the data is stored in the DB.
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Limit to 50MB
        if (file.size > 50 * 1024 * 1024) {
            alert("Fichier trop lourd (max 50 Mo). Réduisez-le ou utilisez une URL externe.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setUploading(true);
        const reader = new FileReader();
        reader.onload = (ev) => {
            const dataUrl = ev.target?.result as string;
            onChange(dataUrl);
            setUploading(false);
        };
        reader.onerror = () => {
            alert("Erreur lors de la lecture du fichier.");
            setUploading(false);
        };
        reader.readAsDataURL(file);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground block">{label}</label>
            <div className="flex items-start gap-4">
                {value ? (
                    <div className="relative aspect-video w-40 rounded-xl overflow-hidden border border-gray-200 group bg-gray-50 flex-shrink-0">
                        {value.match(/\.(mp4|webm)$/i) ? (
                            <div className="relative w-full h-full">
                                <video src={value} className="w-full h-full object-cover" muted />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Video className="text-white h-6 w-6" /></div>
                            </div>
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={value} alt="media" className="w-full h-full object-cover" />
                        )}
                        <button
                            onClick={() => onChange("")}
                            className="absolute top-1 right-1 bg-white/90 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-video w-40 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-gray-500 hover:text-indigo-600 flex-shrink-0"
                    >
                        {uploading ? (
                            <div className="h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <UploadCloud className="h-6 w-6" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                            </>
                        )}
                    </button>
                )}
                <div className="flex-1 space-y-2">
                    <input
                        type="text"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        placeholder="...ou collez une URL cible"
                        className="w-full px-3 py-2 rounded-lg border text-xs focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*,video/mp4,video/webm"
                        onChange={handleFileUpload}
                    />
                    <p className="text-[10px] text-gray-500 leading-tight">Glissez-déposez, cliquez pour uploader, ou collez une URL. Formats : JPG, PNG, WEBP, MP4, WEBM. Max 50 Mo.</p>
                </div>
            </div>
        </div>
    );
}

export function CMSSettings({ initialConfig }: { initialConfig: SiteConfig }) {
    const [currencyCode, setCurrencyCode] = useState(initialConfig.currencyCode);
    const [language, setLanguage] = useState(initialConfig.language);
    const [contactEmail, setContactEmail] = useState(initialConfig.contactEmail);
    const [homeTitle, setHomeTitle] = useState(initialConfig.homeTitle);
    const [activeLocale, setActiveLocale] = useState<Locale>("EN");
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Load texts per locale
    const initialTexts = initialConfig.texts || {};
    const [allTexts, setAllTexts] = useState<Record<Locale, Record<string, string>>>({
        EN: { ...DEFAULT_TEXTS.EN, ...(initialTexts.EN || {}) },
        FR: { ...DEFAULT_TEXTS.FR, ...(initialTexts.FR || {}) },
        ES: { ...DEFAULT_TEXTS.ES, ...(initialTexts.ES || {}) },
    });

    const updateText = (key: string, value: string) => {
        setAllTexts(prev => ({ ...prev, [activeLocale]: { ...prev[activeLocale], [key]: value } }));
    };

    const texts = allTexts[activeLocale];

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currencyCode, language, contactEmail, homeTitle, texts: allTexts }),
            });
            if (!response.ok) throw new Error("Erreur de sauvegarde");
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            alert("Erreur lors de la sauvegarde des paramètres.");
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass = "w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none";

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Region & Currency */}
            <Card>
                <CardHeader>
                    <CardTitle>Région & Devise</CardTitle>
                    <CardDescription>Paramètres d&apos;affichage des prix et langue par défaut.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Devise principale</label>
                        <Select value={currencyCode} onValueChange={setCurrencyCode}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EUR">Euro (€)</SelectItem>
                                <SelectItem value="USD">Dollar ($)</SelectItem>
                                <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                                <SelectItem value="CHF">Franc Suisse (CHF)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Langue par défaut du site</label>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EN">🇬🇧 English</SelectItem>
                                <SelectItem value="FR">🇫🇷 Français</SelectItem>
                                <SelectItem value="ES">🇪🇸 Español</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email de contact (Support)</label>
                        <Input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Titre de la page d&apos;accueil (SEO)</label>
                        <Input value={homeTitle} onChange={e => setHomeTitle(e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            {/* Multilingual CMS Texts */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-indigo-600" />
                        Textes du site (multilingue)
                    </CardTitle>
                    <CardDescription>Modifiez les textes pour chaque langue. Les visiteurs voient la bonne version selon leur choix de langue.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Language tab selector */}
                    <div className="flex gap-2 border-b pb-4">
                        {LOCALES.map(l => (
                            <button
                                key={l.code}
                                onClick={() => setActiveLocale(l.code)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeLocale === l.code ? "bg-indigo-600 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                            >
                                {l.flag} {l.label}
                            </button>
                        ))}
                    </div>

                    {/* Hero */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wide">Section Hero</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Badge</label><input className={inputClass} value={texts.heroBadge} onChange={e => updateText("heroBadge", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Titre Surligné</label><input className={inputClass} value={texts.heroTitleHighlight} onChange={e => updateText("heroTitleHighlight", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Titre Principal</label><input className={inputClass} value={texts.heroTitle} onChange={e => updateText("heroTitle", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Sous-titre</label><input className={inputClass} value={texts.heroSubtitle} onChange={e => updateText("heroSubtitle", e.target.value)} /></div>
                        </div>
                        <ImageUploadField label="Image Hero" value={texts.heroImage || ""} onChange={url => updateText("heroImage", url)} />
                    </div>

                    {/* Features */}
                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wide">Section Bénéfices</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Titre</label><input className={inputClass} value={texts.featuresTitle} onChange={e => updateText("featuresTitle", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Sous-titre</label><input className={inputClass} value={texts.featuresSubtitle} onChange={e => updateText("featuresSubtitle", e.target.value)} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[1, 2, 3].map(n => (
                                <div key={n} className="border rounded-xl p-3 bg-muted/20 space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Bénéfice {n}</label>
                                    <input className={inputClass} placeholder={`Titre ${n}`} value={texts[`f${n}Title`]} onChange={e => updateText(`f${n}Title`, e.target.value)} />
                                    <input className={inputClass} placeholder={`Description ${n}`} value={texts[`f${n}Desc`]} onChange={e => updateText(`f${n}Desc`, e.target.value)} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wide">Section CTA</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Titre CTA</label><input className={inputClass} value={texts.ctaTitle} onChange={e => updateText("ctaTitle", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Sous-titre CTA</label><input className={inputClass} value={texts.ctaSubtitle} onChange={e => updateText("ctaSubtitle", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Texte Bouton</label><input className={inputClass} value={texts.ctaButton} onChange={e => updateText("ctaButton", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Texte Garantie</label><input className={inputClass} value={texts.ctaGuarantee} onChange={e => updateText("ctaGuarantee", e.target.value)} /></div>
                        </div>
                        <div className="mt-3">
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Offre Animation (ex: Achetez 2, 1 Gratuit)</label>
                            <input className={inputClass} value={texts.ctaOffer} onChange={e => updateText("ctaOffer", e.target.value)} />
                        </div>
                    </div>

                    {/* Science Image */}
                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wide">Section Science (Page d&apos;accueil)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ImageUploadField label="Image de contenu (Science)" value={texts.scienceImage || ""} onChange={url => updateText("scienceImage", url)} />
                            <ImageUploadField label="Image de fond (Texture)" value={texts.scienceBgImage || ""} onChange={url => updateText("scienceBgImage", url)} />
                        </div>
                    </div>

                    {/* Lifestyle Images */}
                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wide">Grille Lifestyle (Page d&apos;accueil & Produit)</h4>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Titre de la section</label>
                            <input className={inputClass} value={texts.lifestyleTitle} onChange={e => updateText("lifestyleTitle", e.target.value)} />
                        </div>
                        <div className="grid grid-cols-1 gap-8 mt-4 border-l-2 border-indigo-50 pl-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700">Lifestyle 1 (Sport)</label>
                                <input className={inputClass} placeholder="Libellé (ex: Sport & Running)" value={texts.lifestyle1Label} onChange={e => updateText("lifestyle1Label", e.target.value)} />
                                <ImageUploadField label="Média 1" value={texts.lifestyle1 || ""} onChange={url => updateText("lifestyle1", url)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700">Lifestyle 2 (Quotidien)</label>
                                <input className={inputClass} placeholder="Libellé (ex: Marche Quotidienne)" value={texts.lifestyle2Label} onChange={e => updateText("lifestyle2Label", e.target.value)} />
                                <ImageUploadField label="Média 2" value={texts.lifestyle2 || ""} onChange={url => updateText("lifestyle2", url)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700">Lifestyle 3 (Travail)</label>
                                <input className={inputClass} placeholder="Libellé (ex: Travail & Bureau)" value={texts.lifestyle3Label} onChange={e => updateText("lifestyle3Label", e.target.value)} />
                                <ImageUploadField label="Média 3" value={texts.lifestyle3 || ""} onChange={url => updateText("lifestyle3", url)} />
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-4 border-t">
                    {saved && <span className="text-sm text-green-600 font-medium">✅ Modifications sauvegardées !</span>}
                    {!saved && <span />}
                    <Button onClick={handleSave} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Sauvegarde..." : "Enregistrer toutes les langues"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
