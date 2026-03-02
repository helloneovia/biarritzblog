"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function ProductGallery({ productImages }: { productImages?: string[] | null }) {
    const fallbackImages = [
        "/temu-product.jpg",
        "https://images.unsplash.com/photo-1610961071248-8d34c7ae68d0?q=80&w=2160&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2160&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=2160&auto=format&fit=crop"
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
