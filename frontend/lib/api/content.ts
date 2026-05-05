import { api } from "../apiClient";
import type {
  ContentResponse,
  ContentPublicResponse,
  ContentCreateFields,
  ContentUpdate,
  LikeToggleResponse,
  ToggleSaveResponse,
  SavedContentResponse,
  CommentResponse,
  ReplyResponse,
  CommentCreate,
  CommentUpdate,
} from "@/types/content";
import type { MessageResponse } from "@/types/shared";

export const contentApi = {
  // Creator — own hub content
  listMyContent: () => api.get<ContentResponse[]>("/api/v1/hubs/me/content"),

  createContent: (fields: ContentCreateFields) => {
    const form = new FormData();
    form.append("title", fields.title);
    form.append("content_type", fields.content_type);
    if (fields.description) form.append("description", fields.description);
    if (fields.text_body) form.append("text_body", fields.text_body);
    if (fields.plan_id != null) form.append("plan_id", String(fields.plan_id));
    if (fields.file) form.append("file", fields.file);
    return api.postForm<ContentResponse>("/api/v1/hubs/me/content", form);
  },

  getMyContentItem: (contentId: number) =>
    api.get<ContentResponse>(`/api/v1/hubs/me/content/${contentId}`),

  updateContentItem: (contentId: number, body: ContentUpdate) =>
    api.put<ContentResponse>(`/api/v1/hubs/me/content/${contentId}`, body),

  deleteContentItem: (contentId: number) =>
    api.delete<MessageResponse>(`/api/v1/hubs/me/content/${contentId}`),

  togglePublish: (contentId: number) =>
    api.patch<ContentResponse>(`/api/v1/hubs/me/content/${contentId}/publish`),

  togglePin: (contentId: number) =>
    api.patch<ContentResponse>(`/api/v1/hubs/me/content/${contentId}/pin`),

  // Member — subscribed hub content
  listHubContent: (hubId: number) =>
    api.get<ContentPublicResponse[]>(`/api/v1/hubs/${hubId}/content`),

  getHubContentItem: (hubId: number, contentId: number) =>
    api.get<ContentPublicResponse>(
      `/api/v1/hubs/${hubId}/content/${contentId}`,
    ),

  // ─── Like toggle ───────────────────────────────────────────────────────
  toggleLike: (contentId: number) =>
    api.post<LikeToggleResponse>(`/api/v1/content/${contentId}/like`),

  // ─── Save / bookmark toggle ────────────────────────────────────────────
  toggleSave: (contentId: number) =>
    api.post<ToggleSaveResponse>(`/api/v1/content/${contentId}/save`),

  // ─── Saved content list ────────────────────────────────────────────────
  getSavedContent: (params: { skip?: number; limit?: number } = {}) => {
    const { skip = 0, limit = 20 } = params;
    return api.get<SavedContentResponse[]>(
      `/api/v1/users/me/saved?skip=${skip}&limit=${limit}`,
    );
  },

  // ─── Comments ──────────────────────────────────────────────────────────
  getComments: (
    hubId: number,
    contentId: number,
    params: { skip?: number; limit?: number } = {},
  ) => {
    const { skip = 0, limit = 20 } = params;
    return api.get<CommentResponse[]>(
      `/api/v1/hubs/${hubId}/content/${contentId}/comments?skip=${skip}&limit=${limit}`,
    );
  },

  createComment: (hubId: number, contentId: number, body: CommentCreate) =>
    api.post<CommentResponse>(
      `/api/v1/hubs/${hubId}/content/${contentId}/comments`,
      body,
    ),

  // ─── Replies ───────────────────────────────────────────────────────────
  getReplies: (
    hubId: number,
    contentId: number,
    commentId: number,
    params: { skip?: number; limit?: number } = {},
  ) => {
    const { skip = 0, limit = 20 } = params;
    return api.get<ReplyResponse[]>(
      `/api/v1/hubs/${hubId}/content/${contentId}/comments/${commentId}/replies?skip=${skip}&limit=${limit}`,
    );
  },

  createReply: (
    hubId: number,
    contentId: number,
    commentId: number,
    body: CommentCreate,
  ) =>
    api.post<ReplyResponse>(
      `/api/v1/hubs/${hubId}/content/${contentId}/comments/${commentId}/replies`,
      body,
    ),

  // ─── Edit / delete comments ────────────────────────────────────────────
  updateComment: (commentId: number, body: CommentUpdate) =>
    api.patch<CommentResponse | ReplyResponse>(
      `/api/v1/comments/${commentId}`,
      body,
    ),

  deleteComment: (commentId: number) =>
    api.delete<MessageResponse>(`/api/v1/comments/${commentId}`),
};
