"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users, Calendar, BookOpen, Home, BarChart, Settings, LogOut, User, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTheme } from "next-themes";
interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      {/* Header with mobile menu button */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-background border-b z-40 flex items-center px-4 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mr-4"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          
        </Button>
        <div className="flex items-center gap-2">
          <Image src={isDarkMode ? "/images/darkLogo.png" : "/images/logo.png" } objectFit="contain" alt="Logo" width={110} height={110} />
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 md:block hidden">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          <nav className="space-y-2 p-4 flex-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                router.push("/admin");
                setIsSidebarOpen(false);
              }}
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                router.push("/admin/bookings");
                setIsSidebarOpen(false);
              }}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Bookings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                router.push("/admin/users");
                setIsSidebarOpen(false);
              }}
            >
              <Users className="mr-2 h-4 w-4" />
              Users
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                router.push("/admin/services");
                setIsSidebarOpen(false);
              }}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Services
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                router.push("/admin/analytics");
                setIsSidebarOpen(false);
              }}
            >
              <BarChart className="mr-2 h-4 w-4" /> 
              Analytics
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                router.push("/admin/settings");
                setIsSidebarOpen(false);
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                router.push("/admin/profile");
                setIsSidebarOpen(false);
              }}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </nav>
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 mt-16 md:mt-0">
        {children}
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
