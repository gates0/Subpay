import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentsApi } from "@/lib/api/payments";
import { queryKeys } from "@/lib/queryKeys";
import type { PaymentInitializeRequest, WithdrawalRequest } from "@/types/payment";

// ─── Member ───────────────────────────────────────────────────────────────────

/**
 * Step 1: Initialize a payment. Returns a checkout_url — redirect the user there.
 * After Paystack redirects back, call useVerifyPayment with the reference.
 */
export function useInitializePayment() {
  return useMutation({
    mutationFn: (body: PaymentInitializeRequest) => paymentsApi.initialize(body),
  });
}

/**
 * Step 2: Verify after the user returns from Paystack's hosted page.
 * On success, subscription is created server-side — invalidate subscription cache.
 */
export function useVerifyPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reference: string) => paymentsApi.verify(reference),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.subscriptionsMine });
      qc.invalidateQueries({ queryKey: queryKeys.paymentHistory });
    },
  });
}

export function useMyPaymentHistory() {
  return useQuery({
    queryKey: queryKeys.paymentHistory,
    queryFn: paymentsApi.myHistory,
  });
}

// ─── Creator ──────────────────────────────────────────────────────────────────

export function useHubEarnings() {
  return useQuery({
    queryKey: queryKeys.hubEarnings,
    queryFn: paymentsApi.hubEarnings,
  });
}

export function useHubTransactions() {
  return useQuery({
    queryKey: queryKeys.hubTransactions,
    queryFn: paymentsApi.hubTransactions,
  });
}

export function useWithdraw() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: WithdrawalRequest) => paymentsApi.withdraw(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.hubEarnings });
    },
  });
}