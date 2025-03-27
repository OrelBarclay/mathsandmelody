import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | Math & Melody Academy",
  description: "Manage your tutoring sessions, view upcoming bookings, and track your progress with Math & Melody Academy.",
  icons: {
    icon: [
      { url: "/images/favicon.ico" },
      { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/images/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/images/site.webmanifest",
  openGraph: {
    title: "Dashboard | Math & Melody Academy",
    description: "Manage your tutoring sessions, view upcoming bookings, and track your progress with Math & Melody Academy.",
    type: "website",
    locale: "en_US",
    siteName: "Math & Melody Academy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard | Math & Melody Academy",
    description: "Manage your tutoring sessions, view upcoming bookings, and track your progress with Math & Melody Academy.",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 