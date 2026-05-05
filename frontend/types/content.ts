import type { ContentType, PlanGateSummary } from "@/types/shared";

export type { ContentType };

export interface ContentResponse {
  id: number;
  hub_id: number;
  plan_id?: number | null;
  view_count: number;
  like_count: number;
  plans: PlanGateSummary[];
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
  plans: PlanGateSummary[];
  title: string;
  description?: string | null;
  content_type: ContentType;
  text_body?: string | null;
  file_url?: string | null;
  thumbnail_url?: string | null;
  is_pinned: boolean;
  view_count: number; // ←
  like_count: number; // ←
  created_at: string;
  is_liked: boolean;
}

export interface ContentUpdate {
  title?: string | null;
  description?: string | null;
  text_body?: string | null;
  thumbnail_url?: string | null;
  plan_ids?: number[] | null;
}

export interface ContentCreateFields {
  title: string;
  content_type: ContentType;
  description?: string;
  text_body?: string;
  plan_id?: number;
  file?: File;
}

// ─── APPEND THESE TO YOUR EXISTING @/types/content.ts ───────────────────────

// ─── Like toggle ─────────────────────────────────────────────────────────────

export interface LikeToggleResponse {
  content_id: number;
  is_liked: boolean;
  like_count: number;
  message: string;
}

// ─── Save / bookmark toggle ─────────────────────────────────────────────────

export interface ToggleSaveResponse {
  content_id: number;
  is_saved: boolean;
  message: string;
}

// ─── Saved content list ──────────────────────────────────────────────────────

export interface SavedHubSummary {
  id: number;
  name: string;
  avatar_url?: string | null;
}

export interface SavedContentDetail {
  id: number;
  title: string;
  description?: string | null;
  content_type: "video" | "image" | "audio" | "pdf" | "text";
  thumbnail_url?: string | null;
  hub: SavedHubSummary;
  created_at: string;
}

export interface SavedContentResponse {
  id: number;
  content: SavedContentDetail;
  saved_at: string;
}

// ─── Comments ────────────────────────────────────────────────────────────────

export interface CommentAuthorSummary {
  id: string; // UUID
  username: string;
  avatar_url?: string | null;
}

export interface CommentResponse {
  id: number;
  content_id: number;
  parent_id?: number | null;
  author: CommentAuthorSummary | null;
  body: string | null;
  is_deleted: boolean;
  reply_count: number;
  created_at: string;
  updated_at: string;
}

export interface ReplyResponse {
  id: number;
  content_id: number;
  parent_id: number;
  author: CommentAuthorSummary | null;
  body: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommentCreate {
  body: string;
}

export interface CommentUpdate {
  body: string;
}
