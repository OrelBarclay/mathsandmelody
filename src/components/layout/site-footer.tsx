import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Math and Melody
            </a>
           {" "}for your success.
          </p>
          <div className="flex items-center space-x-1">
            <Link
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
            >
              <Twitter className="h-4 w-4" />
            </Link>
            <Link
              href="https://facebook.com/mathandmelody"
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
            >
              <Facebook className="h-4 w-4" />
            </Link>
            <Link
              href="https://instagram.com/yourusername"
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
            >
              <Instagram className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 