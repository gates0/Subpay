import { api } from "../apiClient";
import type { PlanResponse, PlanCreate, PlanUpdate} from "@/types/plans";
import type { MessageResponse } from "@/types/shared";

export const plansApi = {
  // Creator — own hub plans
  listMyPlans: () => api.get<PlanResponse[]>("/api/v1/hubs/me/plans"),

  createPlan: (body: PlanCreate) =>
    api.post<PlanResponse>("/api/v1/hubs/me/plans", body),

  getMyPlan: (planId: number) =>
    api.get<PlanResponse>(`/api/v1/hubs/me/plans/${planId}`),

  updatePlan: (planId: number, body: PlanUpdate) =>
    api.put<PlanResponse>(`/api/v1/hubs/me/plans/${planId}`, body),

  deletePlan: (planId: number) =>
    api.delete<MessageResponse>(`/api/v1/hubs/me/plans/${planId}`),

  togglePlan: (planId: number) =>
    api.patch<PlanResponse>(`/api/v1/hubs/me/plans/${planId}/toggle`),

  // Member — browse another hub's plans
  listHubPlans: (hubId: number) =>
    api.get<PlanResponse[]>(`/api/v1/hubs/${hubId}/plans`),
};