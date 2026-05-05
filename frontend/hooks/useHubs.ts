import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hubsApi } from "@/lib/api/Hubs";
import { queryKeys } from "@/lib/queryKeys";
import type { PaginationParams } from "@/types/shared";

export function useBrowseHubs(params: PaginationParams = {}) {
  const { skip = 0, limit = 20 } = params;
  return useQuery({
    queryKey: queryKeys.hubsList(skip, limit),
    queryFn: () => hubsApi.browse({ skip, limit }),
  });
}

export function useOwnHub() {
  return useQuery({
    queryKey: queryKeys.hubOwn,
    queryFn: hubsApi.getOwn,
  });
}

export function useOwnHubStats() {
  return useQuery({
    queryKey: queryKeys.hubOwnStats,
    queryFn: hubsApi.getOwnStats,
  });
}

export function useHubById(hubId: number) {
  return useQuery({
    queryKey: queryKeys.hubById(hubId),
    queryFn: () => hubsApi.getById(hubId),
    enabled: !!hubId,
  });
}

// ─── Public hub data (visitor-facing hub page) ────────────────────────────────

export function useHubStats(hubId: number) {
  return useQuery({
    queryKey: queryKeys.hubStats(hubId),
    queryFn: () => hubsApi.getStats(hubId),
    enabled: !!hubId,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useUpdateOwnHub() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: hubsApi.updateOwn,
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.hubOwn, updated);
    },
  });
}

export function useHubOverview(hubId: number) {
  return useQuery({
    queryKey: queryKeys.hubOverview(hubId),
    queryFn: () => hubsApi.getHubOverview(hubId),
    enabled: !!hubId,
  });
}