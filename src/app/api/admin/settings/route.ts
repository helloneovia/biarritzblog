import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

// Allow large payloads (video base64) — bypass Next.js bodyParser limit
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 403 }
            );
        }

        // Use req.text() instead of req.json() to bypass Next.js 4MB bodyParser limit
        const rawBody = await req.text();
        const { currencyCode, language, contactEmail, homeTitle, texts } = JSON.parse(rawBody);

        const config = await prisma.siteConfig.upsert({
            where: {
                id: "global",
            },
            update: {
                currencyCode,
                language,
                contactEmail,
                homeTitle,
                texts,
            },
            create: {
                id: "global",
                currencyCode,
                language,
                contactEmail,
                homeTitle,
                texts: texts || {}
            }
        });

        // Invalidate the site-config cache so changes appear immediately on the site
        revalidateTag("site-config");

        return NextResponse.json(config);
    } catch (error) {
        console.error("Config update error:", error);
        return NextResponse.json(
            { error: "Erreur lors de l'enregistrement des paramètres" },
            { status: 500 }
        );
    }
}
