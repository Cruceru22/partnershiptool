"use client";

import { useState } from "react";
import { MonthSelector } from "@acme/ui";
import { type DataPoint, type MonthlyDataPoint } from "../../../app/(dashboard)/[workspace]/_components/sales-commission-chart";
import dynamic from "next/dynamic";

// Use dynamic import to avoid SSR issues with recharts
const SalesCommissionChart = dynamic(
  () => import("../../../app/(dashboard)/[workspace]/_components/sales-commission-chart").then(mod => mod.SalesCommissionChart),
  { ssr: false }
);

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
      // Fetch from all three affiliate networks
      const awinRes = await fetch(`/api/affiliate/awin${month ? `?month=${month}` : ''}`);
      const shareASaleRes = await fetch(`/api/affiliate/shareasale${month ? `?month=${month}` : ''}`);
      const impactRes = await fetch(`/api/affiliate/impact${month ? `?month=${month}` : ''}`);
      
      // Check if all responses are OK
      if (!awinRes.ok) {
        console.error(`Failed to fetch Awin data: ${awinRes.status}`);
      }
      
      if (!shareASaleRes.ok) {
        console.error(`Failed to fetch ShareASale data: ${shareASaleRes.status}`);
      }
      
      if (!impactRes.ok) {
        console.error(`Failed to fetch Impact data: ${impactRes.status}`);
      }
      
      // Get data from responses
      const awinData: ChartData = awinRes.ok ? await awinRes.json() : { transactions: [], platformData: [], monthlyData: [] };
      const shareASaleData: ChartData = shareASaleRes.ok ? await shareASaleRes.json() : { transactions: [], platformData: [], monthlyData: [] };
      const impactData: ChartData = impactRes.ok ? await impactRes.json() : { transactions: [], platformData: [], monthlyData: [] };

      // Update platform data in state
      setPlatformData([
        { 
          platform: "sharesale", 
          sales: shareASaleData.platformData?.find(p => p.name === "sharesale")?.sales || 0, 
          commission: shareASaleData.platformData?.find(p => p.name === "sharesale")?.commission || 0, 
          transactions: shareASaleData.platformData?.find(p => p.name === "sharesale")?.transactions || 0,
          status: shareASaleRes.ok ? "success" : "error",
          error: shareASaleRes.ok ? undefined : "Failed to fetch ShareASale data"
        },
        { 
          platform: "awin", 
          sales: awinData.platformData?.find(p => p.name === "awin")?.sales || 0, 
          commission: awinData.platformData?.find(p => p.name === "awin")?.commission || 0, 
          transactions: awinData.platformData?.find(p => p.name === "awin")?.transactions || 0,
          status: awinRes.ok ? "success" : "error",
          error: awinRes.ok ? undefined : "Failed to fetch Awin data"
        },
        { 
          platform: "impact", 
          sales: impactData.platformData?.find(p => p.name === "impact")?.sales || 0, 
          commission: impactData.platformData?.find(p => p.name === "impact")?.commission || 0, 
          transactions: impactData.platformData?.find(p => p.name === "impact")?.transactions || 0,
          status: impactRes.ok ? "success" : "error",
          error: impactRes.ok ? undefined : "Failed to fetch Impact data"
        }
      ]);
      
      // Combine all transactions
      const allTransactions = [
        ...(awinData.transactions || []),
        ...(shareASaleData.transactions || []),
        ...(impactData.transactions || [])
      ];
      
      // Combine platform data for chart
      const combinedPlatformData = [
        {
          name: "sharesale",
          sales: shareASaleData.platformData?.find(p => p.name === "sharesale")?.sales || 0,
          commission: shareASaleData.platformData?.find(p => p.name === "sharesale")?.commission || 0,
          transactions: shareASaleData.platformData?.find(p => p.name === "sharesale")?.transactions || 0
        },
        {
          name: "awin",
          sales: awinData.platformData?.find(p => p.name === "awin")?.sales || 0,
          commission: awinData.platformData?.find(p => p.name === "awin")?.commission || 0,
          transactions: awinData.platformData?.find(p => p.name === "awin")?.transactions || 0
        },
        {
          name: "impact",
          sales: impactData.platformData?.find(p => p.name === "impact")?.sales || 0,
          commission: impactData.platformData?.find(p => p.name === "impact")?.commission || 0,
          transactions: impactData.platformData?.find(p => p.name === "impact")?.transactions || 0
        }
      ];
      
      setChartPlatformData(combinedPlatformData);
      
      // Combine monthly data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const combinedMonthlyData = months.map(month => {
        const shareASaleMonth = shareASaleData.monthlyData?.find(m => m.month === month) || { sales: 0, commission: 0, transactions: 0 };
        const awinMonth = awinData.monthlyData?.find(m => m.month === month) || { sales: 0, commission: 0, transactions: 0 };
        const impactMonth = impactData.monthlyData?.find(m => m.month === month) || { sales: 0, commission: 0, transactions: 0 };
        
        return {
          month,
          sales: shareASaleMonth.sales + awinMonth.sales + impactMonth.sales,
          commission: shareASaleMonth.commission + awinMonth.commission + impactMonth.commission,
          transactions: shareASaleMonth.transactions + awinMonth.transactions + impactMonth.transactions
        };
      });
      
      setChartMonthlyData(combinedMonthlyData);
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