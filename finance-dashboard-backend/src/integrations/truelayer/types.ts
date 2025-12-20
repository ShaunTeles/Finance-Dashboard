/**
 * TrueLayer API types
 * Based on TrueLayer API v3 documentation
 */

export interface TrueLayerAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export interface TrueLayerAccount {
  account_id: string;
  account_type: string;
  account_number?: {
    iban?: string;
    number?: string;
    sort_code?: string;
    swift_bic?: string;
  };
  currency: string;
  display_name: string;
  provider: {
    display_name: string;
    provider_id: string;
  };
  account_holder_name?: string;
}

export interface TrueLayerBalance {
  available: number;
  current: number;
  overdraft?: number;
  currency: string;
}

export interface TrueLayerTransaction {
  transaction_id: string;
  timestamp: string;
  description: string;
  transaction_type: string;
  transaction_category: string;
  amount: number;
  currency: string;
  merchant_name?: string;
  running_balance?: {
    amount: number;
    currency: string;
  };
}

export interface TrueLayerCard {
  card_network: string;
  card_type: string;
  currency: string;
  display_name: string;
  partial_card_number: string;
  name_on_card?: string;
}

export interface TrueLayerInvestment {
  account_id: string;
  account_type: string;
  currency: string;
  display_name: string;
  provider: {
    display_name: string;
    provider_id: string;
  };
}

