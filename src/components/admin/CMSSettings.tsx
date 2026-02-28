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
import { Save } from "lucide-react";

type SiteConfig = {
    id: string;
    currencyCode: string;
    language: string;
    contactEmail: string;
    homeTitle: string;
    texts: any;
};

export function CMSSettings({ initialConfig }: { initialConfig: SiteConfig }) {
    const [currencyCode, setCurrencyCode] = useState(initialConfig.currencyCode);
    const [language, setLanguage] = useState(initialConfig.language);
    const [contactEmail, setContactEmail] = useState(initialConfig.contactEmail);
    const [homeTitle, setHomeTitle] = useState(initialConfig.homeTitle);

    // Texts (CMS)
    const initialTexts = initialConfig.texts || {};
    const [texts, setTexts] = useState<any>({
        heroBadge: initialTexts.heroBadge || "🎉 New 2024 Design Released",
        heroTitle: initialTexts.heroTitle || "Walk Pain-Free.",
        heroTitleHighlight: initialTexts.heroTitleHighlight || "Every Single Step.",
        heroSubtitle: initialTexts.heroSubtitle || "Premium orthopaedic insoles engineered to realign your posture, cushion your heels, and eliminate foot, knee, and back pain instantly.",
        heroImage: initialTexts.heroImage || "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",

        featuresTitle: initialTexts.featuresTitle || "Why Choose StepPrs?",
        featuresSubtitle: initialTexts.featuresSubtitle || "Built with advanced podiatric technology, our insoles target the root cause of foot and back pain.",
        f1Title: initialTexts.f1Title || "Instant Pain Relief",
        f1Desc: initialTexts.f1Desc || "Clinically proven to reduce plantar fasciitis, heel pain, and metatarsalgia from day one.",
        f2Title: initialTexts.f2Title || "Posture Realignment",
        f2Desc: initialTexts.f2Desc || "Corrects overpronation and flat feet, aligning your entire body from the ground up.",
        f3Title: initialTexts.f3Title || "All-Day Comfort",
        f3Desc: initialTexts.f3Desc || "Medical-grade EVA foam with targeted cushioning zones for maximum shock absorption.",

        ctaTitle: initialTexts.ctaTitle || "Ready to Take Your Life Back?",
        ctaSubtitle: initialTexts.ctaSubtitle || "Join 50,000+ others who have found instant pain relief with StepPrs. Your feet will thank you.",
        ctaButton: initialTexts.ctaButton || "Get Your Pair Now",
        ctaGuarantee: initialTexts.ctaGuarantee || "30-Day Money-Back Guarantee",
    });

    const [isSaving, setIsSaving] = useState(false);

    const updateText = (key: string, value: string) => {
        setTexts((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currencyCode,
                    language,
                    contactEmail,
                    homeTitle,
                    texts,
                }),
            });

            if (!response.ok) throw new Error("Erreur de sauvegarde");

            alert("Paramètres sauvegardés avec succès ! Modifiez votre prochain visiteur verra les changements.");
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la sauvegarde des paramètres.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Région & Devise</CardTitle>
                    <CardDescription>
                        Ces paramètres affectent la façon dont les prix et la langue par défaut sont affichés aux visiteurs.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Devise Principale</label>
                        <Select value={currencyCode} onValueChange={setCurrencyCode}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une devise" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EUR">Euro (€)</SelectItem>
                                <SelectItem value="USD">Dollar Américain ($)</SelectItem>
                                <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                                <SelectItem value="CHF">Franc Suisse (CHF)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Langue par défaut</label>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une langue" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="FR">Français (FR)</SelectItem>
                                <SelectItem value="EN">Anglais (EN)</SelectItem>
                                <SelectItem value="ES">Espagnol (ES)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Configuration du Site</CardTitle>
                    <CardDescription>
                        Gérez les textes globaux et adresses de contact de votre boutique.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email de Contact (Support)</label>
                        <Input
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="support@biarritz.blog"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Titre de la Page d'Accueil (SEO)</label>
                        <Input
                            value={homeTitle}
                            onChange={(e) => setHomeTitle(e.target.value)}
                            placeholder="Ex: Site e-commerce haut de gamme"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Textes de la Page d'Accueil (CMS)</CardTitle>
                    <CardDescription>
                        Modifiez les textes et images principaux de la page d'accueil.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Badge Hero</label>
                        <Input value={texts.heroBadge} onChange={(e) => updateText("heroBadge", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Titre Principal</label>
                            <Input value={texts.heroTitle} onChange={(e) => updateText("heroTitle", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Titre Surligné (Highlight)</label>
                            <Input value={texts.heroTitleHighlight} onChange={(e) => updateText("heroTitleHighlight", e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Sous-titre Hero</label>
                        <Input value={texts.heroSubtitle} onChange={(e) => updateText("heroSubtitle", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Image Hero (URL)</label>
                        <Input value={texts.heroImage} onChange={(e) => updateText("heroImage", e.target.value)} />
                    </div>

                    {/* Features Section */}
                    <div className="space-y-2 mt-6 pt-4 border-t">
                        <h4 className="font-medium text-sm text-indigo-600">Section Bénéfices (Features)</h4>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Titre des Bénéfices</label>
                        <Input value={texts.featuresTitle} onChange={(e) => updateText("featuresTitle", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Sous-titre des Bénéfices</label>
                        <Input value={texts.featuresSubtitle} onChange={(e) => updateText("featuresSubtitle", e.target.value)} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2 border p-3 rounded-xl bg-gray-50/50">
                            <label className="text-xs font-semibold text-gray-500 uppercase">Bénéfice 1</label>
                            <Input placeholder="Titre 1" value={texts.f1Title} onChange={(e) => updateText("f1Title", e.target.value)} className="text-sm" />
                            <Input placeholder="Description 1" value={texts.f1Desc} onChange={(e) => updateText("f1Desc", e.target.value)} className="text-sm" />
                        </div>
                        <div className="space-y-2 border p-3 rounded-xl bg-gray-50/50">
                            <label className="text-xs font-semibold text-gray-500 uppercase">Bénéfice 2</label>
                            <Input placeholder="Titre 2" value={texts.f2Title} onChange={(e) => updateText("f2Title", e.target.value)} className="text-sm" />
                            <Input placeholder="Description 2" value={texts.f2Desc} onChange={(e) => updateText("f2Desc", e.target.value)} className="text-sm" />
                        </div>
                        <div className="space-y-2 border p-3 rounded-xl bg-gray-50/50">
                            <label className="text-xs font-semibold text-gray-500 uppercase">Bénéfice 3</label>
                            <Input placeholder="Titre 3" value={texts.f3Title} onChange={(e) => updateText("f3Title", e.target.value)} className="text-sm" />
                            <Input placeholder="Description 3" value={texts.f3Desc} onChange={(e) => updateText("f3Desc", e.target.value)} className="text-sm" />
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="space-y-2 mt-6 pt-4 border-t">
                        <h4 className="font-medium text-sm text-indigo-600">Section Appel à l'Action (CTA)</h4>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Titre du CTA</label>
                        <Input value={texts.ctaTitle} onChange={(e) => updateText("ctaTitle", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Sous-titre du CTA</label>
                        <Input value={texts.ctaSubtitle} onChange={(e) => updateText("ctaSubtitle", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Texte du Bouton CTA</label>
                            <Input value={texts.ctaButton} onChange={(e) => updateText("ctaButton", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Texte de Garantie</label>
                            <Input value={texts.ctaGuarantee} onChange={(e) => updateText("ctaGuarantee", e.target.value)} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end pt-4 border-t mt-6">
                    <Button onClick={handleSave} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Sauvegarde..." : "Enregistrer les modifications"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
