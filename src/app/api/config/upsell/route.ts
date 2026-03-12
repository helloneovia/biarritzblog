import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const config = await prisma.siteConfig.findUnique({ where: { id: "global" } });
        const texts: any = config?.texts || {};
        return NextResponse.json({
            active: !!texts.upsellActive,
            title: texts.upsellTitle || "Livraison Express & Assurée",
            price: parseFloat(texts.upsellPrice) || 9.99
        });
    } catch {
        return NextResponse.json({ active: false, title: "", price: 0 });
    }
}
