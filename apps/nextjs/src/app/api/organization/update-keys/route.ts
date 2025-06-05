import { NextResponse } from "next/server";
import { auth, getSession } from "@acme/auth";
import { db } from "@acme/db/client";
import { organization, member } from "@acme/db/schema";
import { eq } from "@acme/db";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get the active organization for this user
    const activeOrg = await db.query.member.findFirst({
      where: eq(member.userId, session.user.id),
      columns: {
        organizationId: true,
      },
    });

    if (!activeOrg) {
      return NextResponse.json(
        { error: "No organization found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      shareASaleToken,
      shareASaleSecretKey,
      awinKey,
      impactKey,
      everflowKey,
      cjKey,
      rakutenKey,
      rakutenSecret,
      partnerizeKey,
    } = body;

    // Update organization
    await db.update(organization)
      .set({
        shareASaleToken,
        shareASaleSecretKey,
        awinKey,
        impactKey,
        everflowKey,
        cjKey,
        rakutenKey,
        rakutenSecret,
        partnerizeKey,
      })
      .where(eq(organization.id, activeOrg.organizationId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating organization API keys:", error);
    return NextResponse.json(
      { error: "Failed to update API keys" },
      { status: 500 }
    );
  }
} 