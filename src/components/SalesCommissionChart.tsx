"use client";

import React from "react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Define data type
export type DataPoint = {
  name: string;
  sales: number;
  commission: number;
  transactions: number;
};

export type MonthlyDataPoint = {
  month: string;
  sales: number;
  commission: number;
  transactions: number;
};

interface SalesCommissionChartProps {
  platformData?: DataPoint[];
  monthlyData?: MonthlyDataPoint[];
}

// Define chart configuration
const chartConfig = {
  sales: {
    label: "Sales Amount",
    color: "#0088FE"
  },
  commission: {
    label: "Commission",
    color: "#00C49F"
  },
  transactions: {
    label: "Transactions",
    color: "#FF8042"
  }
};

// Create minimal components for the chart to avoid dependency issues
interface ChartContainerProps {
  children: React.ReactNode;
  className?: string;
  title: string;
  subtitle?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ children, className, title, subtitle }) => (
  <div className="w-full h-[400px] border rounded-lg p-4 mb-8 bg-white">
    <h4 className="text-lg font-medium mb-2">{title}</h4>
    {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
    <div className={`w-full ${className || 'h-[300px]'}`}>
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  </div>
);

// Custom formatter for currency values
const currencyFormatter = (value: number) => {
  return `$${value.toFixed(2)}`;
};

// Default data in case none is provided
const defaultPlatformData: DataPoint[] = [
  { name: "sharesale", sales: 0, commission: 0, transactions: 0 },
  { name: "awin", sales: 0, commission: 0, transactions: 0 },
  { name: "impact", sales: 0, commission: 0, transactions: 0 }
];

const defaultMonthlyData: MonthlyDataPoint[] = [
  { month: "Jan", sales: 0, commission: 0, transactions: 0 },
  { month: "Feb", sales: 0, commission: 0, transactions: 0 },
  { month: "Mar", sales: 0, commission: 0, transactions: 0 },
  { month: "Apr", sales: 0, commission: 0, transactions: 0 },
  { month: "May", sales: 0, commission: 0, transactions: 0 },
  { month: "Jun", sales: 0, commission: 0, transactions: 0 },
  { month: "Jul", sales: 0, commission: 0, transactions: 0 }
];

export function SalesCommissionChart({ 
  platformData = defaultPlatformData, 
  monthlyData = defaultMonthlyData 
}: SalesCommissionChartProps) {
  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold mb-6">Sales and Commission Analysis</h3>
      
      {/* Platform Comparison Chart */}
      <ChartContainer 
        title="Platform Comparison" 
        subtitle="Sales and commission by platform"
        className="h-80"
      >
        <BarChart data={platformData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" stroke="#0088FE" />
          <YAxis yAxisId="right" orientation="right" stroke="#00C49F" />
          <Tooltip 
            formatter={currencyFormatter}
            labelFormatter={(label) => `Platform: ${label}`}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="sales" name="Sales Amount" fill="#0088FE" />
          <Bar yAxisId="right" dataKey="commission" name="Commission" fill="#00C49F" />
        </BarChart>
      </ChartContainer>
      
      {/* Monthly Trend Chart */}
      <ChartContainer 
        title="Awin Monthly Performance" 
        subtitle="Monthly sales and commission for Awin"
        className="h-80"
      >
        <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" orientation="left" stroke="#0088FE" />
          <YAxis yAxisId="right" orientation="right" stroke="#00C49F" />
          <Tooltip 
            formatter={currencyFormatter}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="sales" 
            name="Sales Amount"
            stroke="#0088FE" 
            activeDot={{ r: 8 }} 
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="commission" 
            name="Commission"
            stroke="#00C49F" 
          />
        </LineChart>
      </ChartContainer>
      
      {/* Transactions Chart */}
      <ChartContainer 
        title="Transaction Activity" 
        subtitle="Monthly transaction count for Awin"
        className="h-64"
      >
        <AreaChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="transactions" 
            name="Transactions"
            fill="#FF8042" 
            stroke="#FF8042"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
} 