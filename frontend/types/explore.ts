import type { ContentType, HubSortBy, PaginationParams } from "@/types/shared";
export type { ContentType, HubSortBy, PaginationParams };


export interface ExploreCreatorSummary {
  id: number;
  username: string;
  avatar_url?: string | null;
}

export interface ExploreHubSummary {
  id: number;
  name: string;
  avatar_url?: string | null;
}

export interface HubExploreResponse {
  id: number;
  name: string;
  description?: string | null;
  banner_url?: string | null;
  avatar_url?: string | null;
  creator: ExploreCreatorSummary;
  subscriber_count: number;
  content_count: number;
  plan_count: number;
  starting_from?: number | null;
  currency?: string | null;
  created_at: string;
}

export interface ContentExploreResponse {
  id: number;
  title: string;
  description?: string | null;
  content_type: ContentType;
  thumbnail_url?: string | null;
  hub: ExploreHubSummary;
  created_at: string;
}

export interface CreatorExploreResponse {
  id: number;
  username: string;
  full_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  hub?: ExploreHubSummary | null;
  created_at: string;
}

// ─── Params ───────────────────────────────────────────────────────────────────

export interface ExploreHubsParams {
  q?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: HubSortBy;
  skip?: number;
  limit?: number;
}

export interface ExploreContentParams {
  q?: string;
  content_type?: ContentType;
  skip?: number;
  limit?: number;
}

export interface ExploreCreatorsParams {
  q?: string;
  skip?: number;
  limit?: number;
}