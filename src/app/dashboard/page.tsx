"use client";

import Link from "next/link";
import { BlankChart } from "@/components/BlankChart";
import { SavedCharts } from "@/components/SavedCharts";

export default async function DashboardPage() {
  const isMasterAccount = true; // You'll need to implement your own logic to determine if this is a master account

  const handleSaveChart = async (chartData: any) => {
    try {
      const response = await fetch('/api/charts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chartData),
      });

      if (!response.ok) {
        throw new Error('Failed to save chart');
      }
    } catch (error) {
      console.error('Error saving chart:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      {isMasterAccount && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Chart</h2>
          <BlankChart 
            title="Custom Chart"
            isMasterAccount={true}
          />
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Saved Charts</h2>
        <SavedCharts />
      </div>
    </div>
  );
} 