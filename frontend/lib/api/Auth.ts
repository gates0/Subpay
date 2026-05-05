import { api } from "../apiClient";
import type { UserRegister, UserLogin, TokenResponse, TokenRefreshRequest, PasswordResetRequest, PasswordResetConfirm, ResendVerificationRequest } from "@/types/auth";
import type { UserResponse } from "@/types/users";
import type { MessageResponse } from "@/types/shared";

export const authApi = {
  register: (body: UserRegister) =>
    api.post<UserResponse>("/api/v1/auth/register", body, false),

  verifyEmail: (token: string) =>
    api.get<MessageResponse>(`/api/v1/auth/verify-email?token=${token}`, false),

  resendVerification: (body: ResendVerificationRequest) =>
    api.post<MessageResponse>("/api/v1/auth/resend-verification", body, false),

  login: (body: UserLogin) =>
    api.post<TokenResponse>("/api/v1/auth/login", body, false),

  refresh: (body: TokenRefreshRequest) =>
    api.post<TokenResponse>("/api/v1/auth/refresh", body, false),

  logout: () => api.post<void>("/api/v1/auth/logout"),

  forgotPassword: (body: PasswordResetRequest) =>
    api.post<MessageResponse>("/api/v1/auth/forgot-password", body, false),

  resetPassword: (body: PasswordResetConfirm) =>
    api.post<MessageResponse>("/api/v1/auth/reset-password", body, false),

  me: () => api.get<UserResponse>("/api/v1/auth/me"),

  oauthLogin: (provider: "google" | "github") => {
    window.location.href = `https://subpay.onrender.com/api/v1/auth/${provider}`;
  },
};