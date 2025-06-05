export interface Transaction {
  id: string;
  transactionDate: string;
  saleAmount?: {
    amount: number;
    currency: string;
  };
  commissionAmount?: {
    amount: number;
    currency: string;
  };
  status: string;
} 