"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookingService } from "@/lib/services/booking-service"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { format, subMonths, eachDayOfInterval, startOfDay } from "date-fns"

const bookingService = new BookingService()

interface AnalyticsData {
  dailyBookings: {
    date: string
    count: number
    revenue: number
  }[]
  serviceStats: {
    serviceType: string
    count: number
    revenue: number
  }[]
  totalRevenue: number
  totalBookings: number
  averageBookingValue: number
  completionRate: number
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    dailyBookings: [],
    serviceStats: [],
    totalRevenue: 0,
    totalBookings: 0,
    averageBookingValue: 0,
    completionRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d")

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      const bookings = await bookingService.getAllBookings()
      const startDate = subMonths(new Date(), timeRange === "7d" ? 1 : timeRange === "30d" ? 1 : 3)
      const endDate = new Date()

      // Generate daily data
      const days = eachDayOfInterval({ start: startDate, end: endDate })
      const dailyBookings = days.map((day) => {
        const dayStart = startOfDay(day)
        const dayBookings = bookings.filter(
          (b) => startOfDay(new Date(b.date)).getTime() === dayStart.getTime()
        )
        return {
          date: format(day, "MMM d"),
          count: dayBookings.length,
          revenue: dayBookings.reduce((sum, b) => sum + b.price, 0),
        }
      })

      // Calculate service statistics
      const serviceStats = Object.entries(
        bookings.reduce((acc, booking) => {
          if (!acc[booking.serviceType]) {
            acc[booking.serviceType] = { count: 0, revenue: 0 }
          }
          acc[booking.serviceType].count++
          acc[booking.serviceType].revenue += booking.price
          return acc
        }, {} as Record<string, { count: number; revenue: number }>)
      ).map(([serviceType, stats]) => ({
        serviceType,
        count: stats.count,
        revenue: stats.revenue,
      }))

      // Calculate overall statistics
      const totalRevenue = bookings.reduce((sum, b) => sum + b.price, 0)
      const totalBookings = bookings.length
      const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0
      const completedBookings = bookings.filter((b) => b.status === "completed").length
      const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0

      setData({
        dailyBookings,
        serviceStats,
        totalRevenue,
        totalBookings,
        averageBookingValue,
        completionRate,
      })
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <div className="flex items-center gap-2">
            <Button
              variant={timeRange === "7d" ? "default" : "outline"}
              onClick={() => setTimeRange("7d")}
            >
              7D
            </Button>
            <Button
              variant={timeRange === "30d" ? "default" : "outline"}
              onClick={() => setTimeRange("30d")}
            >
              30D
            </Button>
            <Button
              variant={timeRange === "90d" ? "default" : "outline"}
              onClick={() => setTimeRange("90d")}
            >
              90D
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Booking Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.averageBookingValue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.completionRate.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.dailyBookings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      name="Revenue"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bookings by Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.serviceStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="serviceType" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" name="Bookings" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
} 