"use client"

import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { MainNav } from "@/components/layout/main-nav"
import { useEffect, useState } from "react"
import { ThemeToggle } from "./theme-toggle"

function Logo() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (error) {
    return (
      <div className="w-[110px] h-[110px] flex items-center justify-center bg-primary/10 rounded-lg">
        <span className="text-primary font-bold text-xl">M&M</span>
      </div>
    )
  }

  // During SSR, always use light theme logo
  if (!mounted) {
    return (
      <Image
        src="/logo.png"
        alt="Math and Melody Logo"
        width={110}
        height={110}
        priority
        onError={() => setError(true)}
      />
    )
  }

  // After hydration, use theme-based logo
  return (
    <Image
      src={resolvedTheme === "dark" ? "/darkLogo.png" : "/logo.png"}
      alt="Math and Melody Logo"
      width={110}
      height={110}
      priority
      onError={() => setError(true)}
    />
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
            <span className="font-bold text-primary text-[3hw] md:text-2xl">Math & Melody Academy</span>
          </Link>
        </div>
        <div className="flex flex-1 justify-end">
          <MainNav />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
} 