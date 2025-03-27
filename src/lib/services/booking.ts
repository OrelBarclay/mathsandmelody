import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { db } from "../firebase"
import { servicePrices } from "../stripe"

export interface BookingData {
  name: string
  email: string
  phone: string
  service: string
  date: Date
  time: string
  notes?: string
  paymentType: "oneTime" | "subscription"
  status: "pending" | "confirmed" | "cancelled"
  userId?: string
}

export async function createBooking(data: BookingData) {
  try {
    // Create a booking document in Firestore
    const bookingRef = await addDoc(collection(db, "bookings"), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    // Get the price ID based on the service and payment type
    const priceId = servicePrices[data.service as keyof typeof servicePrices][data.paymentType]

    if (!priceId) {
      throw new Error("Invalid service or payment type") 
    }

    return {
      bookingId: bookingRef.id,
      priceId,
    }
  } catch (error) {
    console.error("Error creating booking:", error)
    throw error
  }
}

export async function updateBookingStatus(bookingId: string, status: BookingData["status"]) {
  try {
    const bookingRef = doc(db, "bookings", bookingId)
    await updateDoc(bookingRef, {
      status,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating booking status:", error)
    throw error
  }
} 