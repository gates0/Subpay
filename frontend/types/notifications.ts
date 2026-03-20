import type { NotificationType } from "@/types/shared";

export type { NotificationType };

export interface NotificationResponse {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  entity_type?: string | null;
  entity_id?: number | null;
  is_read: boolean;
  created_at: string;
}

export interface NotificationCountResponse {
  unread_count: number;
}