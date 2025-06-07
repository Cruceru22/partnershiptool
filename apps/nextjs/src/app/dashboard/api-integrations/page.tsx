"use client";

import { useState } from "react";
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
  growth?: {
    sales: number;
    commission: number;
    transactions: number;
  };
}

interface ChartData {
  transactions: any[];
  platformData: DataPoint[];
  monthlyData: MonthlyDataPoint[];
  comparison?: {
    sales: { current: number; previous: number; growth: number };
    commission: { current: number; previous: number; growth: number };
    transactions: { current: number; previous: number; growth: number };
  };
  selectedMonth?: string;
  previousMonth?: string;
}

// Growth indicator component
const GrowthIndicator = ({ growth, value }: { growth?: number; value: string }) => {
  console.log('GrowthIndicator rendered:', { growth, value });
  
  if (growth === undefined) {
    console.log('No growth data, showing value only:', value);
    return <span style={{ border: '1px solid blue' }}>{value}</span>;
  }
  
  const isPositive = growth > 0;
  const isNeutral = growth === 0;
  
  return (
    <div className="flex items-center gap-2" style={{ border: '1px solid green' }}>
      <span>{value}</span>
      <span className={`text-xs flex items-center gap-1 ${
        isNeutral ? 'text-gray-500' : isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        {!isNeutral && (
          <span>{isPositive ? '↗' : '↘'}</span>
        )}
        {Math.abs(growth).toFixed(1)}%
      </span>
    </div>
  );
};

// Simple MonthSelector component
const MonthSelector = ({ onSelect, isLoading, selectedMonth }: {
  onSelect: (month: string) => void;
  isLoading?: boolean;
  selectedMonth?: string;
}) => {
  const months = [];
  const today = new Date();
  
  for (let i = 0; i < 24; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const month = date.toISOString().slice(0, 7); // YYYY-MM format
    months.push(month);
  }

  const currentMonth = selectedMonth ?? months[0];

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentMonth}
        onChange={(e) => onSelect(e.target.value)}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isLoading}
      >
        {months.map((month) => (
          <option key={month} value={month}>
            {new Date(month + "-01").toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
            })}
          </option>
        ))}
      </select>
      <button
        onClick={() => onSelect(currentMonth ?? "")}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm"
      >
        {isLoading ? "Loading..." : "Fetch Data"}
      </button>
    </div>
  );
};

export default function ApiIntegrationsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>();
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareData, setCompareData] = useState<any>(null);
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
      const shareASaleRes = await fetch(`/api/affiliate/shareasale-transactions${month ? `?month=${month}` : ''}`);
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
          error: shareASaleRes.ok ? undefined : "Failed to fetch ShareASale data",
          growth: shareASaleRes.ok && shareASaleData.comparison ? {
            sales: shareASaleData.comparison.sales.growth,
            commission: shareASaleData.comparison.commission.growth,
            transactions: shareASaleData.comparison.transactions.growth
          } : undefined
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

  const handleCompare = async (month1: string, month2: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/affiliate/shareasale-compare?month1=${month1}&month2=${month2}`);
      
      if (response.ok) {
        const data = await response.json();
        setCompareData(data);
      } else {
        console.error('Failed to fetch comparison data');
      }
    } catch (error) {
      console.error('Error fetching comparison data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Compare Modal Component
  const CompareModal = () => {
    const [month1, setMonth1] = useState('');
    const [month2, setMonth2] = useState('');

    if (!showCompareModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Compare Months</h3>
            <button 
              onClick={() => setShowCompareModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {!compareData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Month
                  </label>
                  <input
                    type="month"
                    value={month1}
                    onChange={(e) => setMonth1(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Second Month
                  </label>
                  <input
                    type="month"
                    value={month2}
                    onChange={(e) => setMonth2(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleCompare(month1, month2)}
                  disabled={!month1 || !month2 || isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isLoading ? 'Comparing...' : 'Compare'}
                </button>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900">{compareData.month1.month}</h4>
                  <div className="space-y-2 mt-2">
                    <div>Sales: ${compareData.month1.sales.toFixed(2)}</div>
                    <div>Commission: ${compareData.month1.commission.toFixed(2)}</div>
                    <div>Transactions: {compareData.month1.transactions}</div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900">{compareData.month2.month}</h4>
                  <div className="space-y-2 mt-2">
                    <div>Sales: ${compareData.month2.sales.toFixed(2)}</div>
                    <div>Commission: ${compareData.month2.commission.toFixed(2)}</div>
                    <div>Transactions: {compareData.month2.transactions}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Changes ({compareData.month1.month} vs {compareData.month2.month})</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sales:</span>
                    <span className={`font-medium ${compareData.changes.sales.percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${compareData.changes.sales.absolute.toFixed(2)} ({compareData.changes.sales.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commission:</span>
                    <span className={`font-medium ${compareData.changes.commission.percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${compareData.changes.commission.absolute.toFixed(2)} ({compareData.changes.commission.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transactions:</span>
                    <span className={`font-medium ${compareData.changes.transactions.percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {compareData.changes.transactions.absolute} ({compareData.changes.transactions.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCompareData(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Compare Different Months
                </button>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6" style={{ backgroundColor: '#f0f0f0', padding: '1rem' }}>
        <h2 className="text-2xl font-bold">API Integrations Dashboard</h2>
        <div className="flex gap-3">
          <button
            onClick={() => {
              console.log('Compare button clicked!');
              setCompareData(null);
              setShowCompareModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            style={{ border: '2px solid red' }}
          >
            📊 Compare Months
          </button>
          <MonthSelector
            onSelect={handleMonthSelect}
            isLoading={isLoading}
            selectedMonth={selectedMonth}
          />
        </div>
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
                    <GrowthIndicator growth={platform.growth?.sales} value={`$${platform.sales.toFixed(2)}`} />
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {platform.status === "loading" ? (
                    <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
                  ) : (
                    <GrowthIndicator growth={platform.growth?.commission} value={`$${platform.commission.toFixed(2)}`} />
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {platform.status === "loading" ? (
                    <div className="h-4 w-8 animate-pulse rounded bg-gray-200" />
                  ) : (
                    <GrowthIndicator growth={platform.growth?.transactions} value={platform.transactions.toString()} />
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

      {/* Compare Modal */}
      <CompareModal />
    </div>
  );
}