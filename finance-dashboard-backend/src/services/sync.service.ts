import { supabase, supabaseAdmin } from '../config/database';
import { ConnectorRegistry } from '../integrations/registry';
import { BaseConnector, ConnectorCredentials } from '../integrations/base-connector';
import { decryptJSON, encryptJSON } from '../utils/encryption';
import { ApiConnection, SyncLog } from '../database/types';

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  backoffMultiplier?: number;
}

/**
 * Service for syncing data from API integrations
 */
export class SyncService {
  /**
   * Sync data for a specific API connection
   */
  async syncConnection(
    userId: string,
    connectionId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{ success: boolean; recordsSynced: number; errors: string[] }> {
    // Get connection from database
    const { data: connection, error: connError } = await supabase
      .from('api_connections')
      .select('*')
      .eq('id', connectionId)
      .eq('user_id', userId)
      .single();

    if (connError || !connection) {
      throw new Error(`Connection not found: ${connectionId}`);
    }

    // Create sync log
    const { data: syncLog } = await supabase
      .from('sync_logs')
      .insert({
        user_id: userId,
        api_connection_id: connectionId,
        sync_type: 'transactions',
        status: 'success',
        records_synced: 0,
      })
      .select()
      .single();

    try {
      // Decrypt credentials
      const credentials = decryptJSON<ConnectorCredentials>(connection.encrypted_credentials);

      // Create connector
      const connector = ConnectorRegistry.create(connection.provider, credentials);

      // Perform sync with retry logic
      const result = await this.syncWithRetry(connector, startDate, endDate, {
        maxRetries: 3,
        initialDelay: 1000,
        backoffMultiplier: 2,
      });

      // Update accounts
      let accountsSynced = 0;
      for (const account of result.accounts) {
        account.user_id = userId;
        account.api_connection_id = connectionId;

        const { error: accountError } = await supabase.from('accounts').upsert(
          {
            ...account,
            id: account.id, // Use external ID as primary key for upsert
          },
          {
            onConflict: 'id',
          }
        );

        if (!accountError) {
          accountsSynced++;
        }
      }

      // Update transactions
      let transactionsSynced = 0;
      for (const transaction of result.transactions) {
        transaction.user_id = userId;

        const { error: txError } = await supabase.from('transactions').upsert(
          {
            ...transaction,
            id: transaction.id,
          },
          {
            onConflict: 'external_id,account_id,transaction_date,amount',
          }
        );

        if (!txError) {
          transactionsSynced++;
        }
      }

      const totalSynced = accountsSynced + transactionsSynced;

      // Update sync log
      if (syncLog) {
        await supabase
          .from('sync_logs')
          .update({
            status: result.errors && result.errors.length > 0 ? 'partial' : 'success',
            records_synced: totalSynced,
            error_message: result.errors?.join('; ') || null,
            completed_at: new Date().toISOString(),
          })
          .eq('id', syncLog.id);
      }

      // Update connection last_synced_at
      await supabase
        .from('api_connections')
        .update({
          last_synced_at: new Date().toISOString(),
          connection_status: 'active',
        })
        .eq('id', connectionId);

      return {
        success: true,
        recordsSynced: totalSynced,
        errors: result.errors || [],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Update sync log with error
      if (syncLog) {
        await supabase
          .from('sync_logs')
          .update({
            status: 'error',
            error_message: errorMessage,
            completed_at: new Date().toISOString(),
          })
          .eq('id', syncLog.id);
      }

      // Update connection status
      await supabase
        .from('api_connections')
        .update({
          connection_status: 'error',
          error_message: errorMessage,
        })
        .eq('id', connectionId);

      throw error;
    }
  }

  /**
   * Sync with exponential backoff retry
   */
  private async syncWithRetry(
    connector: BaseConnector,
    startDate?: Date,
    endDate?: Date,
    options: RetryOptions = {}
  ): Promise<{ accounts: any[]; transactions: any[]; errors?: string[] }> {
    const { maxRetries = 3, initialDelay = 1000, backoffMultiplier = 2 } = options;
    const errors: string[] = [];

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await connector.sync(startDate, endDate);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Attempt ${attempt + 1}: ${errorMessage}`);

        if (attempt < maxRetries) {
          const delay = initialDelay * Math.pow(backoffMultiplier, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          throw new Error(`Sync failed after ${maxRetries + 1} attempts: ${errors.join('; ')}`);
        }
      }
    }

    throw new Error('Sync failed');
  }
}

export const syncService = new SyncService();

