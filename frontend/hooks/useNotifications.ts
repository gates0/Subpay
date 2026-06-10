import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api/Notifications";
import { tokenStorage } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";

export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: notificationsApi.list,
    enabled: !!tokenStorage.getAccess(),
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: queryKeys.notificationsUnreadCount,
    queryFn: notificationsApi.unreadCount,
    enabled: !!tokenStorage.getAccess(),
    refetchInterval: 1000 * 30,
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.notifications });
      qc.invalidateQueries({ queryKey: queryKeys.notificationsUnreadCount });
    },
  });
}

export function useMarkOneRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: number) =>
      notificationsApi.markOneRead(notificationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.notifications });
      qc.invalidateQueries({ queryKey: queryKeys.notificationsUnreadCount });
    },
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: number) =>
      notificationsApi.delete(notificationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.notifications });
      qc.invalidateQueries({ queryKey: queryKeys.notificationsUnreadCount });
    },
  });
}