import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/Auth";
import { tokenStorage } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";
import type {
  UserRegister,
  UserLogin,
  PasswordResetRequest,
  PasswordResetConfirm,
  ResendVerificationRequest,
} from "@/types/auth";

// ─── Queries ──────────────────────────────────────────────────────────────────

const ME_CACHE_KEY = "hubora_me"

/** Currently authenticated user's profile (via /auth/me — accessible pre-onboarding) */
export function useAuthMe() {
  return useQuery({
    queryKey: queryKeys.authMe,
    queryFn: async () => {
      const data = await authApi.me()
      localStorage.setItem(ME_CACHE_KEY, JSON.stringify(data))
      return data
    },
    initialData: () => {
      if (typeof window === "undefined") return undefined
      const cached = localStorage.getItem(ME_CACHE_KEY)
      return cached ? JSON.parse(cached) : undefined
    },
    initialDataUpdatedAt: 0,
    enabled: !!tokenStorage.getAccess(),
    staleTime: 1000 * 30,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useRegister() {
  return useMutation({
    mutationFn: (body: UserRegister) => authApi.register(body),
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UserLogin) => authApi.login(body),
    onSuccess: (data) => {
      tokenStorage.set(data.access_token, data.refresh_token);
      qc.invalidateQueries({ queryKey: queryKeys.authMe });
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      tokenStorage.clear();
      qc.clear();
    },
  });
}

export function useRefreshTokens() {
  return useMutation({
    mutationFn: authApi.refresh,
    onSuccess: (data) => {
      tokenStorage.set(data.access_token, data.refresh_token);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (body: PasswordResetRequest) => authApi.forgotPassword(body),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (body: PasswordResetConfirm) => authApi.resetPassword(body),
  });
}

export function useVerifyEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: (data) => {
      tokenStorage.set(data.access_token, data.refresh_token);
      qc.invalidateQueries({ queryKey: queryKeys.authMe });
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (body: ResendVerificationRequest) =>
      authApi.resendVerification(body),
  });
}
