"use client";

import React, { useState } from "react";
import { Button } from "@acme/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui/card";
import { Badge } from "@acme/ui/badge";
import { ArrowUpIcon, ArrowDownIcon, CalendarIcon, DollarSignIcon, TrendingUpIcon, ActivityIcon } from "lucide-react";

interface Transaction {
  id: string;
  platform: string;
  affiliateId?: string;
  siteName: string;
  transactionDate: string;
  saleAmount: number | { amount: number; currency: string };
  commission: number | { amount: number; currency: string };
  orderRef: string;
  status: string;
}

interface ComparisonData {
  month1: {
    month: string;
    sales: number;
    commission: number;
    transactions: number;
    transactionDetails: Transaction[];
    platformBreakdown: {
      shareasale: { sales: number; commission: number; transactions: number; details: Transaction[] };
      awin: { sales: number; commission: number; transactions: number; details: Transaction[] };
    };
  };
  month2: {
    month: string;
    sales: number;
    commission: number;
    transactions: number;
    transactionDetails: Transaction[];
    platformBreakdown: {
      shareasale: { sales: number; commission: number; transactions: number; details: Transaction[] };
      awin: { sales: number; commission: number; transactions: number; details: Transaction[] };
    };
  };
  changes: {
    sales: { absolute: number; percentage: number };
    commission: { absolute: number; percentage: number };
    transactions: { absolute: number; percentage: number };
  };
}

