import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { unstable_cache } from "next/cache"

export const revalidate = 60 // ISR: regenerate every 60s instead of force-dynamic

const getCachedPost = unstable_cache(
    async (slug: string) => {
        try {
            return await prisma.post.findUnique({
                where: { slug, published: true }
            });
        } catch (e) {
            console.warn(`Prisma failed to connect, returning null post for slug: ${slug}`);
            return null;
        }
    },
    ["blog-post"],
    { revalidate: 60, tags: ["posts"] }
)

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const post = await getCachedPost(slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="container max-w-4xl mx-auto px-4 py-24 min-h-screen mt-16">
            <div className="mb-12">
                <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                </Link>
            </div>

            <header className="mb-12 text-center max-w-3xl mx-auto">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">{post.title}</h1>
                <p className="text-muted-foreground font-medium text-lg">{post.createdAt.toLocaleDateString()}</p>
            </header>

            {post.imageUrl && (
                <div className="w-full aspect-[2/1] rounded-[2rem] overflow-hidden mb-16 shadow-2xl border bg-muted relative">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                </div>
            )}

            <div className="prose prose-blue dark:prose-invert max-w-3xl mx-auto prose-lg prose-p:leading-relaxed prose-headings:font-bold">
                {post.content.split('\n').map((paragraph: string, idx: number) => (
                    paragraph.trim() ? <p key={idx} className="mb-6">{paragraph}</p> : <br key={idx} />
                ))}
            </div>

        </article>
    );
}
