"use client"
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SignOutButton({ label }: { label?: string }) {
    return (
        <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl whitespace-nowrap"
            onClick={() => signOut({ callbackUrl: "/" })}
        >
            <LogOut className="mr-3 h-4 w-4 shrink-0" />
            {label || "Sign Out"}
        </Button>
    )
}
