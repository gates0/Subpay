import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { onboardingApi } from "@/lib/api/Onboarding";
import { queryKeys } from "@/lib/queryKeys";
import type { OnboardingComplete } from "@/types/onboarding";

export function useOnboardingStatus() {
  return useQuery({
    queryKey: queryKeys.onboardingStatus,
    queryFn: onboardingApi.status,
  });
}

/** Call on every keystroke — debounce in the component */
export function useCheckUsername(username: string) {
  return useQuery({
    queryKey: queryKeys.usernameCheck(username),
    queryFn: () => onboardingApi.checkUsername(username),
    enabled: username.length >= 3,
    staleTime: 1000 * 30,
  });
}

export function useCompleteOnboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: OnboardingComplete) => onboardingApi.complete(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.authMe });
      qc.invalidateQueries({ queryKey: queryKeys.userMe });
      qc.invalidateQueries({ queryKey: queryKeys.onboardingStatus });
    },
  });
}