import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  BookOpen,
  BarChart,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface AdminLayoutProps {
  children: React.ReactNode
}

const adminNavItems = [
  {
    title: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: Calendar,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Services",
    href: "/admin/services",
    icon: BookOpen,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <MainLayout>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="hidden w-64 border-r bg-background lg:block">
          <div className="flex h-16 items-center border-b px-6">
            <h1 className="text-lg font-semibold">Admin Panel</h1>
          </div>
          <nav className="space-y-1 p-4">
            {adminNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="container py-8">{children}</div>
        </div>
      </div>
    </MainLayout>
  )
} 