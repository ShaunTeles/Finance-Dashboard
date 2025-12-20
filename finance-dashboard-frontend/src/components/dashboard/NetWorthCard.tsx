'use client';

import { useNetWorth } from '@/hooks/useNetWorth';
import { formatCurrency } from '@/lib/utils';

export default function NetWorthCard() {
  const { data, loading, error } = useNetWorth();

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
        <p className="text-red-600">Error loading net worth</p>
      </div>
    );
  }

  const { current } = data;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Net Worth</h2>
      <div className="space-y-2">
        <div className="text-3xl font-bold text-gray-900">
          {formatCurrency(current.netWorth)}
        </div>
        <div className="text-sm text-gray-600">
          <div>Assets: {formatCurrency(current.totalAssets)}</div>
          <div>Liabilities: {formatCurrency(current.totalLiabilities)}</div>
        </div>
      </div>
    </div>
  );
}

