import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AdminService } from "@/lib/services/admin-service";
import { format } from "date-fns";
import Image from "next/image";
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { MainLayout } from "@/components/layout/main-layout";
import { Timestamp } from "firebase-admin/firestore";

const adminService = new AdminService();

function isTimestamp(value: unknown): value is Timestamp {
  return value instanceof Timestamp;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return {};

  const publishedTime = isTimestamp(blog.createdAt)
    ? blog.createdAt.toDate().toISOString()
    : blog.createdAt;

  return {
    title: `${blog.title} | Math & Melody Academy Blog`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      publishedTime,
      authors: [blog.author],
      images: blog.image ? [blog.image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: blog.image ? [blog.image] : [],
    },
  };
}

async function getBlog(slug: string) {
  try {
    // Normalize the slug by adding a leading slash if it doesn't have one
    const normalizedSlug = slug.startsWith("/") ? slug : `/${slug}`;
    const blog = await adminService.getBlogBySlug(normalizedSlug);
    return blog;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog || !blog.published) {
    notFound();
  }

  const createdAtDate = isTimestamp(blog.createdAt)
    ? blog.createdAt.toDate()
    : new Date(blog.createdAt || "");

  return (
    <MainLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <article className="container max-w-3xl py-12 mx-auto">
          {blog.image && (
            <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="capitalize">{blog.category}</span>
              <span>•</span>
              <time dateTime={isTimestamp(blog.createdAt) ? blog.createdAt.toDate().toISOString() : blog.createdAt}>
                {format(createdAtDate, "MMM d, yyyy")} {/* Corrected date format */}
              </time>
              <span>•</span>
              <span>By {blog.author}</span>
            </div>
          </header>
          <div
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>
      </Suspense>
    </MainLayout>
  );
}