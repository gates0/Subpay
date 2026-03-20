import type { BillingCycle, Currency } from "@/types/shared";

export type { BillingCycle, Currency };

export interface PlanResponse {
  id: number;
  hub_id: number;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  billing_cycle: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlanCreate {
  name: string;
  description?: string | null;
  price: number;
  currency?: Currency;
  billing_cycle?: BillingCycle;
}

export interface PlanUpdate {
  name?: string | null;
  description?: string | null;
  price?: number | null;
  currency?: Currency | null;
  billing_cycle?: BillingCycle | null;
}