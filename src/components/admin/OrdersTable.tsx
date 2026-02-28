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
import { Eye, Edit, Search, Package, MapPin, CreditCard } from "lucide-react";

type Order = any;

export function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [updateStatus, setUpdateStatus] = useState("");
    const [updateTrackingNumber, setUpdateTrackingNumber] = useState("");
    const [updateTrackingUrl, setUpdateTrackingUrl] = useState("");

    const filteredOrders = orders.filter(
        (order) =>
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenDetail = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
    };

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
            setOrders(orders.map(o => o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o));
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
                                    Aucune commande trouvée.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map((order) => (
                                <TableRow key={order.id} className="hover:bg-muted/20">
                                    <TableCell className="font-medium text-xs font-mono">
                                        #{order.id.slice(-8).toUpperCase()}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{order.firstName} {order.lastName}</div>
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
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleOpenDetail(order)}
                                                title="Voir les détails"
                                            >
                                                <Eye className="h-4 w-4 text-indigo-600" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleOpenUpdateModal(order)}
                                                title="Modifier"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* === ORDER DETAIL MODAL === */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-indigo-600" />
                            Commande #{selectedOrder?.id.slice(-8).toUpperCase()}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedOrder && `${selectedOrder.firstName} ${selectedOrder.lastName} — ${new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}`}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-5 pt-2">
                            {/* Status badge */}
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" className={`text-sm px-3 py-1 ${getStatusColor(selectedOrder.status)}`}>
                                    {getStatusLabel(selectedOrder.status)}
                                </Badge>
                                {selectedOrder.trackingNumber && (
                                    <span className="text-sm font-mono bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                                        📦 {selectedOrder.trackingNumber}
                                    </span>
                                )}
                            </div>

                            {/* Items */}
                            <div>
                                <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider mb-3 flex items-center gap-2">
                                    <Package className="h-4 w-4" /> Articles commandés
                                </h3>
                                <div className="border rounded-xl overflow-hidden">
                                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                        <table className="w-full text-sm">
                                            <thead className="bg-muted/40">
                                                <tr>
                                                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Produit</th>
                                                    <th className="text-center px-4 py-2 font-medium text-muted-foreground">Taille</th>
                                                    <th className="text-center px-4 py-2 font-medium text-muted-foreground">Qté</th>
                                                    <th className="text-right px-4 py-2 font-medium text-muted-foreground">Prix</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {selectedOrder.items.map((item: any, i: number) => (
                                                    <tr key={i}>
                                                        <td className="px-4 py-3 font-medium">{item.product?.name || 'Semelle StepPrs'}</td>
                                                        <td className="px-4 py-3 text-center text-muted-foreground">{item.size || '—'}</td>
                                                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                                                        <td className="px-4 py-3 text-right font-bold text-indigo-700">{formatCurrency(item.price * item.quantity)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-muted/20 border-t-2">
                                                <tr>
                                                    <td colSpan={3} className="px-4 py-3 font-bold text-right">TOTAL</td>
                                                    <td className="px-4 py-3 text-right font-extrabold text-lg text-indigo-700">{formatCurrency(selectedOrder.totalAmount)}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    ) : (
                                        <p className="text-sm text-muted-foreground p-4">Aucun article trouvé pour cette commande.</p>
                                    )}
                                </div>
                            </div>

                            {/* Shipping address */}
                            <div>
                                <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider mb-3 flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> Adresse de livraison
                                </h3>
                                <div className="bg-muted/30 rounded-xl px-4 py-3 text-sm space-y-0.5">
                                    <p className="font-semibold">{selectedOrder.firstName} {selectedOrder.lastName}</p>
                                    <p>{selectedOrder.address}</p>
                                    <p>{selectedOrder.postalCode} {selectedOrder.city}, {selectedOrder.country}</p>
                                    <p className="text-muted-foreground pt-1">{selectedOrder.email}</p>
                                </div>
                            </div>

                            {/* Tracking */}
                            {selectedOrder.trackingUrl && (
                                <div>
                                    <h3 className="text-sm font-bold uppercase text-muted-foreground tracking-wider mb-2 flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" /> Suivi de colis
                                    </h3>
                                    <a
                                        href={selectedOrder.trackingUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors"
                                    >
                                        Suivre le colis →
                                    </a>
                                </div>
                            )}

                            <div className="flex justify-end pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsDetailModalOpen(false);
                                        handleOpenUpdateModal(selectedOrder);
                                    }}
                                >
                                    <Edit className="h-4 w-4 mr-2" /> Modifier le statut
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* === UPDATE MODAL === */}
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
                                placeholder="https://..."
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
