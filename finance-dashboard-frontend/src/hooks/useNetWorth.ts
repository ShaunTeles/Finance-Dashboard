'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

export interface NetWorthData {
  current: {
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
  };
  history: Array<{
    date: string;
    netWorth: number;
    assets: number;
    liabilities: number;
  }>;
  breakdown: {
    byAccountType: Record<string, number>;
  };
}

export const useNetWorth = () => {
  const [data, setData] = useState<NetWorthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNetWorth = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/dashboard/net-worth');
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load net worth data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNetWorth();
  }, []);

  return { data, loading, error, refetch: () => {
    const fetchNetWorth = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/dashboard/net-worth');
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load net worth data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNetWorth();
  }};
};

