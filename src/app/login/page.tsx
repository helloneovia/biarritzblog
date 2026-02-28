"use client"
import { Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

// Inner component that uses useSearchParams — must be inside Suspense
function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (res?.error) {
                setError("Email ou mot de passe incorrect")
            } else {
                router.push(callbackUrl)
                router.refresh()
            }
        } catch (err) {
            setError("Une erreur inattendue s'est produite")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Adresse Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        placeholder="client@exemple.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Mot de passe</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl text-lg font-bold shadow-md"
            >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
        </form>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="max-w-md w-full space-y-8 bg-card p-10 rounded-3xl border shadow-xl">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-foreground">
                        Mon Espace Client
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Suivez vos commandes, gérez votre profil et accédez au support.
                    </p>
                </div>
                {/* Suspense required by Next.js 15 for useSearchParams() */}
                <Suspense fallback={<div className="h-40 flex items-center justify-center text-muted-foreground text-sm">Chargement...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    )
}
