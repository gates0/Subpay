// ─── View & Navigation ────────────────────────────────────────────────────────
export type ViewType = "member" | "creator";

export type MemberNavId = "feed" | "discover" | "subscriptions" | "notifications" | "settings";
export type CreatorNavId = "overview" | "content" | "subscribers" | "plans" | "analytics" | "settings";
export type NavId = MemberNavId | CreatorNavId;

export interface NavItem {
  id: NavId;
  label: string;
  icon: string;
  badge?: number;
}

// ─── Content ──────────────────────────────────────────────────────────────────
export type ContentType = "video" | "pdf" | "image" | "text";

export interface FeedItem {
  id: number;
  creator: string;
  avatar: string;
  color: string;
  type: ContentType;
  title: string;
  time: string;
  locked: boolean;
}

export interface ContentItem {
  title: string;
  type: ContentType;
  views: number;
  date: string;
  plan: string;
}

// ─── Member ───────────────────────────────────────────────────────────────────
export interface MemberSubscription {
  id: number;
  creator: string;
  handle: string;
  avatar: string;
  color: string;
  plan: string;
  price: string;
  renewsIn: string;
  content: number;
  newContent: number;
}

export interface DiscoverHub {
  id: number;
  name: string;
  creator: string;
  avatar: string;
  color: string;
  category: string;
  subscribers: string;
  plans: number[];
}

// ─── Creator ──────────────────────────────────────────────────────────────────
export interface CreatorStat {
  label: string;
  value: string;
  change: string;
  up: boolean;
}

export interface PlanSummary {
  name: string;
  price: number;
  subscribers: number;
  color: string;
  badge: string;
}

export interface PlanDetail {
  name: string;
  price: number;
  billing: string;
  description: string;
  perks: string[];
  subscribers: number;
  color: string;
}

export interface Subscriber {
  name: string;
  avatar: string;
  avatarColor: string;
  plan: string;
  joined: string;
  amount: string;
}