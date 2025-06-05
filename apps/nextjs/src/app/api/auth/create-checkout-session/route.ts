import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@acme/auth";
import { getSession } from "@acme/auth";
import { env } from "../../../../env";

// Check if we have a Stripe key and if we're in debug mode
const hasStripeKey = !!env.STRIPE_SECRET_KEY && env.STRIPE_SECRET_KEY.length > 10;
const isDebugMode = env.NODE_ENV === "development";

console.log("Stripe configuration:", {
  hasStripeKey,
  isDebugMode,
  nodeEnv: env.NODE_ENV,
  priceId: env.STRIPE_PRICE_ID || "Not set",
});

// Initialize Stripe only if we have a key
let stripe: Stripe | null = null;
if (hasStripeKey) {
  try {
    stripe = new Stripe(env.STRIPE_SECRET_KEY);
    console.log("Stripe initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Stripe:", error);
  }
} else {
  console.warn("No Stripe key available - will use mock checkout in development mode");
}

// Support direct GET requests for easier testing
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const session = await getSession();
    
    // Ensure user is authenticated
    if (!session) {
      // Redirect to login for GET requests
      return NextResponse.redirect(new URL('/login?redirect=/debug', request.url));
    }
    
    if (!env.STRIPE_PRICE_ID) {
      console.error("No STRIPE_PRICE_ID found in environment variables");
      return NextResponse.redirect(new URL('/debug?error=no-price-id', request.url));
    }
    
    console.log(`Creating checkout session with price ID: ${env.STRIPE_PRICE_ID}`);
    
    // Default URLs for GET requests
    const successUrl = `${new URL(request.url).origin}/api/auth/checkout-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${new URL(request.url).origin}/debug`;
    
    // Use mock checkout in development if no Stripe key
    if (!stripe && isDebugMode) {
      console.log("Using mock checkout (development mode)");
      const mockSessionId = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      const mockCheckoutUrl = successUrl.replace("{CHECKOUT_SESSION_ID}", mockSessionId);
      return NextResponse.redirect(mockCheckoutUrl);
    }
    
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe payment provider is not configured" },
        { status: 500 }
      );
    }
    
    const stripeSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      client_reference_id: session.user.id,
      customer_email: session.user.email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: session.user.id,
      },
    });
    
    // For GET requests, redirect directly to Stripe
    return NextResponse.redirect(stripeSession.url as string);
  } catch (error) {
    console.error("Error processing GET request:", error);
    return NextResponse.redirect(new URL('/debug?error=checkout-failed', request.url));
  }
}

export async function POST(request: Request) {
  console.log("======== POST REQUEST TO CREATE CHECKOUT SESSION ========");
  
  try {
    // Log the request URL
    console.log("Request URL:", request.url);
    
    // Get session
    const session = await getSession();
    console.log("Session:", session ? { 
      userId: session.user?.id,
      email: session.user?.email,
      isAuthenticated: !!session.user 
    } : "No session");
    
    // Ensure user is authenticated
    if (!session) {
      console.log("Authentication required - no session found");
      return NextResponse.json(
        { error: "You must be logged in to create a checkout session" },
        { status: 401 }
      );
    }

    // Parse request body
    let body;
    let rawBody = "";
    try {
      rawBody = await request.text();
      console.log("Raw request body:", rawBody);
      
      // Handle empty or invalid JSON
      if (!rawBody || rawBody.trim() === '') {
        console.error("Empty request body");
        return NextResponse.json(
          { error: "Empty request body" },
          { status: 400 }
        );
      }
      
      body = JSON.parse(rawBody);
      console.log("Parsed request body:", body);
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError, "Raw body:", rawBody);
      return NextResponse.json(
        { error: "Invalid request body format" },
        { status: 400 }
      );
    }
    
    // Validate required fields
    const { priceId, successUrl, cancelUrl } = body || {};
    
    if (!successUrl || !cancelUrl) {
      console.error("Missing required URL parameters:", { successUrl, cancelUrl });
      return NextResponse.json(
        { error: "Missing required parameters: successUrl and cancelUrl must be provided" },
        { status: 400 }
      );
    }
    
    console.log("Extracted fields:", { priceId, successUrl, cancelUrl });
    
    // Only validate price IDs in production
    if (env.NODE_ENV === 'production') {
      // Valid price IDs
      const validPriceIds = [
        // Pro plan
        'price_1RMq3cG2mTVYifKmpYpy3EZV', // Annual
        'price_1R1Dj0EauNpNklnFp7YC2iSW', // Monthly
        
        // Team plan
        'price_1R1QZKEauNpNklnFdSILW732', // Annual
        'price_1R1Dk1EauNpNklnFZcleYNzg'  // Monthly
      ];
      
      // Validate the price ID if one was provided in the request
      if (priceId && !validPriceIds.includes(priceId)) {
        console.error("Invalid price ID provided:", priceId);
        return NextResponse.json(
          { error: "Invalid price ID" },
          { status: 400 }
        );
      }
    } else {
      // In development, log the price ID but don't validate
      console.log("Development mode - accepting price ID without validation:", priceId);
    }
    
    // Check if we have configuration for Stripe
    console.log("Stripe configuration:", {
      hasStripeKey,
      isDebugMode,
      stripeInitialized: !!stripe
    });

    // Use mock checkout in development if no Stripe key
    if (!stripe && isDebugMode) {
      console.log("Using mock checkout (development mode)");
      
      // Create mock checkout URL that points directly to success URL
      // Replace the placeholder {CHECKOUT_SESSION_ID} with a fake session ID
      const mockSessionId = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      const mockCheckoutUrl = successUrl.replace("{CHECKOUT_SESSION_ID}", mockSessionId);
      
      console.log("Created mock checkout URL:", mockCheckoutUrl);
      return NextResponse.json({ url: mockCheckoutUrl });
    }
    
    // Check if Stripe is initialized
    if (!stripe) {
      console.error("Stripe is not initialized and not in development mode");
      return NextResponse.json(
        { error: "Stripe payment provider is not configured" },
        { status: 500 }
      );
    }

    // Create real checkout session
    try {
      console.log("Creating Stripe checkout session with params:", {
        mode: "subscription",
        priceId: priceId || env.STRIPE_PRICE_ID,
        userId: session.user.id,
        email: session.user.email
      });
      
      const stripeSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId || env.STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        client_reference_id: session.user.id,
        customer_email: session.user.email,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId: session.user.id,
          priceId: priceId || env.STRIPE_PRICE_ID
        },
      });

      console.log("Stripe session created successfully:", { 
        id: stripeSession.id,
        url: stripeSession.url,
        priceId: priceId || env.STRIPE_PRICE_ID
      });
      
      return NextResponse.json({ 
        url: stripeSession.url,
        sessionId: stripeSession.id,
        priceId: priceId || env.STRIPE_PRICE_ID
      });
    } catch (stripeError: any) {
      console.error("Stripe API Error:", {
        message: stripeError.message,
        type: stripeError.type,
        code: stripeError.code,
        param: stripeError.param,
        statusCode: stripeError.statusCode,
        rawError: stripeError
      });
      
      return NextResponse.json(
        { 
          error: "Error creating Stripe checkout session", 
          details: stripeError.message,
          code: stripeError.code,
          type: stripeError.type
        },
        { status: stripeError.statusCode || 500 }
      );
    }
  } catch (error: any) {
    console.error("General error in checkout endpoint:", error);
    return NextResponse.json(
      { 
        error: "Failed to process checkout request",
        details: error.message
      },
      { status: 500 }
    );
  }
} 