'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNetWorth } from '@/hooks/useNetWorth';
import { formatCurrency } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

export default function NetWorthChart() {
  const { data, loading, error } = useNetWorth();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data || data.history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Net Worth Trend</h3>
        <p className="text-gray-500">No historical data available</p>
      </div>
    );
  }

  const chartData = data.history.map((item) => ({
    date: format(parseISO(item.date), 'MMM yyyy'),
    netWorth: item.netWorth,
    assets: item.assets,
    liabilities: item.liabilities,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Net Worth Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
          />
          <Line
            type="monotone"
            dataKey="netWorth"
            stroke="#0ea5e9"
            strokeWidth={2}
            name="Net Worth"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

