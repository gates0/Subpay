// ─── Creator summary (embedded in hub responses) ─────────────────────────────

export interface HubCreatorSummary {
  id: string;       // UUID
  username: string;
  avatar_url?: string | null;
}

// ─── Explore ──────────────────────────────────────────────────────────────────

export interface ExploreCreatorSummary {
  id: string;       // UUID
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

// ─── Public hub (GET /hubs, GET /hubs/:id) ────────────────────────────────────

export interface HubPublicResponse {
  id: number;
  name: string;
  description?: string | null;
  banner_url?: string | null;
  avatar_url?: string | null;
  creator: HubCreatorSummary;
  created_at: string;
  subscriber_count?: number;
}

// ─── Private hub (GET /hubs/me, PUT /hubs/me) ────────────────────────────────

export interface HubPrivateResponse {
  id: number;
  name: string;
  description?: string | null;
  banner_url?: string | null;
  avatar_url?: string | null;
  creator: HubCreatorSummary;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Update body (PUT /hubs/me) ──────────────────────────────────────────────

export interface HubUpdate {
  name?: string | null;
  description?: string | null;
  banner_url?: string | null;
  avatar_url?: string | null;
}

// ─── Stats (GET /hubs/me/stats) ──────────────────────────────────────────────

export interface HubStatsResponse {
  hub_id: number;
  total_subscribers: number;
  total_content_items: number;
  total_plans: number;
}

// ─── Hub summary (embedded in subscription responses) ────────────────────────

export interface HubSummary {
  id: number;
  name: string;
  avatar_url?: string | null;
}

// ─── Content item (GET /hubs/:id/content) ────────────────────────────────────

export interface HubContentResponse {
  id: number;
  hub_id: number;
  title: string;
  description?: string | null;
  content_type: "video" | "image" | "pdf" | "text";
  text_body?: string | null;
  file_url?: string | null;
  thumbnail_url?: string | null;
  is_pinned: boolean;
  view_count: number;
  like_count: number;
  is_liked: boolean;
  plans: { id: number; name: string }[];
  created_at: string;
}

export interface HubOverviewResponse {
  id: number;
  name: string;
  description?: string | null;
  banner_url?: string | null;
  avatar_url?: string | null;
  creator: HubCreatorSummary;
  subscriber_count: number;
  content_count: number;
  plan_count: number;
  created_at: string;
}