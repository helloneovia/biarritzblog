"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowRight } from "lucide-react"

export function AutoLoginButton({ 
    email, 
    password 
}: { 
    email: string
    password?: string | null
}) {
    const [isLoading, setIsLoading] = useState(false)

    const handleAutoLogin = async () => {
        setIsLoading(true)
        if (password) {
            // Auto login with credentials
            await signIn("credentials", {
                email,
                password,
                callbackUrl: "/dashboard",
                redirect: true
            })
        } else {
            // If no password provided, just redirect to login
            window.location.href = `/login?email=${encodeURIComponent(email)}&callbackUrl=/dashboard`
        }
    }

    return (
        <Button 
            size="lg" 
            onClick={handleAutoLogin} 
            disabled={isLoading}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 font-bold uppercase tracking-wider"
        >
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connexion en cours...
                </>
            ) : (
                <>
                    Accéder à mon espace client <ArrowRight className="ml-2 h-5 w-5" />
                </>
            )}
        </Button>
    )
}
