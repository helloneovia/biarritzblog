import { ZoomIn } from "lucide-react"
import Image from "next/image"

export function InsoleGallery({ texts = {} }: { texts?: any }) {
    const images = [
        { src: "/assets/authentic_hero.jpg", label: "Design Biarritz Signature" },
        { src: "/assets/authentic_science.jpg", label: "Technologie Magnétique" },
        { src: "/assets/authentic_flex.jpg", label: "Qualité & Flexibilité" },
        { src: "/assets/authentic_shoe.jpg", label: "Adaptabilité Quotidienne" },
    ]

    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        {texts?.galleryTitle || "Une Conception sans Compromis"}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                        {texts?.gallerySubtitle || "Chaque détail a été pensé pour vous offrir un soulagement immédiat et durable. Découvrez notre produit sous tous les angles."}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                    {images.map((img, idx) => (
                        <div key={idx} className="group relative aspect-square rounded-3xl overflow-hidden border bg-muted/20 hover:border-primary/50 transition-all duration-500">
                            <Image
                                src={img.src}
                                alt={img.label}
                                fill
                                sizes="(max-width: 768px) 50vw, 33vw"
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                <div className="flex items-center gap-2 text-white">
                                    <ZoomIn className="w-5 h-5" />
                                    <span className="font-bold uppercase tracking-widest text-xs">{img.label}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
