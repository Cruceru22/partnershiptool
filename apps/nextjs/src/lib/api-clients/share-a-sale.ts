import crypto from 'crypto';

interface ShareASaleTransaction {
  transID: string;
  userID: string;
  transdate: string;
  transamount: string;
  commission: string;
  ssamount: string;
  comment: string;
  voide: string;
  locked: string;
  pending: string;
  orderNumber: string;
  merchantDefinedType: string;
}

interface ShareASaleResponse {
  transactions: ShareASaleTransaction[];
  totalSales: number;
  totalCommission: number;
}

interface ShareASaleConfig {
  token: string;
  apiSecret: string;
}

interface ShareASaleQueryParams {
  action: string;
  affiliateId: string;
  token: string;
  version: string;
  timestamp: string;
  sortcol?: string;
  sortdir?: 'ASC' | 'DESC';
  XMLFormat?: '0' | '1';
  [key: string]: string | undefined;
}

export class ShareASaleClient {
  private token: string;
  private apiSecret: string;
  private readonly merchantId = "154175"; // Your merchant ID from the documentation examples

  constructor({ token, apiSecret }: { token: string; apiSecret: string }) {
    this.token = token;
    this.apiSecret = apiSecret;
  }

  private generateUTCDate(): string {
    return new Date().toUTCString();
  }

  private generateAuthenticationSignature(utcDate: string, action: string): string {
    // Format: YourAPIToken:CurrentDateInUTCFormat:APIActionValue:YourAPISecret
    const signatureInput = `${this.token}:${utcDate}:${action}:${this.apiSecret}`;
    return crypto.createHash('sha256').update(signatureInput).digest('hex').toUpperCase();
  }

  private parsePipeDelimitedResponse(responseText: string): ShareASaleResponse {
    // Split the response into lines
    const lines = responseText.trim().split('\n');
    // First line contains headers
    const headers = lines[0]?.split('|') || [];
    
    // Map column indices with default values if not found
    const columnMap = {
      transID: headers.indexOf('transID') !== -1 ? headers.indexOf('transID') : 0,
      userID: headers.indexOf('userID') !== -1 ? headers.indexOf('userID') : 1,
      transdate: headers.indexOf('transdate') !== -1 ? headers.indexOf('transdate') : 2,
      transamount: headers.indexOf('transamount') !== -1 ? headers.indexOf('transamount') : 3,
      commission: headers.indexOf('commission') !== -1 ? headers.indexOf('commission') : 4,
      ssamount: headers.indexOf('ssamount') !== -1 ? headers.indexOf('ssamount') : 5,
      comment: headers.indexOf('comment') !== -1 ? headers.indexOf('comment') : 6,
      voide: headers.indexOf('voide') !== -1 ? headers.indexOf('voide') : 7,
      locked: headers.indexOf('locked') !== -1 ? headers.indexOf('locked') : 8,
      pending: headers.indexOf('pending') !== -1 ? headers.indexOf('pending') : 9,
      orderNumber: headers.indexOf('orderNumber') !== -1 ? headers.indexOf('orderNumber') : 10,
      merchantDefinedType: headers.indexOf('merchantDefinedType') !== -1 ? headers.indexOf('merchantDefinedType') : 11
    };

    // Parse transactions (skip header line)
    const transactions = lines.slice(1).map(line => {
      const values = line.split('|');
      return {
        transID: values[columnMap.transID] || '',
        userID: values[columnMap.userID] || '',
        transdate: values[columnMap.transdate] || '',
        transamount: values[columnMap.transamount] || '0',
        commission: values[columnMap.commission] || '0',
        ssamount: values[columnMap.ssamount] || '0',
        comment: values[columnMap.comment] || '',
        voide: values[columnMap.voide] || '',
        locked: values[columnMap.locked] || '',
        pending: values[columnMap.pending] || '',
        orderNumber: values[columnMap.orderNumber] || '',
        merchantDefinedType: values[columnMap.merchantDefinedType] || ''
      };
    });

    // Calculate totals
    const totals = transactions.reduce((acc, trans) => ({
      totalSales: acc.totalSales + (parseFloat(trans.transamount) || 0),
      totalCommission: acc.totalCommission + (parseFloat(trans.commission) || 0)
    }), { totalSales: 0, totalCommission: 0 });

    return {
      transactions,
      ...totals
    };
  }

  async getAffiliateData(month?: string | null) {
    // ShareASale API endpoint
    const url = 'https://api.shareasale.com/w.cfm';
    
    // Format date for the API request
    let startDate: Date;
    let endDate: Date;

    if (month) {
      const [year, monthStr] = month.split("-");
      if (!year || !monthStr) {
        throw new Error("Invalid month format. Expected YYYY-MM");
      }
      startDate = new Date(parseInt(year), parseInt(monthStr) - 1, 1);
      endDate = new Date(parseInt(year), parseInt(monthStr), 0); // Last day of month
    } else {
      const today = new Date();
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 1); // Get data for the last month
      endDate = today;
    }

