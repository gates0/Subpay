// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationParams {
    skip?: number;
    limit?: number;
  }
  
  // ─── Shared Response ──────────────────────────────────────────────────────────
  
  export interface MessageResponse {
    message: string;
  }
  
  // ─── Enums ────────────────────────────────────────────────────────────────────
  
  export type UserRole = "member" | "creator";
  export type BillingCycle = "monthly" | "yearly" | "one_time";
  export type Currency = "USD" | "EUR" | "GBP" | "NGN";
  export type ContentType = "video" | "image" | "pdf" | "text";
  export type SubscriptionStatus = "active" | "cancelled" | "expired";
  export type TransactionStatus = "pending" | "success" | "failed";
  export type WithdrawalStatus = "pending" | "processing" | "completed" | "failed";
  export type HubSortBy = "newest" | "popular";
  export type NotificationType =
    | "new_content"
    | "payment_success"
    | "payment_failed"
    | "subscription_expiring"
    | "subscription_cancelled"
    | "new_subscriber"
    | "subscriber_cancelled"
    | "withdrawal_update";
  
  // ─── Shared Summaries (reused across domains) ─────────────────────────────────
  
  export interface PlanGateSummary {
    id: number;
    name: string;
  }
  
  export interface PlanSummary {
    id: number;
    name: string;
    price: number;
    currency: string;
    billing_cycle: string;
  }
  
  export interface HubSummary {
    id: number;
    name: string;
    avatar_url?: string | null;
  }
  
  export interface MemberSummary {
    id: number;
    username: string;
    avatar_url?: string | null;
  }