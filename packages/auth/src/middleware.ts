import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { stripeClient } from "@better-auth/stripe/client";
import { createAuthClient } from "better-auth/client";
import { emailOTPClient, organizationClient } from "better-auth/client/plugins";

export const client = createAuthClient({
  plugins: [
    emailOTPClient(),
    organizationClient(),
    stripeClient({
      subscription: true,
    }),
  ],
});

export async function authMiddleware(request: NextRequest) {
  // Ignore API routes and static assets
  if (
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Get the session from the request headers
  const { data: session } = await client.getSession({
    fetchOptions: {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    },
  });

  // Allow access to public routes even when not logged in
  if (!session && (
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup") ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/pricing"
  )) {
    return NextResponse.next();
  }

  // If not logged in and trying to access protected routes, redirect to login
  if (!session && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // For logged-in users, check if they have organizations
  if (session) {
    // Skip organization check for public pages and pricing page
    if (
      request.nextUrl.pathname === "/" || 
      request.nextUrl.pathname === "/pricing" || 
      request.nextUrl.pathname.startsWith("/(homepage)") ||
      request.nextUrl.pathname.startsWith("/(public)")
    ) {
      return NextResponse.next();
    }

    // Only check for organizations when accessing dashboard or protected pages
    if (
      request.nextUrl.pathname.startsWith("/dashboard") || 
      request.nextUrl.pathname.startsWith("/(protected)") || 
      request.nextUrl.pathname.startsWith("/(dashboard)")
    ) {
      try {
        // Make a server-side request to our own API to check for organizations
        const response = await fetch(`${request.nextUrl.origin}/api/auth/organizations`, {
          headers: {
            cookie: request.headers.get("cookie") ?? "",
          },
        });
        
        const organizations = await response.json();

        // Check if organizations is an array and if it's empty
        const hasOrganizations = Array.isArray(organizations) && organizations.length > 0;
        
        // If the user doesn't have any organizations, redirect to pricing
        if (!hasOrganizations) {
          return NextResponse.redirect(new URL("/pricing?from=middleware", request.url));
        }
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
        // If we can't check organizations, allow the request to proceed
      }
    }
  }

  return NextResponse.next();
}
