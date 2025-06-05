import { NextResponse } from "next/server";
import { auth, getSession } from "@acme/auth";
import slugify from "@sindresorhus/slugify";
import { nanoid } from "nanoid";
import { db } from "@acme/db/client";
import { organization, member } from "@acme/db/schema";

export async function POST(request: Request) {
  try {
    // Get the current session
    const session = await getSession();
    
    if (!session) {
      console.log("No authenticated session found");
      return NextResponse.json(
        { error: "You must be logged in to create an organization" },
        { status: 401 }
      );
    }
    
    console.log("Session found for user:", session.user.email);
    console.log("Session token present:", !!session.session?.token);
    
    // Parse request body
    const body = await request.json();
    const { 
      name, 
      slug,
      shareASaleKey,
      awinKey,
      impactKey,
      everflowKey,
      cjKey,
      rakutenKey,
      partnerizeKey,
    } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: "Organization name is required" },
        { status: 400 }
      );
    }
    
    const finalSlug = slug || `${slugify(name, { lowercase: true })}-${nanoid(8)}`;
    console.log("Using slug:", finalSlug);
    
    try {
      // Create the organization directly in the database
      const timestamp = new Date();
      const orgId = nanoid();
      
      // Insert organization
      await db.insert(organization).values({
        id: orgId,
        name,
        slug: finalSlug,
        createdAt: timestamp,
        shareASaleKey,
        awinKey,
        impactKey,
        everflowKey,
        cjKey,
        rakutenKey,
        partnerizeKey,
      });
      
      // Insert membership
      await db.insert(member).values({
        id: nanoid(),
        organizationId: orgId,
        userId: session.user.id,
        role: "owner",
        createdAt: timestamp,
      });
      
      console.log("Organization created successfully:", { orgId, name, slug: finalSlug });
      
      return NextResponse.json({
        message: "Organization created successfully",
        organization: {
          id: orgId,
          name,
          slug: finalSlug,
          createdAt: timestamp,
        },
      });
    } catch (orgError: any) {
      console.error("Organization creation error details:", orgError);
      
      // Check if the error might be related to duplicate slug
      if (orgError.message && orgError.message.includes("duplicate")) {
        // Try again with a newly generated slug
        const retrySlug = `${slugify(name, { lowercase: true })}-${nanoid(8)}`;
        console.log("Retry with new slug due to potential duplicate:", retrySlug);
        
        try {
          const orgId = nanoid();
          const timestamp = new Date();
          
          // Insert organization with new slug
          await db.insert(organization).values({
            id: orgId,
            name,
            slug: retrySlug,
            createdAt: timestamp,
            shareASaleKey,
            awinKey,
            impactKey,
            everflowKey,
            cjKey,
            rakutenKey,
            partnerizeKey,
          });
          
          // Insert membership
          await db.insert(member).values({
            id: nanoid(),
            organizationId: orgId,
            userId: session.user.id,
            role: "owner",
            createdAt: timestamp,
          });
          
          console.log("Organization created successfully with retry slug:", { orgId, name, slug: retrySlug });
          
          return NextResponse.json({
            message: "Organization created successfully with alternate name",
            organization: {
              id: orgId,
              name,
              slug: retrySlug,
              createdAt: timestamp,
            },
          });
        } catch (retryError) {
          console.error("Error on retry organization creation:", retryError);
        }
      }
      
      // If we still have errors, return a meaningful error response
      return NextResponse.json(
        { 
          error: "Failed to create organization", 
          details: orgError.message || String(orgError)
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in create organization endpoint:", error);
    return NextResponse.json(
      { error: "An error occurred", details: String(error) },
      { status: 500 }
    );
  }
} 