import { api } from "../apiClient";
import type {
  UserResponse,
  UserPublicResponse,
  UserUpdateProfile,
  UserChangePassword,
  BecomeCreatorResponse,
} from "@/types/users";
import type { MessageResponse } from "@/types/shared";

export const usersApi = {
  getMe: () => api.get<UserResponse>("/api/v1/users/me"),

  updateMe: (body: UserUpdateProfile) =>
    api.put<UserResponse>("/api/v1/users/me", body),

  deleteAccount: () => api.delete<MessageResponse>("/api/v1/users/me"),

  updatePassword: (body: UserChangePassword) =>
    api.put<MessageResponse>("/api/v1/users/me/password", body),

  becomeCreator: () =>
    api.post<BecomeCreatorResponse>("/api/v1/users/me/become-creator"),

  getProfile: (userId: number) =>
    api.get<UserPublicResponse>(`/api/v1/users/${userId}`),
};