const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  format = "currency" 
}: {
  title: string;
  value: number;
  change: { absolute: number; percentage: number };
  icon: React.ElementType;
  format?: "currency" | "number";
}) => {
  const isPositive = change.percentage > 0;
  const isNeutral = change.percentage === 0;
  
  const formatValue = (val: number) => {
    if (format === "currency") {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(val);
    }
    return val.toLocaleString();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {!isNeutral && (
            isPositive ? (
              <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
            )
          )}
          <span className={`font-medium ${
            isNeutral ? 'text-muted-foreground' : 
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? '+' : ''}{change.percentage.toFixed(1)}%
          </span>
          <span className="ml-1">
            ({isPositive ? '+' : ''}{formatValue(change.absolute)})
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const MonthComparisonCard = ({ 
  month, 
  data, 
  isSelected = false 
}: {
  month: string;
  data: { sales: number; commission: number; transactions: number };
  isSelected?: boolean;
}) => {
  return (
    <Card className={isSelected ? "ring-2 ring-primary" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          {new Date(month + "-01").toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
          })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Sales</span>
            <span className="font-medium">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(data.sales)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Commission</span>
            <span className="font-medium">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(data.commission)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Transactions</span>
            <span className="font-medium">{data.transactions.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TransactionTable = ({ 
  transactions, 
  title 
}: {
  transactions: Transaction[];
  title: string;
}) => {
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusColor = (status: string) => {
    if (!status) return 'secondary';
    switch (status.toLowerCase()) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'locked': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          {transactions.length} transactions • Total: {formatCurrency(transactions.reduce((sum, t) => {
            const amount = typeof t.saleAmount === 'number' ? t.saleAmount : t.saleAmount?.amount || 0;
            return sum + amount;
          }, 0))}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found for this month
            </div>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {transaction.platform}
                      </Badge>
                      <Badge variant={getStatusColor(transaction.status)} className="text-xs">
                        {transaction.status || 'unknown'}
                      </Badge>
                    </div>
                    <div className="font-medium text-sm">{transaction.siteName}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(transaction.transactionDate)} • Order: {transaction.orderRef}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-semibold">
                      {formatCurrency(typeof transaction.saleAmount === 'number' ? transaction.saleAmount : transaction.saleAmount?.amount || 0)}
                    </div>
                    <div className="text-sm text-green-600">
                      {formatCurrency(typeof transaction.commission === 'number' ? transaction.commission : transaction.commission?.amount || 0)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function ComparePage() {
  const [month1, setMonth1] = useState('');
  const [month2, setMonth2] = useState('');
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async () => {
    if (!month1 || !month2) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/affiliate/compare-all?month1=${month1}&month2=${month2}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch comparison data');
      }
      
      const data = await response.json();
      setComparisonData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetComparison = () => {
    setComparisonData(null);
    setError(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Month Comparison</h1>
        <p className="text-muted-foreground">
          Compare affiliate network performance between different months
        </p>
      </div>

      {/* Month Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Months to Compare</CardTitle>
          <CardDescription>
            Choose two months to see detailed performance comparison
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Month</label>
              <input
                type="month"
                value={month1}
                onChange={(e) => setMonth1(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Second Month</label>
              <input
                type="month"
                value={month2}
                onChange={(e) => setMonth2(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleCompare}
                disabled={!month1 || !month2 || isLoading}
                className="flex-1"
              >
                {isLoading ? 'Comparing...' : 'Compare'}
              </Button>
              {comparisonData && (
                <Button variant="outline" onClick={resetComparison}>
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <span className="text-sm font-medium">Error:</span>
              <span className="text-sm">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Results */}
      {comparisonData && (
        <div className="space-y-6">
          {/* Summary Metrics */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Performance Overview</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard
                title="Total Sales"
                value={comparisonData.month1.sales}
                change={comparisonData.changes.sales}
                icon={DollarSignIcon}
                format="currency"
              />
              <MetricCard
                title="Commission Earned"
                value={comparisonData.month1.commission}
                change={comparisonData.changes.commission}
                icon={TrendingUpIcon}
                format="currency"
              />
              <MetricCard
                title="Total Transactions"
                value={comparisonData.month1.transactions}
                change={comparisonData.changes.transactions}
                icon={ActivityIcon}
                format="number"
              />
            </div>
          </div>

          {/* Side by Side Comparison */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Side by Side Comparison</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <MonthComparisonCard
                month={comparisonData.month1.month}
                data={comparisonData.month1}
                isSelected={true}
              />
              <MonthComparisonCard
                month={comparisonData.month2.month}
                data={comparisonData.month2}
              />
            </div>
          </div>

          {/* Transaction Details by Platform */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Transaction Details by Platform</h2>
            
            {/* ShareASale Transactions */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-orange-600 flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                ShareASale Transactions
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <TransactionTable
                  transactions={comparisonData.month1.platformBreakdown.shareasale.details}
                  title={`${new Date(comparisonData.month1.month + "-01").toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })} - ShareASale`}
                />
                <TransactionTable
                  transactions={comparisonData.month2.platformBreakdown.shareasale.details}
                  title={`${new Date(comparisonData.month2.month + "-01").toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })} - ShareASale`}
                />
              </div>
            </div>

            {/* Awin Transactions */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-blue-600 flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                Awin Transactions
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <TransactionTable
                  transactions={comparisonData.month1.platformBreakdown.awin.details}
                  title={`${new Date(comparisonData.month1.month + "-01").toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })} - Awin`}
                />
                <TransactionTable
                  transactions={comparisonData.month2.platformBreakdown.awin.details}
                  title={`${new Date(comparisonData.month2.month + "-01").toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })} - Awin`}
                />
              </div>
            </div>

            {/* Combined View */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                All Transactions Combined
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <TransactionTable
                  transactions={comparisonData.month1.transactionDetails}
                  title={`${new Date(comparisonData.month1.month + "-01").toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })} - All Platforms`}
                />
                <TransactionTable
                  transactions={comparisonData.month2.transactionDetails}
                  title={`${new Date(comparisonData.month2.month + "-01").toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })} - All Platforms`}
                />
              </div>
            </div>
          </div>

          {/* Detailed Changes */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Changes</CardTitle>
              <CardDescription>
                Comparison between {comparisonData.month1.month} and {comparisonData.month2.month}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    label: 'Sales', 
                    change: comparisonData.changes.sales,
                    format: 'currency' as const
                  },
                  { 
                    label: 'Commission', 
                    change: comparisonData.changes.commission,
                    format: 'currency' as const
                  },
                  { 
                    label: 'Transactions', 
                    change: comparisonData.changes.transactions,
                    format: 'number' as const
                  }
                ].map((item, index) => {
                  const isPositive = item.change.percentage > 0;
                  const isNeutral = item.change.percentage === 0;
                  
                  const formatValue = (val: number) => {
                    if (item.format === 'currency') {
                      return new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(val);
                    }
                    return val.toLocaleString();
                  };

                  return (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="font-medium">{item.label}</div>
                        <Badge variant={isNeutral ? "secondary" : isPositive ? "default" : "destructive"}>
                          {isPositive ? '+' : ''}{item.change.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${
                          isNeutral ? 'text-muted-foreground' : 
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {isPositive ? '+' : ''}{formatValue(item.change.absolute)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 