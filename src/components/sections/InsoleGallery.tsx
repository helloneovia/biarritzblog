import { ZoomIn, Play } from "lucide-react"
import Image from "next/image"

export function InsoleGallery({ texts = {} }: { texts?: any }) {
    const items = [
        { 
            src: "/assets/ref_product_studio.jpg", 
            label: "Design Biarritz Signature", 
            alt: "Semelles orthopédiques Biarritz Signature avec technologie d'acupression magnétique - Vue studio premium",
            type: "image" as const,
            span: "md:col-span-2 md:row-span-2"
        },
        { 
            src: "/assets/videos/lifestyle_runner.mp4", 
            poster: "/assets/ref_lifestyle_runner.jpg",
            label: "En Action", 
            alt: "Vidéo lifestyle des semelles Biarritz sur la côte basque",
            type: "video" as const,
            span: ""
        },
        { 
            src: "/assets/ref_tech_xray.jpg", 
            label: "Technologie Magnétique", 
            alt: "Visualisation médicale de la technologie d'acupression magnétique Biarritz avec 450+ points",
            type: "image" as const,
            span: ""
        },
        { 
            src: "/assets/lifestyle_sport.jpg", 
            label: "Sport & Performance", 
            alt: "Semelles Biarritz pour le sport et la course à pied sur la côte basque",
            type: "image" as const,
            span: ""
        },
        { 
            src: "/assets/lifestyle_work.jpg", 
            label: "Confort au Bureau", 
            alt: "Semelles Biarritz dans des chaussures de ville pour le confort professionnel",
            type: "image" as const,
            span: ""
        },
    ]

    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center rounded-full border border-primary/20 px-4 py-1.5 text-xs font-black uppercase text-primary bg-primary/5 shadow-sm backdrop-blur-md">
                        {texts?.galleryBadge || "Galerie Produit"}
                    </div>
                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                        {texts?.galleryTitle || "Une Conception sans Compromis"}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                        {texts?.gallerySubtitle || "Chaque détail a été pensé pour vous offrir un soulagement immédiat et durable. Découvrez notre produit sous tous les angles."}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[280px]">
                    {items.map((item, idx) => (
                        <div key={idx} className={`group relative rounded-3xl overflow-hidden border bg-muted/20 hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-2xl ${item.span}`}>
                            {item.type === "video" ? (
                                <>
                                    <video 
                                        src={item.src} 
                                        poster={item.poster}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        autoPlay 
                                        loop 
                                        muted 
                                        playsInline 
                                    />
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2 border border-white/30">
                                        <Play className="w-4 h-4 text-white fill-white" />
                                    </div>
                                </>
                            ) : (
                                <Image
                                    src={item.src}
                                    alt={item.alt || item.label}
                                    fill
                                    sizes={idx === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                <div className="flex items-center gap-2 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <ZoomIn className="w-5 h-5" />
                                    <span className="font-bold uppercase tracking-widest text-xs">{item.label}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
