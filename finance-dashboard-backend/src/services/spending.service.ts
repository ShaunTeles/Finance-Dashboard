import { supabase } from '../config/database';
import { Transaction } from '../database/types';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

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

/**
 * Service for analyzing spending
 */
export class SpendingService {
  /**
   * Get spending analysis for a user
   */
  async getSpendingAnalysis(userId: string, months: number = 6): Promise<SpendingData> {
    const now = new Date();
    const startDate = startOfMonth(subMonths(now, months - 1));
    const endDate = endOfMonth(now);

    // Get transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('amount, transaction_date, type, merchant, category_id, description')
      .eq('user_id', userId)
      .eq('type', 'expense')
      .gte('transaction_date', format(startDate, 'yyyy-MM-dd'))
      .lte('transaction_date', format(endDate, 'yyyy-MM-dd'))
      .order('transaction_date', { ascending: false });

    if (transactionsError) {
      throw new Error(`Failed to fetch transactions: ${transactionsError.message}`);
    }

    const txns = transactions || [];

    // Calculate current month spending
    const currentMonthStart = startOfMonth(now);
    const currentMonthTxns = txns.filter(
      (tx) => new Date(tx.transaction_date) >= currentMonthStart
    );

    const currentMonthTotal = currentMonthTxns.reduce((sum, tx) => sum + tx.amount, 0);

    // Get categories for current month
    const categoryIds = [...new Set(currentMonthTxns.map((tx) => tx.category_id).filter(Boolean))];
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name')
      .in('id', categoryIds);

    const categoryMap = new Map(categories?.map((c) => [c.id, c.name]) || []);

    const spendingByCategory = new Map<string, number>();
    currentMonthTxns.forEach((tx) => {
      const categoryName = tx.category_id ? categoryMap.get(tx.category_id) || 'Uncategorized' : 'Uncategorized';
      spendingByCategory.set(categoryName, (spendingByCategory.get(categoryName) || 0) + tx.amount);
    });

    const byCategory = Array.from(spendingByCategory.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    // Calculate monthly trends
    const monthlySpending = new Map<string, number>();
    txns.forEach((tx) => {
      const month = format(new Date(tx.transaction_date), 'yyyy-MM');
      monthlySpending.set(month, (monthlySpending.get(month) || 0) + tx.amount);
    });

    const trends = Array.from(monthlySpending.entries())
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Top merchants
    const merchantSpending = new Map<string, { amount: number; count: number }>();
    txns.forEach((tx) => {
      const merchant = tx.merchant || tx.description || 'Unknown';
      const existing = merchantSpending.get(merchant) || { amount: 0, count: 0 };
      merchantSpending.set(merchant, {
        amount: existing.amount + tx.amount,
        count: existing.count + 1,
      });
    });

    const topMerchants = Array.from(merchantSpending.entries())
      .map(([merchant, data]) => ({ merchant, ...data }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    return {
      currentMonth: {
        total: currentMonthTotal,
        byCategory,
      },
      trends,
      topMerchants,
    };
  }
}

export const spendingService = new SpendingService();

