// TypeScript types for database tables
// Generated types matching the PostgreSQL schema

export type UUID = string;

export interface Category {
  id: UUID;
  user_id: UUID;
  name: string;
  parent_id: UUID | null;
  color: string | null;
  icon: string | null;
  created_at: Date;
  updated_at: Date;
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
  created_at: Date;
  updated_at: Date;
  last_synced_at: Date | null;
}

export interface Transaction {
  id: UUID;
  user_id: UUID;
  account_id: UUID;
  category_id: UUID | null;
  amount: number;
  description: string | null;
  transaction_date: Date;
  type: 'income' | 'expense' | 'transfer';
  merchant: string | null;
  notes: string | null;
  is_recurring: boolean;
  external_id: string | null;
  created_at: Date;
  updated_at: Date;
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
  last_updated: Date;
  created_at: Date;
  updated_at: Date;
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
  payment_due_date: Date | null;
  next_payment_date: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface Budget {
  id: UUID;
  user_id: UUID;
  category_id: UUID | null;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  start_date: Date;
  end_date: Date | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface NetWorthSnapshot {
  id: UUID;
  user_id: UUID;
  snapshot_date: Date;
  total_assets: number;
  total_liabilities: number;
  net_worth: number;
  created_at: Date;
}

export interface ApiConnection {
  id: UUID;
  user_id: UUID;
  provider: 'truelayer' | 'plaid' | string;
  encrypted_credentials: string;
  connection_status: 'active' | 'expired' | 'error' | 'disconnected';
  last_synced_at: Date | null;
  expires_at: Date | null;
  error_message: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface SyncLog {
  id: UUID;
  user_id: UUID;
  api_connection_id: UUID | null;
  sync_type: 'accounts' | 'transactions' | 'investments';
  status: 'success' | 'error' | 'partial';
  records_synced: number;
  error_message: string | null;
  started_at: Date;
  completed_at: Date | null;
}

export interface CsvImport {
  id: UUID;
  user_id: UUID;
  account_id: UUID | null;
  filename: string;
  file_size: number | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_rows: number | null;
  imported_rows: number;
  error_rows: number;
  column_mapping: Record<string, string> | null;
  error_message: string | null;
  created_at: Date;
  completed_at: Date | null;
}

export interface UserProfile {
  id: UUID;
  user_id: UUID;
  display_name: string | null;
  currency_preference: string;
  timezone: string;
  created_at: Date;
  updated_at: Date;
}

// Database query result types
export interface Database {
  public: {
    Tables: {
      categories: { Row: Category; Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Category> };
      accounts: { Row: Account; Insert: Omit<Account, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Account> };
      transactions: { Row: Transaction; Insert: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Transaction> };
      investments: { Row: Investment; Insert: Omit<Investment, 'id' | 'created_at' | 'updated_at' | 'last_updated'>; Update: Partial<Investment> };
      debts: { Row: Debt; Insert: Omit<Debt, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Debt> };
      budgets: { Row: Budget; Insert: Omit<Budget, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Budget> };
      net_worth_snapshots: { Row: NetWorthSnapshot; Insert: Omit<NetWorthSnapshot, 'id' | 'created_at'>; Update: Partial<NetWorthSnapshot> };
      api_connections: { Row: ApiConnection; Insert: Omit<ApiConnection, 'id' | 'created_at' | 'updated_at'>; Update: Partial<ApiConnection> };
      sync_logs: { Row: SyncLog; Insert: Omit<SyncLog, 'id' | 'started_at'>; Update: Partial<SyncLog> };
      csv_imports: { Row: CsvImport; Insert: Omit<CsvImport, 'id' | 'created_at'>; Update: Partial<CsvImport> };
      user_profiles: { Row: UserProfile; Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>; Update: Partial<UserProfile> };
    };
  };
}

