import { parse } from 'csv-parse/sync';
import { ColumnMapperService, ColumnMapping } from './column-mapper.service';
import { Transaction } from '../database/types';
import { CSVFormat } from '../utils/csv-formats';
import { format, parse as parseDate } from 'date-fns';

export interface ParsedTransaction {
  date: Date;
  amount: number;
  description: string;
  category?: string;
  merchant?: string;
  balance?: number;
  raw: Record<string, string>;
}

export interface ParseResult {
  transactions: ParsedTransaction[];
  errors: Array<{ row: number; error: string }>;
  totalRows: number;
}

/**
 * Service for parsing CSV files
 */
export class CSVParserService {
  private columnMapper: ColumnMapperService;

  constructor() {
    this.columnMapper = new ColumnMapperService();
  }

  /**
   * Parse CSV file content
   */
  parseCSV(
    csvContent: string,
    mapping: ColumnMapping,
    format?: CSVFormat,
    skipRows: number = 0
  ): ParseResult {
    const transactions: ParsedTransaction[] = [];
    const errors: Array<{ row: number; error: string }> = [];

    try {
      // Parse CSV
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        skip_records_with_error: false,
        relax_column_count: true,
      });

      const dateFormat = format?.dateFormat || 'YYYY-MM-DD';

      records.forEach((record: Record<string, string>, index: number) => {
        const rowNumber = index + skipRows + 2; // +2 for header and 1-based indexing

        try {
          // Extract values using mapping
          const dateStr = mapping.date ? record[mapping.date] : null;
          const amountStr = mapping.amount ? record[mapping.amount] : null;
          const description = mapping.description ? record[mapping.description] : '';

          if (!dateStr || !amountStr) {
            errors.push({
              row: rowNumber,
              error: 'Missing required fields (date or amount)',
            });
            return;
          }

          // Parse date
          let date: Date;
          try {
            // Try multiple date formats
            date = this.parseDate(dateStr, dateFormat);
          } catch (error) {
            errors.push({
              row: rowNumber,
              error: `Invalid date format: ${dateStr}`,
            });
            return;
          }

          // Parse amount
          let amount: number;
          try {
            // Remove currency symbols and commas
            const cleanedAmount = amountStr.replace(/[^\d.-]/g, '');
            amount = parseFloat(cleanedAmount);
            if (isNaN(amount)) {
              throw new Error('Not a number');
            }
          } catch (error) {
            errors.push({
              row: rowNumber,
              error: `Invalid amount: ${amountStr}`,
            });
            return;
          }

          // Extract optional fields
          const category = mapping.category ? record[mapping.category] : undefined;
          const merchant = mapping.merchant ? record[mapping.merchant] : undefined;
          const balanceStr = mapping.balance ? record[mapping.balance] : undefined;

          let balance: number | undefined;
          if (balanceStr) {
            try {
              const cleanedBalance = balanceStr.replace(/[^\d.-]/g, '');
              balance = parseFloat(cleanedBalance);
              if (isNaN(balance)) {
                balance = undefined;
              }
            } catch {
              // Ignore balance parsing errors
            }
          }

          transactions.push({
            date,
            amount,
            description: description.trim(),
            category,
            merchant,
            balance,
            raw: record,
          });
        } catch (error) {
          errors.push({
            row: rowNumber,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });

      return {
        transactions,
        errors,
        totalRows: records.length,
      };
    } catch (error) {
      throw new Error(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse date with multiple format attempts
   */
  private parseDate(dateStr: string, preferredFormat: string): Date {
    const formats = [
      preferredFormat,
      'yyyy-MM-dd',
      'MM/dd/yyyy',
      'dd/MM/yyyy',
      'yyyy/MM/dd',
      'dd-MM-yyyy',
      'MM-dd-yyyy',
    ];

    for (const fmt of formats) {
      try {
        return parseDate(dateStr, fmt, new Date());
      } catch {
        // Try next format
      }
    }

    // Fallback to native Date parsing
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) {
      throw new Error(`Unable to parse date: ${dateStr}`);
    }
    return parsed;
  }

  /**
   * Convert parsed transactions to database format
   */
  toDatabaseTransactions(
    parsed: ParsedTransaction[],
    userId: string,
    accountId: string
  ): Omit<Transaction, 'id' | 'created_at' | 'updated_at'>[] {
    return parsed.map((tx) => ({
      user_id: userId,
      account_id: accountId,
      category_id: null, // Will be mapped later
      amount: Math.abs(tx.amount),
      description: tx.description,
      transaction_date: tx.date,
      type: tx.amount >= 0 ? 'income' : 'expense',
      merchant: tx.merchant || null,
      notes: null,
      is_recurring: false,
      external_id: null,
    }));
  }

  /**
   * Deduplicate transactions
   */
  deduplicateTransactions(
    transactions: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>[]
  ): Omit<Transaction, 'id' | 'created_at' | 'updated_at'>[] {
    const seen = new Set<string>();
    const unique: typeof transactions = [];

    for (const tx of transactions) {
      const key = `${tx.account_id}_${tx.transaction_date.toISOString()}_${tx.amount}_${tx.description}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(tx);
      }
    }

    return unique;
  }
}

export const csvParserService = new CSVParserService();

