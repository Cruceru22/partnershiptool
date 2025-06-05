import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@acme/auth";
import { db } from "@acme/db/client";
import { organization, member } from "@acme/db/schema";
import { eq } from "@acme/db";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { affiliateId } = await request.json();
    
    if (!affiliateId) {
      return NextResponse.json(
        { error: "Affiliate ID is required" },
        { status: 400 }
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

    // Get organization API keys
    const org = await db.query.organization.findFirst({
      where: eq(organization.id, activeOrg.organizationId),
      columns: {
        shareASaleToken: true,
        shareASaleSecretKey: true,
      },
    });

    // If API credentials are configured, make the real API call
    if (org?.shareASaleToken && org?.shareASaleSecretKey) {
      try {
        const merchantId = "154175"; // Your merchant ID from the documentation
        const token = org.shareASaleToken;
        const secret = org.shareASaleSecretKey;
        const action = "approveAffiliate";
        const version = "3.0";
        
        // Create UTC date string
        const now = new Date();
        const utcDate = now.toUTCString();
        
        // Create authentication hash
        const stringToHash = `${token}:${utcDate}:${action}:${secret}`;
        const authHash = crypto.createHash('sha256').update(stringToHash).digest('hex').toUpperCase();
        
        const url = `https://api.shareasale.com/w.cfm?merchantId=${merchantId}&token=${token}&version=${version}&action=${action}&affiliateID=${affiliateId}`;
        
        const response = await fetch(url, {
          headers: {
            'x-ShareASale-Date': utcDate,
            'x-ShareASale-Authentication': authHash
          }
        });
        
        if (!response.ok) {
          throw new Error(`ShareASale API error: ${response.status}`);
        }
        
        const responseText = await response.text();
        
        if (responseText.includes("Affiliate Approved")) {
          return NextResponse.json({ 
            success: true, 
            message: "Affiliate approved successfully",
            affiliateId 
          });
        } else if (responseText.includes("Affiliate Not Found")) {
          return NextResponse.json(
            { error: "Affiliate not found" },
            { status: 404 }
          );
        } else if (responseText.includes("Affiliate Already Approved")) {
          return NextResponse.json(
            { error: "Affiliate already approved" },
            { status: 400 }
          );
        } else {
          return NextResponse.json(
            { error: "Failed to approve affiliate" },
            { status: 500 }
          );
        }
      } catch (apiError) {
        console.error("ShareASale API error:", apiError);
        return NextResponse.json(
          { error: "ShareASale API error" },
          { status: 500 }
        );
      }
    }

    // Demo mode response when API credentials not configured
    const mockResponse = {
      success: true,
      message: `Affiliate ${affiliateId} approved successfully (Demo Mode)`,
      affiliateId
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error("Error approving affiliate:", error);
    return NextResponse.json(
      { error: "Failed to approve affiliate" },
      { status: 500 }
    );
  }
} 