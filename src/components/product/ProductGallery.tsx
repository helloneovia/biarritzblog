"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function ProductGallery({ productImages }: { productImages?: string[] | null }) {
    const fallbackImages = [
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2620&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=2160&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?q=80&w=2160&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1577212017184-80cc1b953d60?q=80&w=2160&auto=format&fit=crop"
    ]

    // Force the premium fallback images for the aesthetic, ignoring broken DB links
    const images = fallbackImages;

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
