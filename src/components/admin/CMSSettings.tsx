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
import { Save, Globe } from "lucide-react";

type Locale = "EN" | "FR" | "ES";
const LOCALES: { code: Locale; label: string; flag: string }[] = [
    { code: "EN", label: "English", flag: "🇬🇧" },
    { code: "FR", label: "Français", flag: "🇫🇷" },
    { code: "ES", label: "Español", flag: "🇪🇸" },
];

const DEFAULT_TEXTS: Record<Locale, Record<string, string>> = {
    EN: {
        heroBadge: "🎉 New 2024 Design Released", heroTitle: "Walk Pain-Free.", heroTitleHighlight: "Every Single Step.",
        heroSubtitle: "Premium orthopaedic insoles engineered to realign your posture and eliminate pain.",
        heroImage: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80",
        featuresTitle: "Why Choose Biarritz?", featuresSubtitle: "Built with advanced podiatric technology.",
        f1Title: "Instant Pain Relief", f1Desc: "Clinically proven to reduce plantar fasciitis from day one.",
        f2Title: "Posture Realignment", f2Desc: "Corrects overpronation and flat feet.",
        f3Title: "All-Day Comfort", f3Desc: "Medical-grade EVA foam with targeted cushioning zones.",
        ctaTitle: "Ready to Take Your Life Back?", ctaSubtitle: "Join 50,000+ others who found instant relief.",
        ctaButton: "Get Your Pair Now", ctaGuarantee: "30-Day Money-Back Guarantee",
        lifestyle1: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
        lifestyle2: "https://images.unsplash.com/photo-1474631245212-f5627e62d5c0?q=80&w=1200&auto=format&fit=crop",
        lifestyle3: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1200&auto=format&fit=crop",
    },
    FR: {
        heroBadge: "🎉 Nouvelle collection 2024", heroTitle: "Marchez sans douleur.", heroTitleHighlight: "Chaque pas compte.",
        heroSubtitle: "Semelles orthopédiques premium pour réaligner votre posture et éliminer les douleurs.",
        heroImage: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80",
        featuresTitle: "Pourquoi Biarritz ?", featuresSubtitle: "Conçues avec une technologie podiatrique avancée.",
        f1Title: "Soulagement immédiat", f1Desc: "Cliniquement prouvé contre la fasciite plantaire dès le premier jour.",
        f2Title: "Réalignement postural", f2Desc: "Corrige la pronation et les pieds plats.",
        f3Title: "Confort toute la journée", f3Desc: "Mousse EVA médicale avec zones de coussin ciblées.",
        ctaTitle: "Reprenez votre vie en main !", ctaSubtitle: "Rejoignez 50 000+ personnes soulagées.",
        ctaButton: "Obtenir ma paire", ctaGuarantee: "Garantie 30 jours Satisfait ou Remboursé",
        lifestyle1: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
        lifestyle2: "https://images.unsplash.com/photo-1474631245212-f5627e62d5c0?q=80&w=1200&auto=format&fit=crop",
        lifestyle3: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1200&auto=format&fit=crop",
    },
    ES: {
        heroBadge: "🎉 Nuevo diseño 2024", heroTitle: "Camina sin dolor.", heroTitleHighlight: "Cada paso importa.",
        heroSubtitle: "Plantillas ortopédicas premium para realinear tu postura y eliminar el dolor.",
        heroImage: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80",
        featuresTitle: "¿Por qué Biarritz?", featuresSubtitle: "Diseñadas con tecnología podátrica avanzada.",
        f1Title: "Alivio instantáneo", f1Desc: "Clínicamente probado contra la fascitis plantar desde el primer día.",
        f2Title: "Realineación postural", f2Desc: "Corrige la pronación y los pies planos.",
        f3Title: "Comodidad todo el día", f3Desc: "Espuma EVA médica con zonas de amortiguación.",
        ctaTitle: "¡Recupera tu vida!", ctaSubtitle: "Únete a 50,000+ personas aliviadas.",
        ctaButton: "Obtener mi par", ctaGuarantee: "Garantía de devolución de 30 días",
        lifestyle1: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
        lifestyle2: "https://images.unsplash.com/photo-1474631245212-f5627e62d5c0?q=80&w=1200&auto=format&fit=crop",
        lifestyle3: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1200&auto=format&fit=crop",
    },
};

type SiteConfig = { id: string; currencyCode: string; language: string; contactEmail: string; homeTitle: string; texts: any; };

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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Badge</label><input className={inputClass} value={texts.heroBadge} onChange={e => updateText("heroBadge", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Titre Surligné</label><input className={inputClass} value={texts.heroTitleHighlight} onChange={e => updateText("heroTitleHighlight", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Titre Principal</label><input className={inputClass} value={texts.heroTitle} onChange={e => updateText("heroTitle", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Image Hero (URL)</label><input className={inputClass} value={texts.heroImage} onChange={e => updateText("heroImage", e.target.value)} /></div>
                        </div>
                        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Sous-titre</label><input className={inputClass} value={texts.heroSubtitle} onChange={e => updateText("heroSubtitle", e.target.value)} /></div>
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
                    </div>

                    {/* Lifestyle Images */}
                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wide">Images Lifestyle (Page Produit)</h4>
                        <div className="grid grid-cols-1 gap-3">
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Image 1 (Sport) URL</label><input className={inputClass} value={texts.lifestyle1 || ""} onChange={e => updateText("lifestyle1", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Image 2 (Quotidien) URL</label><input className={inputClass} value={texts.lifestyle2 || ""} onChange={e => updateText("lifestyle2", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Image 3 (Travail) URL</label><input className={inputClass} value={texts.lifestyle3 || ""} onChange={e => updateText("lifestyle3", e.target.value)} /></div>
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
