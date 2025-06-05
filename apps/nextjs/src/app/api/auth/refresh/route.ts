import { NextResponse } from "next/server";
import { auth } from "@acme/auth";
import { db } from "@acme/db/client";
import { session } from "@acme/db/schema";
import { eq, and, gt, sql } from "@acme/db";

export async function POST(request: Request) {
  try {
    // Get the current session token from the Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }
    
    const token = authHeader.split(" ")[1];
    
    // Find the current session
    const currentSession = await db.query.session.findFirst({
      where: and(
        eq(session.token, sql`${token}`),
        gt(session.expiresAt, new Date())
      ),
    });

    if (!currentSession) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }

    // Create a new session using the auth API
    const headers = new Headers();
    headers.set("cookie", `ba.session.token=${token}`);
    
    const newSessionData = await auth.api.getSession({
      headers,
    });

    if (!newSessionData) {
      return NextResponse.json({ error: "Failed to create new session" }, { status: 500 });
    }

    // Delete the old session
    await db.delete(session).where(eq(session.id, currentSession.id));

    return NextResponse.json({
      token: newSessionData.session.token,
      expiresAt: newSessionData.session.expiresAt,
    });
  } catch (error) {
    console.error("Session refresh error:", error);
    return NextResponse.json(
      { error: "Failed to refresh session" },
      { status: 500 }
    );
  }
} 