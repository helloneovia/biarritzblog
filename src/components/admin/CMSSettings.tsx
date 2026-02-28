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
    const [isSaving, setIsSaving] = useState(false);

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
