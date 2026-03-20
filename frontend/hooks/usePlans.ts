import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { plansApi } from "@/lib/api/Plans";
import { queryKeys } from "@/lib/queryKeys";
import type { PlanCreate, PlanUpdate } from "@/types/plans";

// ─── Creator ──────────────────────────────────────────────────────────────────

export function useMyPlans() {
  return useQuery({
    queryKey: queryKeys.plansMine,
    queryFn: plansApi.listMyPlans,
  });
}

export function useMyPlan(planId: number) {
  return useQuery({
    queryKey: queryKeys.planMine(planId),
    queryFn: () => plansApi.getMyPlan(planId),
    enabled: !!planId,
  });
}

export function useCreatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: PlanCreate) => plansApi.createPlan(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.plansMine });
      qc.invalidateQueries({ queryKey: queryKeys.hubOwnStats });
    },
  });
}

export function useUpdatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, body }: { planId: number; body: PlanUpdate }) =>
      plansApi.updatePlan(planId, body),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.planMine(updated.id), updated);
      qc.invalidateQueries({ queryKey: queryKeys.plansMine });
    },
  });
}

export function useDeletePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (planId: number) => plansApi.deletePlan(planId),
    onSuccess: (_data, planId) => {
      qc.removeQueries({ queryKey: queryKeys.planMine(planId) });
      qc.invalidateQueries({ queryKey: queryKeys.plansMine });
      qc.invalidateQueries({ queryKey: queryKeys.hubOwnStats });
    },
  });
}

export function useTogglePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (planId: number) => plansApi.togglePlan(planId),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.planMine(updated.id), updated);
      qc.invalidateQueries({ queryKey: queryKeys.plansMine });
    },
  });
}

// ─── Member ───────────────────────────────────────────────────────────────────

export function useHubPlans(hubId: number) {
  return useQuery({
    queryKey: queryKeys.plansForHub(hubId),
    queryFn: () => plansApi.listHubPlans(hubId),
    enabled: !!hubId,
  });
}