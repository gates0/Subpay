import { useQuery } from "@tanstack/react-query";
import { exploreApi } from "@/lib/api/Explore";
import type { ExploreHubsParams, ExploreContentParams, ExploreCreatorsParams } from "@/types/explore";
import { queryKeys } from "@/lib/queryKeys";

export function useExploreHubs(params: ExploreHubsParams = {}) {
  return useQuery({
    queryKey: queryKeys.exploreHubs(params),
    queryFn: () => exploreApi.hubs(params),
  });
}

export function useExploreContent(params: ExploreContentParams = {}) {
  return useQuery({
    queryKey: queryKeys.exploreContent(params),
    queryFn: () => exploreApi.content(params),
  });
}

export function useExploreCreators(params: ExploreCreatorsParams = {}) {
  return useQuery({
    queryKey: queryKeys.exploreCreators(params),
    queryFn: () => exploreApi.creators(params),
  });
}