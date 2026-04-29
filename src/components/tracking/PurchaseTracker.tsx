"use client"

import { useEffect, useRef } from "react"

export function PurchaseTracker({ order }: { order: any }) {
    const hasFired = useRef(false)

    useEffect(() => {
        if (!order || hasFired.current || typeof window === 'undefined') return
        
        hasFired.current = true // Prevent double firing in Strict Mode

        const itemIds = order.items?.map((item: any) => String(item.productId)) || []
        const numItems = order.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 1

        try {
            // Snapchat Purchase Event
            if ((window as any).snaptr) {
                (window as any).snaptr('track', 'PURCHASE', {
                    'price': order.totalAmount,
                    'currency': 'EUR',
                    'transaction_id': order.id,
                    'item_ids': itemIds,
                    'number_items': numItems
                });
            }

            // TikTok Purchase Event
            if ((window as any).ttq) {
                (window as any).ttq.track('CompletePayment', {
                    'value': order.totalAmount,
                    'currency': 'EUR',
                    'contents': order.items?.map((item: any) => ({
                        'content_id': String(item.productId),
                        'content_type': 'product',
                        'quantity': item.quantity
                    })) || []
                });
            }
        } catch (e) {
            console.error("Failed to fire purchase pixel", e)
        }
    }, [order])

    return null
}
