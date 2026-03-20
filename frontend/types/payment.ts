import type { TransactionStatus, WithdrawalStatus } from "@/types/shared";

export type { TransactionStatus, WithdrawalStatus };

export interface PaymentInitializeRequest {
  plan_id: number;
  callback_url?: string | null;
}

export interface PaymentInitializeResponse {
  reference: string;
  checkout_url: string;
  amount: number;
  currency: string;
}

export interface PlanPaymentSummary {
  id: number;
  name: string;
  billing_cycle: string;
}

export interface HubPaymentSummary {
  id: number;
  name: string;
}

export interface TransactionResponse {
  id: number;
  reference: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  provider: string;
  plan: PlanPaymentSummary;
  hub: HubPaymentSummary;
  created_at: string;
}

export interface EarningsSummaryResponse {
  hub_id: number;
  total_earned: number;
  total_withdrawn: number;
  available_balance: number;
  currency: string;
}

export interface WithdrawalRequest {
  amount: number;
  bank_name: string;
  account_number: string;
  account_name: string;
}

export interface WithdrawalResponse {
  id: number;
  amount: number;
  currency: string;
  status: WithdrawalStatus;
  bank_name?: string | null;
  account_number?: string | null;
  account_name?: string | null;
  note?: string | null;
  created_at: string;
  updated_at: string;
}