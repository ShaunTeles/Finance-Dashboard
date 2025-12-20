'use client';

import { useSpending } from '@/hooks/useSpending';
import { formatCurrency } from '@/lib/utils';

export default function SpendingOverview() {
  const { data, loading, error } = useSpending();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-red-600">Error loading spending data</p>
      </div>
    );
  }

  const { currentMonth } = data;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">This Month's Spending</h2>
      <div className="space-y-2">
        <div className="text-3xl font-bold text-gray-900">
          {formatCurrency(currentMonth.total)}
        </div>
        {currentMonth.byCategory.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">By Category</h3>
            <div className="space-y-1">
              {currentMonth.byCategory.slice(0, 5).map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.category}</span>
                  <span className="text-gray-900 font-medium">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

