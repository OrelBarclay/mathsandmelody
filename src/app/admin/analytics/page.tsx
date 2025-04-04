"use client"

import { useEffect, useState, useCallback } from "react"
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
import { format, subMonths, subDays, eachDayOfInterval, startOfDay } from "date-fns"

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
  revenueChange: number
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    dailyBookings: [],
    serviceStats: [],
    totalRevenue: 0,
    totalBookings: 0,
    averageBookingValue: 0,
    completionRate: 0,
    revenueChange: 0,
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d")

  const loadAnalytics = useCallback(async () => {
    try {
      const bookings = await bookingService.getAllBookings()
      const currentEndDate = new Date()
      
      // Calculate current period start date
      let currentStartDate: Date;
      if (timeRange === "7d") {
        currentStartDate = subDays(currentEndDate, 7);
      } else if (timeRange === "30d") {
        currentStartDate = subDays(currentEndDate, 30);
      } else {
        currentStartDate = subMonths(currentEndDate, 3);
      }
      
      // Calculate previous period start date
      let previousStartDate: Date;
      if (timeRange === "7d") {
        previousStartDate = subDays(currentStartDate, 7);
      } else if (timeRange === "30d") {
        previousStartDate = subDays(currentStartDate, 30);
      } else {
        previousStartDate = subMonths(currentStartDate, 3);
      }

      console.log('Time ranges:', {
        timeRange,
        currentPeriod: {
          start: currentStartDate.toISOString(),
          end: currentEndDate.toISOString()
        },
        previousPeriod: {
          start: previousStartDate.toISOString(),
          end: currentStartDate.toISOString()
        }
      });

      // Filter bookings for current and previous periods
      const currentPeriodBookings = bookings.filter((b) => {
        const bookingDate = b.date;
        let date: Date;
        
        if (typeof bookingDate === 'object' && '_seconds' in bookingDate) {
          date = new Date(bookingDate._seconds * 1000);
        } else if (typeof bookingDate === 'string') {
          date = new Date(bookingDate);
        } else {
          return false;
        }
        
        return date >= currentStartDate && date <= currentEndDate;
      });

      const previousPeriodBookings = bookings.filter((b) => {
        const bookingDate = b.date;
        let date: Date;
        
        if (typeof bookingDate === 'object' && '_seconds' in bookingDate) {
          date = new Date(bookingDate._seconds * 1000);
        } else if (typeof bookingDate === 'string') {
          date = new Date(bookingDate);
        } else {
          return false;
        }
        
        return date >= previousStartDate && date < currentStartDate;
      });

      console.log('Booking counts:', {
        currentPeriod: currentPeriodBookings.length,
        previousPeriod: previousPeriodBookings.length,
        currentRevenue: currentPeriodBookings.reduce((sum, b) => sum + b.price, 0),
        previousRevenue: previousPeriodBookings.reduce((sum, b) => sum + b.price, 0)
      });

      // Calculate revenue for both periods
      const currentRevenue = currentPeriodBookings.reduce((sum, b) => sum + b.price, 0);
      const previousRevenue = previousPeriodBookings.reduce((sum, b) => sum + b.price, 0);

      // Calculate revenue change percentage
      const revenueChange = previousRevenue === 0 
        ? 100 // If previous revenue was 0, treat as 100% increase
        : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

      console.log('Revenue calculation:', {
        currentRevenue,
        previousRevenue,
        revenueChange
      });

      // Generate daily data for the chart
      const days = eachDayOfInterval({ start: currentStartDate, end: currentEndDate })
      const dailyBookings = days.map((day) => {
        const dayStart = startOfDay(day)
        const dayBookings = bookings.filter((b) => {
          const bookingDate = b.date;
          let date: Date;
          
          if (typeof bookingDate === 'object' && '_seconds' in bookingDate) {
            date = new Date(bookingDate._seconds * 1000);
          } else if (typeof bookingDate === 'string') {
            date = new Date(bookingDate);
          } else {
            return false;
          }
          
          return startOfDay(date).getTime() === dayStart.getTime();
        })
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
      const totalRevenue = currentRevenue
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
        revenueChange,
      })
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

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
              <p className={`text-xs ${data.revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {data.revenueChange >= 0 ? '↑' : '↓'} {Math.abs(data.revenueChange).toFixed(1)}% from previous period
              </p>
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