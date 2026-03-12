import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
        }

        const { stripeUpsellPriceId } = await req.json();

        const config = await prisma.siteConfig.findUnique({ where: { id: "global" } });
        const texts = config?.texts as Record<string, any> || {};
        texts.stripeUpsellPriceId = stripeUpsellPriceId;

        await prisma.siteConfig.upsert({
            where: { id: "global" },
            update: { texts },
            create: { id: "global", texts }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Stripe Upsell save error:", error);
        return NextResponse.json({ error: "Erreur" }, { status: 500 });
    }
}
