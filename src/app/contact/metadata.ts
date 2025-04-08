import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface"

export const metadata: Metadata = {
  title: "Contact Us | Math & Melody Academy",
  description: "Get in touch with Math & Melody Academy. We're here to answer your questions about our tutoring services, music lessons, and sports coaching programs.",
  keywords: ["contact us", "get in touch", "tutoring contact", "music lessons contact", "sports coaching contact", "inquiry"],
  openGraph: {
    title: "Contact Math & Melody Academy",
    description: "Get in touch with Math & Melody Academy. We're here to answer your questions about our tutoring services, music lessons, and sports coaching programs.",
    images: [
      {
        url: "/images/contact-og.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Math & Melody Academy"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Math & Melody Academy",
    description: "Get in touch with Math & Melody Academy. We're here to answer your questions about our tutoring services, music lessons, and sports coaching programs.",
    images: ["/images/contact-twitter.jpg"]
  }
} 