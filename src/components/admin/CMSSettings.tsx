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
        announcement1: "🚀 NEW! 2024 Magnetic Technology is finally here.",
        announcement2: "✨ SPECIAL OFFER: 50% off for the next 100 orders!",
        announcement3: "📦 Free express delivery pending 🇺🇸",
        announcement4: "⭐ Over 50,000 satisfied customers!",
        // Clinical Stats
        clinicalBadge: "Clinically Validated", clinicalTitle: "The Future Is Foot Pain-Free",
        clinicalSubtitle: "Results from clinical and consumer studies.",
        clinical1Percent: "95%", clinical1Label: "Reduced Foot Pain", clinical1Desc: "Arch support & cushioning help foot pain.",
        clinical2Percent: "94%", clinical2Label: "Improved Comfort", clinical2Desc: "Comfort with every step.",
        clinical3Percent: "90%", clinical3Label: "Reduced Injury Risk", clinical3Desc: "Cushioning reduces foot injury risk.",
        clinicalNote: "* Results based on clinical and consumer satisfaction studies.",
        // Use Cases
        usecasesBadge: "For All Profiles", usecasesTitle: "Made for Everyone, Every Day",
        usecasesSubtitle: "Our insoles adapt to your life.",
        usecasesCta: "Your profile here?", usecasesCtaDesc: "Everyone deserves pain-free feet.",
        // Expert
        expertBadge: "Expert Opinions", expertTitle: "Recommended by Healthcare Professionals",
        expertSubtitle: "Podiatrists and physiotherapists attest to the effectiveness.",
        expertVerified: "Verified Professional",
        // La Différence
        differenceBadge: "Our Difference", differenceTitle: "The Biarritz Difference",
        differenceSubtitle: "A design crafted for your daily comfort.",
        difference1Title: "Improves Posture", difference1Desc: "Arch support promotes better spinal alignment.",
        difference2Title: "Boosts Performance", difference2Desc: "Each step gains cushioning.",
        difference3Title: "Adjustable Size", difference3Desc: "Cut along dotted lines for a perfect fit.",
        difference4Title: "Easily Washable", difference4Desc: "Hand wash, air dry in a few hours.",
        // Plantar Fasciitis Article
        plantarBadge: "OrthoInsider Exclusive", plantarAuthor: "By Dr. M. Laurent · Updated March 2026",
        plantarTitle: "Plantar Fasciitis: Why Orthopaedic Experts Are Shifting Their Recommendations",
        plantarIntro: "The 2 million people suffering the stabbing agony of Plantar Fasciitis know finding relief is a nightmare.",
        plantar1Title: "Instant Relief in Just One Wear", plantar1Desc: "Near-instant relief from the very first wear.",
        plantar2Title: "Clinically Validated", plantar2Desc: "Tested and approved by healthcare professionals.",
        plantar3Title: "Advanced Arch Support", plantar3Desc: "Calibrated arch support restores structural stability.",
        plantar4Title: "Targeted Massage Points", plantar4Desc: "Stimulates the fascia with every step.",
        plantar5Title: "Full 90-Day Guarantee", plantar5Desc: "Zero-risk 90-day money-back guarantee.",
        plantarClose: "The orthopaedic choice is clear.",
        plantarCloseDesc: "Clinical approval, instant relief, 50,000+ customers, 90-day guarantee.",
        // Coin Flip Game
        coinBadge: "🎮 Mini-Game", coinTitle: "Heads or Tails — Will You Buy?",
        coinSubtitle: "Undecided? Let fate decide.",
        coinHeadsLabel: "Heads", coinHeadsDesc: "= I'm buying!",
        coinTailsLabel: "Tails", coinTailsDesc: "= I'll think about it",
        coinQuestion: "Which side do you pick?",
        coinFlipping: "The coin is in the air... 🎲", coinChose: "You picked:",
        // Sticky CTA
        stickyAddToCart: "Add to Cart", stickyAdded: "Added ✓",
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
        announcement1: "🚀 NOUVEAU ! La technologie magnétique 2024 est enfin disponible.",
        announcement2: "✨ OFFRE SPÉCIALE : 50% de réduction pour les 100 prochaines commandes !",
        announcement3: "📦 Livraison express gratuite en France métropolitaine 🇫🇷",
        announcement4: "⭐ Plus de 50 000 clients satisfaits !",
        // Clinical Stats
        clinicalBadge: "Validé Cliniquement", clinicalTitle: "L'avenir, c'est des pieds sans douleur",
        clinicalSubtitle: "Résultats d'études cliniques et consommateurs.",
        clinical1Percent: "95%", clinical1Label: "Réduction de la douleur", clinical1Desc: "Le soutien de la voûte soulage significativement.",
        clinical2Percent: "94%", clinical2Label: "Amélioration du confort", clinical2Desc: "Un confort renforcé à chaque pas.",
        clinical3Percent: "90%", clinical3Label: "Réduction du risque de blessure", clinical3Desc: "L'amortissement aide à réduire les risques.",
        clinicalNote: "* Résultats basés sur des études cliniques et de satisfaction consommateurs.",
        // Use Cases
        usecasesBadge: "Pour Tous les Profils", usecasesTitle: "Fabriquées pour Tous, Chaque Jour",
        usecasesSubtitle: "Nos semelles s'adaptent à votre vie.",
        usecasesCta: "Votre profil ici ?", usecasesCtaDesc: "Tout le monde mérite des pieds sans douleur.",
        // Expert
        expertBadge: "Avis Experts", expertTitle: "Recommandé par les Professionnels de Santé",
        expertSubtitle: "Des podologues et kinésithérapeutes attestent de l'efficacité.",
        expertVerified: "Professionnel Vérifié",
        // La Différence
        differenceBadge: "Notre Différence", differenceTitle: "La Différence Biarritz",
        differenceSubtitle: "Une conception pensée pour votre confort au quotidien.",
        difference1Title: "Améliore la Posture", difference1Desc: "Le soutien de la voûte favorise un meilleur alignement.",
        difference2Title: "Booste les Performances", difference2Desc: "Chaque pas gagne en amorti.",
        difference3Title: "Taille Ajustable", difference3Desc: "Découpez le long des lignes pointillées.",
        difference4Title: "Facilement Lavables", difference4Desc: "Lavage à la main, séchage naturel.",
        // Plantar Fasciitis Article
        plantarBadge: "OrthoInsider Exclusif", plantarAuthor: "Par Dr. M. Laurent · Mis à jour Mars 2026",
        plantarTitle: "Fasciite Plantaire : Pourquoi les Experts Orthopédiques Changent leurs Recommandations",
        plantarIntro: "Les 2 millions de personnes souffrant des douleurs de la fasciite plantaire savent que trouver un soulagement ressemble à un parcours du combattant.",
        plantar1Title: "Un soulagement dès le Premier Port", plantar1Desc: "Efficacité quasi-immédiate dès le premier port.",
        plantar2Title: "Validées Cliniquement", plantar2Desc: "Testées et approuvées par des professionnels de santé.",
        plantar3Title: "Soutien de la Voûte Avancé", plantar3Desc: "Calibré pour soulever et stabiliser la structure naturelle du pied.",
        plantar4Title: "Points de Massage Ciblés", plantar4Desc: "Stimule le fascia à chaque pas.",
        plantar5Title: "Garantie 90 Jours", plantar5Desc: "Période d'essai 90 jours sans risque.",
        plantarClose: "Le choix orthopédique est clair.",
        plantarCloseDesc: "Approbation clinique, soulagement instantané, 50 000+ clients, filet 90 jours.",
        // Coin Flip Game
        coinBadge: "🎮 Mini-Jeu", coinTitle: "Pile ou Face — Tu Achètes ?",
        coinSubtitle: "Indécis ? Laisse le destin décider.",
        coinHeadsLabel: "Pile", coinHeadsDesc: "= J'achète !",
        coinTailsLabel: "Face", coinTailsDesc: "= Je réfléchis encore",
        coinQuestion: "Quel côté choisis-tu ?",
        coinFlipping: "La pièce est en l'air... 🎲", coinChose: "Tu as choisi :",
        // Sticky CTA
        stickyAddToCart: "Ajouter au panier", stickyAdded: "Ajouté ✓",
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
        announcement1: "🚀 ¡NUEVO! La tecnología magnética 2024 por fin está disponible.",
        announcement2: "✨ OFERTA ESPECIAL: ¡50% de descuento para los próximos 100 pedidos!",
        announcement3: "📦 Envío exprés gratuito 🇪🇸",
        announcement4: "⭐ ¡Más de 50.000 clientes satisfechos!",
        // Clinical Stats
        clinicalBadge: "Validado Clínicamente", clinicalTitle: "El futuro es un pie sin dolor",
        clinicalSubtitle: "Resultados de estudios clínicos y de consumidores.",
        clinical1Percent: "95%", clinical1Label: "Reducción del dolor", clinical1Desc: "El soporte del arco alivia el dolor de pies.",
        clinical2Percent: "94%", clinical2Label: "Mejora del confort", clinical2Desc: "Comodidad en cada paso.",
        clinical3Percent: "90%", clinical3Label: "Reducción del riesgo", clinical3Desc: "La amortiguación reduce el riesgo de lesiones.",
        clinicalNote: "* Resultados basados en estudios clínicos y de satisfacción.",
        // Use Cases
        usecasesBadge: "Para Todos los Perfiles", usecasesTitle: "Fabricadas para Todos, Cada Día",
        usecasesSubtitle: "Nuestras plantillas se adaptan a tu vida.",
        usecasesCta: "¿Tu perfil aquí?", usecasesCtaDesc: "Todo el mundo merece pies sin dolor.",
        // Expert
        expertBadge: "Opinión de Expertos", expertTitle: "Recomendado por Profesionales de la Salud",
        expertSubtitle: "Podólogos y fisioterapeutas avalan la eficacia.",
        expertVerified: "Profesional Verificado",
        // La Différence
        differenceBadge: "Nuestra Diferencia", differenceTitle: "La Diferencia Biarritz",
        differenceSubtitle: "Un diseño pensado para tu comodidad diaria.",
        difference1Title: "Mejora la Postura", difference1Desc: "El soporte del arco favorece el alineamiento.",
        difference2Title: "Aumenta el Rendimiento", difference2Desc: "Cada paso gana amortiguación.",
        difference3Title: "Talla Ajustable", difference3Desc: "Corta a lo largo de las líneas punteadas.",
        difference4Title: "Fácil de Lavar", difference4Desc: "Lavado a mano, secado natural.",
        // Plantar Fasciitis Article
        plantarBadge: "OrthoInsider Exclusivo", plantarAuthor: "Por Dr. M. Laurent · Actualizado Marzo 2026",
        plantarTitle: "Fascitis Plantar: Por Qué los Expertos Ortopédicos Están Cambiando sus Recomendaciones",
        plantarIntro: "Los 2 millones de personas que sufren la fascitis plantar saben que encontrar alivio es una pesadilla.",
        plantar1Title: "Alivio inmediato", plantar1Desc: "Eficacia casi inmediata desde el primer uso.",
        plantar2Title: "Validado clínicamente", plantar2Desc: "Testado y aprobado por profesionales de la salud.",
        plantar3Title: "Soporte de arco avanzado", plantar3Desc: "Calibrado estratégicamente para estabilizar el pie.",
        plantar4Title: "Puntos de masaje dirigidos", plantar4Desc: "Estimula la fascia con cada paso.",
        plantar5Title: "Garantía de 90 días", plantar5Desc: "Período de prueba sin riesgo de 90 días.",
        plantarClose: "La elección ortopédica es clara.",
        plantarCloseDesc: "Aprobación clínica, alivio instantáneo, 50,000+ clientes, garantía 90 días.",
        // Coin Flip Game
        coinBadge: "🎮 Mini-Juego", coinTitle: "Cara o Cruz — ¿Compras?",
        coinSubtitle: "¿Indeciso? Deja que el destino decida.",
        coinHeadsLabel: "Cara", coinHeadsDesc: "= ¡Compro!",
        coinTailsLabel: "Cruz", coinTailsDesc: "= Lo sigo pensando",
        coinQuestion: "¿Qué lado eliges?",
        coinFlipping: "La moneda está en el aire... 🎲", coinChose: "Elegiste:",
        // Sticky CTA
        stickyAddToCart: "Añadir al carrito", stickyAdded: "Añadido ✓",
    },
};

