import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster"
import { RoleBasedRedirect } from "@/components/auth/role-based-redirect";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mathsandmelodyacademy.com'),
  title: {
    default: "Math & Melody Academy | Expert Math Tutoring & Music Lessons",
    template: "%s | Math & Melody Academy"
  },
  description: "Expert tutoring in Mathematics, Music, and Sports. Professional instruction tailored to your needs. Book your sessions today!",
  keywords: ["math tutoring", "music lessons", "sports coaching", "private tutor", "online tutoring", "math tutor", "piano lessons", "academic excellence", "tutoring services", "music education", "sports training"],
  authors: [{ name: "Math & Melody Academy" }],
  creator: "Math & Melody Academy",
  publisher: "Math & Melody Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://www.mathsandmelodyacademy.com",
  },
  icons: {
    icon: [
      { url: "/images/favicon.ico" },
      { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/android-icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/android-icon-192x192.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/images/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
      { url: "/images/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/images/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/images/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/images/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/images/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/images/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/images/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/images/apple-icon-57x57.png", sizes: "57x57", type: "image/png" }
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/images/apple-icon-precomposed.png"
      }
    ]
  },
  manifest: "/images/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Math & Melody Academy"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.mathsandmelodyacademy.com",
    siteName: "Math & Melody Academy",
    title: "Math & Melody Academy | Expert Math Tutoring & Music Lessons",
    description: "Expert tutoring in Mathematics, Music, and Sports. Professional instruction tailored to your needs. Book your sessions today!",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Math & Melody Academy - Expert Tutoring Services"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Math & Melody Academy | Expert Math Tutoring & Music Lessons",
    description: "Expert tutoring in Mathematics, Music, and Sports. Professional instruction tailored to your needs. Book your sessions today!",
    images: ["/images/twitter-image.jpg"],
    creator: "@mathandmelody",
    site: "@mathandmelody"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "google-site-verification: google666156726eade97a.html",
    yandex: "yandex-verification=a7da696d8cafafc3"
  },
  category: "education",
  classification: "tutoring services",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="57x57" href="/images/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/images/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/images/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/images/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/images/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/images/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/images/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/images/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/images/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/images/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
        <link rel="manifest" href="/images/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/images/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <RoleBasedRedirect />
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
