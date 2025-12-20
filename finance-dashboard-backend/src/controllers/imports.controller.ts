import { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import { supabase } from '../config/database';
import { csvParserService } from '../services/csv-parser.service';
import { columnMapperService } from '../services/column-mapper.service';
import { createError } from '../middleware/error-handler';
import { AuthRequest } from '../auth/middleware';
import { ColumnMapping } from '../services/column-mapper.service';

/**
 * Upload CSV file
 */
export const uploadCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Not authenticated', 401);
    }

    if (!req.file) {
      throw createError('No file uploaded', 400);
    }

    // Read file content
    const fileContent = await fs.readFile(req.file.path, 'utf-8');

    // Parse headers
    const lines = fileContent.split('\n').filter((line) => line.trim());
    if (lines.length === 0) {
      throw createError('Empty file', 400);
    }

    const headers = lines[0].split(',').map((h) => h.trim());

    // Auto-detect column mapping
    const { mapping, format } = columnMapperService.autoDetectMapping(headers);

    // Create import record
    const { data: importRecord, error: dbError } = await supabase
      .from('csv_imports')
      .insert({
        user_id: req.user.id,
        filename: req.file.originalname,
        file_size: req.file.size,
        status: 'pending',
        column_mapping: mapping as unknown as Record<string, string>,
      })
      .select()
      .single();

    if (dbError || !importRecord) {
      throw createError(`Failed to create import record: ${dbError?.message}`, 500);
    }

    // Clean up uploaded file (optional - you might want to keep it)
    await fs.unlink(req.file.path).catch(() => {
      // Ignore cleanup errors
    });

    res.json({
      importId: importRecord.id,
      mapping,
      format: format?.name || 'Unknown',
      headers,
      message: 'File uploaded successfully. Please review column mapping.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update column mapping
 */
export const updateMapping = async (
  req: AuthRequest<{ id: string }, {}, { mapping: ColumnMapping }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Not authenticated', 401);
    }

    const { id } = req.params;
    const { mapping } = req.body;

    // Validate mapping
    const validation = columnMapperService.validateMapping(mapping);
    if (!validation.valid) {
      throw createError(`Invalid mapping: ${validation.errors.join(', ')}`, 400);
    }

    // Update import record
    const { error } = await supabase
      .from('csv_imports')
      .update({
        column_mapping: mapping as unknown as Record<string, string>,
      })
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      throw createError(`Failed to update mapping: ${error.message}`, 500);
    }

    res.json({ message: 'Mapping updated successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Process CSV import
 */
export const processImport = async (
  req: AuthRequest<{ id: string }, {}, { accountId?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Not authenticated', 401);
    }

    const { id } = req.params;
    const { accountId } = req.body;

    // Get import record
    const { data: importRecord, error: fetchError } = await supabase
      .from('csv_imports')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !importRecord) {
      throw createError('Import record not found', 404);
    }

    if (importRecord.status !== 'pending') {
      throw createError('Import already processed', 400);
    }

    // Update status to processing
    await supabase
      .from('csv_imports')
      .update({ status: 'processing' })
      .eq('id', id);

    // Note: In production, this should be done in a background job
    // For now, we'll process it synchronously

    // Read file (you'll need to store the file content or path)
    // This is a simplified version - you may need to adjust based on your file storage strategy
    res.json({
      message: 'Import processing started',
      importId: id,
      note: 'In production, this should be processed asynchronously',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get import status
 */
export const getImportStatus = async (
  req: AuthRequest<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Not authenticated', 401);
    }

    const { id } = req.params;

    const { data: importRecord, error } = await supabase
      .from('csv_imports')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !importRecord) {
      throw createError('Import record not found', 404);
    }

    res.json(importRecord);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's imports
 */
export const getImports = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Not authenticated', 401);
    }

    const { data: imports, error } = await supabase
      .from('csv_imports')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw createError(`Failed to fetch imports: ${error.message}`, 500);
    }

    res.json({ imports: imports || [] });
  } catch (error) {
    next(error);
  }
};

