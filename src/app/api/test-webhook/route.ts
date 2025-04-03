import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

interface TestEvent {
  id: string;
  object: string;
  type: string;
  data: {
    object: Stripe.PaymentIntent;
  };
  created: number;
}

interface WebhookResponse {
  status: number;
  statusText: string;
  body: unknown;
}

interface DebugError {
  message: string;
  stack?: string;
}

export async function GET() {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      webhookSecretLength: process.env.STRIPE_WEBHOOK_SECRET?.length || 0
    },
    webhookUrl: "https://mathsandmelody--mathandmelody-a677f.us-central1.hosted.app/api/webhooks/stripe",
    event: null as TestEvent | null,
    signature: "",
    response: null as WebhookResponse | null,
    error: null as DebugError | null
  };

  try {
    // Check if environment variables are set
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      debugInfo.error = {
        message: "STRIPE_WEBHOOK_SECRET is not configured"
      };
      return NextResponse.json(
        { error: "STRIPE_WEBHOOK_SECRET is not configured", debug: debugInfo },
        { status: 500 }
      );
    }

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
    debugInfo.event = event;

    // Sign the event
    const signature = stripe.webhooks.generateTestHeaderString({
      payload: JSON.stringify(event),
      secret: process.env.STRIPE_WEBHOOK_SECRET,
    });
    debugInfo.signature = signature;

    // Send the event to our webhook handler
    const response = await fetch(debugInfo.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Stripe-Signature": signature,
      },
      body: JSON.stringify(event),
    });

    const result = await response.json();
    debugInfo.response = {
      status: response.status,
      statusText: response.statusText,
      body: result
    };
    
    return NextResponse.json({ 
      success: true, 
      debug: debugInfo
    });
  } catch (error) {
    debugInfo.error = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    };
    return NextResponse.json(
      { 
        error: "Failed to test webhook", 
        details: error instanceof Error ? error.message : String(error),
        debug: debugInfo
      },
      { status: 500 }
    );
  }
} 