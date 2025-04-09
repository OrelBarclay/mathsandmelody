"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

export function MainNav() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    await signOut()
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/booking", label: "Book Now" },
    { href: "/contact", label: "Contact" },
    { href: "/blog", label: "Blog" },
  ]

  // Return a placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="relative">
        <div className="lg:hidden">
          <Button variant="ghost" size="sm" disabled>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {navLinks.map((link) => (
            <div
              key={link.href}
              className="h-6 w-20 bg-muted animate-pulse rounded"
            />
          ))}
        </div>
        <div className="hidden lg:flex lg:justify-end lg:gap-x-6">
          <div className="h-9 w-20 bg-muted animate-pulse rounded" />
          <div className="h-9 w-20 bg-muted animate-pulse rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="sr-only">Toggle menu</span>
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Desktop navigation */}
      <div className="flex justify-center items-center">
        <div className="hidden lg:flex lg:gap-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === link.href ? "text-foreground" : "text-foreground/60"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth buttons/menu */}
        <div className="hidden lg:flex lg:justify-end lg:gap-x-6">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {user.displayName?.split(" ")[0]}{"'s Dashboard"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile navigation menu */}
      {isMenuOpen && (
        <div className="fixed top-[4rem] inset-x-0 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto bg-background border-b border-border lg:hidden">
          <div className="flex flex-col space-y-4 p-4 container">
            {/* Mobile nav links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-2 py-1.5 text-sm transition-colors hover:text-foreground/80",
                  pathname === link.href ? "text-foreground font-medium" : "text-foreground/60"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile auth section */}
            <div className="border-t border-border pt-4 mt-4">
              {user ? (
                <div className="space-y-4">
                  <p className="px-2 text-sm text-foreground/60">{user.email}</p>
                  <Link
                    href="/dashboard"
                    className="block px-2 py-1.5 text-sm text-foreground/60 hover:text-foreground"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-2 py-1.5 text-sm text-foreground/60 hover:text-foreground"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start px-2"
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                  >
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/auth/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block"
                  >
                    <Button variant="ghost" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block"
                  >
                    <Button size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 