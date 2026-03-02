"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function ProductGallery({ productImages }: { productImages?: string[] | null }) {
    const fallbackImages = [
        "/temu-product.jpg",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1474631245212-f5627e62d5c0?q=80&w=1200&auto=format&fit=crop"
    ]

    // Use DB images if available, else fall back to insole-specific images
    const images = (productImages && productImages.length > 0) ? productImages : fallbackImages;

    const [activeIndex, setActiveIndex] = useState(0)

    return (
        <div className="flex flex-col gap-4">
            <div className="aspect-square bg-muted rounded-3xl overflow-hidden border">
                <img
                    src={images[activeIndex]}
                    alt="Orthopaedic Insole"
                    className="w-full h-full object-cover transition-all duration-300"
                />
            </div>
            <div className="grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={cn(
                            "aspect-square rounded-xl overflow-hidden border-2 transition-all outline-none",
                            activeIndex === i ? "border-primary shadow-md" : "border-transparent hover:border-border"
                        )}
                    >
                        <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    )
}
