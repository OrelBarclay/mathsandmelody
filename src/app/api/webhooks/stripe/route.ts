import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/firebase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    console.log("Webhook received");
    
    // Log all headers for debugging
    const headersList = Array.from(request.headers.entries());
    console.log("Request headers:", JSON.stringify(headersList, null, 2));
    
    const body = await request.text();
    console.log("Request body:", body);
    
    const signature = request.headers.get("stripe-signature");
    console.log("Stripe signature:", signature);
    console.log("Webhook secret configured:", webhookSecret ? "yes" : "no");
    console.log("Webhook secret length:", webhookSecret ? webhookSecret.length : 0);

    if (!signature) {
      console.error("Missing stripe-signature header");
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    if (!webhookSecret) {
      console.error("Webhook secret is not configured");
      return NextResponse.json(
        { error: "Webhook secret is not configured" },
        { status: 500 }
      );
    }

    let event: Stripe.Event;

    try {
      // Log the exact values being used for verification
      console.log("Verifying webhook with:", {
        bodyLength: body.length,
        signatureLength: signature.length,
        secretLength: webhookSecret.length
      });

      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log("Successfully constructed Stripe event:", event.type);
    } catch (err) {
      console.error("Error verifying webhook signature:", err);
      // Log more details about the verification failure
      console.error("Verification failure details:", {
        error: err instanceof Error ? err.message : String(err),
        bodyLength: body.length,
        signatureLength: signature.length,
        secretLength: webhookSecret.length
      });
      return NextResponse.json(
        { 
          error: "Invalid signature", 
          details: err instanceof Error ? err.message : String(err)
        },
        { status: 400 }
      );
    }

    console.log("Processing webhook event:", event.type);
    console.log("Event data:", JSON.stringify(event.data, null, 2));

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) {
          console.error("No booking ID in session metadata");
          return NextResponse.json(
            { error: "No booking ID provided" },
            { status: 400 }
          );
        }

        // Update the booking status to confirmed
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
          console.error("No booking ID in payment intent metadata");
          return NextResponse.json(
            { error: "No booking ID provided" },
            { status: 400 }
          );
        }

        // Update the booking status to confirmed
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
          console.error("No booking ID in payment intent metadata");
          return NextResponse.json(
            { error: "No booking ID provided" },
            { status: 400 }
          );
        }

        // Update the booking status to cancelled
        await db.collection("bookings").doc(bookingId).update({
          status: "cancelled",
          updatedAt: new Date(),
        });

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { 
        error: "Webhook handler failed", 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 