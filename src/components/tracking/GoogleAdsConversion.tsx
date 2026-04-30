"use client"

import Script from "next/script"

interface GoogleAdsConversionProps {
    transactionId: string
    value: number
}

export function GoogleAdsConversion({ transactionId, value }: GoogleAdsConversionProps) {
    if (!transactionId) return null

    return (
        <Script
            id="google-ads-conversion"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
                __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('event', 'conversion', {
                        'send_to': 'AW-18127261012/rI8wCLHMvaQcENSa4MND',
                        'value': ${value},
                        'currency': 'EUR',
                        'transaction_id': '${transactionId}'
                    });
                `,
            }}
        />
    )
}
