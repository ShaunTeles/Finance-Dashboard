'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import { Account, Debt } from '@/types/database';

export interface AccountSummary {
  accounts: Account[];
  debts: Debt[];
  summary: {
    totalBankBalance: number;
    totalCreditCardBalance: number;
    totalInvestmentValue: number;
    totalDebt: number;
  };
}

export const useAccounts = () => {
  const [data, setData] = useState<AccountSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/dashboard/accounts');
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load account data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return { data, loading, error };
};

