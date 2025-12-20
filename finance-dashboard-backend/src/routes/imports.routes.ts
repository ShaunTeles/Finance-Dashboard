import { Router } from 'express';
import * as importsController from '../controllers/imports.controller';
import { authenticate } from '../auth/middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

/**
 * @route   POST /api/imports/upload
 * @desc    Upload CSV file
 * @access  Private
 */
router.post('/upload', authenticate, upload.single('file'), importsController.uploadCSV);

/**
 * @route   GET /api/imports
 * @desc    Get user's imports
 * @access  Private
 */
router.get('/', authenticate, importsController.getImports);

/**
 * @route   GET /api/imports/:id
 * @desc    Get import status
 * @access  Private
 */
router.get('/:id', authenticate, importsController.getImportStatus);

/**
 * @route   PUT /api/imports/:id/mapping
 * @desc    Update column mapping
 * @access  Private
 */
router.put('/:id/mapping', authenticate, importsController.updateMapping);

/**
 * @route   POST /api/imports/:id/process
 * @desc    Process CSV import
 * @access  Private
 */
router.post('/:id/process', authenticate, importsController.processImport);

export default router;

