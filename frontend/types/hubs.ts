export interface HubCreatorSummary {
  id: number;
  username: string;
  avatar_url?: string | null;
}

export interface HubPublicResponse {
  id: number;
  name: string;
  description?: string | null;
  banner_url?: string | null;
  avatar_url?: string | null;
  creator: HubCreatorSummary;
  created_at: string;
}

export interface HubPrivateResponse extends HubPublicResponse {
  is_active: boolean;
  updated_at: string;
}

export interface HubUpdate {
  name?: string | null;
  description?: string | null;
  banner_url?: string | null;
  avatar_url?: string | null;
}

export interface HubStatsResponse {
  hub_id: number;
  total_subscribers: number;
  total_content_items: number;
  total_plans: number;
}