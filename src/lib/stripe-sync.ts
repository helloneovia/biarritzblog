import { getStripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { sendAccountCreatedEmail, sendOrderConfirmationEmail } from "@/lib/email"
import bcrypt from "bcryptjs"

export async function syncPaymentIntent(paymentIntentId: string) {
    const stripe = await getStripe();
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ['payment_method']
    }) as any;

    if (paymentIntent.status !== 'succeeded') {
        return null;
    }

    // Check if order already exists
    let order = await prisma.order.findUnique({
        where: { stripeSession: paymentIntentId },
        include: { items: { include: { product: true } } }
    });
    if (order) return order;

    // Try to extract email
    let email = paymentIntent.receipt_email;
    if (!email && paymentIntent.payment_method) {
        email = paymentIntent.payment_method.billing_details?.email;
    }
    if (!email) {
        email = `client-${paymentIntent.id.slice(-8).toLowerCase()}@biarritz.blog`;
    }

    const items = JSON.parse(paymentIntent.metadata?.items || "[]")
    const tempPassword = `Biarritz-${paymentIntent.id.slice(-6)}`;
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    
    let user = await prisma.user.findUnique({ where: { email } });
    let isNewUser = false;
    
    const shipping = paymentIntent.shipping || {};
    const customerName = shipping.name || "Client";
    const address = shipping.address || {};

    if (!user) {
        user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: customerName,
                role: "USER"
            }
        });
        isNewUser = true;
    }

    const firstName = customerName.split(' ')[0] || '';
    const lastName = customerName.split(' ').slice(1).join(' ') || '';
    const fullAddress = [
        address.line1,
        address.postal_code,
        address.city,
        address.country,
    ].filter(Boolean).join(', ');

    order = await prisma.order.create({
        data: {
            email,
            firstName,
            lastName,
            address: address.line1 || '',
            city: address.city || '',
            postalCode: address.postal_code || '',
            country: address.country || 'FR',
            totalAmount: (paymentIntent.amount || 0) / 100,
            status: "PAID",
            stripeSession: paymentIntent.id,
            userId: user.id,
            items: {
                create: items.map((item: any) => ({
                    product: {
                        connectOrCreate: {
                            where: { id: item.id?.toString() || "default" },
                            create: {
                                id: item.id?.toString() || "default",
                                name: `Bundle ${item.id}`,
                                description: "Generated from checkout",
                                price: Number(item.p) || 0,
                            }
                        }
                    },
                    quantity: item.q || 1,
                    price: Number(item.p) || 0,
                    size: item.size || ''
                }))
            }
        },
        include: { items: { include: { product: true } } }
    })

    const orderItemsForEmail = items.map((item: any) => ({
        name: `Semelles Biarritz (Bundle ${item.id})`,
        quantity: item.q || 1,
        price: Number(item.p) || 0,
        size: item.size || '',
    }))

    await sendOrderConfirmationEmail({
        email,
        name: customerName,
        orderId: order.id.slice(-8).toUpperCase(),
        orderItems: orderItemsForEmail,
        totalAmount: (paymentIntent.amount || 0) / 100,
        address: fullAddress,
    })

    if (isNewUser) {
        await sendAccountCreatedEmail({
            email,
            name: firstName || 'Client',
            tempPassword,
            orderId: order.id.slice(-8).toUpperCase(),
        })
    }

    return order;
}
