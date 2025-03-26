import { loadStripe } from "@stripe/stripe-js"

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export const servicePrices = {
  math: {
    oneTime: process.env.NEXT_PUBLIC_MATH_ONE_TIME_PRICE_ID,
    subscription: process.env.NEXT_PUBLIC_MATH_SUBSCRIPTION_PRICE_ID,
  },
  music: {
    oneTime: process.env.NEXT_PUBLIC_MUSIC_ONE_TIME_PRICE_ID,
    subscription: process.env.NEXT_PUBLIC_MUSIC_SUBSCRIPTION_PRICE_ID,
  },
  sports: {
    oneTime: process.env.NEXT_PUBLIC_SPORTS_ONE_TIME_PRICE_ID,
    subscription: process.env.NEXT_PUBLIC_SPORTS_SUBSCRIPTION_PRICE_ID,
  },
} 