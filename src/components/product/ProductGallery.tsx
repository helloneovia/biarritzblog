"use client"
import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ZoomIn, X, Video } from "lucide-react"

export function ProductGallery({ productImages }: { productImages?: string[] | null }) {
    const fallbackImages = [
        "/temu-product.jpg",
        "/insole-angle.png",
    ]

    const images = (productImages && productImages.length > 0) ? productImages : fallbackImages;

    const [activeIndex, setActiveIndex] = useState(0)
    const [isZoomed, setIsZoomed] = useState(false)

    const isVideo = (src: string) => /\.(mp4|webm)$/i.test(src)

    return (
        <div className="flex flex-col gap-3 md:gap-4">
            {/* Main Image */}
            <div
                className="w-full bg-white rounded-2xl md:rounded-3xl overflow-hidden border group cursor-zoom-in"
                onClick={() => setIsZoomed(true)}
            >
                {isVideo(images[activeIndex]) ? (
                    <video
                        src={images[activeIndex]}
                        className="w-full object-contain"
                        style={{ maxHeight: "500px" }}
                        autoPlay loop muted playsInline
                    />
                ) : (
                    <Image
                        src={images[activeIndex]}
                        alt="Orthopaedic Insole"
                        width={800}
                        height={800}
                        sizes="(max-width: 1024px) calc(100vw - 32px), 50vw"
                        className="object-contain"
                        style={{ width: "100%", height: "auto", maxHeight: "500px" }}
                        priority={activeIndex === 0}
                    />
                )}
            </div>

            {/* Thumbnails */}
            <div className="flex flex-wrap gap-2 md:gap-4">
                {images.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={cn(
                            "w-16 h-16 md:w-20 md:h-20 rounded-lg md:rounded-xl overflow-hidden border-2 transition-all outline-none shrink-0 relative",
                            activeIndex === i ? "border-primary shadow-md" : "border-transparent hover:border-border"
                        )}
                    >
                        {isVideo(img) ? (
                            <div className="relative w-full h-full">
                                <video src={img} className="w-full h-full object-cover" muted playsInline />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Video className="text-white h-5 w-5 drop-shadow-md" /></div>
                            </div>
                        ) : (
                            <Image src={img} alt={`Thumbnail ${i}`} fill sizes="80px" className="object-cover" />
                        )}
                    </button>
                ))}
            </div>

            {/* Zoom Modal */}
            {isZoomed && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
                    onClick={() => setIsZoomed(false)}
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
                        className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-[60]"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    {isVideo(images[activeIndex]) ? (
                        <video
                            src={images[activeIndex]}
                            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                            controls autoPlay playsInline
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <img
                            src={images[activeIndex]}
                            alt="Zoomed Product"
                            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}
                </div>
            )}
        </div>
    )
}
