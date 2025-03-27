"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { BookingService, Booking } from "@/lib/services/booking-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      const bookingService = new BookingService()
      bookingService.getBookingsByUserId(user.uid)
        .then(setBookings)
        .finally(() => setLoading(false))
    }
  }, [user])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>My Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{bookings.length}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => router.push("/booking")}
            >
              View All Bookings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {bookings.filter(b => b.status === "confirmed").length}
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => router.push("/booking")}
            >
              Schedule New Session
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => router.push("/profile")}
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
        <div className="space-y-4">
          {bookings.slice(0, 5).map((booking) => (
            <Card key={booking.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{booking.serviceType}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === "confirmed" ? "bg-green-100 text-green-800" :
                    booking.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 