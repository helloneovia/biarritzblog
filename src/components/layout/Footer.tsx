import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t bg-muted/20">
            <div className="container mx-auto px-4 py-8 md:py-12 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">StepPrs</h3>
                        <p className="text-sm text-muted-foreground">
                            Premium orthopaedic insoles designed for maximum comfort, posture correction, and pain relief.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/product" className="hover:text-primary">Orthopaedic Insoles</Link></li>
                            <li><Link href="/#bundles" className="hover:text-primary">Bundles & Offers</Link></li>
                            <li><Link href="/#reviews" className="hover:text-primary">Customer Reviews</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
                            <li><Link href="/#faq" className="hover:text-primary">FAQ</Link></li>
                            <li><Link href="/login?callbackUrl=/dashboard" className="hover:text-primary">Track Order</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/legal/terms" className="hover:text-primary">Terms of Service</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                            <li><Link href="/legal/returns" className="hover:text-primary">Returns Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} StepPrs. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
