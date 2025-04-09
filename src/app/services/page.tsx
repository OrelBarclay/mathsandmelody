import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

const services = [
  {
    title: "Math Tutoring",
    description: "One-on-one math tutoring sessions",
    price: "$50",
    duration: "1 hour",
    features: [
      "Personalized learning plan",
      "Homework help",
      "Exam preparation",
      "Progress tracking",
      "Online or in-person sessions",
    ],
  },
  {
    title: "Music Lessons",
    description: "Professional music instruction",
    price: "$60",
    duration: "1 hour",
    features: [
      "Instrument-specific training",
      "Music theory",
      "Performance techniques",
      "Practice guidance",
      "Recital opportunities",
    ],
  },
  {
    title: "Sports Coaching",
    description: "Athletic training and coaching",
    price: "$45",
    duration: "1 hour",
    features: [
      "Personalized training plans",
      "Technique improvement",
      "Strength and conditioning",
      "Game strategy",
      "Performance analysis",
    ],
  },
]

export const metadata: Metadata = {
  title: "Our Services | Expert Math Tutoring & Music Lessons | Math & Melody Academy",
  description: "Discover our comprehensive range of educational services at Math & Melody Academy. From personalized math tutoring to professional music lessons and sports coaching. Find the perfect program for your needs.",
  keywords: ["math tutoring services", "music lessons", "private tutoring", "online tutoring", "math help", "piano lessons", "guitar lessons", "sports coaching", "academic support", "music education"],
  openGraph: {
    title: "Our Services | Expert Math Tutoring & Music Lessons | Math & Melody Academy",
    description: "Discover our comprehensive range of educational services at Math & Melody Academy. From personalized math tutoring to professional music lessons and sports coaching. Find the perfect program for your needs.",
    images: [
      {
        url: "/images/services-og.jpg",
        width: 1200,
        height: 630,
        alt: "Math & Melody Academy - Our Services"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Services | Expert Math Tutoring & Music Lessons | Math & Melody Academy",
    description: "Discover our comprehensive range of educational services at Math & Melody Academy. From personalized math tutoring to professional music lessons and sports coaching. Find the perfect program for your needs.",
    images: ["/images/services-twitter.jpg"]
  },
  alternates: {
    canonical: "https://www.mathsandmelodyacademy.com/services"
  }
};

export default function ServicesPage() {
  return (
    <MainLayout>
      <div className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 text-center">
          <h1 className="text-3xl text-primary font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
            Our Services
          </h1>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Choose from our range of professional services designed to help you achieve your goals.
          </p>
        </div>
        <div className="mx-auto grid max-w-[980px] gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className="flex flex-col">
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{service.price}</span>
                  <span className="text-muted-foreground">/{service.duration}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/booking" className="w-full">
                  <Button className="w-full">Book Now</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mx-auto max-w-[980px] text-center">
          <h2 className="text-2xl font-bold">Need a Custom Package?</h2>
          <p className="mt-4 text-muted-foreground">
            Contact us to discuss your specific needs and create a personalized learning plan.
          </p>
          <Link href="/contact">
            <Button variant="outline" className="mt-4">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  )
} 