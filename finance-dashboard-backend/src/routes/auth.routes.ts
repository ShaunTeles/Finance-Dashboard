import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../auth/middleware';

const router = Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', authController.signup);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route   GET /api/auth/session
 * @desc    Get current session
 * @access  Private
 */
router.get('/session', authenticate, authController.getSession);

export default router;

