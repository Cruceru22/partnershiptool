import { NextResponse } from "next/server";
import { getSession } from "@acme/auth";
import { db } from "@acme/db/client";
import { organization, member } from "@acme/db/schema";
import { eq } from "@acme/db";
import crypto from "crypto";

export async function GET() {
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

    // Get organization API keys
    const org = await db.query.organization.findFirst({
      where: eq(organization.id, activeOrg.organizationId),
      columns: {
        shareASaleToken: true,
        shareASaleSecretKey: true,
      },
    });

    // Check if API credentials are configured
    if (!org?.shareASaleToken || !org?.shareASaleSecretKey) {
      return NextResponse.json(
        { 
          error: "ShareASale API credentials not configured",
          message: "Please configure your ShareASale API token and secret key in organization settings"
        },
        { status: 400 }
      );
    }

    // Make the ShareASale API call
    try {
      const merchantId = "154175"; // Your merchant ID from the documentation
      const token = org.shareASaleToken;
      const secret = org.shareASaleSecretKey;
      const action = "report-affiliate";
      const version = "3.0";
      
      // Create UTC date string
      const now = new Date();
      const utcDate = now.toUTCString();
      
      // Create authentication hash
      const stringToHash = `${token}:${utcDate}:${action}:${secret}`;
      const authHash = crypto.createHash('sha256').update(stringToHash).digest('hex').toUpperCase();
      
      const url = `https://api.shareasale.com/w.cfm?merchantId=${merchantId}&token=${token}&version=${version}&action=${action}&format=pipe`;
      
      const response = await fetch(url, {
        headers: {
          'x-ShareASale-Date': utcDate,
          'x-ShareASale-Authentication': authHash
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`ShareASale API error: ${response.status} - ${errorText}`);
        return NextResponse.json(
          { 
            error: "ShareASale API request failed",
            details: `HTTP ${response.status}`,
            message: "Please check your API credentials and try again"
          },
          { status: 502 }
        );
      }
      
      const responseText = await response.text();
      
      // Log the response to understand the structure
      console.log('ShareASale API Response Headers and Sample Data:');
      const lines = responseText.trim().split('\n');
      if (lines.length > 0) {
        console.log('Headers:', lines[0]);
        if (lines.length > 1) {
          console.log('Sample Record:', lines[1]);
        }
      }
      
      // Parse pipe-delimited response (ShareASale default format)
      const headers = lines[0]?.split('|') || [];
      const affiliates = lines.slice(1).map((line, index) => {
        const values = line.split('|');
        const affiliate: any = {};
        headers.forEach((header, index) => {
          affiliate[header.trim()] = values[index]?.trim() || '';
        });
        
        // Map the real status from ShareASale fields
        let status = "pending"; // Default fallback
        
        // Try to determine status from various possible fields
        if (affiliate.status) {
          // Direct status field
          const apiStatus = affiliate.status.toLowerCase();
          if (apiStatus.includes('approved') || apiStatus.includes('active')) {
            status = "approved";
          } else if (apiStatus.includes('declined') || apiStatus.includes('rejected') || apiStatus.includes('denied')) {
            status = "declined";
          }
        } else if (affiliate.affiliateStatus) {
          // Alternative status field name
          const apiStatus = affiliate.affiliateStatus.toLowerCase();
          if (apiStatus.includes('approved') || apiStatus.includes('active')) {
            status = "approved";
          } else if (apiStatus.includes('declined') || apiStatus.includes('rejected') || apiStatus.includes('denied')) {
            status = "declined";
          }
        } else if (affiliate.approvalStatus) {
          // Another possible field name
          const apiStatus = affiliate.approvalStatus.toLowerCase();
          if (apiStatus.includes('approved') || apiStatus.includes('active')) {
            status = "approved";
          } else if (apiStatus.includes('declined') || apiStatus.includes('rejected') || apiStatus.includes('denied')) {
            status = "declined";
          }
        }
        
        // Create a unique ID - use existing userId/affiliateId or generate one
        const uniqueId = affiliate.userId || affiliate.affiliateId || `affiliate-${index}-${Date.now()}`;
        
        // Map ShareASale fields to our interface
        return {
          userId: uniqueId,
          organization: affiliate.organization || affiliate.website || '',
          website: affiliate.website || '',
          country: affiliate.country || '',
          state: affiliate.state || '',
          email: affiliate.email || '',
          phone: affiliate.phone || '',
          address: affiliate.address || '',
          city: affiliate.city || '',
          zip: affiliate.zip || '',
          notes: affiliate.notes || '',
          feedbackCount: parseInt(affiliate.feedbackCount) || 0,
          feedbackAverage: parseFloat(affiliate.feedbackAverage) || 0,
          feedbackRating: affiliate.feedbackRating || '',
          status: status, // Use the mapped status
          signupDate: affiliate.signupDate || new Date().toISOString(),
          tags: affiliate.tags || ''
        };
      });
      
      return NextResponse.json(affiliates);
    } catch (apiError) {
      console.error("ShareASale API error:", apiError);
      return NextResponse.json(
        { 
          error: "Failed to fetch affiliates from ShareASale",
          message: "There was an error communicating with the ShareASale API. Please try again later.",
          details: apiError instanceof Error ? apiError.message : "Unknown error"
        },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Error fetching ShareASale affiliates:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: "An unexpected error occurred while processing your request"
      },
      { status: 500 }
    );
  }
} 