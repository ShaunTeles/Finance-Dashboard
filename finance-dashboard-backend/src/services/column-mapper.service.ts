import { CSVFormat, COMMON_CSV_FORMATS, detectCSVFormat } from '../utils/csv-formats';

export interface ColumnMapping {
  date: string | null;
  amount: string | null;
  description: string | null;
  category?: string | null;
  merchant?: string | null;
  balance?: string | null;
}

/**
 * Service for mapping CSV columns to standard schema
 */
export class ColumnMapperService {
  /**
   * Auto-detect column mapping from CSV headers
   */
  autoDetectMapping(headers: string[]): { mapping: ColumnMapping; format: CSVFormat | null } {
    const format = detectCSVFormat(headers);
    const normalizedHeaders = headers.map((h) => h.trim());

    const mapping: ColumnMapping = {
      date: null,
      amount: null,
      description: null,
      category: null,
      merchant: null,
      balance: null,
    };

    if (format) {
      // Map columns based on detected format
      for (const header of normalizedHeaders) {
        const normalizedHeader = header.toLowerCase();

        // Date
        if (!mapping.date && format.columns.date.some((col) => normalizedHeader === col.toLowerCase())) {
          mapping.date = header;
        }

        // Amount
        if (!mapping.amount && format.columns.amount.some((col) => normalizedHeader === col.toLowerCase())) {
          mapping.amount = header;
        }

        // Description
        if (!mapping.description && format.columns.description.some((col) => normalizedHeader === col.toLowerCase())) {
          mapping.description = header;
        }

        // Category
        if (format.columns.category && !mapping.category && format.columns.category.some((col) => normalizedHeader === col.toLowerCase())) {
          mapping.category = header;
        }

        // Merchant
        if (format.columns.merchant && !mapping.merchant && format.columns.merchant.some((col) => normalizedHeader === col.toLowerCase())) {
          mapping.merchant = header;
        }

        // Balance
        if (format.columns.balance && !mapping.balance && format.columns.balance.some((col) => normalizedHeader === col.toLowerCase())) {
          mapping.balance = header;
        }
      }
    } else {
      // Fallback: try common column names
      for (const header of normalizedHeaders) {
        const normalizedHeader = header.toLowerCase();

        if (!mapping.date && ['date', 'transaction_date', 'transaction date'].includes(normalizedHeader)) {
          mapping.date = header;
        }
        if (!mapping.amount && ['amount', 'value'].includes(normalizedHeader)) {
          mapping.amount = header;
        }
        if (!mapping.description && ['description', 'memo', 'details', 'note'].includes(normalizedHeader)) {
          mapping.description = header;
        }
      }
    }

    return { mapping, format };
  }

  /**
   * Validate column mapping
   */
  validateMapping(mapping: ColumnMapping): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!mapping.date) {
      errors.push('Date column is required');
    }
    if (!mapping.amount) {
      errors.push('Amount column is required');
    }
    if (!mapping.description) {
      errors.push('Description column is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const columnMapperService = new ColumnMapperService();