type SiteConfig = { id: string; currencyCode: string; language: string; contactEmail: string; homeTitle: string; texts: any; };

function ImageUploadField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // Upload file to /api/admin/upload which stores it in the Upload DB table.
    // Only the lightweight URL (/api/images/filename) is saved into the CMS texts JSON.
    // This prevents bloating SiteConfig with multi-MB base64 strings.
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 50 * 1024 * 1024) {
            alert("Fichier trop lourd (max 50 Mo). Réduisez-le ou utilisez une URL externe.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            // Store the URL path, not the base64 data
            onChange(data.url);
        } catch (err) {
            alert("Erreur lors de l'upload du fichier.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // For preview: if value is a data: URL (legacy), show it directly; otherwise use the URL
    const previewSrc = value;
    const isYoutube = previewSrc?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);

    return (
        <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground block">{label}</label>
            <div className="flex items-start gap-4">
                {value ? (
                    <div className="relative aspect-video w-40 rounded-xl overflow-hidden border border-gray-200 group bg-gray-50 flex-shrink-0">
                        {isYoutube ? (
                            <div className="relative w-full h-full">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={`https://img.youtube.com/vi/${isYoutube[1]}/0.jpg`} alt="youtube" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Video className="text-white h-6 w-6" /></div>
                            </div>
                        ) : value.match(/\.(mp4|webm)$/i) ? (
                            <div className="relative w-full h-full">
                                <video src={previewSrc} className="w-full h-full object-cover" muted />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Video className="text-white h-6 w-6" /></div>
                            </div>
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={previewSrc} alt="media" className="w-full h-full object-cover" />
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

                    {/* Announcement Bar */}
                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wide">Barre d'Annonce (Haut de page)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Annonce 1</label><input className={inputClass} value={texts.announcement1 || ""} onChange={e => updateText("announcement1", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Annonce 2</label><input className={inputClass} value={texts.announcement2 || ""} onChange={e => updateText("announcement2", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Annonce 3</label><input className={inputClass} value={texts.announcement3 || ""} onChange={e => updateText("announcement3", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Annonce 4</label><input className={inputClass} value={texts.announcement4 || ""} onChange={e => updateText("announcement4", e.target.value)} /></div>
                        </div>
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

                    {/* Clinical Stats */}
                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wide">Section Statistiques Cliniques</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Badge</label><input className={inputClass} value={texts.clinicalBadge || ""} onChange={e => updateText("clinicalBadge", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Titre</label><input className={inputClass} value={texts.clinicalTitle || ""} onChange={e => updateText("clinicalTitle", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Sous-titre</label><input className={inputClass} value={texts.clinicalSubtitle || ""} onChange={e => updateText("clinicalSubtitle", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Note légale</label><input className={inputClass} value={texts.clinicalNote || ""} onChange={e => updateText("clinicalNote", e.target.value)} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[1, 2, 3].map(n => (
                                <div key={n} className="border rounded-xl p-3 bg-muted/20 space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Stat {n}</label>
                                    <input className={inputClass} placeholder="%" value={texts[`clinical${n}Percent`] || ""} onChange={e => updateText(`clinical${n}Percent`, e.target.value)} />
                                    <input className={inputClass} placeholder="Libellé" value={texts[`clinical${n}Label`] || ""} onChange={e => updateText(`clinical${n}Label`, e.target.value)} />
                                    <input className={inputClass} placeholder="Description" value={texts[`clinical${n}Desc`] || ""} onChange={e => updateText(`clinical${n}Desc`, e.target.value)} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Use Cases & Expert */}
                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wide">Section Profils d&apos;Utilisateurs</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Badge</label><input className={inputClass} value={texts.usecasesBadge || ""} onChange={e => updateText("usecasesBadge", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Titre</label><input className={inputClass} value={texts.usecasesTitle || ""} onChange={e => updateText("usecasesTitle", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Sous-titre</label><input className={inputClass} value={texts.usecasesSubtitle || ""} onChange={e => updateText("usecasesSubtitle", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">CTA</label><input className={inputClass} value={texts.usecasesCta || ""} onChange={e => updateText("usecasesCta", e.target.value)} /></div>
                        </div>
                    </div>

                    {/* Expert Endorsement */}
                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wide">Section Avis Experts</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Badge</label><input className={inputClass} value={texts.expertBadge || ""} onChange={e => updateText("expertBadge", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Titre</label><input className={inputClass} value={texts.expertTitle || ""} onChange={e => updateText("expertTitle", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Sous-titre</label><input className={inputClass} value={texts.expertSubtitle || ""} onChange={e => updateText("expertSubtitle", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Label Vérifié</label><input className={inputClass} value={texts.expertVerified || ""} onChange={e => updateText("expertVerified", e.target.value)} /></div>
                        </div>
                    </div>

                    {/* Plantar Fasciitis Article */}
                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wide">Article Fasciite Plantaire (5 points)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Badge</label><input className={inputClass} value={texts.plantarBadge || ""} onChange={e => updateText("plantarBadge", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Auteur / Date</label><input className={inputClass} value={texts.plantarAuthor || ""} onChange={e => updateText("plantarAuthor", e.target.value)} /></div>
                            <div className="md:col-span-2"><label className="text-xs font-medium text-muted-foreground mb-1 block">Titre article</label><input className={inputClass} value={texts.plantarTitle || ""} onChange={e => updateText("plantarTitle", e.target.value)} /></div>
                            <div className="md:col-span-2"><label className="text-xs font-medium text-muted-foreground mb-1 block">Intro</label><textarea rows={2} className={`${inputClass} resize-none`} value={texts.plantarIntro || ""} onChange={e => updateText("plantarIntro", e.target.value)} /></div>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {[1, 2, 3, 4, 5].map(n => (
                                <div key={n} className="border rounded-xl p-3 bg-muted/20 grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase md:col-span-2">Point {n}</label>
                                    <input className={inputClass} placeholder={`Titre point ${n}`} value={texts[`plantar${n}Title`] || ""} onChange={e => updateText(`plantar${n}Title`, e.target.value)} />
                                    <textarea rows={2} className={`${inputClass} resize-none`} placeholder={`Description point ${n}`} value={texts[`plantar${n}Desc`] || ""} onChange={e => updateText(`plantar${n}Desc`, e.target.value)} />
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Titre de clôture</label><input className={inputClass} value={texts.plantarClose || ""} onChange={e => updateText("plantarClose", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Texte de clôture</label><input className={inputClass} value={texts.plantarCloseDesc || ""} onChange={e => updateText("plantarCloseDesc", e.target.value)} /></div>
                        </div>
                    </div>

                    {/* Coin Flip Game */}
                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wide">Mini-Jeu Pile ou Face</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Badge</label><input className={inputClass} value={texts.coinBadge || ""} onChange={e => updateText("coinBadge", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Titre</label><input className={inputClass} value={texts.coinTitle || ""} onChange={e => updateText("coinTitle", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Sous-titre</label><input className={inputClass} value={texts.coinSubtitle || ""} onChange={e => updateText("coinSubtitle", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Question</label><input className={inputClass} value={texts.coinQuestion || ""} onChange={e => updateText("coinQuestion", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Libellé Pile</label><input className={inputClass} value={texts.coinHeadsLabel || ""} onChange={e => updateText("coinHeadsLabel", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Description Pile</label><input className={inputClass} value={texts.coinHeadsDesc || ""} onChange={e => updateText("coinHeadsDesc", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Libellé Face</label><input className={inputClass} value={texts.coinTailsLabel || ""} onChange={e => updateText("coinTailsLabel", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Description Face</label><input className={inputClass} value={texts.coinTailsDesc || ""} onChange={e => updateText("coinTailsDesc", e.target.value)} /></div>
                        </div>
                    </div>

                    {/* Sticky CTA */}
                    <div className="space-y-3 pt-4 border-t">
                        <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wide">Barre Flottante (Sticky Add to Cart)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Texte Bouton</label><input className={inputClass} value={texts.stickyAddToCart || ""} onChange={e => updateText("stickyAddToCart", e.target.value)} /></div>
                            <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Texte Ajouté</label><input className={inputClass} value={texts.stickyAdded || ""} onChange={e => updateText("stickyAdded", e.target.value)} /></div>
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
