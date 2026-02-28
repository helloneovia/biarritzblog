"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function SupportWidget({ t }: { t: Record<string, string> }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (!res.ok) throw new Error("Erreur d'envoi");

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setIsOpen(false);
                setForm({ firstName: "", lastName: "", email: "", message: "" });
            }, 3000);
        } catch (error) {
            toast.error("Échec de l'envoi. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Popover Form */}
            {isOpen && (
                <div className="mb-4 w-[340px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">{t.widgetTitle || "Contact Support"}</h3>
                            <p className="text-primary-foreground/80 text-xs mt-0.5">{t.contactSuccessDesc || "We typically reply in a few hours."}</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-5">
                        {success ? (
                            <div className="text-center py-8">
                                <span className="text-4xl block mb-2">✅</span>
                                <h4 className="font-bold text-primary">{t.contactSuccessTitle || "Message Sent!"}</h4>
                                <p className="text-sm text-slate-500 mt-1">{t.widgetMessage || "We will email you back soon."}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        placeholder="First Name" required
                                        className="h-10 text-sm bg-slate-50"
                                        value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Last Name" required
                                        className="h-10 text-sm bg-slate-50"
                                        value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })}
                                    />
                                </div>
                                <Input
                                    type="email" placeholder="Email Address" required
                                    className="h-10 text-sm bg-slate-50"
                                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                />
                                <textarea
                                    required placeholder={t.widgetMessage || "How can we help?"}
                                    className="w-full h-24 text-sm p-3 rounded-md border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                                />
                                <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10">
                                    {loading ? "..." : <><Send className="h-4 w-4 mr-2" /> {t.contactSend || "Send Message"}</>}
                                </Button>
                            </form>
                        )}

                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <a
                                href="https://wa.me/33695259991"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 font-semibold text-sm transition-colors"
                            >
                                <Phone className="h-4 w-4" /> {t.widgetWhatsapp || "Message us on WhatsApp"}
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-14 w-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                aria-label="Support"
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </button>
        </div>
    );
}
