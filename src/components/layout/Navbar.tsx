import Link from "next/link"
import { headers } from "next/headers"
import { cookies } from "next/headers"
import { Menu, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "@/components/layout/CartDrawer"
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"

export async function Navbar() {
    const session = await getServerSession(authOptions)
    const cookieStore = await cookies()
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "EN"

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
                <div className="flex items-center gap-3">
                    {/* Language Switcher */}
                    <div className="hidden sm:block">
                        <LanguageSwitcher currentLocale={locale} />
                    </div>

                    {session ? (
                        <div className="hidden sm:flex items-center gap-4">
                            {session.user?.role === "ADMIN" && (
                                <Link href="/admin" className="flex items-center gap-1 text-sm font-bold text-red-600 hover:text-red-800 transition-colors">
                                    <UserCircle className="h-5 w-5" />
                                    Admin
                                </Link>
                            )}
                            <Link href="/dashboard" className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                                <UserCircle className="h-5 w-5" />
                                Dashboard
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login" className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            <UserCircle className="h-5 w-5" />
                            Login
                        </Link>
                    )}
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
