import { CheckCircle2, XCircle } from "lucide-react"

export function Comparison() {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Not All Insoles Are Equal
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                        See why thousands are switching from generic drugstore brands to StepPrs.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto bg-background rounded-3xl border shadow-sm overflow-hidden">
                    <div className="grid grid-cols-3 p-6 md:p-8 border-b bg-muted/50 items-center">
                        <div className="font-semibold text-muted-foreground">Features</div>
                        <div className="font-bold text-center">Generic Brands</div>
                        <div className="font-extrabold text-center text-primary text-lg flex flex-col items-center">
                            StepPrs
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full mt-1">Our Choice</span>
                        </div>
                    </div>

                    {[
                        { label: "Arch Support", generic: false, ours: true },
                        { label: "Deep Heel Cup", generic: false, ours: true },
                        { label: "Shock Absorption", generic: "Minimal", ours: "Maximum" },
                        { label: "Durability", generic: "2-3 Months", ours: "1-2 Years" },
                        { label: "Podiatrist Approved", generic: false, ours: true },
                    ].map((row, idx) => (
                        <div key={idx} className="grid grid-cols-3 p-6 md:p-8 border-b last:border-0 items-center transition-colors hover:bg-muted/20">
                            <div className="font-medium">{row.label}</div>
                            <div className="flex justify-center text-muted-foreground">
                                {typeof row.generic === 'boolean'
                                    ? (row.generic ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-400" />)
                                    : <span className="text-sm font-medium">{row.generic}</span>
                                }
                            </div>
                            <div className="flex justify-center">
                                {typeof row.ours === 'boolean'
                                    ? (row.ours ? <CheckCircle2 className="text-primary w-6 h-6" /> : <XCircle className="text-red-400" />)
                                    : <span className="text-sm font-bold text-primary">{row.ours}</span>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
