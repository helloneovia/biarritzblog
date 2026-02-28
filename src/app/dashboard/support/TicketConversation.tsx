"use client"
import { useState } from "react"
import { Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
    id: string
    content: string
    senderId: string
    createdAt: string
    isCurrentUser: boolean
    senderName: string
}

export function TicketConversation({
    ticketId,
    initialMessages,
    currentUserId,
}: {
    ticketId: string
    initialMessages: Message[]
    currentUserId: string
}) {
    const [messages, setMessages] = useState(initialMessages)
    const [reply, setReply] = useState("")
    const [sending, setSending] = useState(false)
    const [error, setError] = useState("")

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!reply.trim()) return
        setSending(true)
        setError("")

        try {
            const res = await fetch(`/api/tickets/${ticketId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: reply.trim() }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Erreur")

            setMessages(prev => [...prev, {
                ...data,
                isCurrentUser: true,
                senderName: "Moi",
            }])
            setReply("")
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="space-y-4">
            {/* Messages */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${msg.isCurrentUser
                            ? 'bg-indigo-600 text-white rounded-br-md'
                            : 'bg-muted rounded-bl-md'
                            }`}>
                            {!msg.isCurrentUser && (
                                <p className="text-xs font-bold mb-1 text-indigo-600">{msg.senderName}</p>
                            )}
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                            <p className={`text-xs mt-1.5 ${msg.isCurrentUser ? 'text-indigo-200' : 'text-muted-foreground'}`}>
                                {new Date(msg.createdAt).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
                {messages.length === 0 && (
                    <p className="text-center text-muted-foreground py-8 text-sm">Aucun message pour l'instant.</p>
                )}
            </div>

            {/* Reply form */}
            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-2 text-sm flex items-center justify-between">
                    {error}
                    <button onClick={() => setError("")}><X className="h-4 w-4" /></button>
                </div>
            )}
            <form onSubmit={handleSend} className="flex gap-3">
                <input
                    type="text"
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Votre réponse..."
                    className="flex-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                />
                <Button type="submit" disabled={sending || !reply.trim()} className="rounded-xl px-5">
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    )
}
