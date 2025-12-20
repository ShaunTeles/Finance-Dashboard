import { Router } from 'express';
import * as integrationsController from '../controllers/integrations.controller';
import { authenticate } from '../auth/middleware';

const router = Router();

/**
 * @route   GET /api/integrations/providers
 * @desc    Get list of available providers
 * @access  Public
 */
router.get('/providers', integrationsController.getProviders);

/**
 * @route   GET /api/integrations/truelayer/connect
 * @desc    Initiate TrueLayer OAuth flow
 * @access  Private
 */
router.get('/truelayer/connect', authenticate, integrationsController.initiateTrueLayerConnection);

/**
 * @route   GET /api/integrations/truelayer/callback
 * @desc    Handle TrueLayer OAuth callback
 * @access  Public (called by TrueLayer)
 */
router.get('/truelayer/callback', integrationsController.handleTrueLayerCallback);

/**
 * @route   GET /api/integrations
 * @desc    Get user's connections
 * @access  Private
 */
router.get('/', authenticate, integrationsController.getConnections);

/**
 * @route   DELETE /api/integrations/:id
 * @desc    Delete a connection
 * @access  Private
 */
router.delete('/:id', authenticate, integrationsController.deleteConnection);

/**
 * @route   POST /api/integrations/:id/sync
 * @desc    Trigger manual sync for a connection
 * @access  Private
 */
router.post('/:id/sync', authenticate, integrationsController.syncConnection);

export default router;

