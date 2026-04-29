import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
    try {
        const stripe = await getStripe();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { affiliateProfile: true }
        });

        if (!user) {
            return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
        }

        if (user.affiliateProfile) {
            return NextResponse.json({ error: "Vous êtes déjà un affilié" }, { status: 400 });
        }

        // Generate a random unique promo code prefix
        const codeString = `AFF-${user.name?.slice(0, 3).toUpperCase() || 'PRO'}-${Math.floor(1000 + Math.random() * 9000)}`;

        // Check if there's a 20% off coupon in Stripe, if not create it
        const couponId = 'AFFILIATE_20_PERCENT';
        try {
            await stripe.coupons.retrieve(couponId);
        } catch (error: any) {
            if (error.statusCode === 404) {
                // Create the coupon
                await stripe.coupons.create({
                    id: couponId,
                    percent_off: 20,
                    duration: 'forever',
                    name: "20% Affilié"
                });
            } else {
                throw error;
            }
        }

        // Create the promotion code in Stripe
        await stripe.promotionCodes.create({
            coupon: couponId,
            code: codeString,
            active: true
        } as any);

        // Update user to AFFILIATE and create AffiliateProfile and PromoCode
        await prisma.$transaction(async (tx) => {
            // Update role if not already higher than USER (like ADMIN)
            if (user.role === 'USER') {
                await tx.user.update({
                    where: { id: user.id },
                    data: { role: 'AFFILIATE' }
                });
            }

            const profile = await tx.affiliateProfile.create({
                data: {
                    userId: user.id,
                }
            });

            await tx.promoCode.create({
                data: {
                    code: codeString,
                    discount: 20,
                    isPercent: true,
                    affiliateId: profile.id
                }
            });
        });

        return NextResponse.json({ success: true, code: codeString });

    } catch (error: any) {
        console.error("AFFILIATE_REGISTRATION_ERROR:", error);
        return NextResponse.json(
            { error: error.message || "Impossible de créer le profil d'affilié" },
            { status: 500 }
        );
    }
}
