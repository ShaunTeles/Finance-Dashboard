/**
 * Sync scheduler for periodic data synchronization
 * This can be run as a cron job or scheduled task
 */

import { supabase } from '../config/database';
import { syncService } from '../services/sync.service';

/**
 * Sync all active connections for all users
 * Should be called periodically (e.g., every hour)
 */
export async function syncAllConnections(): Promise<void> {
  try {
    // Get all active connections
    const { data: connections, error } = await supabase
      .from('api_connections')
      .select('id, user_id, provider')
      .eq('connection_status', 'active');

    if (error || !connections) {
      console.error('Error fetching connections:', error);
      return;
    }

    console.log(`Syncing ${connections.length} connections...`);

    // Sync each connection
    for (const connection of connections) {
      try {
        await syncService.syncConnection(connection.user_id, connection.id);
        console.log(`Successfully synced connection ${connection.id} (${connection.provider})`);
      } catch (error) {
        console.error(`Error syncing connection ${connection.id}:`, error);
      }
    }

    console.log('Sync completed');
  } catch (error) {
    console.error('Error in syncAllConnections:', error);
  }
}

/**
 * Sync a specific user's connections
 */
export async function syncUserConnections(userId: string): Promise<void> {
  try {
    const { data: connections, error } = await supabase
      .from('api_connections')
      .select('id, provider')
      .eq('user_id', userId)
      .eq('connection_status', 'active');

    if (error || !connections) {
      console.error('Error fetching user connections:', error);
      return;
    }

    for (const connection of connections) {
      try {
        await syncService.syncConnection(userId, connection.id);
      } catch (error) {
        console.error(`Error syncing connection ${connection.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in syncUserConnections:', error);
  }
}

