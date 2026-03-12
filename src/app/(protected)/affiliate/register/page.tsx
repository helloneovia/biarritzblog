"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, DollarSign, Users, Award } from "lucide-react";

export default function AffiliateRegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/affiliates/register", {
                method: "POST",
            });
            const data = await res.json();

            if (!res.ok) {
                if (data.error === "Vous êtes déjà un affilié") {
                    router.push("/affiliate/dashboard");
                } else {
                    toast.error(data.error || "Une erreur est survenue");
                }
                return;
            }

            toast.success("Bienvenue dans le programme d'affiliation !");
            router.push("/affiliate/dashboard");
        } catch (error) {
            toast.error("Erreur de connexion");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl py-20 px-4">
            <Card className="shadow-lg border-2 border-primary/10">
                <CardHeader className="text-center space-y-4">
                    <CardTitle className="text-3xl font-bold tracking-tight">Programme d'Affiliation Biarritz</CardTitle>
                    <CardDescription className="text-lg">
                        Devenez partenaire et gagnez de l'argent en recommandant nos semelles orthopédiques.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="flex flex-col items-center text-center space-y-2">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <DollarSign className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold">50% de Commission</h3>
                            <p className="text-sm text-muted-foreground">Sur chaque vente générée</p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-2">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <Award className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold">Code de Réduction</h3>
                            <p className="text-sm text-muted-foreground">-15% offert à vos clients</p>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-2">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold">Accès Exclusif</h3>
                            <p className="text-sm text-muted-foreground">Une interface pour suivre vos gains</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button
                        size="lg"
                        className="w-full text-lg h-14"
                        onClick={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Création de votre profil...
                            </>
                        ) : (
                            "Rejoindre le programme"
                        )}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                        En rejoignant le programme, vous acceptez nos conditions générales d'affiliation.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
