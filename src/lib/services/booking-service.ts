import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, query, where, Timestamp, updateDoc, deleteDoc, doc } from "firebase/firestore"

export interface Booking {
  id?: string
  userId: string
  serviceType: "math" | "music" | "sports"
  date: Date
  duration: number // in minutes
  status: "pending" | "confirmed" | "cancelled" | "completed"
  price: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export class BookingService {
  private collection = collection(db, "bookings")

  async createBooking(booking: Omit<Booking, "id" | "createdAt" | "updatedAt">): Promise<Booking> {
    const docRef = await addDoc(this.collection, {
      ...booking,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    return {
      id: docRef.id,
      ...booking,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  async getBookingsByUserId(userId: string): Promise<Booking[]> {
    const q = query(this.collection, where("userId", "==", userId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Booking[]
  }

  async getAllBookings(): Promise<Booking[]> {
    const querySnapshot = await getDocs(this.collection)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Booking[]
  }

  async updateBookingStatus(bookingId: string, status: Booking["status"]): Promise<void> {
    const docRef = doc(this.collection, bookingId)
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now(),
    })
  }

  async deleteBooking(bookingId: string): Promise<void> {
    const docRef = doc(this.collection, bookingId)
    await deleteDoc(docRef)
  }
} 