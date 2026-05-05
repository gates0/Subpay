import { api } from "../apiClient";
import type {
  HubExploreResponse,
  ContentExploreResponse,
  CreatorExploreResponse,
  ContentType,
  HubSortBy,
  PaginationParams,
} from "@/types/explore";

export interface ExploreHubsParams extends PaginationParams {
  q?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: HubSortBy;
}

export interface ExploreContentParams extends PaginationParams {
  q?: string;
  content_type?: ContentType;
}

export interface ExploreCreatorsParams extends PaginationParams {
  q?: string;
}

function buildQuery(params: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      parts.push(`${key}=${encodeURIComponent(String(value))}`);
    }
  }
  return parts.length ? `?${parts.join("&")}` : "";
}

export const exploreApi = {
  hubs: (params: ExploreHubsParams = {}) =>
    api.get<HubExploreResponse[]>(
      `/api/v1/explore/hubs${buildQuery({ skip: 0, limit: 20, ...params })}`
    ),

  content: (params: ExploreContentParams = {}) =>
    api.get<ContentExploreResponse[]>(
      `/api/v1/explore/content${buildQuery({ skip: 0, limit: 20, ...params })}`
    ),

  creators: (params: ExploreCreatorsParams = {}) =>
    api.get<CreatorExploreResponse[]>(
      `/api/v1/explore/creators${buildQuery({ skip: 0, limit: 20, ...params })}`
    ),
};