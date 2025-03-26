"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { useEffect, useState } from "react"
import { BookingService, Booking } from "@/lib/services/booking-service"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"

const bookingService = new BookingService()

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
      return
    }

    loadBookings()
  }, [user, router])

  const loadBookings = async () => {
    try {
      const data = await bookingService.getAllBookings()
      setBookings(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (bookingId: string, newStatus: Booking["status"]) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus)
      await loadBookings()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update booking status")
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="text-center">Loading...</div>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={loadBookings}>Refresh</Button>
        </div>

        <div className="mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell className="capitalize">{booking.serviceType}</TableCell>
                  <TableCell>
                    {format(booking.date, "MMM d, yyyy h:mm a")}
                  </TableCell>
                  <TableCell>{booking.duration} min</TableCell>
                  <TableCell>${booking.price}</TableCell>
                  <TableCell>
                    <Select
                      value={booking.status}
                      onValueChange={(value: Booking["status"]) =>
                        handleStatusChange(booking.id!, value)
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this booking?")) {
                          bookingService.deleteBooking(booking.id!).then(loadBookings)
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  )
} 