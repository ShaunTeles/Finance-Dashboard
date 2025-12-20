import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/database';
import { encryptJSON, decryptJSON } from '../utils/encryption';
import { ConnectorRegistry } from '../integrations/registry';
import { TrueLayerAuth } from '../integrations/truelayer/auth';
import { syncService } from '../services/sync.service';
import { createError } from '../middleware/error-handler';
import { AuthRequest } from '../auth/middleware';
import { ConnectorCredentials } from '../integrations/base-connector';

/**
 * Get list of available providers
 */
export const getProviders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const providers = ConnectorRegistry.getProviders();
    res.json({ providers });
  } catch (error) {
    next(error);
  }
};

/**
 * Initiate TrueLayer OAuth flow
 */
export const initiateTrueLayerConnection = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Not authenticated', 401);
    }

    const clientId = process.env.TRUELAYER_CLIENT_ID;
    const clientSecret = process.env.TRUELAYER_CLIENT_SECRET;
    const redirectUri = process.env.TRUELAYER_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw createError('TrueLayer configuration missing', 500);
    }

    const auth = new TrueLayerAuth(clientId, clientSecret, redirectUri);
    const state = `${req.user.id}_${Date.now()}`;
    const authUrl = auth.getAuthorizationUrl(state);

    res.json({ authUrl, state });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle TrueLayer OAuth callback
 */
export const handleTrueLayerCallback = async (
  req: Request<{}, {}, {}, { code?: string; state?: string; error?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code, state, error: oauthError } = req.query;

    if (oauthError) {
      throw createError(`OAuth error: ${oauthError}`, 400);
    }

    if (!code || !state) {
      throw createError('Missing code or state parameter', 400);
    }

    // Extract user ID from state
    const userId = state.split('_')[0];
    if (!userId) {
      throw createError('Invalid state parameter', 400);
    }

    const clientId = process.env.TRUELAYER_CLIENT_ID;
    const clientSecret = process.env.TRUELAYER_CLIENT_SECRET;
    const redirectUri = process.env.TRUELAYER_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw createError('TrueLayer configuration missing', 500);
    }

    // Exchange code for tokens
    const auth = new TrueLayerAuth(clientId, clientSecret, redirectUri);
    const authResponse = await auth.exchangeCodeForToken();
    const credentials = auth.toCredentials(authResponse);

    // Encrypt and store credentials
    const encryptedCredentials = encryptJSON(credentials);

    const expiresAt = credentials.expiresAt || new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + (authResponse.expires_in || 3600));

    // Save connection to database
    const { data: connection, error: dbError } = await supabase
      .from('api_connections')
      .insert({
        user_id: userId,
        provider: 'truelayer',
        encrypted_credentials: encryptedCredentials,
        connection_status: 'active',
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (dbError || !connection) {
      throw createError(`Failed to save connection: ${dbError?.message}`, 500);
    }

    res.json({
      message: 'Connection established successfully',
      connectionId: connection.id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's connections
 */
export const getConnections = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Not authenticated', 401);
    }

    const { data: connections, error } = await supabase
      .from('api_connections')
      .select('id, provider, connection_status, last_synced_at, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw createError(`Failed to fetch connections: ${error.message}`, 500);
    }

    res.json({ connections: connections || [] });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a connection
 */
export const deleteConnection = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Not authenticated', 401);
    }

    const { id } = req.params;

    const { error } = await supabase
      .from('api_connections')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      throw createError(`Failed to delete connection: ${error.message}`, 500);
    }

    res.json({ message: 'Connection deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Trigger manual sync for a connection
 */
export const syncConnection = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Not authenticated', 401);
    }

    const { id } = req.params;

    // Start sync in background (in production, use a job queue)
    syncService
      .syncConnection(req.user.id, id)
      .then((result) => {
        console.log(`Sync completed for connection ${id}:`, result);
      })
      .catch((error) => {
        console.error(`Sync failed for connection ${id}:`, error);
      });

    res.json({ message: 'Sync started', connectionId: id });
  } catch (error) {
    next(error);
  }
};

