import { supabase } from '../config/database';
import { Account, Debt } from '../database/types';

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

/**
 * Service for account aggregation
 */
export class AccountService {
  /**
   * Get account summary for a user
   */
  async getAccountSummary(userId: string): Promise<AccountSummary> {
    // Get all accounts
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('type', { ascending: true })
      .order('name', { ascending: true });

    if (accountsError) {
      throw new Error(`Failed to fetch accounts: ${accountsError.message}`);
    }

    // Get all debts
    const { data: debts, error: debtsError } = await supabase
      .from('debts')
      .select('*')
      .eq('user_id', userId)
      .order('principal_balance', { ascending: false });

    if (debtsError) {
      throw new Error(`Failed to fetch debts: ${debtsError.message}`);
    }

    // Calculate summaries
    let totalBankBalance = 0;
    let totalCreditCardBalance = 0;
    let totalInvestmentValue = 0;
    let totalDebt = 0;

    accounts?.forEach((account) => {
      if (account.type === 'checking' || account.type === 'savings') {
        totalBankBalance += account.balance;
      } else if (account.type === 'credit_card') {
        totalCreditCardBalance += Math.abs(account.balance); // Credit cards are negative
      } else if (account.type === 'investment') {
        totalInvestmentValue += account.balance;
      }
    });

    debts?.forEach((debt) => {
      totalDebt += debt.principal_balance;
    });

    // Include credit card balances in total debt
    totalDebt += totalCreditCardBalance;

    return {
      accounts: accounts || [],
      debts: debts || [],
      summary: {
        totalBankBalance,
        totalCreditCardBalance,
        totalInvestmentValue,
        totalDebt,
      },
    };
  }
}

export const accountService = new AccountService();

