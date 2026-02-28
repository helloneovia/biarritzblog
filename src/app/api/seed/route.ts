import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    if (searchParams.get("secret") !== "updatedb123") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await prisma.product.deleteMany({});
        await prisma.bundle.deleteMany({});

        await prisma.product.create({
            data: {
                name: "Semelles Magnétiques d'Acupression Biarritz",
                description: "Semelles orthopédiques de massage par acupression avec aimants intégrés. Conçues de manière ergonomique avec un support de la voûte plantaire en matériau EVA pour un confort optimal tout au long de la journée. Idéales pour la fasciite plantaire, le soulagement de la douleur au talon et l'amélioration de la circulation sanguine.",
                price: 39.00,
                compareAt: 59.00,
                images: [
                    "https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/ee31bc82-89b4-43d8-877f-2fba2826636d.mp4/productVideoOptimized.mp4",
                    "https://m.media-amazon.com/images/I/510flNCi9PL.jpg",
                    "https://m.media-amazon.com/images/I/51+MaFQHSUL.jpg",
                    "https://m.media-amazon.com/images/I/51nBgPITl7L.jpg",
                    "https://m.media-amazon.com/images/I/51POFgjK4NL.jpg",
                    "https://m.media-amazon.com/images/I/510c+HTpP4L.jpg"
                ],
                features: ["Acupression Magnétique", "Support de la voûte plantaire", "Matériau EVA respirant", "Découpable sur mesure"],
                isPopular: true,
                variants: {
                    create: [
                        { sku: "BIA-MAG-S", size: "S (35-40)", stock: 500 },
                        { sku: "BIA-MAG-L", size: "L (41-46)", stock: 500 }
                    ]
                }
            }
        });

        await prisma.bundle.createMany({
            data: [
                { name: "Pack Essentiel", quantity: 1, price: 39.00, compareAt: 59.00, discount: 0, badge: null },
                { name: "Pack Confirmé (2 Paires)", quantity: 2, price: 59.00, compareAt: 118.00, discount: 50, badge: "Plus Populaire" },
                { name: "Pack Familial (3 Paires)", quantity: 3, price: 79.00, compareAt: 177.00, discount: 55, badge: "Meilleure Offre" }
            ]
        });

        return NextResponse.json({ success: true, message: "Database updated" });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
