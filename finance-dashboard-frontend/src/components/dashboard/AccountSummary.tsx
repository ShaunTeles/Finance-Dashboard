'use client';

import { useAccounts } from '@/hooks/useAccounts';
import { formatCurrency } from '@/lib/utils';
import { Account } from '@/types/database';

export default function AccountSummary() {
  const { data, loading, error } = useAccounts();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-red-600">Error loading accounts</p>
      </div>
    );
  }

  const { accounts, summary } = data;

  const getAccountTypeLabel = (type: Account['type']): string => {
    const labels: Record<Account['type'], string> = {
      checking: 'Checking',
      savings: 'Savings',
      credit_card: 'Credit Card',
      investment: 'Investment',
      loan: 'Loan',
      mortgage: 'Mortgage',
    };
    return labels[type] || type;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Account Summary</h2>
      
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Bank Balance</div>
            <div className="text-xl font-semibold text-green-600">
              {formatCurrency(summary.totalBankBalance)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Credit Cards</div>
            <div className="text-xl font-semibold text-red-600">
              {formatCurrency(summary.totalCreditCardBalance)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Investments</div>
            <div className="text-xl font-semibold text-blue-600">
              {formatCurrency(summary.totalInvestmentValue)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Total Debt</div>
            <div className="text-xl font-semibold text-red-600">
              {formatCurrency(summary.totalDebt)}
            </div>
          </div>
        </div>
      </div>

      {accounts.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Accounts</h3>
          <div className="space-y-2">
            {accounts.slice(0, 5).map((account) => (
              <div key={account.id} className="flex justify-between items-center py-2 border-b">
                <div>
                  <div className="font-medium text-gray-900">{account.name}</div>
                  <div className="text-sm text-gray-500">
                    {getAccountTypeLabel(account.type)}
                    {account.institution && ` • ${account.institution}`}
                  </div>
                </div>
                <div className={`font-semibold ${
                  account.balance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(account.balance, account.currency)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

