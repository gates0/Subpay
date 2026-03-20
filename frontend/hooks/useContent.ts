import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contentApi } from "@/lib/api/content";
import { queryKeys } from "@/lib/queryKeys";
import type { ContentCreateFields, ContentUpdate } from "@/types/content";

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
    mutationFn: (fields: ContentCreateFields) =>
      contentApi.createContent(fields),
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
