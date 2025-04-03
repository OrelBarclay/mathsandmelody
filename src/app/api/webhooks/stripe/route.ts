import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/firebase-admin";

// Initialize Stripe with the secret key from service account
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

interface VerificationDetails {
  bodyLength: number;
  signatureLength: number;
  secretLength: number;
}

interface DebugError {
  message: string;
  verificationDetails?: VerificationDetails;
  stack?: string;
}

export async function POST(request: Request) {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    headers: {} as Record<string, string>,
    body: "",
    signature: "",
    webhookSecretConfigured: false,
    verificationDetails: {} as VerificationDetails,
    eventType: "",
    eventData: null as Stripe.Event.Data.Object | null,
    error: null as DebugError | null
  };

  try {
    // Get and store headers
    const headersList = Array.from(request.headers.entries());
    headersList.forEach(([key, value]) => {
      debugInfo.headers[key] = value;
    });

    // Get and store body
    const body = await request.text();
    debugInfo.body = body;

    // Get and store signature
    const signature = request.headers.get("stripe-signature");
    debugInfo.signature = signature || "";
    debugInfo.webhookSecretConfigured = !!webhookSecret;

    if (!signature) {
      debugInfo.error = {
        message: "Missing stripe-signature header"
      };
      return NextResponse.json(
        { error: "Missing stripe-signature header", debug: debugInfo },
        { status: 400 }
      );
    }

    if (!webhookSecret) {
      debugInfo.error = {
        message: "Webhook secret is not configured"
      };
      return NextResponse.json(
        { error: "Webhook secret is not configured", debug: debugInfo },
        { status: 500 }
      );
    }

    let event: Stripe.Event;

    try {
      // Store verification details
      debugInfo.verificationDetails = {
        bodyLength: body.length,
        signatureLength: signature.length,
        secretLength: webhookSecret.length
      };

      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      debugInfo.eventType = event.type;
      debugInfo.eventData = event.data;
    } catch (err) {
      debugInfo.error = {
        message: err instanceof Error ? err.message : String(err),
        verificationDetails: debugInfo.verificationDetails
      };
      return NextResponse.json(
        { 
          error: "Invalid signature", 
          details: err instanceof Error ? err.message : String(err),
          debug: debugInfo
        },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) {
          debugInfo.error = {
            message: "No booking ID in session metadata"
          };
          return NextResponse.json(
            { error: "No booking ID provided", debug: debugInfo },
            { status: 400 }
          );
        }

        // Use admin SDK to update the booking
        await db.collection("bookings").doc(bookingId).update({
          status: "confirmed",
          updatedAt: new Date(),
          paymentIntentId: session.payment_intent,
        });

        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata?.bookingId;

        if (!bookingId) {
          debugInfo.error = {
            message: "No booking ID in payment intent metadata"
          };
          return NextResponse.json(
            { error: "No booking ID provided", debug: debugInfo },
            { status: 400 }
          );
        }

        // Use admin SDK to update the booking
        await db.collection("bookings").doc(bookingId).update({
          status: "confirmed",
          updatedAt: new Date(),
          paymentIntentId: paymentIntent.id,
        });

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata?.bookingId;

        if (!bookingId) {
          debugInfo.error = {
            message: "No booking ID in payment intent metadata"
          };
          return NextResponse.json(
            { error: "No booking ID provided", debug: debugInfo },
            { status: 400 }
          );
        }

        // Use admin SDK to update the booking
        await db.collection("bookings").doc(bookingId).update({
          status: "cancelled",
          updatedAt: new Date(),
        });

        break;
      }

      default:
        debugInfo.error = {
          message: `Unhandled event type: ${event.type}`
        };
    }

    return NextResponse.json({ 
      received: true, 
      debug: debugInfo 
    });
  } catch (error) {
    debugInfo.error = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    };
    return NextResponse.json(
      { 
        error: "Webhook handler failed", 
        details: error instanceof Error ? error.message : String(error),
        debug: debugInfo
      },
      { status: 500 }
    );
  }
} 