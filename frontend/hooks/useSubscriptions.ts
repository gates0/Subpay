import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subscriptionsApi } from "@/lib/api/subscription";
import { queryKeys } from "@/lib/queryKeys";
import type { SubscriptionCreate } from "@/types/subscriptions";

// ─── Member ───────────────────────────────────────────────────────────────────

export function useMySubscriptions() {
  return useQuery({
    queryKey: queryKeys.subscriptionsMine,
    queryFn: subscriptionsApi.listMine,
  });
}

export function useMySubscription(subscriptionId: number) {
  return useQuery({
    queryKey: queryKeys.subscriptionOne(subscriptionId),
    queryFn: () => subscriptionsApi.getOne(subscriptionId),
    enabled: !!subscriptionId,
  });
}

export function useCreateSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: SubscriptionCreate) => subscriptionsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.subscriptionsMine });
    },
  });
}

export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (subscriptionId: number) =>
      subscriptionsApi.cancel(subscriptionId),
    onSuccess: (_data, subscriptionId) => {
      qc.invalidateQueries({ queryKey: queryKeys.subscriptionOne(subscriptionId) });
      qc.invalidateQueries({ queryKey: queryKeys.subscriptionsMine });
    },
  });
}

export function useRenewSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (subscriptionId: number) =>
      subscriptionsApi.renew(subscriptionId),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.subscriptionOne(updated.id), updated);
      qc.invalidateQueries({ queryKey: queryKeys.subscriptionsMine });
    },
  });
}

// ─── Creator ──────────────────────────────────────────────────────────────────

export function useHubSubscribers() {
  return useQuery({
    queryKey: queryKeys.hubSubscribers,
    queryFn: subscriptionsApi.listSubscribers,
  });
}

export function useHubSubscriber(subscriptionId: number) {
  return useQuery({
    queryKey: queryKeys.hubSubscriber(subscriptionId),
    queryFn: () => subscriptionsApi.getSubscriber(subscriptionId),
    enabled: !!subscriptionId,
  });
}