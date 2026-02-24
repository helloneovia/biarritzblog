import { ProductGallery } from "@/components/product/ProductGallery"
import { ProductForm } from "@/components/product/ProductForm"
import { Testimonials } from "@/components/sections/Testimonials"
import { Faq } from "@/components/sections/Faq"

export const metadata = {
    title: "Premium Orthopaedic Insoles - StepPrs",
    description: "Buy the #1 rated orthopaedic insoles for pain relief.",
}

export default function ProductPage() {
    return (
        <main className="py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-24">
                    {/* Left Column: Gallery */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <ProductGallery />
                    </div>

                    {/* Right Column: Details & Form */}
                    <div>
                        <ProductForm />
                    </div>
                </div>
            </div>

            {/* Social Proof & FAQ */}
            <Testimonials />
            <Faq />

            {/* JSON-LD Schema.org Product */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org/",
                        "@type": "Product",
                        "name": "StepPrs Orthopaedic Insoles",
                        "image": [
                            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        ],
                        "description": "Premium orthopaedic insoles engineered to realign your posture, cushion your heels, and eliminate foot, knee, and back pain instantly.",
                        "sku": "STEPPRS-001",
                        "brand": {
                            "@type": "Brand",
                            "name": "StepPrs"
                        },
                        "offers": {
                            "@type": "Offer",
                            "url": "https://steppprs.com/product",
                            "priceCurrency": "EUR",
                            "price": "39.00",
                            "priceValidUntil": "2025-12-31",
                            "itemCondition": "https://schema.org/NewCondition",
                            "availability": "https://schema.org/InStock",
                            "seller": {
                                "@type": "Organization",
                                "name": "StepPrs"
                            }
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "reviewCount": "3450"
                        }
                    })
                }}
            />
        </main>
    )
}
