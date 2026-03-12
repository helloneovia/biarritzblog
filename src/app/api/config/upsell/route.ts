import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const upsells = await prisma.product.findMany({
            where: { type: "UPSELL" },
            orderBy: { createdAt: "asc" }
        });
        return NextResponse.json(upsells.map(u => ({
            id: u.id,
            name: u.name,
            price: u.price,
            compareAt: u.compareAt,
            image: u.images?.[0] || ""
        })));
    } catch {
        return NextResponse.json([]);
    }
}
