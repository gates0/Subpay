import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/Users";
import { tokenStorage } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";
import type { UserUpdateProfile, UserChangePassword } from "@/types/users";

export function useMe() {
  return useQuery({
    queryKey: queryKeys.userMe,
    queryFn: usersApi.getMe,
    enabled: !!tokenStorage.getAccess(),
  });
}

export function useUserProfile(userId: number) {
  return useQuery({
    queryKey: queryKeys.userProfile(userId),
    queryFn: () => usersApi.getProfile(userId),
    enabled: !!userId,
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UserUpdateProfile) => usersApi.updateMe(body),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.userMe, updated);
      qc.setQueryData(queryKeys.authMe, updated);
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (body: UserChangePassword) => usersApi.updatePassword(body),
  });
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.deleteAccount,
    onSuccess: () => {
      tokenStorage.clear();
      qc.clear();
    },
  });
}

export function useBecomeCreator() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.becomeCreator,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.userMe });
      qc.invalidateQueries({ queryKey: queryKeys.authMe });
      qc.invalidateQueries({ queryKey: queryKeys.hubOwn });
    },
  });
}