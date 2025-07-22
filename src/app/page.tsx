import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Home | Expert Math Tutoring & Music Lessons | Math & Melody Academy",
  description:
    "Transform your learning journey with expert math tutoring and music lessons at Math & Melody Academy. Personalized instruction, flexible scheduling, and proven results. Book your session today!",
  keywords: [
    "math tutoring",
    "music lessons",
    "private tutor",
    "online tutoring",
    "math help",
    "piano lessons",
    "academic success",
    "tutoring services",
    "music education",
    "sports training",
  ],
  openGraph: {
    title:
      "Home | Expert Math Tutoring & Music Lessons | Math & Melody Academy",
    description:
      "Transform your learning journey with expert math tutoring and music lessons at Math & Melody Academy. Personalized instruction, flexible scheduling, and proven results. Book your session today!",
    images: [
      {
        url: "/images/home-og.jpg",
        width: 1200,
        height: 630,
        alt: "Math & Melody Academy - Expert Tutoring Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Home | Expert Math Tutoring & Music Lessons | Math & Melody Academy",
    description:
      "Transform your learning journey with expert math tutoring and music lessons at Math & Melody Academy. Personalized instruction, flexible scheduling, and proven results. Book your session today!",
    images: ["/images/home-twitter.jpg"],
  },
  alternates: {
    canonical: "https://www.mathsandmelodyacademy.com",
  },
};

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48">
          {/* Background Image Container */}
          <div className="absolute inset-0 w-full h-full z-0">
            <Image
              src={"/images/home-hero.jpg"}
              alt="hero image"
              fill
              priority
              className="object-cover "
            />
          </div>
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="relative z-20 container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Where Numbers Sing and Melodies Compute
                </h1>
                <p className="mx-auto max-w-[700px] text-white md:text-xl">
                  Unlock your potential in mathematics and music through our
                  innovative, integrated learning approach with a multi-talented
                  instructor
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
                  Expert math tutoring for all levels, from basic arithmetic to
                  advanced calculus.
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
                  Professional music instruction in various instruments and
                  music theory.
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
                  Athletic training and coaching for various sports and fitness
                  goals.
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
                  Book your first session today and start your journey towards
                  excellence.
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
  );
}