    // Format dates as MM/dd/yyyy for ShareASale
    const formattedStartDate = `${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getDate().toString().padStart(2, '0')}/${startDate.getFullYear()}`;
    const formattedEndDate = `${(endDate.getMonth() + 1).toString().padStart(2, '0')}/${endDate.getDate().toString().padStart(2, '0')}/${endDate.getFullYear()}`;

    const action = 'transactiondetail';
    const utcDate = this.generateUTCDate();
    const authHash = this.generateAuthenticationSignature(utcDate, action);

    // Create query parameters according to the API documentation
    const queryParams = new URLSearchParams({
      merchantId: this.merchantId,
      token: this.token,
      version: '3.0',
      action,
      dateStart: formattedStartDate,
      dateEnd: formattedEndDate,
      format: 'pipe'  // Changed to pipe format since that's what the API returns
    });

    const fullUrl = `${url}?${queryParams}`;
    console.log('ShareASale API Request URL:', fullUrl);
    console.log('ShareASale API Request Headers:', {
      'x-ShareASale-Date': utcDate,
      'x-ShareASale-Authentication': authHash
    });

    try {
      const response = await fetch(fullUrl, {
        headers: {
          'Accept': 'text/plain',  // Changed to accept text/plain for pipe-delimited data
          'x-ShareASale-Date': utcDate,
          'x-ShareASale-Authentication': authHash
        }
      });

      console.log('ShareASale API Response Status:', response.status);
      const responseText = await response.text();
      console.log('ShareASale API Raw Response:', responseText);

      if (!response.ok) {
        throw new Error(`ShareASale API request failed: ${response.status} - ${responseText}`);
      }

      // If the response is empty or whitespace, return zero values
      if (!responseText.trim()) {
        return {
          transactions: [],
          totalSales: 0,
          totalCommission: 0
        };
      }

      try {
        const data = this.parsePipeDelimitedResponse(responseText);
        console.log('ShareASale API Parsed Response:', data);
        return data;
      } catch (parseError) {
        console.error('Failed to parse ShareASale response:', parseError);
        return {
          transactions: [],
          totalSales: 0,
          totalCommission: 0
        };
      }
    } catch (error) {
      console.error('ShareASale API error:', error);
      throw error;
    }
  }

  private async makeRequest(params: Partial<ShareASaleQueryParams>) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    
    const queryParams: ShareASaleQueryParams = {
      action: params.action || 'dailyActivity',
      affiliateId: this.token,
      token: this.token,
      version: '1.7',
      timestamp,
      ...params
    };

    const signature = this.generateAuthenticationSignature(timestamp, queryParams.action);
    
    const searchParams = new URLSearchParams({
      ...queryParams,
      authentication: signature
    });

    try {
      const response = await fetch(`https://api.shareasale.com/x.cfm?${searchParams}`);
      
      if (!response.ok) {
        throw new Error(`ShareASale API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('ShareASale API error:', error);
      throw error;
    }
  }

  // Get today's statistics
  async getDailyActivity(options?: { 
    sortcol?: string; 
    sortdir?: 'ASC' | 'DESC';
    XMLFormat?: '0' | '1';
  }) {
    return this.makeRequest({
      action: 'dailyActivity',
      ...options
    });
  }

  // Get monthly summary
  async getMonthlySummary(options?: {
    sortcol?: string;
    sortdir?: 'ASC' | 'DESC';
    XMLFormat?: '0' | '1';
  }) {
    return this.makeRequest({
      action: 'monthlySummary',
      ...options
    });
  }

  // Search merchants by product
  async searchMerchantsByProduct(keyword: string, options?: {
    sortcol?: string;
    sortdir?: 'ASC' | 'DESC';
    XMLFormat?: '0' | '1';
  }) {
    return this.makeRequest({
      action: 'merchantSearch',
      keyword,
      ...options
    });
  }

  // Get merchant creatives (banners)
  async getMerchantCreatives(options?: {
    merchantId?: string;
    category?: string;
    sortcol?: string;
    sortdir?: 'ASC' | 'DESC';
    XMLFormat?: '0' | '1';
  }) {
    return this.makeRequest({
      action: 'merchantCreatives',
      ...options
    });
  }

  // Get invalid links report
  async getInvalidLinks(options?: {
    sortcol?: string;
    sortdir?: 'ASC' | 'DESC';
    XMLFormat?: '0' | '1';
  }) {
    return this.makeRequest({
      action: 'invalidLinks',
      ...options
    });
  }

  // Get best performing merchants
  async getBestMerchants(options?: {
    sortcol?: string;
    sortdir?: 'ASC' | 'DESC';
    XMLFormat?: '0' | '1';
  }) {
    return this.makeRequest({
      action: 'merchantPerformance',
      ...options
    });
  }
} 