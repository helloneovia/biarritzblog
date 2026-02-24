"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function ProductGallery() {
    const images = [
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    ]
    const [activeImg, setActiveImg] = useState(0)

    return (
        <div className="flex flex-col gap-4">
            <div className="aspect-square bg-muted rounded-3xl overflow-hidden border">
                <img
                    src={images[activeImg]}
                    alt="Orthopaedic Insole"
                    className="w-full h-full object-cover transition-all duration-300"
                />
            </div>
            <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveImg(idx)}
                        className={cn(
                            "aspect-square rounded-xl overflow-hidden border-2 transition-all",
                            activeImg === idx ? "border-primary opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                        )}
                    >
                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    )
}
