"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Check, X } from "lucide-react";

export default function AdminPayoutActions({ payoutId }: { payoutId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleAction = async (status: "PAID" | "REJECTED") => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/affiliates/payouts/${payoutId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });

            if (!res.ok) {
                const data = await res.json();
                toast.error(data.error || "Erreur");
                return;
            }

            toast.success(`Demande marquée comme ${status}`);
            router.refresh();
        } catch (error) {
            toast.error("Erreur réseau");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                size="sm"
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleAction("PAID")}
                disabled={isLoading}
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                Payer
            </Button>

            <Button
                size="sm"
                variant="destructive"
                onClick={() => handleAction("REJECTED")}
                disabled={isLoading}
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-1" />}
                Refuser
            </Button>
        </div>
    );
}
