export interface ExploreCreatorSummary {
  id: number;
  username: string;
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