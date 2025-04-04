'use client'

import { useEffect, useState, useCallback } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {
  Users,
  Calendar,
  DollarSign,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
} from "lucide-react"
import { BookingService } from "@/lib/services/booking-service"

const bookingService = new BookingService()

interface DashboardStats {
  totalUsers: number
  totalBookings: number
  totalRevenue: number
  pendingBookings: number
  revenueChange: number
  bookingsChange: number
}

export function AdminDashboard() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    revenueChange: 0,
    bookingsChange: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboardData = useCallback(async () => {
    try {
      const [bookings, usersResponse] = await Promise.all([
        bookingService.getAllBookings(),
        fetch("/api/admin/users").then(res => {
          if (!res.ok) {
            throw new Error("Failed to fetch users");
          }
          return res.json();
        }),
      ])

      // Get current and previous month dates
      const now = new Date()
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

      // Filter bookings by month
      const currentMonthBookings = bookings.filter(booking => {
        const bookingDate = booking.date;
        let date: Date;
        
        if (typeof bookingDate === 'object' && '_seconds' in bookingDate) {
          date = new Date(bookingDate._seconds * 1000);
        } else if (typeof bookingDate === 'string') {
          date = new Date(bookingDate);
        } else {
          return false;
        }
        
        return date >= currentMonthStart && date <= now;
      });

      const previousMonthBookings = bookings.filter(booking => {
        const bookingDate = booking.date;
        let date: Date;
        
        if (typeof bookingDate === 'object' && '_seconds' in bookingDate) {
          date = new Date(bookingDate._seconds * 1000);
        } else if (typeof bookingDate === 'string') {
          date = new Date(bookingDate);
        } else {
          return false;
        }
        
        return date >= previousMonthStart && date <= previousMonthEnd;
      });

      // Calculate revenues
      const currentMonthRevenue = currentMonthBookings.reduce((sum, booking) => sum + booking.price, 0)
      const previousMonthRevenue = previousMonthBookings.reduce((sum, booking) => sum + booking.price, 0)

      // Calculate changes
      const revenueChange = previousMonthRevenue === 0 
        ? 100 
        : ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100

      const bookingsChange = previousMonthBookings.length === 0 
        ? 100 
        : ((currentMonthBookings.length - previousMonthBookings.length) / previousMonthBookings.length) * 100

      console.log('Dashboard calculations:', {
        currentMonth: {
          bookings: currentMonthBookings.length,
          revenue: currentMonthRevenue
        },
        previousMonth: {
          bookings: previousMonthBookings.length,
          revenue: previousMonthRevenue
        },
        changes: {
          revenue: revenueChange,
          bookings: bookingsChange
        }
      })

      const totalRevenue = bookings.reduce((sum, booking) => sum + booking.price, 0)
      const pendingBookings = bookings.filter(b => b.status === "pending").length

      setStats({
        totalUsers: usersResponse?.users?.length || 0,
        totalBookings: bookings.length,
        totalRevenue,
        pendingBookings,
        revenueChange,
        bookingsChange,
      })
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {

    if (!isAdmin) {
      console.log("AdminDashboard - Not admin, redirecting to dashboard");
      router.replace('/dashboard')
      return
    }
    loadDashboardData()
  }, [isAdmin, router, loadDashboardData, loading, error])

  if (!isAdmin) {
    console.log("AdminDashboard - Not admin, returning null");
    return null
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    console.log("AdminDashboard - Error state");
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-500">{error}</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <Button onClick={loadDashboardData}>Refresh</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <div className="flex items-center text-xs">
                <span className={stats.bookingsChange >= 0 ? "text-green-500" : "text-red-500"}>
                  {stats.bookingsChange >= 0 ? (
                    <ArrowUpRight className="inline h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="inline h-4 w-4" />
                  )}
                  {Math.abs(stats.bookingsChange)}%
                </span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue}</div>
              <div className="flex items-center text-xs">
                <span className={stats.revenueChange >= 0 ? "text-green-500" : "text-red-500"}>
                  {stats.revenueChange >= 0 ? (
                    <ArrowUpRight className="inline h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="inline h-4 w-4" />
                  )}
                  {Math.abs(stats.revenueChange)}%
                </span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingBookings}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting confirmation
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/admin/bookings")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Bookings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/admin/users")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push("/admin/services")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Manage Services
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* This would be populated with recent activity data */}
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
} 