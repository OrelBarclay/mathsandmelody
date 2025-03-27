"use client"

import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { MainNav } from "@/components/layout/main-nav"
import { useEffect, useState } from "react"

function Logo() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR, always use light theme logo
  if (!mounted) {
    return (
      <Image
        src="/logo.png"
        alt="Math and Melody Logo"
        width={110}
        height={110}
        priority
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
            <span className="font-bold hidden md:block">Math & Melody Academy</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 sm:justify-end">
          <MainNav />
          {/* <ThemeToggle /> */}
        </div>
      </div>
    </header>
  )
} 