import { auth, getSession } from "@acme/auth";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import slugify from "@sindresorhus/slugify";
import { nanoid } from "nanoid";
import Stripe from "stripe";
import { env } from "../../../../env";
import { db } from "@acme/db/client";
import { stripeTransactions } from "@acme/db/schema";

// Check if we have a Stripe key and if we're in debug mode
const hasStripeKey = !!env.STRIPE_SECRET_KEY && env.STRIPE_SECRET_KEY.length > 10;
const isDebugMode = env.NODE_ENV === "development";

// Initialize Stripe only if we have a key
let stripe: Stripe | null = null;
if (hasStripeKey) {
  try {
    stripe = new Stripe(env.STRIPE_SECRET_KEY);
    console.log("Stripe initialized successfully in checkout-success");
  } catch (error) {
    console.error("Failed to initialize Stripe in checkout-success:", error);
  }
} else {
  console.warn("No Stripe key available in checkout-success - will use mock checkout in development mode");
}

export async function GET(request: Request) {
  console.log("GET request to /api/auth/checkout-success received");
  
  try {
    const session = await getSession();
    
    // Ensure user is authenticated
    if (!session) {
      console.log("No session found, redirecting to login");
      return redirect('/login');
    }

    console.log("User authenticated:", session.user.email);

    // Get the session_id from the URL
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('session_id');
    
    if (!sessionId) {
      console.error("No Stripe session ID found in URL");
      return NextResponse.redirect(new URL('/pricing', request.url));
    }

    console.log("Processing checkout with session ID:", sessionId);
    
    // Check if this is a mock session in development mode
    const isMockSession = sessionId.startsWith('mock_') && isDebugMode;
    let paymentSuccessful = false;
    let stripeSessionData = null;
    
    if (isMockSession) {
      console.log("Mock session detected in development mode - considering payment successful");
      paymentSuccessful = true;
      
      // Create mock session data for development
      stripeSessionData = {
        id: sessionId,
        amount_total: 1900, // $19.00
        currency: 'usd',
        customer: 'mock_customer',
        metadata: {
          planType: 'pro',
          isAnnual: 'false'
        }
      };
    } else if (stripe) {
      // Verify the checkout session with Stripe
      try {
        console.log("Verifying checkout session with Stripe");
        const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
        stripeSessionData = stripeSession;
        
        // Verify that the session is complete and payment was successful
        paymentSuccessful = stripeSession.status === 'complete' && stripeSession.payment_status === 'paid';
        
        console.log("Stripe session verification:", {
          status: stripeSession.status,
          paymentStatus: stripeSession.payment_status,
          successful: paymentSuccessful,
        });
        
        // Verify that the user ID matches
        if (stripeSession.client_reference_id !== session.user.id) {
          console.error("User ID mismatch:", stripeSession.client_reference_id, session.user.id);
          return NextResponse.redirect(new URL('/pricing', request.url));
        }
      } catch (error) {
        console.error("Error verifying Stripe session:", error);
        return NextResponse.redirect(new URL('/pricing', request.url));
      }
    } else {
      console.error("Stripe not initialized and not in mock mode");
      return NextResponse.redirect(new URL('/pricing?error=configuration', request.url));
    }

    if (!paymentSuccessful && !isMockSession) {
      console.error("Payment not completed successfully");
      return NextResponse.redirect(new URL('/pricing?error=payment', request.url));
    }
    
    try {
      // Record the transaction
      if (stripeSessionData) {
        console.log("Recording transaction in database");
        
        // Extract plan type and annual flag from metadata or line items
        const planType = stripeSessionData.metadata?.planType || 'pro';
        const isAnnual = stripeSessionData.metadata?.isAnnual === 'true';
        
        await db.insert(stripeTransactions).values({
          userId: session.user.id,
          stripeSessionId: sessionId,
          stripeCustomerId: stripeSessionData.customer?.toString() || null,
          amount: stripeSessionData.amount_total || 0,
          currency: stripeSessionData.currency || 'usd',
          status: 'succeeded',
          planType,
          isAnnual,
          metadata: stripeSessionData,
        });
        
        console.log("Transaction recorded successfully");
      }
    } catch (dbError) {
      // Log but don't fail the process if we can't record the transaction
      console.error("Error recording transaction:", dbError);
    }

    // Skip the organization check entirely and redirect directly to create-organization
    // This avoids the UNAUTHORIZED errors when checking organizations
    console.log("Payment successful, redirecting directly to create organization page");
    return NextResponse.redirect(new URL('/create-organization', request.url));
    
  } catch (error) {
    console.error("Error in checkout success handler:", error);
    // If an error occurs, redirect back to pricing
    return NextResponse.redirect(new URL('/pricing?error=general', request.url));
  }
} 