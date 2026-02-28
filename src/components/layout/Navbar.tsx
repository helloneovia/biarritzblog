import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "@/components/layout/CartDrawer"

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold text-xl tracking-tight">StepPrs</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/blog" className="transition-colors hover:text-foreground/80 font-bold text-primary">
                            Blog
                        </Link>
                        <Link href="/#benefits" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Benefits
                        </Link>
                        <Link href="/#reviews" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Reviews
                        </Link>
                        <Link href="/#faq" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            FAQ
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <CartDrawer />
                    <Button className="hidden md:inline-flex rounded-full" asChild>
                        <Link href="/product">Shop Now</Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}
