import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export interface CreateCheckoutSessionParams {
  bookingId: string
  amount: number
  currency?: string
}

export class StripeService {
  static async createCheckoutSession({ bookingId, amount, currency = "usd" }: CreateCheckoutSessionParams) {
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          amount,
          currency,
        }),
      })

      const { sessionId } = await response.json()

      const stripe = await stripePromise
      if (!stripe) throw new Error("Stripe failed to initialize")

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
      throw error
    }
  }
} 