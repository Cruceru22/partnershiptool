import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { auth, getSession } from "@acme/auth";
import { db } from "@acme/db/client";
import { organization, member } from "@acme/db/schema";
import { eq } from "@acme/db";

interface ShareASaleApiTransaction {
  // Original expected fields
  transid: string;
  userid: string;
  affiliatename: string;
  transdate: string;
  clickdate: string;
  ssamount: string;
  commission: string;
  comment: string;
  ordernumber: string;
  status: string;
  lockdate: string;
  transactiontype: string;
  commissiontype: string;
  skulist: string;
  pricelist: string;
  quantitylist: string;
  parenttrans: string;
  bannername: string;
  bannertype: string;
  storeID: string;
  merchantdefinedtype: string;
  useragent: string;
  originalcurrency: string;
  originalcurrencyamount: string;
  ismobile: string;
  usedacoupon: string;
  couponccode: string;
  referencetrans: string;
  newcustomerflag: string;
  
  // Additional actual CSV fields
  transID?: string;
  userID?: string;
  transamount?: string;
  dateofclick?: string;
  orderNumber?: string;
  bannerName?: string;
  bannerType?: string;
  transactionType?: string;
  pending?: string;
  locked?: string;
  voided?: string;
}

// Helper to get short month name from date
function getMonthName(date: Date): string {
  return date.toLocaleString('default', { month: 'short' });
}

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

// Helper function to parse ShareASale date format
const parseShareASaleDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  try {
    // ShareASale typically returns dates in MM/DD/YYYY format or similar
    // Try multiple common formats
    const formats = [
      dateString, // Try as-is first
      dateString.replace(/(\d{2})-(\d{2}) (\d{2}:\d{2}:\d{2})/, '2025-$1-$2 $3'), // Handle MM-DD HH:mm:ss format
      dateString.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, '$3-$1-$2'), // MM/DD/YYYY to YYYY-MM-DD
    ];
    
    for (const format of formats) {
      const date = new Date(format);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    
    console.warn('Could not parse ShareASale date:', dateString);
    return null;
  } catch (error) {
    console.warn('Error parsing ShareASale date:', dateString, error);
    return null;
  }
};

// Helper function to fetch affiliate data for meaningful site names
async function fetchShareASaleAffiliates(token: string, secret: string): Promise<Record<string, { organization: string; website: string }>> {
  try {
    const action = "report-affiliate";
    const authHeaders = createShareASaleAuth(token, secret, action);

    // Build the ShareASale Affiliate API URL
    const apiUrl = `https://api.shareasale.com/w.cfm?` + 
      new URLSearchParams({
        merchantId: "154175",
        token: token,
        version: '3.0',
        action: action,
        format: 'csv'
      }).toString();

    console.log('Fetching ShareASale affiliates for site name mapping...');

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
      console.log('No affiliates found');
      return {};
    }

    // Parse affiliate CSV data
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

        // Map userID to organization and website
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

    console.log(`Loaded ${Object.keys(affiliateMapping).length} affiliate mappings`);
    return affiliateMapping;
    
  } catch (error) {
    console.error('Error fetching ShareASale affiliates:', error);
    return {};
  }
}

