"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Eye, Edit, Truck, Search } from "lucide-react";

type Order = any; // Will be properly typed when connected to prisma

export function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Form states for update
    const [updateStatus, setUpdateStatus] = useState("");
    const [updateTrackingNumber, setUpdateTrackingNumber] = useState("");
    const [updateTrackingUrl, setUpdateTrackingUrl] = useState("");

    const filteredOrders = orders.filter(
        (order) =>
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenUpdateModal = (order: Order) => {
        setSelectedOrder(order);
        setUpdateStatus(order.status);
        setUpdateTrackingNumber(order.trackingNumber || "");
        setUpdateTrackingUrl(order.trackingUrl || "");
        setIsUpdateModalOpen(true);
    };

    const handleUpdateOrder = async () => {
        if (!selectedOrder) return;
        setIsUpdating(true);

        try {
            const response = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: updateStatus,
                    trackingNumber: updateTrackingNumber || null,
                    trackingUrl: updateTrackingUrl || null,
                }),
            });

            if (!response.ok) throw new Error("Erreur lors de la mise à jour");

            const updatedOrder = await response.json();

            // Update local state
            setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
            setIsUpdateModalOpen(false);
        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue lors de la mise à jour de la commande.");
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-yellow-100 text-yellow-800";
            case "PAID": return "bg-blue-100 text-blue-800";
            case "SHIPPED": return "bg-indigo-100 text-indigo-800";
            case "DELIVERED": return "bg-green-100 text-green-800";
            case "CANCELED": return "bg-red-100 text-red-800";
            case "REFUNDED": return "bg-gray-100 text-gray-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "PENDING": return "En attente";
            case "PAID": return "Payée";
            case "SHIPPED": return "Expédiée";
            case "DELIVERED": return "Livrée";
            case "CANCELED": return "Annulée";
            case "REFUNDED": return "Remboursée";
            default: return status;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm ml-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Chercher (ID, Email, Nom)..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Numéro</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    Aucune commande ne correspond à votre recherche.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium text-xs">
                                        {order.id.slice(-8).toUpperCase()}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                    </TableCell>
                                    <TableCell>
                                        <div>{order.firstName} {order.lastName}</div>
                                        <div className="text-xs text-muted-foreground">{order.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={getStatusColor(order.status)}>
                                            {getStatusLabel(order.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {formatCurrency(order.totalAmount)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleOpenUpdateModal(order)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Update Modal */}
            <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Modifier la commande</DialogTitle>
                        <DialogDescription>
                            {selectedOrder && `Commande #${selectedOrder.id.slice(-8).toUpperCase()} - ${selectedOrder.firstName} ${selectedOrder.lastName}`}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right text-sm font-medium">Statut</label>
                            <div className="col-span-3">
                                <Select value={updateStatus} onValueChange={setUpdateStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez un statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PENDING">En attente (Non payée)</SelectItem>
                                        <SelectItem value="PAID">Payée (A préparer)</SelectItem>
                                        <SelectItem value="SHIPPED">Expédiée (En transit)</SelectItem>
                                        <SelectItem value="DELIVERED">Livrée (Terminée)</SelectItem>
                                        <SelectItem value="CANCELED">Annulée</SelectItem>
                                        <SelectItem value="REFUNDED">Remboursée</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right text-sm font-medium">N° Suivi</label>
                            <Input
                                value={updateTrackingNumber}
                                onChange={(e) => setUpdateTrackingNumber(e.target.value)}
                                className="col-span-3"
                                placeholder="Ex: 8X000000000"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right text-sm font-medium">Lien Suivi</label>
                            <Input
                                value={updateTrackingUrl}
                                onChange={(e) => setUpdateTrackingUrl(e.target.value)}
                                className="col-span-3"
                                placeholder="Ex: https://www.laposte.fr/outils/suivre-vos-envois"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)}>Annuler</Button>
                        <Button onClick={handleUpdateOrder} disabled={isUpdating}>
                            {isUpdating ? "Sauvegarde..." : "Sauvegarder"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
