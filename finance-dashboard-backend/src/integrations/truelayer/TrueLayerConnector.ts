import axios, { AxiosInstance } from 'axios';
import { BaseConnector, ConnectorCredentials, SyncResult } from '../base-connector';
import { Account, Transaction, Investment } from '../../database/types';
import {
  TrueLayerAccount,
  TrueLayerBalance,
  TrueLayerTransaction,
  TrueLayerCard,
} from './types';
import { TrueLayerAuth } from './auth';

const TRUELAYER_API_URL = 'https://api.truelayer.com';

export class TrueLayerConnector extends BaseConnector {
  private httpClient: AxiosInstance;
  private auth: TrueLayerAuth;

  constructor(credentials: ConnectorCredentials) {
    super('truelayer', credentials);

    this.httpClient = axios.create({
      baseURL: TRUELAYER_API_URL,
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`,
      },
    });

    // Initialize auth helper
    const clientId = process.env.TRUELAYER_CLIENT_ID || '';
    const clientSecret = process.env.TRUELAYER_CLIENT_SECRET || '';
    const redirectUri = process.env.TRUELAYER_REDIRECT_URI || '';
    this.auth = new TrueLayerAuth(clientId, clientSecret, redirectUri);
  }

  /**
   * Check if authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    if (!this.credentials.accessToken) {
      return false;
    }

    // Check if token is expired
    if (this.credentials.expiresAt) {
      const now = new Date();
      if (now >= this.credentials.expiresAt) {
        return false;
      }
    }

    // Test with a simple API call
    try {
      await this.httpClient.get('/v3/cards');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Refresh authentication
   */
  async refreshAuth(): Promise<ConnectorCredentials> {
    if (!this.credentials.refreshToken) {
      throw new Error('No refresh token available');
    }

    const authResponse = await this.auth.refreshToken(this.credentials.refreshToken);
    this.credentials = this.auth.toCredentials(authResponse);

    // Update HTTP client with new token
    this.httpClient.defaults.headers.Authorization = `Bearer ${this.credentials.accessToken}`;

    return this.credentials;
  }

  /**
   * Fetch accounts
   */
  async fetchAccounts(): Promise<Account[]> {
    try {
      const response = await this.httpClient.get<{ results: TrueLayerAccount[] }>('/v3/accounts');
      const accounts = response.data.results;

      // Fetch balances for each account
      const accountsWithBalances: Account[] = [];

      for (const account of accounts) {
        try {
          const balanceResponse = await this.httpClient.get<TrueLayerBalance>(
            `/v3/accounts/${account.account_id}/balance`
          );
          const balance = balanceResponse.data;

          accountsWithBalances.push({
            id: account.account_id,
            user_id: '', // Will be set by the service
            name: account.display_name,
            type: this.mapAccountType(account.account_type),
            institution: account.provider.display_name,
            account_number_last4: this.extractLast4(account.account_number),
            balance: balance.current || balance.available || 0,
            currency: account.currency,
            is_active: true,
            api_connection_id: null, // Will be set by the service
            created_at: new Date(),
            updated_at: new Date(),
            last_synced_at: new Date(),
          });
        } catch (error) {
          console.error(`Error fetching balance for account ${account.account_id}:`, error);
          // Continue with zero balance
          accountsWithBalances.push({
            id: account.account_id,
            user_id: '',
            name: account.display_name,
            type: this.mapAccountType(account.account_type),
            institution: account.provider.display_name,
            account_number_last4: this.extractLast4(account.account_number),
            balance: 0,
            currency: account.currency,
            is_active: true,
            api_connection_id: null,
            created_at: new Date(),
            updated_at: new Date(),
            last_synced_at: new Date(),
          });
        }
      }

      return accountsWithBalances;
    } catch (error) {
      throw new Error(`Failed to fetch accounts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch transactions
   */
  async fetchTransactions(accountId: string, startDate?: Date, endDate?: Date): Promise<Transaction[]> {
    try {
      const params: Record<string, string> = {};
      if (startDate) {
        params.from = startDate.toISOString();
      }
      if (endDate) {
        params.to = endDate.toISOString();
      }

      const response = await this.httpClient.get<{ results: TrueLayerTransaction[] }>(
        `/v3/accounts/${accountId}/transactions`,
        { params }
      );

      return response.data.results.map((tx) => ({
        id: tx.transaction_id,
        user_id: '', // Will be set by the service
        account_id: accountId,
        category_id: null, // Will be mapped later
        amount: Math.abs(tx.amount),
        description: tx.description,
        transaction_date: new Date(tx.timestamp),
        type: tx.amount >= 0 ? 'income' : 'expense',
        merchant: tx.merchant_name || null,
        notes: null,
        is_recurring: false,
        external_id: tx.transaction_id,
        created_at: new Date(),
        updated_at: new Date(),
      }));
    } catch (error) {
      throw new Error(`Failed to fetch transactions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Map TrueLayer account type to our account type
   */
  private mapAccountType(truelayerType: string): Account['type'] {
    const typeMap: Record<string, Account['type']> = {
      transaction: 'checking',
      savings: 'savings',
      credit_card: 'credit_card',
      investment: 'investment',
      loan: 'loan',
      mortgage: 'mortgage',
    };

    return typeMap[truelayerType.toLowerCase()] || 'checking';
  }

  /**
   * Extract last 4 digits from account number
   */
  private extractLast4(accountNumber?: { iban?: string; number?: string }): string | null {
    if (!accountNumber) return null;

    const number = accountNumber.number || accountNumber.iban;
    if (!number) return null;

    return number.slice(-4);
  }
}

