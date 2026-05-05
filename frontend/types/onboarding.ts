import type { UserRole } from "@/types/shared";

export type { UserRole };

export interface OnboardingComplete {
  username: string;
  role: UserRole;
}

export interface OnboardingStatusResponse {
  is_onboarded: boolean;
  email: string;
}

export interface UsernameCheckResponse {
  username: string;
  available: boolean;
}