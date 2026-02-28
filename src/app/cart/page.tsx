import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CartPage() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen mt-16 flex items-center justify-center">
            <div className="max-w-md w-full bg-card rounded-3xl p-8 text-center shadow-xl border">
                <div className="mx-auto w-16 h-16 bg-muted text-muted-foreground rounded-full flex items-center justify-center mb-6">
                    <ShoppingCart className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-extrabold mb-4">Your Cart is Empty</h1>
                <p className="text-muted-foreground mb-8">
                    Looks like you haven't added any items to your cart yet, or you've canceled your checkout process.
                </p>
                <Link href="/product">
                    <Button size="lg" className="w-full rounded-xl">View Products</Button>
                </Link>
            </div>
        </div>
    )
}
