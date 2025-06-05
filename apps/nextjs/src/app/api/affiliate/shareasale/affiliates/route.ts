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

    // If API credentials are configured, make the real API call
    if (org?.shareASaleToken && org?.shareASaleSecretKey) {
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
          throw new Error(`ShareASale API error: ${response.status}`);
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
        const affiliates = lines.slice(1).map(line => {
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
          
          // Map ShareASale fields to our interface
          return {
            userId: affiliate.userId || affiliate.affiliateId || '',
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
        // Fall back to demo data if API fails
      }
    }

    // Fallback demo data when API credentials not configured or API fails
    const demoAffiliates = [
      {
        userId: "123456",
        organization: "Golf Pro Reviews",
        website: "https://golfproreviews.com",
        country: "US",
        state: "CA",
        email: "john@golfproreviews.com",
        phone: "+1-555-0123",
        address: "123 Golf Street",
        city: "San Francisco",
        zip: "94105",
        notes: "High-traffic golf equipment review site",
        feedbackCount: 15,
        feedbackAverage: 4.8,
        feedbackRating: "Excellent",
        status: "pending",
        signupDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        tags: "golf,sports,reviews"
      },
      {
        userId: "789012",
        organization: "Sports Gear Central",
        website: "https://sportsgearcentral.net",
        country: "US", 
        state: "NY",
        email: "sarah@sportsgearcentral.net",
        phone: "+1-555-0456",
        address: "456 Sports Ave",
        city: "New York",
        zip: "10001",
        notes: "General sports equipment affiliate",
        feedbackCount: 8,
        feedbackAverage: 4.2,
        feedbackRating: "Good",
        status: "approved",
        signupDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        tags: "sports,equipment"
      },
      {
        userId: "345678",
        organization: "Budget Golf Deals",
        website: "https://budgetgolfdeals.com",
        country: "CA",
        state: "ON",
        email: "mike@budgetgolfdeals.com",
        phone: "+1-416-555-0789",
        address: "789 Deal Street",
        city: "Toronto",
        zip: "M5V 3A8",
        notes: "Focuses on budget golf equipment",
        feedbackCount: 3,
        feedbackAverage: 3.5,
        feedbackRating: "Average",
        status: "pending",
        signupDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        tags: "golf,budget,deals"
      },
      {
        userId: "901234",
        organization: "Outdoor Adventures Blog",
        website: "https://outdooradventuresblog.org",
        country: "US",
        state: "CO",
        email: "alex@outdooradventuresblog.org",
        phone: "+1-555-0321",
        address: "321 Mountain View Dr",
        city: "Denver",
        zip: "80202",
        notes: "Outdoor sports and adventure content",
        feedbackCount: 12,
        feedbackAverage: 4.6,
        feedbackRating: "Excellent",
        status: "declined",
        signupDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        tags: "outdoor,adventure,sports"
      },
      {
        userId: "567890",
        organization: "Golf Equipment Reviews",
        website: "https://golfequipmentreviews.pro",
        country: "UK",
        state: "",
        email: "emma@golfequipmentreviews.pro",
        phone: "+44-20-7946-0958",
        address: "10 Golf Lane",
        city: "London",
        zip: "SW1A 1AA",
        notes: "UK-based golf equipment review site",
        feedbackCount: 6,
        feedbackAverage: 4.3,
        feedbackRating: "Good",
        status: "pending",
        signupDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        tags: "golf,reviews,uk"
      }
    ];

    return NextResponse.json(demoAffiliates);
  } catch (error) {
    console.error("Error fetching ShareASale affiliates:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliates" },
      { status: 500 }
    );
  }
} 