"use client"
import { useState } from "react"
import Link from "next/link"
import { MessageCircle, Plus, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Ticket {
    id: string
    subject: string
    status: string
    messages: any[]
    updatedAt: string
}

export function SupportPageClient({ tickets: initialTickets, userId }: { tickets: Ticket[], userId: string }) {
    const [tickets, setTickets] = useState(initialTickets)
    const [showModal, setShowModal] = useState(false)
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [sending, setSending] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSending(true)
        setError("")
        setSuccess("")

        try {
            const res = await fetch("/api/tickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, message }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Failed to create ticket")

            setTickets((prev: Ticket[]) => [data, ...prev])
            setSuccess("Votre demande a été envoyée avec succès !")
            setSubject("")
            setMessage("")
            setTimeout(() => {
                setShowModal(false)
                setSuccess("")
            }, 1500)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center sm:flex-row flex-col sm:gap-0 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold mb-2">Support Tickets</h1>
                    <p className="text-muted-foreground">Ouvrez un ticket ou consultez vos demandes existantes.</p>
                </div>
                <Button className="rounded-xl font-bold" onClick={() => setShowModal(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Nouvelle demande
                </Button>
            </div>

            {/* New Ticket Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl border p-8 relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <h2 className="text-2xl font-extrabold mb-1">Nouvelle Demande</h2>
                        <p className="text-muted-foreground text-sm mb-6">Notre équipe vous répondra dans les 24h.</p>

                        {success && (
                            <div className="bg-green-50 border border-green-100 text-green-700 rounded-xl p-4 mb-4 text-sm font-medium">
                                ✅ {success}
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 mb-4 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Sujet</label>
                                <input
                                    type="text"
                                    required
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    placeholder="Ex: Problème avec ma commande"
                                    className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder="Décrivez votre problème en détail..."
                                    className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                                />
                            </div>
                            <Button type="submit" disabled={sending} className="w-full rounded-xl font-bold h-12">
                                {sending ? "Envoi en cours..." : (
                                    <><Send className="mr-2 h-4 w-4" /> Envoyer la demande</>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {tickets.length === 0 ? (
                <div className="bg-card rounded-3xl p-12 mt-8 text-center border shadow-sm flex flex-col items-center justify-center">
                    <div className="h-16 w-16 bg-muted text-muted-foreground rounded-full flex items-center justify-center mb-4">
                        <MessageCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Aucun ticket actif</h3>
                    <p className="text-muted-foreground mb-4">Vous n&apos;avez aucune demande en cours. Cliquez sur &quot;Nouvelle demande&quot; si vous avez besoin d&apos;aide.</p>
                    <Button className="rounded-xl font-bold" onClick={() => setShowModal(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Créer un ticket
                    </Button>
                </div>
            ) : (
                <div className="space-y-4 mt-8">
                    {tickets.map((ticket: Ticket) => (
                        <Link
                            key={ticket.id}
                            href={`/dashboard/support/${ticket.id}`}
                            className="bg-card rounded-2xl border shadow-sm p-6 hover:border-primary/60 hover:shadow-md transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4 block"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold text-lg">{ticket.subject}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'}`}>
                                        {ticket.status}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Mis à jour : {new Date(ticket.updatedAt).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-sm font-medium text-muted-foreground bg-muted px-4 py-2 rounded-lg text-center">
                                    {ticket.messages.length} message(s)
                                </div>
                                <span className="text-muted-foreground text-lg">→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
