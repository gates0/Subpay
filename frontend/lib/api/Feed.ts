import { api } from "@/lib/apiClient";
import type { ContentPublicResponse } from "@/types/content";

export const feedApi = {
  getHubContent: (hubId: number) =>
    api.get<ContentPublicResponse[]>(`/api/v1/hubs/${hubId}/content`),
};