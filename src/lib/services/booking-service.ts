interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export interface Booking {
  id: string
  userId: string
  serviceId: string
  serviceType: string
  date: string | FirestoreTimestamp
  time: string
  duration: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  price: number
  notes?: string
  createdAt: string | FirestoreTimestamp
  updatedAt: string | FirestoreTimestamp
}

export class BookingService {
  async getAllBookings(): Promise<Booking[]> {
    try {
      const response = await fetch("/api/admin/bookings");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch bookings");
      }
      const data = await response.json();
      return data.bookings;
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      throw error;
    }
  }

  async getBookingsByUserId(): Promise<Booking[]> {
    try {
      const response = await fetch('/api/bookings')
      if (!response.ok) {
        throw new Error('Failed to fetch user bookings')
      }
      const data = await response.json()
      return data.bookings
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      return []
    }
  }

  async getBooking(id: string): Promise<Booking | null> {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch booking')
      }
      const data = await response.json()
      return data.booking
    } catch (error) {
      console.error('Error fetching booking:', error)
      return null
    }
  }

  async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking | null> {
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
      })
      if (!response.ok) {
        throw new Error('Failed to create booking')
      }
      const data = await response.json()
      return data.booking
    } catch (error) {
      console.error('Error creating booking:', error)
      return null
    }
  }

  async updateBooking(id: string, booking: Partial<Booking>): Promise<Booking | null> {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
      })
      if (!response.ok) {
        throw new Error('Failed to update booking')
      }
      const data = await response.json()
      return data.booking
    } catch (error) {
      console.error('Error updating booking:', error)
      return null
    }
  }

  async deleteBooking(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete booking')
      }
      return true
    } catch (error) {
      console.error('Error deleting booking:', error)
      return false
    }
  }
} 