import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Current date for realistic recent transactions
    const today = new Date();
    const thisMonth = today.toLocaleString('default', { month: 'short' });
    
    // Get month from query params if provided
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get('month');

    // Realistic mock transactions for a sporting goods store
    const mockTransactions = [
      {
        id: "imp-78429321",
        transactionDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2).toISOString(),
        saleAmount: {
          amount: 149.99,
          currency: "USD"
        },
        commissionAmount: {
          amount: 17.99,
          currency: "USD"
        },
        status: "approved",
        siteName: "OutdoorGearDeals.com",
        orderRef: "ORD-893271",
        type: "sale",
        publicationName: "OutdoorGearDeals.com",
        customerCountry: "US",
        clickDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 10, 15, 0).toISOString()
      },
      {
        id: "imp-78429456",
        transactionDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3).toISOString(),
        saleAmount: {
          amount: 289.95,
          currency: "USD"
        },
        commissionAmount: {
          amount: 34.79,
          currency: "USD"
        },
        status: "approved",
        siteName: "ActiveLifestyle.blog",
        orderRef: "ORD-893345",
        type: "sale",
        publicationName: "ActiveLifestyle.blog",
        customerCountry: "US",
        clickDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3, 14, 22, 0).toISOString()
      },
      {
        id: "imp-78429789",
        transactionDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5).toISOString(),
        saleAmount: {
          amount: 199.99,
          currency: "USD"
        },
        commissionAmount: {
          amount: 24.00,
          currency: "USD"
        },
        status: "pending",
        siteName: "FitnessReviewCentral.net",
        orderRef: "ORD-893498",
        type: "sale",
        publicationName: "FitnessReviewCentral.net",
        customerCountry: "CA",
        clickDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5, 9, 45, 0).toISOString()
      },
      {
        id: "imp-78429932",
        transactionDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6).toISOString(),
        saleAmount: {
          amount: 79.95,
          currency: "USD"
        },
        commissionAmount: {
          amount: 9.59,
          currency: "USD"
        },
        status: "approved",
        siteName: "SportingGoodsDiscounter.com",
        orderRef: "ORD-893512",
        type: "sale",
        publicationName: "SportingGoodsDiscounter.com",
        customerCountry: "US",
        clickDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6, 16, 30, 0).toISOString()
      },
      {
        id: "imp-78430119",
        transactionDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 8).toISOString(),
        saleAmount: {
          amount: 329.99,
          currency: "USD"
        },
        commissionAmount: {
          amount: 39.60,
          currency: "USD"
        },
        status: "approved",
        siteName: "EcoSportingLife.org",
        orderRef: "ORD-893671",
        type: "sale",
        publicationName: "EcoSportingLife.org",
        customerCountry: "US",
        clickDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 8, 11, 5, 0).toISOString()
      },
      {
        id: "imp-78430287",
        transactionDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 12).toISOString(),
        saleAmount: {
          amount: 124.50,
          currency: "USD"
        },
        commissionAmount: {
          amount: 14.94,
          currency: "USD"
        },
        status: "approved",
        siteName: "AdventureGearHub.com",
        orderRef: "ORD-893782",
        type: "sale",
        publicationName: "AdventureGearHub.com",
        customerCountry: "UK",
        clickDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 12, 8, 15, 0).toISOString()
      },
      {
        id: "imp-78430341",
        transactionDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15).toISOString(),
        saleAmount: {
          amount: 219.99,
          currency: "USD"
        },
        commissionAmount: {
          amount: 26.40,
          currency: "USD"
        },
        status: "approved",
        siteName: "OutdoorPassion.net",
        orderRef: "ORD-893845",
        type: "sale",
        publicationName: "OutdoorPassion.net",
        customerCountry: "US",
        clickDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15, 13, 40, 0).toISOString()
      }
    ];

    // Calculate totals from mock transactions
    const impactTotals = mockTransactions.reduce((acc, transaction) => ({
      sales: acc.sales + (transaction.saleAmount?.amount || 0),
      commission: acc.commission + (transaction.commissionAmount?.amount || 0),
      transactions: acc.transactions + 1
    }), { sales: 0, commission: 0, transactions: 0 });

    // Create platform comparison data
    const platformData = [
      { name: "sharesale", sales: 6778.20, commission: 799.83, transactions: 31 },
      { name: "impact", ...impactTotals },
      { name: "awin", sales: 4329.45, commission: 498.76, transactions: 18 }
    ];

    // Group transactions by month
    const transactionsByMonth = mockTransactions.reduce((acc: Record<string, { sales: number; commission: number; transactions: number }>, transaction) => {
      const date = new Date(transaction.transactionDate);
      const monthKey = date.toLocaleString('default', { month: 'short' });

      if (!acc[monthKey]) {
        acc[monthKey] = { sales: 0, commission: 0, transactions: 0 };
      }

      acc[monthKey].sales += transaction.saleAmount?.amount || 0;
      acc[monthKey].commission += transaction.commissionAmount?.amount || 0;
      acc[monthKey].transactions += 1;

      return acc;
    }, {});

    // Create realistic monthly data with a trend over the year
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map(month => {
      if (month === thisMonth) {
        return {
          month,
          ...transactionsByMonth[month]
        };
      }
      
      // Create realistic historical data with seasonality
      const getSeasonalFactor = (month: string) => {
        // Higher sales in Nov-Dec (holiday season), Apr-May (spring), Jul-Aug (summer)
        const seasonality: Record<string, number> = {
          'Jan': 0.7, 
          'Feb': 0.8, 
          'Mar': 0.9, 
          'Apr': 1.1, 
          'May': 1.2, 
          'Jun': 1.0,
          'Jul': 1.3, 
          'Aug': 1.2, 
          'Sep': 0.9, 
          'Oct': 1.0, 
          'Nov': 1.5, 
          'Dec': 1.8
        };
        return seasonality[month] || 1.0;
      };
      
      const factor = getSeasonalFactor(month);
      const baseSales = 1200 * factor;
      const baseCommission = baseSales * 0.12;
      const baseTransactions = Math.round(baseSales / 150);
      
      return {
        month,
        sales: Math.round(baseSales * 100) / 100,
        commission: Math.round(baseCommission * 100) / 100,
        transactions: baseTransactions
      };
    });

    return NextResponse.json({
      transactions: mockTransactions,
      platformData,
      monthlyData
    });

  } catch (error) {
    console.error("Impact API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Impact data" },
      { status: 500 }
    );
  }
}