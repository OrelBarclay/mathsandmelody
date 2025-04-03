"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { BookingService, Booking } from "@/lib/services/booking-service"
import { StripeService } from "@/lib/services/stripe-service"
import { useAuth } from "@/contexts/auth-context"

const bookingService = new BookingService()

export function BookingForm() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    serviceType: "" as Booking["serviceType"],
    date: "",
    duration: "60",
    notes: "",
  })


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError("Please sign in to make a booking")
      return
    }

    setLoading(true)
    setError(null)

   

    try {
      // Create booking
      const booking = await bookingService.createBooking({
        userId: user.uid,
        serviceId: formData.serviceType,
        serviceType: formData.serviceType,
        date: new Date(formData.date).toISOString(),
        time: new Date(formData.date).toLocaleTimeString(),
        duration: parseFloat(formData.duration),
        status: "pending",
        price: formData.serviceType === "math" ? 50 * parseFloat(formData.duration) : formData.serviceType === "music" ? 60 * parseFloat(formData.duration) : 45 * parseFloat(formData.duration),
        notes: formData.notes,
      })

      if (!booking) {
        throw new Error("Failed to create booking")
      }

      // Create Stripe checkout session
      await StripeService.createCheckoutSession({
        bookingId: booking.id,
        amount: booking.price,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create booking")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="serviceType">Service Type</Label>
        <Select
          value={formData.serviceType}
          onValueChange={(value: Booking["serviceType"]) =>
            setFormData({ ...formData, serviceType: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="math">Math Tutoring</SelectItem>
            <SelectItem value="music">Music Lessons</SelectItem>
            <SelectItem value="sports">Sports Coaching</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date & Time</Label>
        <Input
          id="date"
          type="datetime-local"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Select
          value={formData.duration}
          onValueChange={(value) =>
            setFormData({ ...formData, duration: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="60">1 hour</SelectItem>
            <SelectItem value="90">1.5 hours</SelectItem>
            <SelectItem value="120">2 hours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any specific topics or requirements?"
        />
      </div>

      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Processing..." : "Proceed to Payment"}
      </Button>
    </form>
  )
} 