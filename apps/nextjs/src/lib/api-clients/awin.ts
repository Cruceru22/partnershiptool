interface AwinConfig {
  accessToken: string;
  publisherId: string;
}

export class AwinClient {
  private accessToken: string;
  private publisherId: string;

  constructor(config: AwinConfig) {
    this.accessToken = config.accessToken;
    this.publisherId = config.publisherId;
  }

  async getAffiliateData() {
    // Awin API endpoint for publisher reports
    const url = `https://api.awin.com/publishers/${this.publisherId}/reports/`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Awin API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Awin API error:', error);
      throw error;
    }
  }
} 