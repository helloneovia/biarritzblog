import Link from 'next/link'
import { CheckCircle, UserCircle, Key } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CheckoutSuccessPage({
    searchParams,
}: {
    searchParams: { session_id?: string }
}) {
    const sessionId = searchParams.session_id;
    const tempPassword = sessionId ? `Biarritz-${sessionId.slice(-6)}` : null;

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen mt-16 flex flex-col items-center justify-center">
            <div className="max-w-md w-full bg-card rounded-3xl p-8 text-center shadow-xl border relative overflow-hidden">
                <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-extrabold mb-4">Paiement Réussi !</h1>
                <p className="text-muted-foreground mb-8">
                    Merci pour votre achat ! Nous avons bien reçu votre commande et nous la préparons actuellement.
                </p>

                {tempPassword && (
                    <div className="mt-8 mb-8 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-left">
                        <div className="flex items-center gap-2 mb-2 text-indigo-900 font-semibold">
                            <UserCircle className="w-5 h-5" />
                            <span>Votre Espace Client A Été Créé</span>
                        </div>
                        <p className="text-sm text-indigo-700 mb-4">
                            Si vous n'aviez pas de compte, un compte a été créé automatiquement pour vous permettre de suivre l'expédition de votre commande.
                        </p>
                        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border">
                            <Key className="w-5 h-5 text-gray-400" />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium">Mot de passe temporaire :</p>
                                <p className="font-mono text-sm font-bold tracking-tight">{tempPassword}</p>
                            </div>
                        </div>
                        <p className="text-xs text-indigo-600 mt-3 flex items-center gap-1 opacity-80">
                            (Connectez-vous avec l'email utilisé lors du paiement, puis modifiez votre mot de passe dans les réglages de votre profil).
                        </p>
                    </div>
                )}

                <div className="space-y-3">
                    <Link href="/dashboard" className="block">
                        <Button size="lg" className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white">
                            Suivre ma commande
                        </Button>
                    </Link>
                    <Link href="/" className="block">
                        <Button variant="outline" size="lg" className="w-full rounded-xl">
                            Retour à la boutique
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

