"use client";

import { useState, useEffect } from "react";
import { MonthSelector } from "packages/ui/src/month-selector";
import { SalesCommissionChart, type DataPoint, type MonthlyDataPoint } from "../../../(dashboard)/[workspace]/_components/sales-commission-chart";

interface PlatformData {
  platform: string;
  sales: number;
  commission: number;
  transactions: number;
  status: "success" | "error" | "loading";
  error?: string;
}

interface ChartData {
  transactions: any[];
  platformData: DataPoint[];
  monthlyData: MonthlyDataPoint[];
}

// Helper to get short month name from date
function getMonthName(date: Date): string {
  return date.toLocaleString('default', { month: 'short' });
}

export default function ApiIntegrationsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>();
  const [platformData, setPlatformData] = useState<PlatformData[]>([
    { platform: "sharesale", sales: 0, commission: 0, transactions: 0, status: "loading" },
    { platform: "awin", sales: 0, commission: 0, transactions: 0, status: "loading" },
    { platform: "impact", sales: 0, commission: 0, transactions: 0, status: "loading" },
  ]);
  const [chartPlatformData, setChartPlatformData] = useState<DataPoint[]>([]);
  const [chartMonthlyData, setChartMonthlyData] = useState<MonthlyDataPoint[]>([]);

  const handleMonthSelect = async (month: string) => {
    setIsLoading(true);
    setSelectedMonth(month);
    try {
      // For now, we're only implementing Awin
      const awinRes = await fetch(`/api/affiliate/awin${month ? `?month=${month}` : ''}`);
      
      if (!awinRes.ok) {
        throw new Error(`Failed to fetch Awin data: ${awinRes.status}`);
      }
      
      const chartData: ChartData = await awinRes.json();
      
      // First, check if we got the processed chart data structure
      if (chartData.platformData && chartData.monthlyData) {
        // Use pre-processed chart data from API
        setChartPlatformData(chartData.platformData);
        setChartMonthlyData(chartData.monthlyData);
        
        // Update the platform data for the table
        const awinPlatform = chartData.platformData.find(p => p.name === "awin");
        
        if (awinPlatform) {
          setPlatformData(prev => prev.map(platform => 
            platform.platform === "awin" 
              ? {
                  ...platform,
                  sales: awinPlatform.sales,
                  commission: awinPlatform.commission,
                  transactions: awinPlatform.transactions,
                  status: "success"
                }
              : platform
          ));
        }
      } else {
        // If we don't have chart data, we'll process transactions manually
        const transactions = chartData.transactions || [];
        
        // Calculate totals from Awin transactions
        const awinTotals = transactions.reduce((acc: any, transaction: any) => ({
          sales: acc.sales + (transaction.saleAmount?.amount || 0),
          commission: acc.commission + (transaction.commissionAmount?.amount || 0),
          transactions: acc.transactions + 1,
        }), { sales: 0, commission: 0, transactions: 0 });
        
        setPlatformData(prev => prev.map(platform => 
          platform.platform === "awin" 
            ? {
                ...platform,
                sales: awinTotals.sales,
                commission: awinTotals.commission,
                transactions: awinTotals.transactions,
                status: awinRes.ok ? "success" : "error",
                error: awinRes.ok ? undefined : "Failed to fetch Awin data"
              }
            : platform
        ));
        
        // Create platform data for chart
        const newChartPlatformData = [
          { name: "sharesale", sales: 0, commission: 0, transactions: 0 },
          { name: "awin", sales: awinTotals.sales, commission: awinTotals.commission, transactions: awinTotals.transactions },
          { name: "impact", sales: 0, commission: 0, transactions: 0 }
        ];
        
        setChartPlatformData(newChartPlatformData);
        
        // Create monthly data from transactions
        const monthlyDataMap = transactions.reduce((acc: any, transaction: any) => {
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
        
        // Convert to array with all months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const newMonthlyData = months.map(month => ({
          month,
          ...(monthlyDataMap[month] || { sales: 0, commission: 0, transactions: 0 })
        }));
        
        setChartMonthlyData(newMonthlyData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setPlatformData(prev => prev.map(platform => ({
        ...platform,
        status: "error",
        error: "Failed to fetch data"
      })));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">API Integrations Dashboard</h2>
        <MonthSelector
          onSelect={handleMonthSelect}
          isLoading={isLoading}
          selectedMonth={selectedMonth}
        />
      </div>
      
      {/* API Integrations Summary Table */}
      <div className="mb-10 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">platform</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">total sales</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">total commission</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">transactions</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {platformData.map(platform => (
              <tr key={platform.platform}>
                <td className="px-4 py-3 text-sm text-gray-900">{platform.platform}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {platform.status === "loading" ? (
                    <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
                  ) : (
                    `$${platform.sales.toFixed(2)}`
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {platform.status === "loading" ? (
                    <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
                  ) : (
                    `$${platform.commission.toFixed(2)}`
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {platform.status === "loading" ? (
                    <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
                  ) : (
                    platform.transactions
                  )}
                </td>
                <td className={`px-4 py-3 text-sm ${
                  platform.status === "error" ? "text-red-500" : 
                  platform.status === "success" ? "text-green-500" : 
                  "text-gray-500"
                }`}>
                  {platform.status === "loading" ? (
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                  ) : platform.status === "error" ? (
                    platform.error || "error"
                  ) : (
                    "success"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Analytics Charts */}
      <SalesCommissionChart 
        platformData={chartPlatformData}
        monthlyData={chartMonthlyData}
      />
    </div>
  );
} 