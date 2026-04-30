"use client"

import Script from "next/script"

export function GoogleAdsScript() {
    return (
        <>
            <Script
                strategy="afterInteractive"
                src="https://www.googletagmanager.com/gtag/js?id=AW-18127261012"
            />
            <Script
                id="google-ads-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'AW-18127261012');
                    `,
                }}
            />
        </>
    )
}
