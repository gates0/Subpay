import type { ContentType, PlanGateSummary } from "@/types/shared";

export type { ContentType };

export interface ContentResponse {
  id: number;
  hub_id: number;
  plan_id?: number | null;
  plan?: PlanGateSummary | null;
  title: string;
  description?: string | null;
  content_type: ContentType;
  text_body?: string | null;
  file_url?: string | null;
  thumbnail_url?: string | null;
  is_published: boolean;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentPublicResponse {
  id: number;
  hub_id: number;
  plan?: PlanGateSummary | null;
  title: string;
  description?: string | null;
  content_type: ContentType;
  text_body?: string | null;
  file_url?: string | null;
  thumbnail_url?: string | null;
  is_pinned: boolean;
  created_at: string;
}

export interface ContentUpdate {
  title?: string | null;
  description?: string | null;
  text_body?: string | null;
  thumbnail_url?: string | null;
  plan_id?: number | null;
}

export interface ContentCreateFields {
  title: string;
  content_type: ContentType;
  description?: string;
  text_body?: string;
  plan_id?: number;
  file?: File;
}