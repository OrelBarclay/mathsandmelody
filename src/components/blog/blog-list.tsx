import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Blog } from "@/lib/services/admin-service"

interface BlogListProps {
  blogs: Blog[]
}

export function BlogList({ blogs }: BlogListProps) {
  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No blog posts available yet.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {blogs.map((blog) => (
        <Link
          key={blog.id}
          href={`/blog/${blog.slug}`}
          className="group block"
        >
          <article className="space-y-4">
            {blog.image && (
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="capitalize">{blog.category}</span>
                <span>•</span>
                <time dateTime={typeof blog.createdAt === 'string' ? blog.createdAt : blog.createdAt?.toISOString() || ""}>
                  {blog.createdAt && format(new Date(blog.createdAt), "MMM d, yyyy")}
                </time>
              </div>
              <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {blog.title}
              </h2>
              <p className="text-gray-600 line-clamp-2">{blog.excerpt}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>By {blog.author}</span>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
} 