import Link from "next/link"
import { cookies } from "next/headers"
import { getSiteConfig, getTexts, Locale } from "@/lib/i18n"

export async function Footer() {
    const cookieStore = await cookies()
    const locale = (cookieStore.get("NEXT_LOCALE")?.value || "EN") as Locale
    const config = await getSiteConfig()
    const t = getTexts(config, locale)
    return (
        <footer className="border-t bg-muted/20">
            <div className="container mx-auto px-4 py-8 md:py-12 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Biarritz</h3>
                        <p className="text-sm text-muted-foreground">
                            Premium orthopaedic insoles designed for maximum comfort, posture correction, and pain relief.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">{t.navShop}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/product" className="hover:text-primary">Orthopaedic Insoles</Link></li>
                            <li><Link href="/product" className="hover:text-primary">Bundles &amp; Offers</Link></li>
                            <li><Link href="/#reviews" className="hover:text-primary">{t.navReviews}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/contact" className="hover:text-primary">{t.footerContact}</Link></li>
                            <li><Link href="/#faq" className="hover:text-primary">{t.navFaq}</Link></li>
                            <li><Link href="/login?callbackUrl=/dashboard" className="hover:text-primary">Track Order</Link></li>
                            <li><Link href="/affiliate/register" className="hover:text-primary">Devenir Affilié</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/legal/terms" className="hover:text-primary">{t.footerTerms}</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-primary">{t.footerPrivacy}</Link></li>
                            <li><Link href="/legal/returns" className="hover:text-primary">{t.footerRefunds}</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Biarritz. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
