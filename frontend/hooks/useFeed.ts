import { useQuery } from "@tanstack/react-query";
import { useMySubscriptions } from "@/hooks/useSubscriptions";
import { contentApi } from "@/lib/api/content";
import { queryKeys } from "@/lib/queryKeys";
import type { ContentPublicResponse } from "@/types/content";

export function useFeedContent() {
  const { data: subscriptions = [], isLoading: subsLoading } = useMySubscriptions();

  const activeHubIds = [
    ...new Set(
      subscriptions
        .filter((s) => s.status === "active")
        .map((s) => s.hub.id)
    ),
  ].sort((a, b) => a - b);

  return useQuery({
    queryKey: [...queryKeys.feed, ...activeHubIds],
    queryFn: async (): Promise<ContentPublicResponse[]> => {
      if (activeHubIds.length === 0) return [];

      const results = await Promise.all(
        activeHubIds.map((hubId) => contentApi.listHubContent(hubId))
      );

      const seen = new Set<number>();
      return results
        .flat()
        .filter((item) => {
          if (seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        })
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    },
    enabled: !subsLoading && activeHubIds.length > 0,
  });
}