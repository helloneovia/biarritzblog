import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/options"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Package, MessageCircle, Settings, LogOut, ShieldCheck } from "lucide-react"
import { SignOutButton } from "@/components/auth/SignOutButton"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const navItems = [
        { label: "My Orders", href: "/dashboard", icon: Package },
        { label: "Support Tickets", href: "/dashboard/support", icon: MessageCircle },
        { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ]

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen mt-16 max-w-6xl">
            <div className="flex flex-col md:flex-row gap-8">

                {/* Sidebar */}
                <div className="w-full md:w-64 shrink-0">
                    <div className="bg-card rounded-3xl p-6 shadow-sm border sticky top-24">
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b">
                            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                                {session.user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold truncate max-w-[150px]">{session.user?.name || "Member"}</p>
                                {session?.user?.role === "ADMIN" && (
                                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full mt-1 inline-block">Admin</span>
                                )}
                            </div>
                        </div>

                        <nav className="space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium transition-colors"
                                >
                                    <item.icon className="h-4 w-4 text-muted-foreground" />
                                    {item.label}
                                </Link>
                            ))}

                            {/* Admin Link */}
                            {session?.user?.role === "ADMIN" && (
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium transition-colors text-primary"
                                >
                                    <ShieldCheck className="h-4 w-4" />
                                    Admin Panel
                                </Link>
                            )}

                            <div className="pt-4 mt-6 border-t">
                                <SignOutButton />
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
