import { Request, Response, NextFunction } from 'express';
import { supabaseAuth } from '../auth/supabase-client';
import { supabase } from '../config/database';
import { createError } from '../middleware/error-handler';
import { AuthRequest } from '../auth/middleware';

interface SignupBody {
  email: string;
  password: string;
  displayName?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

/**
 * User signup
 */
export const signup = async (
  req: Request<{}, {}, SignupBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      throw createError('Email and password are required', 400);
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabaseAuth.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      throw createError(authError?.message || 'Failed to create user', 400);
    }

    // Create user profile
    if (authData.user) {
      const { error: profileError } = await supabase.from('user_profiles').insert({
        user_id: authData.user.id,
        display_name: displayName || null,
        currency_preference: 'USD',
        timezone: 'UTC',
      });

      if (profileError) {
        console.error('Failed to create user profile:', profileError);
        // Don't fail the request, profile can be created later
      }
    }

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: authData.user?.id,
        email: authData.user?.email,
      },
      session: authData.session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User login
 */
export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError('Email and password are required', 400);
    }

    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user || !data.session) {
      throw createError(error?.message || 'Invalid credentials', 401);
    }

    res.json({
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      session: data.session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User logout
 */
export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.substring(7);

    if (token) {
      await supabaseAuth.auth.signOut();
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current session
 */
export const getSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Not authenticated', 401);
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      // PGRST116 is "not found" - acceptable if profile doesn't exist yet
      console.error('Error fetching user profile:', profileError);
    }

    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        profile: profile || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

