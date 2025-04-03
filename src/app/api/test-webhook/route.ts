import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function GET() {
  try {
    // Check if environment variables are set
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "STRIPE_WEBHOOK_SECRET is not configured" },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_APP_URL is not configured" },
        { status: 500 }
      );
    }

    console.log("Creating test payment intent...");
    // Create a test payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      currency: "usd",
      metadata: {
        bookingId: "test-booking-id",
      },
    });
    console.log("Payment intent created:", paymentIntent.id);

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
    console.log("Test event created:", event.id);

    // Sign the event
    const signature = stripe.webhooks.generateTestHeaderString({
      payload: JSON.stringify(event),
      secret: process.env.STRIPE_WEBHOOK_SECRET,
    });
    console.log("Signature generated");

    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/stripe`;
    console.log("Sending webhook to:", webhookUrl);

    // Send the event to our webhook handler
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Stripe-Signature": signature,
      },
      body: JSON.stringify(event),
    });

    const result = await response.json();
    console.log("Webhook response:", result);
    
    return NextResponse.json({ 
      success: true, 
      result,
      webhookUrl,
      eventId: event.id,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error("Error testing webhook:", error);
    return NextResponse.json(
      { 
        error: "Failed to test webhook", 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 