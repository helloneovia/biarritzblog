import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Package, MessageCircle, Settings, LogOut, ShieldCheck, Gift } from "lucide-react"
import { SignOutButton } from "@/components/auth/SignOutButton"
import { getSiteConfig, getTexts, Locale } from "@/lib/i18n"
import { cookies } from "next/headers"
import { MobileDashboardMenu } from "@/components/dashboard/MobileDashboardMenu"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const cookieStore = await cookies()
    const locale = (cookieStore.get("NEXT_LOCALE")?.value || "EN") as Locale
    const config = await getSiteConfig()
    const t = getTexts(config, locale)

    const navItems = [
        { label: t.dashOrders || "My Orders", href: "/dashboard", icon: Package },
        { label: t.dashSupport || "Support Tickets", href: "/dashboard/support", icon: MessageCircle },
        { label: t.dashSettings || "Settings", href: "/dashboard/settings", icon: Settings },
    ]

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 min-h-screen mt-16 max-w-6xl">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">

                {/* Sidebar */}
                <div className="w-full md:w-64 shrink-0">
                    <div className="bg-card rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border sticky top-20 md:top-24 z-10">
                        {/* Profile header - Desktop */}
                        <div className="hidden md:flex items-center gap-3 mb-8 pb-6 border-b">
                            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                                {session.user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold truncate max-w-[150px]">{session.user?.name || (t.dashMember || "Member")}</p>
                                {session?.user?.role === "ADMIN" && (
                                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full mt-1 inline-block">Admin</span>
                                )}
                            </div>
                        </div>

                        {/* Profile header - Mobile */}
                        <div className="md:hidden flex items-center gap-3 mb-4 pb-4 border-b">
                            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                                {session.user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold truncate text-sm">{session.user?.name || (t.dashMember || "Member")}</p>
                            </div>
                        </div>

                        {/* Mobile Navigation Dropdown */}
                        <div className="md:hidden mt-2 mb-2">
                            <MobileDashboardMenu 
                                items={[
                                    ...navItems,
                                    ...(session?.user?.role === "AFFILIATE" ? [{ label: t.dashAffiliate || "Tableau de Bord Affilié", href: "/affiliate/dashboard", icon: Gift, colorClass: "text-green-600" }] : []),
                                    ...(session?.user?.role === "USER" ? [{ label: t.dashBecomeAffiliate || "Devenir Affilié (-15%)", href: "/affiliate/register", icon: Gift, colorClass: "text-green-600" }] : []),
                                    ...(session?.user?.role === "ADMIN" ? [{ label: t.navAdmin || "Admin Panel", href: "/admin", icon: ShieldCheck, colorClass: "text-primary" }] : [])
                                ]}
                                signOutNode={<SignOutButton label={t.dashSignOut || "Sign Out"} />}
                            />
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex flex-col space-y-2 pb-0">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium transition-colors"
                                >
                                    <item.icon className="h-5 w-5 text-muted-foreground" />
                                    {item.label}
                                </Link>
                            ))}

                            {/* Affiliate Link */}
                            {session?.user?.role === "AFFILIATE" ? (
                                <Link
                                    href="/affiliate/dashboard"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium transition-colors text-green-600"
                                >
                                    <Gift className="h-5 w-5" />
                                    {t.dashAffiliate || "Tableau de Bord Affilié"}
                                </Link>
                            ) : session?.user?.role === "USER" ? (
                                <Link
                                    href="/affiliate/register"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium transition-colors text-green-600"
                                >
                                    <Gift className="h-5 w-5" />
                                    {t.dashBecomeAffiliate || "Devenir Affilié (-15%)"}
                                </Link>
                            ) : null}

                            {/* Admin Link */}
                            {session?.user?.role === "ADMIN" && (
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium transition-colors text-primary"
                                >
                                    <ShieldCheck className="h-5 w-5" />
                                    {t.navAdmin || "Admin Panel"}
                                </Link>
                            )}

                            <div className="pt-4 mt-4 border-t">
                                <SignOutButton label={t.dashSignOut || "Sign Out"} />
                            </div>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {children}
                </div>

            </div>
        </div>
    )
}
