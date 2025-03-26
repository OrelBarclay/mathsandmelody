import Link from "next/link"
import { MainNav } from "./main-nav"
import { ThemeToggle } from "./theme-toggle"
import Image from "next/image"
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="/logo.png" alt="Math and Melody Logo"  width={110} height={110} />
            <span className="font-bold">Math & Melody Academy</span>
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