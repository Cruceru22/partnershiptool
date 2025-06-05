import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Current date for realistic recent transactions
    const today = new Date();
    const thisMonth = today.toLocaleString('default', { month: 'short' });
    
    // Get month from query params if provided
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get("month");

    // Realistic hardcoded transactions for a sporting goods store
    const mockTransactions = [
      {
        id: "22583470",
        transactionDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1).toISOString(),
        saleAmount: {
          amount: 196.00,
          currency: "USD"
        },
        commissionAmount: {
          amount: 29.40,
          currency: "USD"
        },
        siteName: "RadmorGolf.com",
        orderRef: "635569501010",
        status: "confirmed",
        type: "sale",
        customerCountry: "US",
        clickDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 8, 30, 0).toISOString()
      },
      {
        id: "22497603",
        transactionDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3).toISOString(),
        saleAmount: {
          amount: 108.00,
          currency: "USD"
        },
        commissionAmount: {
          amount: 16.20,
          currency: "USD"
        },
        siteName: "GolfSavings.net",
        orderRef: "632220804742",
        status: "confirmed",
        type: "sale",
        customerCountry: "US",
        clickDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3, 12, 15, 0).toISOString()
      },
      {
        id: "22495861",
        transactionDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4).toISOString(),
        saleAmount: {
          amount: 349.99,
          currency: "USD"
        },
        commissionAmount: {
          amount: 52.50,
          currency: "USD"
        },
        siteName: "GolfReviewExpert.com",
        orderRef: "631584932104",
        status: "confirmed",
        type: "sale",
        customerCountry: "CA",
        clickDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4, 15, 45, 0).toISOString()
      },
      {
        id: "22492175",
        transactionDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6).toISOString(),
        saleAmount: {
          amount: 129.95,
          currency: "USD"
        },
        commissionAmount: {
          amount: 19.49,
          currency: "USD"
        },
        siteName: "GolfGearToday.com",
        orderRef: "631398276514",
        status: "confirmed",
        type: "sale",
        customerCountry: "US",
        clickDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6, 9, 20, 0).toISOString()
      },
      {
        id: "22489237",
        transactionDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7).toISOString(),
        saleAmount: {
          amount: 245.00,
          currency: "USD"
        },
        commissionAmount: {
          amount: 36.75,
          currency: "USD"
        },
        siteName: "SportingAdvice.co",
        orderRef: "631245698321",
        status: "confirmed",
        type: "sale",
        customerCountry: "US",
        clickDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7, 14, 10, 0).toISOString()
      },
      {
        id: "22487932",
        transactionDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 9).toISOString(),
        saleAmount: {
          amount: 185.50,
          currency: "USD"
        },
        commissionAmount: {
          amount: 27.83,
          currency: "USD"
        },
        siteName: "OutdoorSportsHub.com",
        orderRef: "631126543278",
        status: "confirmed",
        type: "sale",
        customerCountry: "UK",
        clickDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 9, 11, 30, 0).toISOString()
      },
      {
        id: "22483421",
        transactionDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10).toISOString(),
        saleAmount: {
          amount: 299.99,
          currency: "USD"
        },
        commissionAmount: {
          amount: 45.00,
          currency: "USD"
        },
        siteName: "GolfingLife.net",
        orderRef: "631098765432",
        status: "confirmed",
        type: "sale",
        customerCountry: "US",
        clickDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10, 17, 0, 0).toISOString()
      },
      {
        id: "22481359",
        transactionDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 12).toISOString(),
        saleAmount: {
          amount: 164.50,
          currency: "USD"
        },
        commissionAmount: {
          amount: 24.68,
          currency: "USD"
        },
        siteName: "SportSavings.com",
        orderRef: "630987654321",
        status: "pending",
        type: "sale",
        customerCountry: "US",
        clickDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 12, 10, 45, 0).toISOString()
      },
      {
        id: "22479823",
        transactionDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14).toISOString(),
        saleAmount: {
          amount: 225.75,
          currency: "USD"
        },
        commissionAmount: {
          amount: 33.86,
          currency: "USD"
        },
        siteName: "DiscountGolfGear.net",
        orderRef: "630876543210",
        status: "confirmed",
        type: "sale",
        customerCountry: "US",
        clickDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14, 13, 20, 0).toISOString()
      }
    ];

    // Calculate totals
    const totalSales = mockTransactions.reduce((acc, transaction) => 
      acc + (transaction.saleAmount?.amount || 0), 0);
    
    const totalCommission = mockTransactions.reduce((acc, transaction) => 
      acc + (transaction.commissionAmount?.amount || 0), 0);

    // Create platform comparison data
    const platformData = [
      { name: "sharesale", sales: totalSales, commission: totalCommission, transactions: mockTransactions.length },
      { name: "impact", sales: 1394.36, commission: 167.31, transactions: 7 },
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
          ...(transactionsByMonth[month] || { sales: 0, commission: 0, transactions: 0 })
        };
      }
      
      // Create realistic historical data with seasonality
      const getSeasonalFactor = (month: string) => {
        // Higher sales in Nov-Dec (holiday season), Apr-May (spring), Jul-Aug (summer)
        const seasonality: Record<string, number> = {
          'Jan': 0.7, 
          'Feb': 0.8, 
          'Mar': 0.9, 
          'Apr': 1.2, 
          'May': 1.3, 
          'Jun': 1.1,
          'Jul': 1.4, 
          'Aug': 1.3, 
          'Sep': 0.9, 
          'Oct': 1.1, 
          'Nov': 1.6, 
          'Dec': 1.9
        };
        return seasonality[month] || 1.0;
      };
      
      const factor = getSeasonalFactor(month);
      const baseSales = 1600 * factor;
      const baseCommission = baseSales * 0.15;
      const baseTransactions = Math.round(baseSales / 180);
      
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
    console.error('ShareASale API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ShareASale data' },
      { status: 500 }
    );
  }
}