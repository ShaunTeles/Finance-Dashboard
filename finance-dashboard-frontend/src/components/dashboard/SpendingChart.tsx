'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSpending } from '@/hooks/useSpending';
import { formatCurrency } from '@/lib/utils';

export default function SpendingChart() {
  const { data, loading, error } = useSpending();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data || data.trends.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Spending Trends</h3>
        <p className="text-gray-500">No spending data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Spending Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.trends}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
          />
          <Bar dataKey="total" fill="#0ea5e9" name="Spending" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

