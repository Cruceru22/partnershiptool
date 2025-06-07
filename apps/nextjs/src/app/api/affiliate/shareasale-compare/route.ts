import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { auth, getSession } from "@acme/auth";
import { db } from "@acme/db/client";
import { organization, member } from "@acme/db/schema";
import { eq } from "@acme/db";

// Helper to create ShareASale authentication headers
function createShareASaleAuth(token: string, secret: string, action: string): {
  'x-ShareASale-Date': string;
  'x-ShareASale-Authentication': string;
} {
  const utcDate = new Date().toUTCString();
  const stringToHash = `${token}:${utcDate}:${action}:${secret}`;
  const hash = crypto.createHash('sha256').update(stringToHash).digest('hex').toUpperCase();
  
  return {
    'x-ShareASale-Date': utcDate,
    'x-ShareASale-Authentication': hash
  };
}

// Helper function to fetch detailed data for a specific month
async function fetchMonthData(
  token: string, 
  secret: string, 
  startDate: Date, 
  endDate: Date,
  affiliateMapping: Record<string, { organization: string; website: string }>
) {
  const action = "transactiondetail";
  const authHeaders = createShareASaleAuth(token, secret, action);

  // Format dates for ShareASale API (MM/DD/YYYY format)
  const formatShareASaleDate = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const formattedStartDate = formatShareASaleDate(startDate);
  const formattedEndDate = formatShareASaleDate(endDate);

  // Build the ShareASale API URL
  const apiUrl = `https://api.shareasale.com/w.cfm?` + 
    new URLSearchParams({
      merchantId: "154175",
      token: token,
      version: '3.0',
      action: action,
      datestart: formattedStartDate,
      dateend: formattedEndDate,
      format: 'csv'
    }).toString();

  const response = await fetch(apiUrl, {
    headers: {
      ...authHeaders,
      'Accept': 'text/csv'
    }
  });

  if (!response.ok) {
    throw new Error(`ShareASale API responded with status: ${response.status}`);
  }

  const csvData = await response.text();
  const lines = csvData.trim().split('\n');
  
  if (lines.length <= 1) {
    return { 
      transactions: [],
      summary: { sales: 0, commission: 0, transactionCount: 0 } 
    };
  }

  // Parse CSV data
  const headers = lines[0]!.split(',').map(h => h.trim().replace(/\r/g, ''));
  const transactions: any[] = [];
  let summary = { sales: 0, commission: 0, transactionCount: 0 };

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]!.trim();
    if (!line) continue;
    
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    
    if (values.length >= headers.length - 2) {
      const transaction: any = {};
      headers.forEach((header, index) => {
        const cleanHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
        transaction[cleanHeader] = (values[index] || '').trim();
      });

      const saleAmount = parseFloat(transaction.transamount || transaction.ssamount || '0') || 0;
      const commission = parseFloat(transaction.commission || '0') || 0;
      const userId = transaction.userid || transaction.userID || '';
      const affiliate = affiliateMapping[userId];
      
      // Create processed transaction
      const processedTransaction = {
        id: transaction.transid || transaction.transID || '',
        platform: 'ShareASale',
        affiliateId: userId,
        siteName: affiliate?.organization || 
                  affiliate?.website || 
                  transaction.bannername || 
                  transaction.bannerName || 
                  (userId ? `Affiliate ${userId}` : 'Unknown'),
        transactionDate: transaction.transdate || '',
        saleAmount,
        commission,
        orderRef: transaction.ordernumber || transaction.orderNumber || '',
        status: transaction.pending === '1' ? 'pending' : (transaction.locked === '1' ? 'locked' : 'approved'),
      };
      
      transactions.push(processedTransaction);
      
      summary.sales += saleAmount;
      summary.commission += commission;
      summary.transactionCount += 1;
    }
  }

  return { transactions, summary };
}

