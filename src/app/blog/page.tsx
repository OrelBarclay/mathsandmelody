import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface"
import { MainLayout } from "@/components/layout/main-layout"
import { BlogList } from "@/components/blog/blog-list"
import { db } from "@/lib/firebase-admin"
import { Blog } from "@/lib/services/admin-service"
import { Timestamp } from "firebase-admin/firestore"

export const metadata: Metadata = {
  title: "Blog | Math & Melody Academy",
  description: "Read our latest articles about math, music, sports, and education.",
}

async function getBlogs(): Promise<Blog[]> {
  try {
    console.log("Fetching blogs from Firestore...")
    const snapshot = await db.collection("blogs")
      .where("published", "==", true)
      .get()

    console.log(`Found ${snapshot.size} published blogs`)
    
    const blogs = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        slug: data.slug,
        author: data.author,
        category: data.category,
        image: data.image,
        published: data.published,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : '',
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : '',
      } as Blog
    })

    // Sort blogs by createdAt in memory
    return blogs.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return []
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs()

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Blog</h1>
          <BlogList blogs={blogs} />
        </div>
      </div>
    </MainLayout>
  )
} 