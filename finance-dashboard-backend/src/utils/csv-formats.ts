/**
 * Common CSV format definitions for bank exports
 */

export interface CSVFormat {
  name: string;
  dateFormat: string;
  columns: {
    date: string[];
    amount: string[];
    description: string[];
    category?: string[];
    merchant?: string[];
    balance?: string[];
  };
  delimiter?: string;
  skipRows?: number;
}

export const COMMON_CSV_FORMATS: CSVFormat[] = [
  {
    name: 'Chase Bank',
    dateFormat: 'MM/DD/YYYY',
    columns: {
      date: ['Transaction Date', 'Date'],
      amount: ['Amount', 'Debit', 'Credit'],
      description: ['Description', 'Details'],
      category: ['Category', 'Type'],
    },
    delimiter: ',',
  },
  {
    name: 'Bank of America',
    dateFormat: 'MM/DD/YYYY',
    columns: {
      date: ['Date', 'Transaction Date'],
      amount: ['Amount'],
      description: ['Description', 'Payee'],
      category: ['Category'],
    },
    delimiter: ',',
  },
  {
    name: 'Wells Fargo',
    dateFormat: 'MM/DD/YYYY',
    columns: {
      date: ['Date'],
      amount: ['Amount'],
      description: ['Description'],
      category: ['Category'],
    },
    delimiter: ',',
  },
  {
    name: 'Generic CSV',
    dateFormat: 'YYYY-MM-DD',
    columns: {
      date: ['date', 'Date', 'DATE', 'transaction_date', 'Transaction Date'],
      amount: ['amount', 'Amount', 'AMOUNT', 'value', 'Value'],
      description: ['description', 'Description', 'DESCRIPTION', 'memo', 'Memo', 'details', 'Details'],
      category: ['category', 'Category', 'CATEGORY', 'type', 'Type'],
      merchant: ['merchant', 'Merchant', 'MERCHANT', 'payee', 'Payee'],
    },
    delimiter: ',',
  },
];

/**
 * Detect CSV format from headers
 */
export function detectCSVFormat(headers: string[]): CSVFormat | null {
  const normalizedHeaders = headers.map((h) => h.trim().toLowerCase());

  for (const format of COMMON_CSV_FORMATS) {
    let matches = 0;
    const requiredFields = ['date', 'amount', 'description'];

    for (const field of requiredFields) {
      const fieldColumns = format.columns[field as keyof typeof format.columns] || [];
      if (fieldColumns.some((col) => normalizedHeaders.includes(col.toLowerCase()))) {
        matches++;
      }
    }

    // If we match all required fields, this is likely the format
    if (matches === requiredFields.length) {
      return format;
    }
  }

  // Return generic format as fallback
  return COMMON_CSV_FORMATS[COMMON_CSV_FORMATS.length - 1];
}

