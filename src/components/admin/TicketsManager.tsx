"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send, User as UserIcon, ShieldAlert, CheckCircle2 } from "lucide-react";

type Message = any;
type Ticket = any;

export function TicketsManager({ initialTickets }: { initialTickets: Ticket[] }) {
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const selectedTicket = tickets.find(t => t.id === selectedTicketId) || null;

    const handleSendMessage = async () => {
        if (!selectedTicket || !newMessage.trim()) return;
        setIsSending(true);

        try {
            const response = await fetch(`/api/admin/tickets/${selectedTicket.id}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newMessage }),
            });

            if (!response.ok) throw new Error("Erreur d'envoi");

            const savedMessage = await response.json();

            // Update local state by adding the message
            setTickets(tickets.map(t => {
                if (t.id === selectedTicket.id) {
                    return {
                        ...t,
                        messages: [...t.messages, savedMessage],
                        status: t.status === "CLOSED" ? "OPEN" : t.status // Re-open if admin replies
                    };
                }
                return t;
            }));
            setNewMessage("");
        } catch (error) {
            console.error(error);
            alert("Impossible d'envoyer le message.");
        } finally {
            setIsSending(false);
        }
    };

    const handleToggleStatus = async (status: "OPEN" | "CLOSED" | "RESOLVED") => {
        if (!selectedTicket) return;
        setIsClosing(true);

        try {
            const response = await fetch(`/api/admin/tickets/${selectedTicket.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) throw new Error("Erreur de mise à jour du statut");

            const updatedTicket = await response.json();

            setTickets(tickets.map(t => t.id === updatedTicket.id ? { ...t, status: updatedTicket.status } : t));
        } catch (error) {
            console.error(error);
            alert("Impossible de changer le statut.");
        } finally {
            setIsClosing(false);
        }
    };

    const activeTickets = tickets.filter(t => t.status !== "CLOSED");
    const closedTickets = tickets.filter(t => t.status === "CLOSED");

    const renderTicketList = (list: Ticket[], title: string) => (
        <div className="space-y-2 mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {title} ({list.length})
            </h3>
            {list.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Aucun ticket</p>
            ) : (
                list.map((ticket) => (
                    <button
                        key={ticket.id}
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${selectedTicketId === ticket.id ? 'bg-indigo-50 border-indigo-200' : 'bg-white hover:bg-gray-50'}`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm truncate pr-2">{ticket.subject}</span>
                            <Badge variant="outline" className={`text-[10px] ${ticket.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                    ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-800 border-green-200' :
                                        'bg-gray-100 text-gray-800'
                                }`}>
                                {ticket.status}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                            {ticket.user.firstName} {ticket.user.lastName}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-2">
                            {new Date(ticket.updatedAt).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </button>
                ))
            )}
        </div>
    );

    return (
        <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
            {/* Sidebar list */}
            <div className="md:col-span-1 border rounded-xl bg-gray-50/50 p-4 overflow-y-auto">
                {renderTicketList(activeTickets, "Tickets Actifs")}
                {renderTicketList(closedTickets, "Tickets Fermés")}
            </div>

            {/* Chat Area */}
            <div className="md:col-span-2 border rounded-xl bg-white flex flex-col overflow-hidden">
                {!selectedTicket ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                        <ShieldAlert className="h-12 w-12 text-gray-200 mb-4" />
                        <p>Sélectionnez un ticket pour l'afficher.</p>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b bg-white flex justify-between items-center z-10">
                            <div>
                                <h2 className="font-semibold text-lg">{selectedTicket.subject}</h2>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <UserIcon className="h-3 w-3" />
                                    {selectedTicket.user.firstName} {selectedTicket.user.lastName} ({selectedTicket.user.email})
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {selectedTicket.status !== "RESOLVED" && (
                                    <Button variant="outline" size="sm" onClick={() => handleToggleStatus("RESOLVED")} disabled={isClosing}>
                                        <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
                                        Résolu
                                    </Button>
                                )}
                                {selectedTicket.status !== "CLOSED" && (
                                    <Button variant="outline" size="sm" onClick={() => handleToggleStatus("CLOSED")} disabled={isClosing}>
                                        Clôturer
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {selectedTicket.messages.map((message: Message) => {
                                const isAdmin = message.senderId !== selectedTicket.userId; // If sender is not the customer

                                return (
                                    <div key={message.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-2xl p-4 ${isAdmin ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white border text-gray-800 rounded-bl-sm shadow-sm'}`}>
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                            <p className={`text-[10px] mt-2 ${isAdmin ? 'text-indigo-200' : 'text-gray-400'}`}>
                                                {new Date(message.createdAt).toLocaleString('fr-FR', {
                                                    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                                                })}
                                                {isAdmin ? " • Moi (Admin)" : ""}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Reply Box */}
                        <div className="p-4 border-t bg-white">
                            <div className="flex gap-2">
                                <Textarea
                                    placeholder="Écrivez votre réponse..."
                                    className="min-h-[80px] resize-none"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                />
                                <Button
                                    className="h-auto w-16 bg-indigo-600 hover:bg-indigo-700"
                                    onClick={handleSendMessage}
                                    disabled={isSending || !newMessage.trim()}
                                >
                                    <Send className="h-5 w-5" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 text-right">
                                Appuyez sur <kbd className="px-1 py-0.5 bg-gray-100 rounded border">Entrée</kbd> pour envoyer.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
