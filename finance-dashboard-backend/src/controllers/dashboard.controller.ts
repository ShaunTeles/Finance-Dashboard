import { Response, NextFunction } from 'express';
import { netWorthService } from '../services/net-worth.service';
import { spendingService } from '../services/spending.service';
import { accountService } from '../services/account.service';
import { createError } from '../middleware/error-handler';
import { AuthRequest } from '../auth/middleware';

/**
 * Get net worth data
 */
export const getNetWorth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Not authenticated', 401);
    }

    const data = await netWorthService.calculateNetWorth(req.user.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get spending analysis
 */
export const getSpending = async (
  req: AuthRequest<{}, {}, {}, { months?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Not authenticated', 401);
    }

    const months = parseInt(req.query.months || '6', 10);
    const data = await spendingService.getSpendingAnalysis(req.user.id, months);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get account summary
 */
export const getAccounts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Not authenticated', 401);
    }

    const data = await accountService.getAccountSummary(req.user.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

