import { NextRequest, NextResponse } from "next/server";
import { auth, getSession } from "@acme/auth";
import { db } from "@acme/db/client";
import { organization, member } from "@acme/db/schema";
import { eq } from "@acme/db";

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

    const searchParams = request.nextUrl.searchParams;
    const month1 = searchParams.get("month1");
    const month2 = searchParams.get("month2");

    if (!month1 || !month2) {
      return NextResponse.json(
        { error: "Both month1 and month2 parameters are required" },
        { status: 400 }
      );
    }

    console.log(`Comparing all platforms: ${month1} vs ${month2}`);

    // Get the session cookie for internal API calls
    const cookies = request.headers.get('cookie') || '';
    
    console.log('Making API calls to fetch data...');
    
    // Fetch data from both ShareASale and Awin for both months
    const [
      shareASaleMonth1,
      shareASaleMonth2,
      awinMonth1,
      awinMonth2
    ] = await Promise.all([
      fetch(`${request.nextUrl.origin}/api/affiliate/shareasale-transactions?month=${month1}`, {
        headers: { cookie: cookies }
      }).then(res => res.ok ? res.json() : null),
      fetch(`${request.nextUrl.origin}/api/affiliate/shareasale-transactions?month=${month2}`, {
        headers: { cookie: cookies }
      }).then(res => res.ok ? res.json() : null),
      fetch(`${request.nextUrl.origin}/api/affiliate/awin?month=${month1}`, {
        headers: { cookie: cookies }
      }).then(res => res.ok ? res.json() : null),
      fetch(`${request.nextUrl.origin}/api/affiliate/awin?month=${month2}`, {
        headers: { cookie: cookies }
      }).then(res => res.ok ? res.json() : null),
    ]);

    console.log('API responses received:', {
      shareASaleMonth1: shareASaleMonth1 ? 'success' : 'null',
      shareASaleMonth2: shareASaleMonth2 ? 'success' : 'null',
      awinMonth1: awinMonth1 ? 'success' : 'null',
      awinMonth2: awinMonth2 ? 'success' : 'null'
    });

    // Extract ShareASale data
    const shareASaleData1 = shareASaleMonth1 ? {
      sales: shareASaleMonth1.platformData?.find((p: any) => p.name === "shareasale")?.sales || 0,
      commission: shareASaleMonth1.platformData?.find((p: any) => p.name === "shareasale")?.commission || 0,
      transactions: shareASaleMonth1.platformData?.find((p: any) => p.name === "shareasale")?.transactions || 0,
      transactionDetails: shareASaleMonth1.transactions || []
    } : { sales: 0, commission: 0, transactions: 0, transactionDetails: [] };

    const shareASaleData2 = shareASaleMonth2 ? {
      sales: shareASaleMonth2.platformData?.find((p: any) => p.name === "shareasale")?.sales || 0,
      commission: shareASaleMonth2.platformData?.find((p: any) => p.name === "shareasale")?.commission || 0,
      transactions: shareASaleMonth2.platformData?.find((p: any) => p.name === "shareasale")?.transactions || 0,
      transactionDetails: shareASaleMonth2.transactions || []
    } : { sales: 0, commission: 0, transactions: 0, transactionDetails: [] };

    // Extract Awin data
    const awinData1 = awinMonth1 ? {
      sales: awinMonth1.platformData?.find((p: any) => p.name === "awin")?.sales || 0,
      commission: awinMonth1.platformData?.find((p: any) => p.name === "awin")?.commission || 0,
      transactions: awinMonth1.platformData?.find((p: any) => p.name === "awin")?.transactions || 0,
      details: awinMonth1.transactions || []
    } : { sales: 0, commission: 0, transactions: 0, details: [] };

    const awinData2 = awinMonth2 ? {
      sales: awinMonth2.platformData?.find((p: any) => p.name === "awin")?.sales || 0,
      commission: awinMonth2.platformData?.find((p: any) => p.name === "awin")?.commission || 0,
      transactions: awinMonth2.platformData?.find((p: any) => p.name === "awin")?.transactions || 0,
      details: awinMonth2.transactions || []
    } : { sales: 0, commission: 0, transactions: 0, details: [] };

    console.log('Extracted data:', {
      shareASaleData1: { sales: shareASaleData1.sales, commission: shareASaleData1.commission, transactions: shareASaleData1.transactions },
      shareASaleData2: { sales: shareASaleData2.sales, commission: shareASaleData2.commission, transactions: shareASaleData2.transactions },
      awinData1: { sales: awinData1.sales, commission: awinData1.commission, transactions: awinData1.transactions },
      awinData2: { sales: awinData2.sales, commission: awinData2.commission, transactions: awinData2.transactions }
    });

    // Combine totals for each month
    const month1Totals = {
      sales: shareASaleData1.sales + awinData1.sales,
      commission: shareASaleData1.commission + awinData1.commission,
      transactions: shareASaleData1.transactions + awinData1.transactions,
    };

    const month2Totals = {
      sales: shareASaleData2.sales + awinData2.sales,
      commission: shareASaleData2.commission + awinData2.commission,
      transactions: shareASaleData2.transactions + awinData2.transactions,
    };

    // Calculate changes (month1 vs month2)
    const calculateChange = (month1Value: number, month2Value: number) => {
      const absolute = month1Value - month2Value;
      const percentage = month2Value === 0 ? (month1Value > 0 ? 100 : 0) : (absolute / month2Value) * 100;
      return { absolute, percentage };
    };

    // Process Awin transactions to match expected format
    const processAwinTransactions = (transactions: any[]) => {
      return transactions.map(t => ({
        ...t,
        status: t.commissionStatus || t.status || 'unknown',
        platform: 'Awin'
      }));
    };

    // Combine transaction details
    const allTransactionsMonth1 = [
      ...(shareASaleData1.transactionDetails || []),
      ...processAwinTransactions(awinData1.details || [])
    ];

    const allTransactionsMonth2 = [
      ...(shareASaleData2.transactionDetails || []),
      ...processAwinTransactions(awinData2.details || [])
    ];

    const comparison = {
      month1: {
        month: month1,
        sales: month1Totals.sales,
        commission: month1Totals.commission,
        transactions: month1Totals.transactions,
        transactionDetails: allTransactionsMonth1,
        platformBreakdown: {
          shareasale: {
            sales: shareASaleData1.sales,
            commission: shareASaleData1.commission,
            transactions: shareASaleData1.transactions,
            details: shareASaleData1.transactionDetails || []
          },
          awin: {
            sales: awinData1.sales,
            commission: awinData1.commission,
            transactions: awinData1.transactions,
            details: processAwinTransactions(awinData1.details || [])
          }
        }
      },
      month2: {
        month: month2,
        sales: month2Totals.sales,
        commission: month2Totals.commission,
        transactions: month2Totals.transactions,
        transactionDetails: allTransactionsMonth2,
        platformBreakdown: {
          shareasale: {
            sales: shareASaleData2.sales,
            commission: shareASaleData2.commission,
            transactions: shareASaleData2.transactions,
            details: shareASaleData2.transactionDetails || []
          },
          awin: {
            sales: awinData2.sales,
            commission: awinData2.commission,
            transactions: awinData2.transactions,
            details: processAwinTransactions(awinData2.details || [])
          }
        }
      },
      changes: {
        sales: calculateChange(month1Totals.sales, month2Totals.sales),
        commission: calculateChange(month1Totals.commission, month2Totals.commission),
        transactions: calculateChange(month1Totals.transactions, month2Totals.transactions)
      }
    };

    return NextResponse.json(comparison);

  } catch (error) {
    console.error("Error comparing affiliate data:", error);
    return NextResponse.json(
      { error: "Failed to compare affiliate data" },
      { status: 500 }
    );
  }
} 