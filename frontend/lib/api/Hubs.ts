import { api } from "../apiClient";
import type {
  HubPublicResponse,
  HubPrivateResponse,
  HubUpdate,
  HubStatsResponse,
  HubContentResponse,
  HubOverviewResponse,
} from "@/types/hubs";
import type { PaginationParams } from "@/types/shared";

export const hubsApi = {
  browse: (params: PaginationParams = {}) => {
    const { skip = 0, limit = 20 } = params;
    return api.get<HubPublicResponse[]>(
      `/api/v1/hubs?skip=${skip}&limit=${limit}`,
    );
  },

  getOwn: () => api.get<HubPrivateResponse>("/api/v1/hubs/me"),

  updateOwn: (body: HubUpdate) =>
    api.put<HubPrivateResponse>("/api/v1/hubs/me", body),

  getOwnStats: () => api.get<HubStatsResponse>("/api/v1/hubs/me/stats"),

  getById: (hubId: number) =>
    api.get<HubPublicResponse>(`/api/v1/hubs/${hubId}`),

  getStats: (hubId: number) =>
    api.get<HubStatsResponse>(`/api/v1/hubs/${hubId}/stats`),

  getContent: (hubId: number) =>
    api.get<HubContentResponse[]>(`/api/v1/hubs/${hubId}/content`),

  getHubOverview: (hubId: number) =>
    api.get<HubOverviewResponse>(`/api/v1/hubs/${hubId}/overview`),
};
