import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BlankChartProps {
  title: string;
  isMasterAccount?: boolean;
  onSave?: (chartData: any) => void;
}

export const BlankChart: React.FC<BlankChartProps> = ({
  title,
  isMasterAccount = false,
  onSave
}) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Custom Data',
        data: [0, 0, 0, 0, 0, 0],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const handleSave = () => {
    if (isMasterAccount && onSave) {
      onSave({
        title,
        options,
        data,
      });
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow">
      <Line options={options} data={data} />
      {isMasterAccount && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Chart
          </button>
        </div>
      )}
    </div>
  );
}; 