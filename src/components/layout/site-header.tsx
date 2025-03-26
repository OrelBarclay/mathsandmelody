"use client"

import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { MainNav } from "@/components/layout/main-nav"
import { ThemeToggle } from "@/components/layout/theme-toggle"

function Logo() {
  const { theme } = useTheme()
  return (
    <Image
      src={theme === "dark" ? "/darkLogo.png" : "/logo.png"}
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
        <div className="flex flex-1 items-center justify-between space-x-2">
          <MainNav />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
} 