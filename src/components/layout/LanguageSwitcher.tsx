"use client"
import { useState, useTransition } from "react"

const LOCALES = [
    { code: "EN", label: "EN", flag: "🇬🇧" },
    { code: "FR", label: "FR", flag: "🇫🇷" },
    { code: "ES", label: "ES", flag: "🇪🇸" },
]

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
    const [isPending, startTransition] = useTransition()
    const [active, setActive] = useState(currentLocale || "EN")

    const switchLocale = async (code: string) => {
        startTransition(async () => {
            await fetch("/api/locale", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ locale: code }),
            })
            setActive(code)
            window.location.reload()
        })
    }

    return (
        <div className="flex items-center gap-0.5 bg-muted/50 rounded-lg p-0.5 border">
            {LOCALES.map(l => (
                <button
                    key={l.code}
                    onClick={() => switchLocale(l.code)}
                    disabled={isPending}
                    className={`px-2 py-1 rounded-md text-xs font-semibold transition-all ${active === l.code
                            ? "bg-white shadow text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                    title={l.code}
                >
                    {l.flag} {l.label}
                </button>
            ))}
        </div>
    )
}
