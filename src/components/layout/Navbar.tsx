import Image from "next/image"
import Link from "next/link"
import { headers } from "next/headers"
import { cookies } from "next/headers"
import { Menu, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { CartDrawer } from "@/components/layout/CartDrawer"
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher"
import { getSiteConfig, getTexts, Locale } from "@/lib/i18n"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"

export async function Navbar() {
    const session = await getServerSession(authOptions)
    const cookieStore = await cookies()
    const locale = (cookieStore.get("NEXT_LOCALE")?.value || "FR") as Locale

    const config = await getSiteConfig()
    const t = getTexts(config, locale)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center space-x-2">
                        {/* Stepprs inspired logo style */}
                        <div className="bg-primary text-white font-black text-2xl tracking-tighter px-3 py-1 rounded-sm flex items-center justify-center transform hover:scale-105 transition-transform">
                            biarritz.
                        </div>
                    </Link>
                    <nav className="hidden lg:flex items-center gap-6 text-sm font-bold uppercase tracking-wider">
                        <Link href="/blog" className="transition-colors hover:text-primary text-foreground/80">
                            {t.navBlog}
                        </Link>
                        <Link href="/#benefits" className="transition-colors hover:text-primary text-foreground/80">
                            {t.navBenefits}
                        </Link>
                        <Link href="/#reviews" className="transition-colors hover:text-primary text-foreground/80">
                            {t.navReviews}
                        </Link>
                        <Link href="/#faq" className="transition-colors hover:text-primary text-foreground/80">
                            {t.navFaq}
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
                                    {t.navAdmin}
                                </Link>
                            )}
                            {session.user?.role === "AFFILIATE" && (
                                <Link href="/affiliate/dashboard" className="flex items-center gap-1 text-sm font-bold text-green-600 hover:text-green-800 transition-colors">
                                    <UserCircle className="h-5 w-5" />
                                    Affiliation
                                </Link>
                            )}
                            <Link href="/dashboard" className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                                <UserCircle className="h-5 w-5" />
                                {t.navDashboard}
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login" className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            <UserCircle className="h-5 w-5" />
                            {t.navLogin}
                        </Link>
                    )}
                    <CartDrawer t={t} />
                    <Button className="hidden lg:inline-flex rounded-xl font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all" asChild>
                        <Link href="/product">{t.navShop}</Link>
                    </Button>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden ml-1">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <SheetHeader>
                                <SheetTitle className="text-left">Menu</SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col gap-4 mt-8">
                                <Link href="/blog" className="text-lg font-bold text-primary">{t.navBlog}</Link>
                                <Link href="/#benefits" className="text-lg font-medium hover:text-primary">{t.navBenefits}</Link>
                                <Link href="/#reviews" className="text-lg font-medium hover:text-primary">{t.navReviews}</Link>
                                <Link href="/#faq" className="text-lg font-medium hover:text-primary">{t.navFaq}</Link>
                            </nav>
                            <div className="flex flex-col gap-4 mt-8 border-t pt-8">
                                <LanguageSwitcher currentLocale={locale} />
                                {session ? (
                                    <>
                                        {session.user?.role === "ADMIN" && (
                                            <Link href="/admin" className="flex items-center gap-2 text-red-600 font-bold hover:text-red-800">
                                                <UserCircle className="h-5 w-5" />
                                                {t.navAdmin}
                                            </Link>
                                        )}
                                        {session.user?.role === "AFFILIATE" && (
                                            <Link href="/affiliate/dashboard" className="flex items-center gap-2 text-green-600 font-bold hover:text-green-800">
                                                <UserCircle className="h-5 w-5" />
                                                Affiliation
                                            </Link>
                                        )}
                                        <Link href="/dashboard" className="flex items-center gap-2 text-primary font-bold hover:text-primary/80">
                                            <UserCircle className="h-5 w-5" />
                                            {t.navDashboard}
                                        </Link>
                                    </>
                                ) : (
                                    <Link href="/login" className="flex items-center gap-2 font-medium text-muted-foreground hover:text-primary">
                                        <UserCircle className="h-5 w-5" />
                                        {t.navLogin}
                                    </Link>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
