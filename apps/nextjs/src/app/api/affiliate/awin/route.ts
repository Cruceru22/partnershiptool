/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { NextRequest, NextResponse } from "next/server";
import { auth, getSession } from "@acme/auth";
import { db } from "@acme/db/client";
import { organization, member } from "@acme/db/schema";
import { eq } from "@acme/db";
import { type AffiliateAPI, affiliateAPIs } from "../../../../types/api";

interface AwinApiTransaction {
  id: number;
  advertiserId: number;
  publisherId: number;
  siteName: string;
  commissionStatus: string;
  commissionAmount: {
    amount: number;
    currency: string;
  };
  saleAmount: {
    amount: number;
    currency: string;
  };
  customerCountry: string;
  clickDate: string;
  transactionDate: string;
  validationDate: string;
  type: string;
  voucherCodeUsed: boolean;
  voucherCode: string | null;
  clickDevice: string;
  transactionDevice: string;
  customerAcquisition: string;
  publisherUrl: string;
  orderRef: string;
}

// Helper to get short month name from date
function getMonthName(date: Date): string {
  return date.toLocaleString('default', { month: 'short' });
}

const AWIN_ACCESS_TOKEN = "88228a50-7a0c-4880-9ceb-bc3f316dff0e";

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

    // Get organization's Awin advertiser ID
    const org = await db.query.organization.findFirst({
      where: eq(organization.id, activeOrg.organizationId),
      columns: {
        awinKey: true,
      },
    });

    if (!org?.awinKey) {
      return NextResponse.json(
        { error: "Awin advertiser ID not configured" },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get("month");

    // If no month is provided, use current month
    const today = new Date();
    const selectedMonth = month ?? today.toISOString().slice(0, 7);
    
    // Calculate start and end dates for the selected month
    const [year, monthStr] = selectedMonth.split("-");
    if (!year || !monthStr) {
      throw new Error("Invalid month format. Expected YYYY-MM");
    }

    const startDate = new Date(parseInt(year), parseInt(monthStr) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(monthStr), 0); // Last day of month

    // Validate date range is not more than 31 days
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 31) {
      return NextResponse.json(
        { error: "Date range cannot exceed 31 days" },
        { status: 400 }
      );
    }

    // Format dates for API
    const formattedStartDate = `${startDate.toISOString().slice(0, 10)}T00:00:00`;
    const formattedEndDate = `${endDate.toISOString().slice(0, 10)}T23:59:59`;

    // Build the URL with query parameters
    const apiUrl = `https://api.awin.com/advertisers/${org.awinKey}/transactions/?` + 
      new URLSearchParams({
        accessToken: AWIN_ACCESS_TOKEN,
        dateType: 'transaction',
        endDate: formattedEndDate,
        startDate: formattedStartDate,
        timezone: 'UTC',
        showBasketProducts: 'false'
      }).toString();

    console.log('Calling Awin API:', apiUrl);
    console.log('Date range:', { startDate: formattedStartDate, endDate: formattedEndDate });

    const response = await fetch(apiUrl, {
      headers: {
        'accept': 'application/json;charset=UTF-8'
      }
    });

    console.log('Awin API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Awin API error response:', errorText);
      
      // Handle specific error cases
      if (response.status === 401) {
        return NextResponse.json(
          { error: "Invalid API credentials" },
          { status: 401 }
        );
      } else if (response.status === 403) {
        return NextResponse.json(
          { error: "Access forbidden - please check API permissions" },
          { status: 403 }
        );
      } else if (response.status === 429) {
        return NextResponse.json(
          { error: "Too many requests - please try again later" },
          { status: 429 }
        );
      }
      
      throw new Error(`Awin API responded with status: ${response.status} - ${errorText}`);
    }

    let data: AwinApiTransaction[];
    try {
      data = await response.json();
      if (!Array.isArray(data)) {
        console.error('Unexpected API response format:', data);
        throw new Error('Invalid response format from Awin API');
      }
    } catch (parseError) {
      console.error('Failed to parse Awin API response:', parseError);
      return NextResponse.json(
        { error: "Failed to parse API response" },
        { status: 500 }
      );
    }

    console.log(`Received ${data.length} transactions from Awin API`);
    
    if (data.length === 0) {
      console.log('No transactions found for the specified date range');
      // Return empty data structure instead of throwing error
      return NextResponse.json({
        transactions: [],
        platformData: [
          { name: "sharesale", sales: 0, commission: 0, transactions: 0 },
          { name: "awin", sales: 0, commission: 0, transactions: 0 },
          { name: "impact", sales: 0, commission: 0, transactions: 0 }
        ],
        monthlyData: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => ({
          month,
          sales: 0,
          commission: 0,
          transactions: 0
        }))
      });
    }

    console.log('Sample transaction:', JSON.stringify(data[0], null, 2));

    // Pre-process the transactions data
    const processedData = data.map(transaction => ({
      ...transaction,
      transactionDate: transaction.transactionDate,
      month: selectedMonth,
    }));

    // Process the data for chart visualization
    try {
      // Calculate platform totals for Awin
      const awinTotals = data.reduce((acc, transaction) => ({
        sales: acc.sales + (transaction.saleAmount?.amount || 0),
        commission: acc.commission + (transaction.commissionAmount?.amount || 0),
        transactions: acc.transactions + 1,
      }), { sales: 0, commission: 0, transactions: 0 });
      
      // Create platform comparison data
      const platformData = [
        { name: "sharesale", sales: 0, commission: 0, transactions: 0 },
        { name: "awin", sales: awinTotals.sales, commission: awinTotals.commission, transactions: awinTotals.transactions },
        { name: "impact", sales: 0, commission: 0, transactions: 0 }
      ];
      
      // Group by day
      const transactionsByDay = data.reduce((acc, transaction) => {
        const date = new Date(transaction.transactionDate);
        const dayKey = date.toISOString().slice(0, 10); // YYYY-MM-DD
        
        if (!acc[dayKey]) {
          acc[dayKey] = { sales: 0, commission: 0, transactions: 0 };
        }
        
        acc[dayKey].sales += transaction.saleAmount?.amount || 0;
        acc[dayKey].commission += transaction.commissionAmount?.amount || 0;
        acc[dayKey].transactions += 1;
        
        return acc;
      }, {} as Record<string, { sales: number; commission: number; transactions: number }>);
      
      // Convert to array and get month names
      const dailyData = Object.entries(transactionsByDay).map(([day, data]) => ({
        day,
        month: getMonthName(new Date(day)),
        ...data
      }));
      
      // Group by month
      const monthlyDataMap = dailyData.reduce((acc, item) => {
        const monthKey = item.month;
        
        if (!acc[monthKey]) {
          acc[monthKey] = { sales: 0, commission: 0, transactions: 0 };
        }
        
        const existingData = acc[monthKey];
        existingData.sales += item.sales;
        existingData.commission += item.commission;
        existingData.transactions += item.transactions;
        
        return acc;
      }, {} as Record<string, { sales: number; commission: number; transactions: number }>);
      
      // Convert to array with all months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyData = months.map(month => ({
        month,
        ...(monthlyDataMap[month] ?? { sales: 0, commission: 0, transactions: 0 })
      }));
      
      // Create chart data object
      const chartData = {
        transactions: processedData,
        platformData,
        monthlyData
      };
      
      // Create a response directly with chart data
      return NextResponse.json(chartData);
      
    } catch (processingError) {
      console.error("Error processing chart data:", processingError);
      // If processing fails, return the raw data
      return NextResponse.json({ transactions: processedData });
    }
  } catch (error) {
    console.error("Error fetching Awin transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch Awin transactions" },
      { status: 500 }
    );
  }
}
   