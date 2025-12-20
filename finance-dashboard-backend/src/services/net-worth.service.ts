import { supabase } from '../config/database';
import { NetWorthSnapshot } from '../database/types';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

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

/**
 * Service for calculating net worth
 */
export class NetWorthService {
  /**
   * Calculate current net worth for a user
   */
  async calculateNetWorth(userId: string): Promise<NetWorthData> {
    // Get all accounts
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('type, balance, currency')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (accountsError) {
      throw new Error(`Failed to fetch accounts: ${accountsError.message}`);
    }

    // Get all debts
    const { data: debts, error: debtsError } = await supabase
      .from('debts')
      .select('principal_balance')
      .eq('user_id', userId);

    if (debtsError) {
      throw new Error(`Failed to fetch debts: ${debtsError.message}`);
    }

    // Calculate assets (positive balances)
    let totalAssets = 0;
    const assetsByType: Record<string, number> = {};

    accounts?.forEach((account) => {
      if (account.balance > 0) {
        totalAssets += account.balance;
        assetsByType[account.type] = (assetsByType[account.type] || 0) + account.balance;
      }
    });

    // Calculate liabilities (negative balances + debts)
    let totalLiabilities = 0;

    accounts?.forEach((account) => {
      if (account.balance < 0) {
        totalLiabilities += Math.abs(account.balance);
      }
    });

    debts?.forEach((debt) => {
      totalLiabilities += debt.principal_balance;
    });

    const netWorth = totalAssets - totalLiabilities;

    // Get historical snapshots (last 12 months)
    const { data: snapshots, error: snapshotsError } = await supabase
      .from('net_worth_snapshots')
      .select('*')
      .eq('user_id', userId)
      .order('snapshot_date', { ascending: false })
      .limit(12);

    if (snapshotsError) {
      console.error('Error fetching snapshots:', snapshotsError);
    }

    const history = (snapshots || []).map((snapshot) => ({
      date: snapshot.snapshot_date,
      netWorth: snapshot.net_worth,
      assets: snapshot.total_assets,
      liabilities: snapshot.total_liabilities,
    }));

    // Create or update today's snapshot
    const today = format(new Date(), 'yyyy-MM-dd');
    await supabase
      .from('net_worth_snapshots')
      .upsert(
        {
          user_id: userId,
          snapshot_date: today,
          total_assets: totalAssets,
          total_liabilities: totalLiabilities,
          net_worth: netWorth,
        },
        {
          onConflict: 'user_id,snapshot_date',
        }
      )
      .catch((error) => {
        console.error('Error saving snapshot:', error);
      });

    return {
      current: {
        totalAssets,
        totalLiabilities,
        netWorth,
      },
      history: history.reverse(), // Oldest first
      breakdown: {
        byAccountType: assetsByType,
      },
    };
  }
}

export const netWorthService = new NetWorthService();

