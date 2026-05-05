import type { SubscriptionStatus, PlanSummary, HubSummary, MemberSummary } from "@/types/shared";

export interface SubscriptionResponse {
  id: number;
  status: SubscriptionStatus;
  auto_renew: boolean;
  started_at: string;
  expires_at?: string | null;
  cancelled_at?: string | null;
  created_at: string;
  hub: HubSummary;
  plan: PlanSummary;
}

export interface SubscriptionCreate {
  plan_id: number;
}

export interface SubscriberResponse {
  id: number;
  status: SubscriptionStatus;
  auto_renew: boolean;
  started_at: string;
  expires_at?: string | null;
  cancelled_at?: string | null;
  created_at: string;
  member: MemberSummary;
  plan: PlanSummary;
}