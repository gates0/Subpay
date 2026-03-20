import { api } from "../apiClient";
import type {
  SubscriptionResponse,
  SubscriptionCreate,
  SubscriberResponse,
} from "@/types/subscriptions";
import type { MessageResponse } from "@/types/shared";

export const subscriptionsApi = {
  // Member
  create: (body: SubscriptionCreate) =>
    api.post<SubscriptionResponse>("/api/v1/subscriptions", body),

  listMine: () => api.get<SubscriptionResponse[]>("/api/v1/subscriptions/me"),

  getOne: (subscriptionId: number) =>
    api.get<SubscriptionResponse>(
      `/api/v1/subscriptions/me/${subscriptionId}`
    ),

  cancel: (subscriptionId: number) =>
    api.delete<MessageResponse>(
      `/api/v1/subscriptions/me/${subscriptionId}`
    ),

  renew: (subscriptionId: number) =>
    api.post<SubscriptionResponse>(
      `/api/v1/subscriptions/me/${subscriptionId}/renew`
    ),

  // Creator — own hub subscribers
  listSubscribers: () =>
    api.get<SubscriberResponse[]>("/api/v1/hubs/me/subscribers"),

  getSubscriber: (subscriptionId: number) =>
    api.get<SubscriberResponse>(
      `/api/v1/hubs/me/subscribers/${subscriptionId}`
    ),
};