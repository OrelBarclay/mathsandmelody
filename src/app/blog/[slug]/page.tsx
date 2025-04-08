import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface"
import { MainLayout } from "@/components/layout/main-layout"
import { db } from "@/lib/firebase-admin"
import Image from "next/image"
import { format } from "date-fns"
import { notFound } from "next/navigation"
import { Blog } from "@/lib/services/admin-service"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const normalizedSlug = slug.startsWith('/') ? slug : `/${slug}`
  
  const doc = await db.collection("blogs")
    .where("slug", "==", normalizedSlug)
    .where("published", "==", true)
    .limit(1)
    .get()

  if (doc.empty) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    }
  }

  const blog = doc.docs[0].data() as Blog

  return {
    title: `${blog.title} | Math & Melody Academy`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.image ? [{ url: blog.image }] : [],
    },
  }
}

async function getBlog(slug: string): Promise<Blog | null> {
  const normalizedSlug = slug.startsWith('/') ? slug : `/${slug}`
  
  const doc = await db.collection("blogs")
    .where("slug", "==", normalizedSlug)
    .where("published", "==", true)
    .limit(1)
    .get()

  if (doc.empty) {
    return null
  }

  const data = doc.docs[0].data()
  return {
    id: doc.docs[0].id,
    ...data,
    createdAt: data.createdAt?.toDate().toISOString(),
    updatedAt: data.updatedAt?.toDate().toISOString(),
  } as Blog
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    notFound()
  }

  return (
    <MainLayout>
      <article className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <header className="space-y-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="capitalize">{blog.category}</span>
              <span>•</span>
              <time dateTime={typeof blog.createdAt === 'string' ? blog.createdAt : blog.createdAt?.toISOString() || ""}>
                {blog.createdAt && format(new Date(blog.createdAt), "MMM d, yyyy")}
              </time>
            </div>
            <h1 className="text-4xl font-bold">{blog.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>By {blog.author}</span>
            </div>
          </header>

          {blog.image && (
            <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </article>
    </MainLayout>
  )
} 