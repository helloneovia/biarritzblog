"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function ContactForm({ t }: { t: Record<string, string> }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        orderNumber: "",
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
            toast.success(t.contactSuccessTitle || "Message envoyé avec succès !");
            setForm({ firstName: "", lastName: "", email: "", orderNumber: "", message: "" });
        } catch (error) {
            toast.error("Échec de l'envoi. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24 bg-slate-50 min-h-screen">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-[#0B1B3D]">{t.contactTitle || "Get In Touch"}</h1>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                    {t.widgetMessage || "Have a question about your order or our insoles? Our customer support team is here to help you step pain-free."}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
                {/* Contact Info */}
                <div className="space-y-10 py-6">
                    <div className="flex items-start gap-5">
                        <div className="h-12 w-12 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-[#0B1B3D] mb-1">Email</h3>
                            <p className="text-slate-500 mb-2 text-sm">We aim to reply within 24 hours.</p>
                            <a href="mailto:support@biarritz.blog" className="font-semibold text-[#0B1B3D] hover:text-indigo-600 transition-colors">support@biarritz.blog</a>
                        </div>
                    </div>
                    <div className="flex items-start gap-5">
                        <div className="h-12 w-12 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                            <Phone className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-[#0B1B3D] mb-1">WhatsApp</h3>
                            <p className="text-slate-500 mb-2 text-sm">{t.widgetWhatsapp || "Message us on WhatsApp"}</p>
                            <a href="https://wa.me/33695259991" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0B1B3D] hover:text-indigo-600 transition-colors">+33 6 95 25 99 91</a>
                        </div>
                    </div>
                    <div className="flex items-start gap-5">
                        <div className="h-12 w-12 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-[#0B1B3D] mb-1">Biarritz</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Paris, France
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-sm">
                    {success ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0B1B3D]">{t.contactSuccessTitle || "Message Sent!"}</h3>
                            <p className="text-slate-500">{t.contactSuccessDesc || "We've received your message and will get back to you shortly."}</p>
                            <Button onClick={() => setSuccess(false)} variant="outline" className="mt-4">Send another message</Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-[#0B1B3D] font-semibold text-sm">First Name</Label>
                                    <Input id="firstName" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required className="bg-white border-slate-200 focus:ring-indigo-600 focus:border-indigo-600 h-11" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-[#0B1B3D] font-semibold text-sm">Last Name</Label>
                                    <Input id="lastName" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required className="bg-white border-slate-200 focus:ring-indigo-600 focus:border-indigo-600 h-11" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[#0B1B3D] font-semibold text-sm">{t.contactEmail || "Email"}</Label>
                                <Input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="bg-white border-slate-200 focus:ring-indigo-600 focus:border-indigo-600 h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="orderNumber" className="text-[#0B1B3D] font-semibold text-sm">Order Number (Optional)</Label>
                                <Input id="orderNumber" value={form.orderNumber} onChange={e => setForm({ ...form, orderNumber: e.target.value })} className="bg-white border-slate-200 focus:ring-indigo-600 focus:border-indigo-600 h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-[#0B1B3D] font-semibold text-sm">{t.contactMessage || "Message"}</Label>
                                <textarea
                                    id="message"
                                    required
                                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                                    className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 min-h-[120px] resize-none"
                                ></textarea>
                            </div>
                            <Button type="submit" disabled={loading} size="lg" className="w-full bg-[#0B1B3D] hover:bg-indigo-900 text-white font-semibold h-12 mt-2">
                                {loading ? "..." : (t.contactSend || "Send Message")}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
