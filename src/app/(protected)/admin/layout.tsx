import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import Link from "next/link";
import {
    LayoutDashboard,
    Package,
    MessageSquare,
    Settings,
    LogOut,
    ArrowLeft,
    ShoppingBag,
    Users,
    CreditCard,
    BarChart3
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/auth/login?callbackUrl=/admin");
    }

    // Double check admin role
    if (session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const navItems = [
        { name: "Tableau de Bord", href: "/admin", icon: LayoutDashboard },
        { name: "Statistiques", href: "/admin/stats", icon: BarChart3 },
        { name: "Commandes", href: "/admin/orders", icon: Package },
        { name: "Produits & Offres", href: "/admin/products", icon: ShoppingBag },
        { name: "Support", href: "/admin/support", icon: MessageSquare },
        { name: "Affiliés & Virements", href: "/admin/affiliates", icon: Users },
        { name: "Paramètres (CMS)", href: "/admin/settings", icon: Settings },
        { name: "Modes de Paiement", href: "/admin/payments", icon: CreditCard },
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-slate-900 flex flex-col md:flex-row">
            {/* Admin Sidebar */}
            <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Boutique</span>
                    </Link>
                    <span className="text-xs bg-black text-white px-2 py-1 rounded-full font-bold">ADMIN</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
                            >
                                <Icon className="w-5 h-5 text-gray-500" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-4 px-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                            {session.user.name?.[0] || session.user.email?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {session.user.name || "Administrateur"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {session.user.email}
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/api/auth/signout"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Déconnexion
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
