import { Metadata } from "next";
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Home | Expert Math Tutoring & Music Lessons",
  description: "Welcome to Math & Melody Academy. We offer expert tutoring in mathematics, professional music lessons, and sports coaching. Start your journey to excellence today!",
  openGraph: {
    title: "Math & Melody Academy - Expert Math Tutoring & Music Lessons",
    description: "Welcome to Math & Melody Academy. We offer expert tutoring in mathematics, professional music lessons, and sports coaching. Start your journey to excellence today!",
    images: [
      {
        url: "/images/home-og.jpg",
        width: 1200,
        height: 630,
        alt: "Math & Melody Academy Homepage"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Math & Melody Academy - Expert Math Tutoring & Music Lessons",
    description: "Welcome to Math & Melody Academy. We offer expert tutoring in mathematics, professional music lessons, and sports coaching. Start your journey to excellence today!",
    images: ["/images/home-twitter.jpg"]
  }
};

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Math & Melody Academy
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Professional math tutoring and music lessons from a multi-talented instructor
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/services">
                  <Button>Book a Session</Button>
                </Link>
                <Link href="/portfolio">
                  <Button variant="outline">View Portfolio</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Math Tutoring</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Expert math tutoring for all levels, from basic arithmetic to advanced calculus.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Music Lessons</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Professional music instruction in various instruments and music theory.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Sports Coaching</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Athletic training and coaching for various sports and fitness goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Start Learning?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Book your first session today and start your journey towards excellence.
                </p>
              </div>
              <div>
                <Link href="/services">
                  <Button>Book Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
