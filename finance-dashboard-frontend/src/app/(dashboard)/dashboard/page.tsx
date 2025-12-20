import NetWorthCard from '@/components/dashboard/NetWorthCard';
import NetWorthChart from '@/components/dashboard/NetWorthChart';
import SpendingOverview from '@/components/dashboard/SpendingOverview';
import SpendingChart from '@/components/dashboard/SpendingChart';
import AccountSummary from '@/components/dashboard/AccountSummary';
import BudgetStatus from '@/components/dashboard/BudgetStatus';

export default function DashboardPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Your financial overview at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <NetWorthCard />
        <SpendingOverview />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <NetWorthChart />
        <SpendingChart />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AccountSummary />
        <BudgetStatus />
      </div>
    </div>
  );
}

