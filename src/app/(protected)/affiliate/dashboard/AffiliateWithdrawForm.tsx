"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AffiliateWithdrawForm({ balance, initialIban, initialBic }: { balance: number, initialIban: string, initialBic: string }) {
    const [amount, setAmount] = useState<number>(balance);
    const [iban, setIban] = useState(initialIban);
    const [bic, setBic] = useState(initialBic);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (amount < 50) {
            toast.error("Le montant minimum est de 50€");
            return;
        }

        if (amount > balance) {
            toast.error("Solde insuffisant");
            return;
        }

        if (!iban || !bic) {
            toast.error("Veuillez renseigner votre IBAN et BIC");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/affiliates/payout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, iban, bic })
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Erreur de demande");
                return;
            }

            toast.success("Demande de virement envoyée !");
            router.refresh();
        } catch (error) {
            toast.error("Erreur de connexion");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="amount">Montant à retirer (€)</Label>
                <Input
                    id="amount"
                    type="number"
                    min={50}
                    max={balance}
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="iban">IBAN</Label>
                <Input
                    id="iban"
                    type="text"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    placeholder="FR76 1234..."
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bic">BIC / SWIFT</Label>
                <Input
                    id="bic"
                    type="text"
                    value={bic}
                    onChange={(e) => setBic(e.target.value)}
                    placeholder="ABCDEFGH"
                    required
                />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || balance < 50}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {balance < 50 ? "Solde insuffisant (min 50€)" : "Demander le virement"}
            </Button>
        </form>
    );
}
