import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 403 }
            );
        }

        const { currencyCode, language, contactEmail, homeTitle, texts } = await req.json();

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

        return NextResponse.json(config);
    } catch (error) {
        console.error("Config update error:", error);
        return NextResponse.json(
            { error: "Erreur lors de l'enregistrement des paramètres" },
            { status: 500 }
        );
    }
}
