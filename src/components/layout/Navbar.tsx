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
                        <Image src="/logo.svg" alt="Biarritz Logo" width={120} height={30} className="h-8 w-auto object-contain" priority />
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/blog" className="transition-colors hover:text-foreground/80 font-bold text-primary">
                            {t.navBlog}
                        </Link>
                        <Link href="/#benefits" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            {t.navBenefits}
                        </Link>
                        <Link href="/#reviews" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            {t.navReviews}
                        </Link>
                        <Link href="/#faq" className="transition-colors hover:text-foreground/80 text-foreground/60">
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
                    <Button className="hidden md:inline-flex rounded-full" asChild>
                        <Link href="/product">{t.navShop}</Link>
                    </Button>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
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
