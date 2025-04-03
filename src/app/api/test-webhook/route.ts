import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function GET() {
  try {
    // Create a test payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      currency: "usd",
      metadata: {
        bookingId: "test-booking-id",
      },
    });

    // Create a test event
    const event = {
      id: "evt_test_" + Date.now(),
      object: "event",
      type: "payment_intent.succeeded",
      data: {
        object: paymentIntent,
      },
      created: Math.floor(Date.now() / 1000),
    };

    // Sign the event
    const signature = stripe.webhooks.generateTestHeaderString({
      payload: JSON.stringify(event),
      secret: process.env.STRIPE_WEBHOOK_SECRET!,
    });

    // Send the event to our webhook handler
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/stripe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Stripe-Signature": signature,
      },
      body: JSON.stringify(event),
    });

    const result = await response.json();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error testing webhook:", error);
    return NextResponse.json(
      { error: "Failed to test webhook" },
      { status: 500 }
    );
  }
} 