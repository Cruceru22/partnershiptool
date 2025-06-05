import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

interface Chart {
  id: string;
  title: string;
  options: any;
  data: any;
}

export const SavedCharts: React.FC = () => {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const response = await fetch('/api/charts');
        if (!response.ok) {
          throw new Error('Failed to fetch charts');
        }
        const data = await response.json();
        setCharts(data);
      } catch (error) {
        console.error('Error fetching charts:', error);
        setError('Failed to load charts');
      } finally {
        setLoading(false);
      }
    };

    fetchCharts();
  }, []);

  if (loading) {
    return <div>Loading charts...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (charts.length === 0) {
    return <div>No charts available</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {charts.map((chart) => (
        <div key={chart.id} className="w-full p-4 bg-white rounded-lg shadow">
          <Line options={chart.options} data={chart.data} />
        </div>
      ))}
    </div>
  );
}; 