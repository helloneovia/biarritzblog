"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, Menu } from "lucide-react"
import { usePathname } from "next/navigation"

type NavItem = {
    label: string
    href: string
    icon: any
    colorClass?: string
}

export function MobileDashboardMenu({ items, signOutNode }: { items: NavItem[], signOutNode: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    // Close menu when route changes
    useEffect(() => {
        setOpen(false)
    }, [pathname])

    // Find current active item
    const activeItem = items.find(item => item.href === pathname) || items[0]
    const ActiveIcon = activeItem?.icon || Menu

    return (
        <div className="md:hidden relative">
            <button 
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between bg-muted/50 hover:bg-muted px-4 py-3 rounded-xl font-semibold transition-colors"
            >
                <div className="flex items-center gap-3">
                    <ActiveIcon className="h-5 w-5 text-muted-foreground" />
                    <span>{activeItem?.label || "Menu"}</span>
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-xl shadow-lg z-50 flex flex-col p-2 space-y-1 animate-in fade-in slide-in-from-top-2">
                    {items.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                    isActive 
                                    ? 'bg-primary/10 text-primary' 
                                    : 'hover:bg-muted text-foreground'
                                } ${item.colorClass || ''}`}
                            >
                                <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                                {item.label}
                            </Link>
                        )
                    })}
                    <div className="pt-2 mt-2 border-t">
                        {signOutNode}
                    </div>
                </div>
            )}
            
            {/* Backdrop for closing when clicking outside */}
            {open && (
                <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                />
            )}
        </div>
    )
}
