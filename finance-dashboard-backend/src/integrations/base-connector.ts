import { Account, Transaction, Investment } from '../database/types';

/**
 * Base interface for API connector credentials
 */
export interface ConnectorCredentials {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  [key: string]: unknown;
}

/**
 * Sync result from API connector
 */
export interface SyncResult {
  accounts: Account[];
  transactions: Transaction[];
  investments?: Investment[];
  errors?: string[];
}

/**
 * Abstract base class for API connectors
 * All API integrations should extend this class
 */
export abstract class BaseConnector {
  protected provider: string;
  protected credentials: ConnectorCredentials;

  constructor(provider: string, credentials: ConnectorCredentials) {
    this.provider = provider;
    this.credentials = credentials;
  }

  /**
   * Get the provider name
   */
  getProvider(): string {
    return this.provider;
  }

  /**
   * Check if credentials are valid and not expired
   */
  abstract isAuthenticated(): Promise<boolean>;

  /**
   * Refresh authentication tokens
   */
  abstract refreshAuth(): Promise<ConnectorCredentials>;

  /**
   * Fetch accounts from the provider
   */
  abstract fetchAccounts(): Promise<Account[]>;

  /**
   * Fetch transactions for a specific account
   */
  abstract fetchTransactions(accountId: string, startDate?: Date, endDate?: Date): Promise<Transaction[]>;

  /**
   * Fetch investments (optional, provider-specific)
   */
  abstract fetchInvestments?(): Promise<Investment[]>;

  /**
   * Sync all data from the provider
   */
  async sync(startDate?: Date, endDate?: Date): Promise<SyncResult> {
    try {
      // Check authentication
      if (!(await this.isAuthenticated())) {
        await this.refreshAuth();
      }

      // Fetch accounts
      const accounts = await this.fetchAccounts();

      // Fetch transactions for each account
      const allTransactions: Transaction[] = [];
      for (const account of accounts) {
        try {
          const transactions = await this.fetchTransactions(
            account.id,
            startDate,
            endDate
          );
          allTransactions.push(...transactions);
        } catch (error) {
          console.error(`Error fetching transactions for account ${account.id}:`, error);
        }
      }

      // Fetch investments if supported
      let investments: Investment[] | undefined;
      if (this.fetchInvestments) {
        try {
          investments = await this.fetchInvestments();
        } catch (error) {
          console.error('Error fetching investments:', error);
        }
      }

      return {
        accounts,
        transactions: allTransactions,
        investments,
      };
    } catch (error) {
      throw new Error(`Sync failed for ${this.provider}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Test the connection
   */
  async testConnection(): Promise<boolean> {
    try {
      return await this.isAuthenticated();
    } catch {
      return false;
    }
  }
}

