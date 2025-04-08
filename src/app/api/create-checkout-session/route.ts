import { NextResponse } from "next/server"
import Stripe from "stripe"

// Only initialize Stripe if we have a secret key
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    })
  : null

// Helper function to get the base URL
function getBaseUrl() {
  // Get the first valid URL from the environment variable
  const urls = (process.env.NEXT_PUBLIC_APP_URL || "").split("||").map(url => url.trim())
  const validUrl = urls.find(url => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  })

  // If no valid URL found, use localhost
  return validUrl || "http://localhost:3000"
}

export async function POST(request: Request) {
  try {
    if (!stripe) {
      throw new Error("Stripe is not initialized")
    }

    const { bookingId, amount, currency = "usd" } = await request.json()

    if (!bookingId || !amount) {
      throw new Error("Missing required fields: bookingId and amount are required")
    }

    // Get the base URL
    const baseUrl = getBaseUrl()
    
    // Construct the success and cancel URLs
    const successUrl = `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}/booking/cancel`

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: "Tutoring Session",
              description: `Booking ID: ${bookingId}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents and ensure it's an integer
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        bookingId,
      },
      payment_intent_data: {
        metadata: {
          bookingId,
        },
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error creating checkout session" },
      { status: 500 }
    )
  }
} 