import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function BlogPage() {
    let posts: any[] = [];

    // Prevent Prisma execution during Next.js build time without a valid connection
    if (process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "production") {
        return <div className="p-24">Building...</div>
    }

    try {
        posts = await prisma.post.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' }
        });
    } catch (e) {
        console.warn("Prisma failed to connect during build/render, returning empty posts.");
    }

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen mt-16">
            <div className="mb-8">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Link>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight mb-8">Biarritz Blog</h1>

            {posts.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed">
                    <p className="text-muted-foreground text-lg">No posts published yet. Check back later!</p>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map(post => (
                        <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col h-full bg-card border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            {post.imageUrl ? (
                                <div className="aspect-[4/3] w-full bg-muted relative overflow-hidden">
                                    <img src={post.imageUrl} alt={post.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                                </div>
                            ) : (
                                <div className="aspect-[4/3] w-full bg-primary/5 flex items-center justify-center relative overflow-hidden">
                                    <div className="text-primary/20 text-6xl font-serif font-bold opacity-50">Blog</div>
                                </div>
                            )}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="text-xs text-muted-foreground mb-3 font-medium">
                                    {post.createdAt.toLocaleDateString()}
                                </div>
                                <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h2>
                                <p className="text-muted-foreground flex-1 line-clamp-3 text-sm">{post.content}</p>
                                <div className="mt-6 text-sm text-primary font-bold flex items-center">
                                    Read Article <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
