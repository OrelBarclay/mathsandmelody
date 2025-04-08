import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    })
  : null

export async function POST(request: Request) {
  try {
    if (!stripe) {
      throw new Error("Stripe is not initialized")
    }

    const { sessionId } = await request.json()

    if (!sessionId) {
      throw new Error("Session ID is required")
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Check if the payment was successful
    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed")
    }

    // Get the booking ID from metadata
    const bookingId = session.metadata?.bookingId
    if (!bookingId) {
      throw new Error("Booking ID not found")
    }

    return NextResponse.json({
      success: true,
      bookingId,
      paymentIntent: session.payment_intent,
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error verifying payment" },
      { status: 500 }
    )
  }
} 