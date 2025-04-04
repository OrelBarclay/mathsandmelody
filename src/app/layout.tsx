import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster"
import { RoleBasedRedirect } from "@/components/auth/role-based-redirect";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Math & Melody Academy",
  description: "Expert tutoring in Mathematics, Music, and Sports. Book your sessions today!",
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
    title: "Math & Melody Academy",
    description: "Expert tutoring in Mathematics, Music, and Sports. Book your sessions today!",
    type: "website",
    locale: "en_US",
    siteName: "Math & Melody Academy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Math & Melody Academy",
    description: "Expert tutoring in Mathematics, Music, and Sports. Book your sessions today!",
  },
  robots: {
    index: true,
    follow: true,
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
