import { api } from "../apiClient";
import type {
  NotificationResponse,
  NotificationCountResponse,
} from "@/types/notifications";
import type { MessageResponse } from "@/types/shared";

export const notificationsApi = {
  list: () => api.get<NotificationResponse[]>("/api/v1/notifications"),

  unreadCount: () =>
    api.get<NotificationCountResponse>("/api/v1/notifications/unread-count"),

  markAllRead: () =>
    api.patch<MessageResponse>("/api/v1/notifications/read-all"),

  markOneRead: (notificationId: number) =>
    api.patch<NotificationResponse>(
      `/api/v1/notifications/${notificationId}/read`
    ),

  delete: (notificationId: number) =>
    api.delete<MessageResponse>(`/api/v1/notifications/${notificationId}`),
};