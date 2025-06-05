import { NextResponse } from "next/server";
import { getSession } from "@acme/auth";
import { db } from "@acme/db/client";
import { eq, and } from "@acme/db";
import { member, session } from "@acme/db/schema";

export async function POST(request: Request) {
  try {
    const currentSession = await getSession();
    
    if (!currentSession) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { organizationId } = body;

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    // Verify user is a member of the organization
    const memberRecord = await db.query.member.findFirst({
      where: (members, { eq, and }) =>
        and(
          eq(members.userId, currentSession.user.id),
          eq(members.organizationId, organizationId)
        ),
    });

    if (!memberRecord) {
      return NextResponse.json(
        { error: "You are not a member of this organization" },
        { status: 403 }
      );
    }

    // Update the session
    await db.update(session)
      .set({ activeOrganizationId: organizationId })
      .where(eq(session.id, currentSession.session.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting active organization:", error);
    return NextResponse.json(
      { error: "Failed to set active organization" },
      { status: 500 }
    );
  }
} 