// Helper function to fetch data for a specific month
async function fetchShareASaleDataForMonth(
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
    return { transactions: [], summary: { sales: 0, commission: 0, transactionCount: 0 } };
  }

  // Parse CSV data
  const headers = lines[0]!.split(',').map(h => h.trim().replace(/\r/g, ''));
  const transactions: any[] = [];

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
      transactions.push(transaction);
    }
  }

  // Calculate summary metrics
  const summary = transactions.reduce((acc, transaction) => {
    const saleAmount = parseFloat(transaction.transamount || transaction.ssamount || '0') || 0;
    const commission = parseFloat(transaction.commission || '0') || 0;
    
    return {
      sales: acc.sales + saleAmount,
      commission: acc.commission + commission,
      transactionCount: acc.transactionCount + 1
    };
  }, { sales: 0, commission: 0, transactionCount: 0 });

  // Transform transactions
  const processedTransactions = transactions.map(transaction => {
    const userId = transaction.userid || transaction.userID || '';
    const affiliate = affiliateMapping[userId];
    
    const siteName = affiliate?.organization || 
                    affiliate?.website || 
                    transaction.bannername || 
                    transaction.bannerName || 
                    (userId ? `Affiliate ${userId}` : 'Unknown');

    return {
      id: transaction.transid || transaction.transID || '',
      affiliateId: userId,
      siteName: siteName,
      transactionDate: parseShareASaleDate(transaction.transdate || '')?.toISOString() || transaction.transdate || '',
      clickDate: parseShareASaleDate(transaction.dateofclick || '')?.toISOString() || transaction.dateofclick || '',
      saleAmount: {
        amount: parseFloat(transaction.transamount || transaction.ssamount || '0') || 0,
        currency: "USD"
      },
      commissionAmount: {
        amount: parseFloat(transaction.commission || '0') || 0,
        currency: "USD"
      },
      orderRef: transaction.ordernumber || transaction.orderNumber || '',
      status: transaction.pending === '1' ? 'pending' : (transaction.locked === '1' ? 'locked' : 'approved'),
      type: transaction.transactiontype || transaction.transactionType || '',
      bannerName: transaction.bannername || transaction.bannerName || '',
      bannerType: transaction.bannertype || transaction.bannerType || '',
      affiliateInfo: affiliate ? `${affiliate.organization} (${affiliate.website})` : undefined,
    };
  });

  return { transactions: processedTransactions, summary };
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

    // Calculate previous month dates
    const prevMonthStart = new Date(parseInt(year), parseInt(monthStr) - 2, 1);
    const prevMonthEnd = new Date(parseInt(year), parseInt(monthStr) - 1, 0);

    // Format dates for ShareASale API (MM/DD/YYYY format)
    const formatShareASaleDate = (date: Date) => {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    };

    const formattedStartDate = formatShareASaleDate(startDate);
    const formattedEndDate = formatShareASaleDate(endDate);

    // Fetch affiliate mapping for meaningful site names
    console.log('Fetching affiliate mapping...');
    const affiliateMapping = await fetchShareASaleAffiliates(org.shareASaleToken, org.shareASaleSecretKey);

    // Fetch data for the selected month
    console.log('Fetching current month data...');
    const { transactions: monthlyTransactions, summary: monthlySummary } = await fetchShareASaleDataForMonth(
      org.shareASaleToken,
      org.shareASaleSecretKey,
      startDate,
      endDate,
      affiliateMapping
    );

    // Fetch previous month data for comparison
    console.log('Fetching previous month data for comparison...');
    let previousMonthSummary = { sales: 0, commission: 0, transactionCount: 0 };
    try {
      const { summary } = await fetchShareASaleDataForMonth(
        org.shareASaleToken,
        org.shareASaleSecretKey,
        prevMonthStart,
        prevMonthEnd,
        affiliateMapping
      );
      previousMonthSummary = summary;
    } catch (error) {
      console.warn('Failed to fetch previous month data for comparison:', error);
    }

    // Calculate growth metrics
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const comparison = {
      sales: {
        current: monthlySummary.sales,
        previous: previousMonthSummary.sales,
        growth: calculateGrowth(monthlySummary.sales, previousMonthSummary.sales)
      },
      commission: {
        current: monthlySummary.commission,
        previous: previousMonthSummary.commission,
        growth: calculateGrowth(monthlySummary.commission, previousMonthSummary.commission)
      },
      transactions: {
        current: monthlySummary.transactionCount,
        previous: previousMonthSummary.transactionCount,
        growth: calculateGrowth(monthlySummary.transactionCount, previousMonthSummary.transactionCount)
      }
    };

    console.log('Month-over-month comparison:', comparison);

    // Process the data for chart visualization
    try {
      // Calculate platform totals for ShareASale
      const shareASaleTotals = monthlyTransactions.reduce((acc, transaction) => ({
        sales: acc.sales + (transaction.saleAmount?.amount || 0),
        commission: acc.commission + (transaction.commissionAmount?.amount || 0),
        transactions: acc.transactions + 1,
      }), { sales: 0, commission: 0, transactions: 0 });
      
      // Create platform comparison data
      const platformData = [
        { name: "shareasale", sales: shareASaleTotals.sales, commission: shareASaleTotals.commission, transactions: shareASaleTotals.transactions },
        { name: "awin", sales: 0, commission: 0, transactions: 0 },
        { name: "impact", sales: 0, commission: 0, transactions: 0 }
      ];
      
      // Group by day with improved date parsing
      const transactionsByDay = monthlyTransactions.reduce((acc, transaction) => {
        const date = parseShareASaleDate(transaction.transactionDate);
        if (!date) return acc; // Skip invalid dates
        
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
        transactions: monthlyTransactions,
        platformData,
        monthlyData,
        comparison,
        selectedMonth,
        previousMonth: `${prevMonthStart.getFullYear()}-${(prevMonthStart.getMonth() + 1).toString().padStart(2, '0')}`
      };
      
      return NextResponse.json(chartData);
      
    } catch (processingError) {
      console.error("Error processing chart data:", processingError);
      // If processing fails, return the raw data without chart processing
      return NextResponse.json({ 
        transactions: monthlyTransactions,
        platformData: [
          { name: "shareasale", sales: 0, commission: 0, transactions: monthlyTransactions.length },
          { name: "awin", sales: 0, commission: 0, transactions: 0 },
          { name: "impact", sales: 0, commission: 0, transactions: 0 }
        ],
        monthlyData: [],
        comparison: {
          sales: { current: 0, previous: 0, growth: 0 },
          commission: { current: 0, previous: 0, growth: 0 },
          transactions: { current: monthlyTransactions.length, previous: 0, growth: 0 }
        },
        selectedMonth,
        previousMonth: `${prevMonthStart.getFullYear()}-${(prevMonthStart.getMonth() + 1).toString().padStart(2, '0')}`
      });
    }
  } catch (error) {
    console.error("Error fetching ShareASale transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch ShareASale transactions" },
      { status: 500 }
    );
  }
} 