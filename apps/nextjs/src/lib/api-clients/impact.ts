import { type Transaction } from '../types/transactions';

interface ImpactConfig {
  accountSID: string;
  authToken: string;
  advertizerId: string;
}

interface ImpactResponse {
  actions: {
    records: Array<{
      id: string;
      amount: number;
      commissionAmount: number;
      date: string;
      status: string;
    }>;
    page: {
      totalRecords: number;
      pageSize: number;
      currentPage: number;
    };
  };
}

export class ImpactClient {
  private accountSID: string;
  private authToken: string;
  private advertizerId: string;
  private baseUrl = 'https://api.impact.com';

  constructor(config: ImpactConfig) {
    this.accountSID = config.accountSID;
    this.authToken = config.authToken;
    this.advertizerId = config.advertizerId;
  }

  async getAffiliateData(startDate?: string, endDate?: string) {
    try {
      // Construct the URL with proper date parameters
      const url = `${this.baseUrl}/Mediapartners/${this.accountSID}/Actions`;
      
      // Default to last 30 days if no dates provided and ensure they are strings
      const end: string = endDate ?? new Date().toISOString().split('T')[0];
      const start: string = startDate ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      // Ensure all values are strings for URLSearchParams
      const queryParams: Record<string, string> = {
        startDate: start,
        endDate: end,
        status: 'approved,pending',
        page: '1',
        pageSize: '100'
      };

      const params = new URLSearchParams(queryParams);

      // Create proper auth header using base64 encoded credentials
      const authHeader = Buffer.from(`${this.accountSID}:${this.authToken}`).toString('base64');

      const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // Log response headers for debugging
      console.log('Impact API Response Status:', response.status);
      console.log('Impact API Response Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Impact API Error Response:', errorText);
        throw new Error(`Impact API request failed: ${response.status} - ${errorText}`);
      }

      const data: ImpactResponse = await response.json();
      console.log('Impact API Response Data:', JSON.stringify(data, null, 2));

      // Transform the data to match our interface
      const transactions: Transaction[] = data.actions.records.map(action => ({
        id: action.id,
        transactionDate: action.date,
        saleAmount: {
          amount: action.amount,
          currency: 'USD' // Assuming USD, adjust if needed
        },
        commissionAmount: {
          amount: action.commissionAmount,
          currency: 'USD'
        },
        status: action.status.toLowerCase()
      }));

      // Calculate totals
      const totals = transactions.reduce((acc, transaction) => ({
        sales: acc.sales + (transaction.saleAmount?.amount || 0),
        commission: acc.commission + (transaction.commissionAmount?.amount || 0),
        clicks: acc.clicks // Impact doesn't provide click data in this endpoint
      }), { sales: 0, commission: 0, clicks: 0 });

      return {
        transactions,
        ...totals
      };
    } catch (error) {
      console.error('Impact API error:', error);
      throw error;
    }
  }
} 