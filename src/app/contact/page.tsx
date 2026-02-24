import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, MapPin, Phone } from "lucide-react"

export const metadata = {
    title: "Contact Us - StepPrs",
}

export default function ContactPage() {
    return (
        <div className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">Get In Touch</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Have a question about your order or our insoles? Our customer support team is here to help you step pain-free.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Mail className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">Email Us</h3>
                            <p className="text-muted-foreground mb-2">We aim to reply within 24 hours.</p>
                            <a href="mailto:support@steppprs.com" className="font-semibold hover:text-primary transition-colors">support@steppprs.com</a>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Phone className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">Call Us</h3>
                            <p className="text-muted-foreground mb-2">Mon-Fri, 9am to 6pm EST</p>
                            <a href="tel:+18001234567" className="font-semibold hover:text-primary transition-colors">+1 (800) 123-4567</a>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">Headquarters</h3>
                            <p className="text-muted-foreground">
                                123 Wellness Ave, Suite 400<br />
                                New York, NY 10001
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-muted/30 p-8 rounded-3xl border">
                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" placeholder="John" className="bg-background" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" placeholder="Doe" className="bg-background" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="john@example.com" className="bg-background" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="orderNumber">Order Number (Optional)</Label>
                            <Input id="orderNumber" placeholder="#123456" className="bg-background" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <textarea
                                id="message"
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px]"
                                placeholder="How can we help?"
                            ></textarea>
                        </div>
                        <Button type="button" size="lg" className="w-full">Send Message</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
