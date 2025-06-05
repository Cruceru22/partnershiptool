import { NextRequest, NextResponse } from "next/server";
import { auth, getSession } from "@acme/auth";
import { db } from "@acme/db/client";
import { organization, member } from "@acme/db/schema";
import { eq } from "@acme/db";
import { randomUUID } from "crypto";

interface RakutenApiTransaction {
  transaction_id?: string;
  etransactionId?: string;
  advertiser_id?: number;
  advertiserId?: number;
  order_id?: string;
  orderId?: string;
  transaction_date?: string;
  transactionDate?: string;
  process_date?: string;
  processDate?: string;
  sale_amount?: number;
  saleAmount?: number;
  commission_amount?: number;
  commissionAmount?: number;
  currency?: string;
  site_name?: string;
  memberName?: string;
  publisher_url?: string;
  memberUrl?: string;
  status?: string;
  orderStatus?: string;
  deviceType?: string;
}

interface RakutenApiResponse {
  transactions?: RakutenApiTransaction[];
  data?: RakutenApiTransaction[];
  summary?: {
    total_transactions: number;
    total_sales: number;
    total_commission: number;
  };
}

interface TransformedTransaction {
  id: string;
  advertiserId: number;
  orderId: string;
  transactionDate: string;
  processDate: string;
  saleAmount: {
    amount: number;
    currency: string;
  };
  commissionAmount: {
    amount: number;
    currency: string;
  };
  status: string;
  siteName: string;
  publisherUrl: string;
}

// Helper to get short month name from date
function getMonthName(date: Date): string {
  return date.toLocaleString('default', { month: 'short' });
}

export async function GET(request: Request) {
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

    // Get organization's Rakuten credentials
    const org = await db.query.organization.findFirst({
      where: eq(organization.id, activeOrg.organizationId),
      columns: {
        rakutenKey: true,
        rakutenSecret: true,
      },
    });

    if (!org?.rakutenKey || !org?.rakutenSecret) {
      return NextResponse.json(
        { error: "Rakuten API credentials not found" },
        { status: 400 }
      );
    }

    // Get the date range from query params or use current month
    const searchParams = new URL(request.url).searchParams;
    const month = searchParams.get("month");
    
    let startDate: Date;
    let endDate: Date;

    if (month) {
      const parts = month.split("-");
      if (parts.length !== 2) {
        return NextResponse.json(
          { error: "Invalid month format. Expected YYYY-MM" },
          { status: 400 }
        );
      }
      
      const yearStr = parts[0];
      const monthStr = parts[1];
      
      if (!yearStr || !monthStr) {
        return NextResponse.json(
          { error: "Invalid month format. Expected YYYY-MM" },
          { status: 400 }
        );
      }
      
      const year = parseInt(yearStr, 10);
      const monthNum = parseInt(monthStr, 10);
      
      if (isNaN(year) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return NextResponse.json(
          { error: "Invalid month format. Expected YYYY-MM with valid month number" },
          { status: 400 }
        );
      }
      startDate = new Date(year, monthNum - 1, 1);
      endDate = new Date(year, monthNum, 0);
    } else {
      // If no month specified, get data for the previous month
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1); // First day of previous month
      endDate = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of previous month
    }

    console.log("Date range:", { 
      startDate: startDate.toISOString(), 
      endDate: endDate.toISOString() 
    });

    // First, get an access token
    console.log("Requesting Rakuten access token...");
    const tokenResponse = await fetch("https://api.linksynergy.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: org.rakutenKey,
        client_secret: org.rakutenSecret,
        scope: org.rakutenKey, // Use the client ID as the scope
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("Error getting Rakuten access token:", {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error,
        url: tokenResponse.url,
        headers: Object.fromEntries(tokenResponse.headers.entries())
      });
      return NextResponse.json(
        { error: `Failed to authenticate with Rakuten API: ${error}` },
        { status: tokenResponse.status }
      );
    }

    console.log("Successfully obtained Rakuten access token");
    const { access_token } = await tokenResponse.json();

    // Extract the numeric part of the client ID to use as site ID
    const siteId = parseInt(org.rakutenKey.replace(/\D/g, ''), 10);
    if (isNaN(siteId)) {
      console.error("Failed to parse site ID from client ID:", org.rakutenKey);
      return NextResponse.json(
        { error: "Invalid site ID format" },
        { status: 400 }
      );
    }

    // Now use the token to get transactions
    console.log("Fetching Rakuten transactions...");
    const transactionsUrl = 'https://api.linksynergy.com/advancedreports/1.0';
    console.log("Transactions URL:", transactionsUrl);
    console.log("Using site ID:", siteId);
    
    const transactionsResponse = await fetch(transactionsUrl, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-request-id": randomUUID(),
        "x-rm-preferred-sid": siteId.toString()
      },
      body: JSON.stringify({
        report_id: "transaction_history",
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        page_info: {
          page_size: 100,
          page_number: 1
        }
      })
    });

    if (!transactionsResponse.ok) {
      const error = await transactionsResponse.text();
      console.error("Error fetching Rakuten transactions:", {
        status: transactionsResponse.status,
        statusText: transactionsResponse.statusText,
        error,
        url: transactionsResponse.url,
        headers: Object.fromEntries(transactionsResponse.headers.entries())
      });
      return NextResponse.json(
        { error: `Failed to fetch transactions: ${error}` },
        { status: transactionsResponse.status }
      );
    }

    const data = await transactionsResponse.json();
    console.log("Rakuten API Response:", JSON.stringify(data, null, 2));

    // Check if we got any data
    if (!data || (!data.transactions && !data.data)) {
      console.log("No transactions found in response");
      return NextResponse.json({
        transactions: [],
        summary: {
          total_transactions: 0,
          total_sales: 0,
          total_commission: 0
        }
      });
    }

    // Try both data formats (data.transactions and data.data)
    const rawTransactions = data.transactions || data.data || [];
    console.log(`Found ${rawTransactions.length} transactions`);
    
    // Transform the data to match our expected format
    const transactions: TransformedTransaction[] = rawTransactions.map((t: RakutenApiTransaction) => ({
      id: t.transaction_id || t.etransactionId || '',
      advertiserId: t.advertiser_id || t.advertiserId || 0,
      orderId: t.order_id || t.orderId || '',
      transactionDate: t.transaction_date || t.transactionDate || '',
      processDate: t.process_date || t.processDate || '',
      saleAmount: {
        amount: parseFloat(String(t.sale_amount || t.saleAmount || 0)),
        currency: t.currency || 'USD'
      },
      commissionAmount: {
        amount: parseFloat(String(t.commission_amount || t.commissionAmount || 0)),
        currency: t.currency || 'USD'
      },
      status: t.status || t.orderStatus || 'pending',
      siteName: t.site_name || t.memberName || '',
      publisherUrl: t.publisher_url || t.memberUrl || ''
    }));

    // Calculate summary
    const summary = data.summary || {
      total_transactions: transactions.length,
      total_sales: transactions.reduce((sum: number, t: TransformedTransaction) => sum + (t.saleAmount?.amount || 0), 0),
      total_commission: transactions.reduce((sum: number, t: TransformedTransaction) => sum + (t.commissionAmount?.amount || 0), 0)
    };

    console.log("Returning data:", {
      transactionCount: transactions.length,
      summary
    });

    return NextResponse.json({
      transactions,
      summary
    });
  } catch (error) {
    console.error("Error in Rakuten API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 