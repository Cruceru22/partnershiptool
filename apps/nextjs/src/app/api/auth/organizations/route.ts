import { NextResponse } from "next/server";
import { auth, getSession } from "@acme/auth";

export async function GET() {
  console.log("GET /api/auth/organizations request received");
  
  try {
    const session = await getSession();
    
    // Log session info (excluding sensitive data)
    console.log("Session info:", session ? {
      present: true,
      userId: session.user?.id,
      email: session.user?.email,
      hasToken: !!session.session?.token,
    } : "No session");
    
    // Ensure user is authenticated
    if (!session) {
      console.log("No authenticated session - returning 401");
      return NextResponse.json([], { status: 401 });
    }

    // Fetch organizations for the current user
    console.log("Fetching organizations for user:", session.user.id);
    
    try {
      const response = await auth.api.listOrganizations({
        headers: {
          cookie: `ba.session.token=${session.session.token}`,
        },
      });
      
      console.log("Organizations API response:", {
        type: typeof response,
        isArray: Array.isArray(response),
        length: Array.isArray(response) ? response.length : 'not an array',
        data: response
      });

      return NextResponse.json(response || []);
    } catch (orgError: any) {
      console.error("Error calling listOrganizations API:", orgError);
      
      // Even if there's an error, return an empty array with 200 status
      // to prevent pricing page from breaking
      console.log("Returning empty array with 200 status despite error");
      return NextResponse.json([], { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching organizations:", error);
    // Return empty array with 200 status to prevent pricing page from breaking
    return NextResponse.json([], { status: 200 });
  }
} 