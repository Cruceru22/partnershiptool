import { NextResponse } from "next/server";
import { auth, getSession } from "@acme/auth";
import { db } from "@acme/db/client";
import { organization, member } from "@acme/db/schema";
import { eq } from "@acme/db";

interface Organization {
  id: string;
  name: string;
  slug: string | null;
  logo: string | null;
  createdAt: Date;
  metadata: string | null;
}

// Helper endpoint to redirect users to their dashboard
export async function GET() {
  try {
    // Get the user session
    const session = await getSession();
    
    if (!session?.user?.id) {
      console.log("No authenticated session - redirecting to login");
      return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
    }

    // First, check if there's an active organization in the session
    const activeOrgId = (session as any).session?.activeOrganizationId;
    if (activeOrgId) {
      const activeOrg = await db.query.organization.findFirst({
        where: eq(organization.id, activeOrgId),
      });

      if (activeOrg?.slug) {
        console.log(`Found active organization slug: ${activeOrg.slug}, redirecting`);
        return NextResponse.redirect(new URL(`/${activeOrg.slug}`, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
      }
    }
    
    try {
      // If no active organization, try to get all organizations using the member table
      const userOrgs = await db.query.member.findMany({
        where: eq(member.userId, session.user.id),
        with: {
          organization: true,
        },
      });
      
      // If the user has organizations, redirect to the first one
      const firstOrg = userOrgs[0]?.organization as Organization | undefined;
      if (firstOrg?.slug) {
        console.log(`Found organization slug: ${firstOrg.slug}, redirecting`);
        return NextResponse.redirect(new URL(`/${firstOrg.slug}`, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
      }
      
      // If no organizations found or no valid slug, redirect to pricing
      console.log("No valid organizations found, redirecting to pricing");
      return NextResponse.redirect(new URL('/pricing', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
    } catch (error) {
      console.error("Error finding organizations:", error);
      // In case of error, default to pricing
      return NextResponse.redirect(new URL('/pricing', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
    }
  } catch (error) {
    console.error("Error in get-dashboard-redirect:", error);
    return NextResponse.redirect(new URL('/pricing', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  }
} 