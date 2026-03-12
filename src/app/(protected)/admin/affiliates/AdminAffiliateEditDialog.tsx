"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Settings2 } from "lucide-react";

interface AdminAffiliateEditDialogProps {
    affiliateId: string;
    currentCommission: number;
    currentDiscount: number;
}

export default function AdminAffiliateEditDialog({ affiliateId, currentCommission, currentDiscount }: AdminAffiliateEditDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [commissionRate, setCommissionRate] = useState(currentCommission);
    const [discount, setDiscount] = useState(currentDiscount);
    const router = useRouter();

    const handleSave = async () => {
        if (commissionRate < 0 || commissionRate > 100) {
            toast.error("La commission doit être entre 0 et 100");
            return;
        }
        if (discount < 0 || discount > 100) {
            toast.error("La réduction doit être entre 0 et 100");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/affiliates/${affiliateId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ commissionRate, discount })
            });

            if (!res.ok) {
                const data = await res.json();
                toast.error(data.error || "Une erreur est survenue");
                return;
            }

            toast.success("Taux mis à jour avec succès");
            setOpen(false);
            router.refresh(); // Refresh the page to show new rates
        } catch (error) {
            toast.error("Erreur réseau");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Settings2 className="h-4 w-4" />
                    Taux
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Éditer les taux</DialogTitle>
                    <DialogDescription>
                        Ajustez la commission gagnée par l'affilié et la réduction offerte sur son code promotionnel.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="commissionRate" className="text-right">
                            Commission (%)
                        </Label>
                        <Input
                            id="commissionRate"
                            type="number"
                            value={commissionRate}
                            onChange={(e) => setCommissionRate(Number(e.target.value))}
                            className="col-span-3"
                            min={0}
                            max={100}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="discount" className="text-right">
                            Réduction (%)
                        </Label>
                        <Input
                            id="discount"
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(Number(e.target.value))}
                            className="col-span-3"
                            min={0}
                            max={100}
                        />
                    </div>
                </div>
                <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded-md mb-2">
                    Si le % de réduction est modifié, le code actuel dans Stripe sera remplacé par un nouveau code tout en gardant le même nom public (ex: AFF-XYZ).
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Annuler</Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Sauvegarder
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
