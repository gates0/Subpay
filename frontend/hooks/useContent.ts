import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contentApi } from "@/lib/api/content";
import { queryKeys } from "@/lib/queryKeys";
import type { ContentCreateFields, ContentUpdate } from "@/types/content";
  import type { CommentCreate, CommentUpdate } from "@/types/content";

// ─── Creator ──────────────────────────────────────────────────────────────────

export function useMyContent() {
  return useQuery({
    queryKey: queryKeys.contentMine,
    queryFn: contentApi.listMyContent,
  });
}

export function useMyContentItem(contentId: number) {
  return useQuery({
    queryKey: queryKeys.contentMineItem(contentId),
    queryFn: () => contentApi.getMyContentItem(contentId),
    enabled: !!contentId,
  });
}

export function useCreateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      fields,
      publish = false,
    }: {
      fields: ContentCreateFields;
      publish?: boolean;
    }) => {
      const created = await contentApi.createContent(fields);

      if (publish) {
        const published = await contentApi.togglePublish(created.id);
        return published;
      }

      return created;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.contentMine });
      qc.invalidateQueries({ queryKey: queryKeys.hubOwnStats });
    },
  });
}

export function useUpdateContentItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      contentId,
      body,
    }: {
      contentId: number;
      body: ContentUpdate;
    }) => contentApi.updateContentItem(contentId, body),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.contentMineItem(updated.id), updated);
      qc.invalidateQueries({ queryKey: queryKeys.contentMine });
    },
  });
}

export function useDeleteContentItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contentId: number) => contentApi.deleteContentItem(contentId),
    onSuccess: (_data, contentId) => {
      qc.removeQueries({ queryKey: queryKeys.contentMineItem(contentId) });
      qc.invalidateQueries({ queryKey: queryKeys.contentMine });
      qc.invalidateQueries({ queryKey: queryKeys.hubOwnStats });
    },
  });
}

export function useTogglePublish() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contentId: number) => contentApi.togglePublish(contentId),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.contentMineItem(updated.id), updated);
      qc.invalidateQueries({ queryKey: queryKeys.contentMine });
    },
  });
}

export function useTogglePin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contentId: number) => contentApi.togglePin(contentId),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.contentMineItem(updated.id), updated);
      qc.invalidateQueries({ queryKey: queryKeys.contentMine });
    },
  });
}

// ─── Member ───────────────────────────────────────────────────────────────────

export function useHubContent(hubId: number) {
  return useQuery({
    queryKey: queryKeys.contentForHub(hubId),
    queryFn: () => contentApi.listHubContent(hubId),
    enabled: !!hubId,
  });
}

export function useHubContentItem(hubId: number, contentId: number) {
  return useQuery({
    queryKey: queryKeys.contentHubItem(hubId, contentId),
    queryFn: () => contentApi.getHubContentItem(hubId, contentId),
    enabled: !!hubId && !!contentId,
  });
}

// ─── APPEND EVERYTHING BELOW TO YOUR EXISTING hooks/useContent.ts ───────────

// ─── Engagement ───────────────────────────────────────────────────────────────

/** Toggle like on a content item */
export function useToggleLike(hubId: number, contentId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contentIdArg: number) => contentApi.toggleLike(contentIdArg),
    onSuccess: (data) => {
      qc.setQueryData(
        queryKeys.contentHubItem(hubId, contentId),
        (old: any) =>
          old
            ? { ...old, is_liked: data.is_liked, like_count: data.like_count }
            : old,
      );
    },
  });
}

/** Toggle save/bookmark on a content item */
export function useToggleSave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contentId: number) => contentApi.toggleSave(contentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.savedContent });
    },
  });
}

/** Fetch the current user's saved/bookmarked content */
export function useSavedContent(params?: { skip?: number; limit?: number }) {
  return useQuery({
    queryKey: [...queryKeys.savedContent, params],
    queryFn: () => contentApi.getSavedContent(params),
  });
}

// ─── Comments ─────────────────────────────────────────────────────────────────

/** Fetch top-level comments on a content item */
export function useComments(
  hubId: number,
  contentId: number,
  params?: { skip?: number; limit?: number },
) {
  return useQuery({
    queryKey: [...queryKeys.comments(hubId, contentId), params],
    queryFn: () => contentApi.getComments(hubId, contentId, params),
    enabled: !!hubId && !!contentId,
  });
}

/** Fetch replies to a specific comment */
export function useReplies(
  hubId: number,
  contentId: number,
  commentId: number,
  params?: { skip?: number; limit?: number },
) {
  return useQuery({
    queryKey: [...queryKeys.replies(hubId, contentId, commentId), params],
    queryFn: () => contentApi.getReplies(hubId, contentId, commentId, params),
    enabled: !!hubId && !!contentId && !!commentId,
  });
}

/** Post a top-level comment */
export function useCreateComment(hubId: number, contentId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CommentCreate) =>
      contentApi.createComment(hubId, contentId, body),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: queryKeys.comments(hubId, contentId),
      });
    },
  });
}

/** Reply to a top-level comment */
export function useCreateReply(
  hubId: number,
  contentId: number,
  commentId: number,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CommentCreate) =>
      contentApi.createReply(hubId, contentId, commentId, body),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: queryKeys.replies(hubId, contentId, commentId),
      });
      qc.invalidateQueries({
        queryKey: queryKeys.comments(hubId, contentId),
      });
    },
  });
}

/** Edit a comment or reply */
export function useUpdateComment(hubId: number, contentId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      commentId,
      body,
    }: {
      commentId: number;
      body: CommentUpdate;
    }) => contentApi.updateComment(commentId, body),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: queryKeys.comments(hubId, contentId),
      });
    },
  });
}

/** Delete a comment or reply */
export function useDeleteComment(hubId: number, contentId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: number) => contentApi.deleteComment(commentId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: queryKeys.comments(hubId, contentId),
      });
    },
  });
}