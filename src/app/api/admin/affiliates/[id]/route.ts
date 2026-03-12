import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
        }

        const resolvedParams = await params;
        const { commissionRate, discount } = await req.json();

        if (commissionRate === undefined || discount === undefined) {
            return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
        }

        const affiliate = await prisma.affiliateProfile.findUnique({
            where: { id: resolvedParams.id },
            include: { promoCode: true }
        });

        if (!affiliate || !affiliate.promoCode) {
            return NextResponse.json({ error: "Affilié introuvable" }, { status: 404 });
        }

        const oldDiscount = affiliate.promoCode.discount;

        // If discount changed, we need to update Stripe
        if (discount !== oldDiscount) {
            const codeString = affiliate.promoCode.code;

            // 1. Find the old promotion code in Stripe and deactivate it
            const promotionCodes = await stripe.promotionCodes.list({
                code: codeString,
                active: true,
                limit: 1
            });

            if (promotionCodes.data.length > 0) {
                await stripe.promotionCodes.update(promotionCodes.data[0].id, {
                    active: false
                });
            }

            // 2. Ensure new Coupon exists
            const couponId = `AFFILIATE_${discount}_PERCENT`;
            try {
                await stripe.coupons.retrieve(couponId);
            } catch (error: any) {
                if (error.statusCode === 404) {
                    await stripe.coupons.create({
                        id: couponId,
                        percent_off: discount,
                        duration: 'forever',
                        name: `${discount}% Affilié`
                    });
                } else {
                    throw error;
                }
            }

            // 3. Create new PromotionCode with the same text
            await stripe.promotionCodes.create({
                coupon: couponId,
                code: codeString,
                active: true
            } as any);
        }

        // Update DB
        await prisma.$transaction(async (tx) => {
            await tx.affiliateProfile.update({
                where: { id: affiliate.id },
                data: { commissionRate: Number(commissionRate) }
            });

            await tx.promoCode.update({
                where: { id: affiliate.promoCode!.id },
                data: { discount: Number(discount) }
            });
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("ADMIN_AFFILIATE_UPDATE_ERROR:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