// Helper function to fetch affiliate data for meaningful site names
async function fetchShareASaleAffiliates(token: string, secret: string): Promise<Record<string, { organization: string; website: string }>> {
  try {
    const action = "report-affiliate";
    const authHeaders = createShareASaleAuth(token, secret, action);

    const apiUrl = `https://api.shareasale.com/w.cfm?` + 
      new URLSearchParams({
        merchantId: "154175",
        token: token,
        version: '3.0',
        action: action,
        format: 'csv'
      }).toString();

    const response = await fetch(apiUrl, {
      headers: {
        ...authHeaders,
        'Accept': 'text/csv'
      }
    });

    if (!response.ok) {
      console.warn('Failed to fetch ShareASale affiliates:', response.status);
      return {};
    }

    const csvData = await response.text();
    const lines = csvData.trim().split('\n');
    
    if (lines.length <= 1) {
      return {};
    }

    const headers = lines[0]!.split(',').map(h => h.trim().replace(/\r/g, ''));
    const affiliateMapping: Record<string, { organization: string; website: string }> = {};

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]!.trim();
      if (!line) continue;
      
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      
      if (values.length >= headers.length - 2) {
        const affiliate: any = {};
        headers.forEach((header, index) => {
          const cleanHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
          affiliate[cleanHeader] = (values[index] || '').trim();
        });

        const userId = affiliate.userid || affiliate.id || affiliate.affiliateid;
        const organization = affiliate.organization || affiliate.company || affiliate.name || '';
        const website = affiliate.website || affiliate.url || affiliate.domain || '';
        
        if (userId && (organization || website)) {
          affiliateMapping[userId] = {
            organization: organization || 'Unknown Affiliate',
            website: website || ''
          };
        }
      }
    }

    return affiliateMapping;
    
  } catch (error) {
    console.error('Error fetching ShareASale affiliates:', error);
    return {};
  }
}

export async function GET(request: NextRequest) {
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

    // Get organization's ShareASale credentials
    const org = await db.query.organization.findFirst({
      where: eq(organization.id, activeOrg.organizationId),
      columns: {
        shareASaleToken: true,
        shareASaleSecretKey: true,
      },
    });

    if (!org?.shareASaleToken || !org?.shareASaleSecretKey) {
      return NextResponse.json(
        { error: "ShareASale credentials not configured" },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const month1 = searchParams.get("month1");
    const month2 = searchParams.get("month2");

    if (!month1 || !month2) {
      return NextResponse.json(
        { error: "Both month1 and month2 parameters are required" },
        { status: 400 }
      );
    }

    // Parse months and create date ranges
    const parseMonth = (monthStr: string) => {
      const [year, month] = monthStr.split("-");
      if (!year || !month) {
        throw new Error("Invalid month format. Expected YYYY-MM");
      }
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      return { startDate, endDate };
    };

    const { startDate: start1, endDate: end1 } = parseMonth(month1);
    const { startDate: start2, endDate: end2 } = parseMonth(month2);

    // Fetch affiliate mapping for meaningful site names
    console.log('Fetching affiliate mapping...');
    const affiliateMapping = await fetchShareASaleAffiliates(org.shareASaleToken, org.shareASaleSecretKey);

    // Fetch data for both months
    console.log(`Comparing ${month1} vs ${month2}`);
    
    const [data1, data2] = await Promise.all([
      fetchMonthData(org.shareASaleToken, org.shareASaleSecretKey, start1, end1, affiliateMapping),
      fetchMonthData(org.shareASaleToken, org.shareASaleSecretKey, start2, end2, affiliateMapping)
    ]);

    // Calculate differences
    const calculateChange = (current: number, previous: number) => {
      const absolute = current - previous;
      const percentage = previous === 0 ? (current > 0 ? 100 : 0) : (absolute / previous) * 100;
      return { absolute, percentage };
    };

    const comparison = {
      month1: {
        month: month1,
        sales: data1.summary.sales,
        commission: data1.summary.commission,
        transactions: data1.summary.transactionCount,
        transactionDetails: data1.transactions
      },
      month2: {
        month: month2,
        sales: data2.summary.sales,
        commission: data2.summary.commission,
        transactions: data2.summary.transactionCount,
        transactionDetails: data2.transactions
      },
      changes: {
        sales: calculateChange(data1.summary.sales, data2.summary.sales),
        commission: calculateChange(data1.summary.commission, data2.summary.commission),
        transactions: calculateChange(data1.summary.transactionCount, data2.summary.transactionCount)
      }
    };

    return NextResponse.json(comparison);

  } catch (error) {
    console.error("Error comparing ShareASale data:", error);
    return NextResponse.json(
      { error: "Failed to compare ShareASale data" },
      { status: 500 }
    );
  }
} 