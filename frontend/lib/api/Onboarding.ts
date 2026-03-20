import { api } from "../apiClient";
import type {
  OnboardingComplete,
  OnboardingStatusResponse,
  UsernameCheckResponse,
} from "@/types/onboarding";
import type { UserResponse } from "@/types/users";

export const onboardingApi = {
  status: () => api.get<OnboardingStatusResponse>("/api/v1/onboarding/status"),

  checkUsername: (username: string) =>
    api.get<UsernameCheckResponse>(
      `/api/v1/onboarding/check-username?username=${encodeURIComponent(username)}`
    ),

  complete: (body: OnboardingComplete) =>
    api.post<UserResponse>("/api/v1/onboarding/complete", body),
};