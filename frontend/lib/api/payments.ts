import { api } from "../apiClient";
import type {
  PaymentInitializeRequest,
  PaymentInitializeResponse,
  TransactionResponse,
  EarningsSummaryResponse,
  WithdrawalRequest,
  WithdrawalResponse,
} from "@/types/payment";

export const paymentsApi = {
  initialize: (body: PaymentInitializeRequest) =>
    api.post<PaymentInitializeResponse>("/api/v1/payments/initialize", body),

  verify: (reference: string) =>
    api.post<TransactionResponse>(
      `/api/v1/payments/verify?reference=${encodeURIComponent(reference)}`
    ),

  myHistory: () =>
    api.get<TransactionResponse[]>("/api/v1/payments/me/history"),

  // Creator
  hubEarnings: () =>
    api.get<EarningsSummaryResponse>("/api/v1/payments/hubs/me/earnings"),

  hubTransactions: () =>
    api.get<TransactionResponse[]>("/api/v1/payments/hubs/me/transactions"),

  withdraw: (body: WithdrawalRequest) =>
    api.post<WithdrawalResponse>("/api/v1/payments/withdraw", body),
};