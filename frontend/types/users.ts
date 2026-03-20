import type { UserRole } from "@/types/shared";

export type { UserRole };

export interface UserResponse {
  id: number;
  email: string;
  username?: string | null;
  role?: UserRole | null;
  full_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  is_active: boolean;
  is_verified: boolean;
  is_onboarded: boolean;
  oauth_provider?: string | null;
  created_at: string;
}

export interface UserPublicResponse {
  id: number;
  username: string;
  full_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  role: UserRole;
  created_at: string;
}

export interface UserUpdateProfile {
  full_name?: string | null;
  username?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
}

export interface UserChangePassword {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface BecomeCreatorResponse {
  message: string;
  role: UserRole;
}