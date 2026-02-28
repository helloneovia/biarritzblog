import { prisma } from "@/lib/prisma";
import { CMSSettings } from "@/components/admin/CMSSettings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    // Always fetch 'global' or create it if missing
    let config = await prisma.siteConfig.findUnique({
        where: { id: "global" }
    });

    if (!config) {
        config = await prisma.siteConfig.create({
            data: {
                id: "global",
                currencyCode: "EUR",
                language: "FR",
                contactEmail: "support@biarritz.blog",
                homeTitle: "Biarritzblog - Premium Orthopaedic Insoles",
                texts: {}
            }
        });
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Paramètres du Site</h1>
                <p className="text-muted-foreground mt-2">
                    Gérez la configuration globale de votre boutique (Devises, langues, e-mails de contact).
                </p>
            </div>

            <CMSSettings initialConfig={config} />
        </div>
    );
}
