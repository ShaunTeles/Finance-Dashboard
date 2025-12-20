import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../auth/middleware';

const router = Router();

/**
 * @route   GET /api/dashboard/net-worth
 * @desc    Get net worth data
 * @access  Private
 */
router.get('/net-worth', authenticate, dashboardController.getNetWorth);

/**
 * @route   GET /api/dashboard/spending
 * @desc    Get spending analysis
 * @access  Private
 */
router.get('/spending', authenticate, dashboardController.getSpending);

/**
 * @route   GET /api/dashboard/accounts
 * @desc    Get account summary
 * @access  Private
 */
router.get('/accounts', authenticate, dashboardController.getAccounts);

export default router;

