'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

export interface SpendingData {
  currentMonth: {
    total: number;
    byCategory: Array<{ category: string; amount: number }>;
  };
  trends: Array<{
    month: string;
    total: number;
  }>;
  topMerchants: Array<{ merchant: string; amount: number; count: number }>;
}

export const useSpending = (months: number = 6) => {
  const [data, setData] = useState<SpendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpending = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/dashboard/spending?months=${months}`);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load spending data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpending();
  }, [months]);

  return { data, loading, error };
};

