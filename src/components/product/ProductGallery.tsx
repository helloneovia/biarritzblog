"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function ProductGallery({ productImages }: { productImages?: string[] | null }) {
    // If DB is empty, provide a fallback gallery showing the Zen aesthetic.
    const fallbackImages = [
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2620&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1545648583-b26a5c102c91?q=80&w=2160&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?q=80&w=2160&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1620056910398-35ed5f6d7dd0?q=80&w=2160&auto=format&fit=crop"
    ]

    // Filter out any empty strings or invalid URLs that might be in the DB
    const validImages = productImages?.filter(img => typeof img === 'string' && img.trim() !== '') || [];
    const images = validImages.length > 0 ? validImages : fallbackImages;

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
