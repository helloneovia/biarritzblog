import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CheckoutSuccessPage() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen mt-16 flex items-center justify-center">
            <div className="max-w-md w-full bg-card rounded-3xl p-8 text-center shadow-xl border">
                <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-extrabold mb-4">Payment Successful!</h1>
                <p className="text-muted-foreground mb-8">
                    Thank you for your purchase. We have received your order and are currently processing it.
                </p>
                <Link href="/">
                    <Button size="lg" className="w-full rounded-xl">Return to Shop</Button>
                </Link>
            </div>
        </div>
    )
}
