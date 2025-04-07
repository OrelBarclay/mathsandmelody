"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

interface Booking {
  id: string
  userId: string
  serviceType: string
  date: string
  duration: number
  price: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  createdAt: string
  updatedAt: string
  paymentIntentId?: string
  notes?: string
}

export function ClientBookingDetails({ bookingId }: { bookingId: string }) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchBooking = async () => {
      try {
        if (authLoading) return

        if (!isAuthenticated || !user) {
          router.push("/auth/signin")
          return
        }

        const bookingDoc = await getDoc(doc(db, "bookings", bookingId))
        
        if (!bookingDoc.exists()) {
          setError("Booking not found")
          setLoading(false)
          return
        }

        const bookingData = bookingDoc.data()
        
        if (bookingData.userId !== user.uid) {
          setError("Unauthorized access")
          setLoading(false)
          return
        }

        const formattedBooking = {
          id: bookingDoc.id,
          ...bookingData,
          date: bookingData.date?.toDate?.()?.toISOString() || bookingData.date,
          createdAt: bookingData.createdAt?.toDate?.()?.toISOString() || bookingData.createdAt,
          updatedAt: bookingData.updatedAt?.toDate?.()?.toISOString() || bookingData.updatedAt,
        } as Booking

        setBooking(formattedBooking)
      } catch (err) {
        console.error("Error fetching booking:", err)
        setError("Failed to load booking details")
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId, user, isAuthenticated, authLoading, router, mounted])

  if (!mounted) return null

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <p className="text-lg text-destructive">{error}</p>
        <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
      </div>
    )
  }

  if (!booking) return null

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>
              Session scheduled for {format(new Date(booking.date), "PPP 'at' p")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Service Type</p>
                <p className="font-medium capitalize">{booking.serviceType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{booking.duration} minutes</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{booking.status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-medium">${booking.price}</p>
              </div>
            </div>
            {booking.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="font-medium">{booking.notes}</p>
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              <p>Booking ID: {booking.id}</p>
              {booking.paymentIntentId && (
                <p>Payment ID: {booking.paymentIntentId}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
            {booking.status === "pending" && (
              <Button variant="destructive" onClick={() => router.push(`/booking/${booking.id}/cancel`)}>
                Cancel Booking
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 