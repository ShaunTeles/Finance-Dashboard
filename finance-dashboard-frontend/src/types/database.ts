// TypeScript types for database tables (shared with backend)
export type UUID = string;

export interface Category {
  id: UUID;
  user_id: UUID;
  name: string;
  parent_id: UUID | null;
  color: string | null;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: UUID;
  user_id: UUID;
  name: string;
  type: 'checking' | 'savings' | 'credit_card' | 'investment' | 'loan' | 'mortgage';
  institution: string | null;
  account_number_last4: string | null;
  balance: number;
  currency: string;
  is_active: boolean;
  api_connection_id: UUID | null;
  created_at: string;
  updated_at: string;
  last_synced_at: string | null;
}

export interface Transaction {
  id: UUID;
  user_id: UUID;
  account_id: UUID;
  category_id: UUID | null;
  amount: number;
  description: string | null;
  transaction_date: string;
  type: 'income' | 'expense' | 'transfer';
  merchant: string | null;
  notes: string | null;
  is_recurring: boolean;
  external_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Investment {
  id: UUID;
  user_id: UUID;
  account_id: UUID | null;
  symbol: string | null;
  name: string;
  type: 'stock' | 'bond' | 'etf' | 'mutual_fund' | 'crypto' | 'other' | null;
  quantity: number;
  purchase_price: number | null;
  current_price: number | null;
  total_value: number | null;
  currency: string;
  last_updated: string;
  created_at: string;
  updated_at: string;
}

export interface Debt {
  id: UUID;
  user_id: UUID;
  account_id: UUID | null;
  name: string;
  type: 'credit_card' | 'loan' | 'mortgage' | 'other';
  principal_balance: number;
  interest_rate: number | null;
  minimum_payment: number | null;
  payment_due_date: string | null;
  next_payment_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: UUID;
  user_id: UUID;
  category_id: UUID | null;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NetWorthSnapshot {
  id: UUID;
  user_id: UUID;
  snapshot_date: string;
  total_assets: number;
  total_liabilities: number;
  net_worth: number;
  created_at: string;
}

export interface UserProfile {
  id: UUID;
  user_id: UUID;
  display_name: string | null;
  currency_preference: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      categories: { Row: Category };
      accounts: { Row: Account };
      transactions: { Row: Transaction };
      investments: { Row: Investment };
      debts: { Row: Debt };
      budgets: { Row: Budget };
      net_worth_snapshots: { Row: NetWorthSnapshot };
      user_profiles: { Row: UserProfile };
    };
  };
}

