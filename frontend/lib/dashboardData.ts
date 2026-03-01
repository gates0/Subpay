import { IconPaths } from "@/components/dashboard/shared/Icon";
import {
  ContentType,
  FeedItem,
  ContentItem,
  MemberSubscription,
  DiscoverHub,
  CreatorStat,
  PlanSummary,
  PlanDetail,
  Subscriber,
} from "@/types/dashboard";

// ─── Content type helpers ─────────────────────────────────────────────────────
export const contentTypeIcon: Record<ContentType, string> = {
  video: IconPaths.play,
  pdf:   IconPaths.file,
  image: IconPaths.image,
  text:  IconPaths.file,
};

export const contentTypeBadge: Record<ContentType, string> = {
  video: "bg-red-50 text-red-500",
  pdf:   "bg-blue-50 text-blue-500",
  image: "bg-emerald-50 text-emerald-500",
  text:  "bg-purple-50 text-purple-500",
};

// ─── Member data ──────────────────────────────────────────────────────────────
export const memberSubscriptions: MemberSubscription[] = [
  {
    id: 1,
    creator: "Aria Chen",
    handle: "@ariac",
    avatar: "AC",
    color: "bg-violet-500",
    plan: "Premium",
    price: "$12/mo",
    renewsIn: "14 days",
    content: 48,
    newContent: 3,
  },
  {
    id: 2,
    creator: "Marcus Webb",
    handle: "@mwebb",
    avatar: "MW",
    color: "bg-amber-500",
    plan: "Standard",
    price: "$7/mo",
    renewsIn: "22 days",
    content: 31,
    newContent: 1,
  },
  {
    id: 3,
    creator: "Lena Park",
    handle: "@lenapark",
    avatar: "LP",
    color: "bg-emerald-500",
    plan: "Basic",
    price: "$4/mo",
    renewsIn: "5 days",
    content: 12,
    newContent: 0,
  },
];

export const feedItems: FeedItem[] = [
  {
    id: 1,
    creator: "Aria Chen",
    avatar: "AC",
    color: "bg-violet-500",
    type: "video",
    title: "Mastering Light in Portrait Photography",
    time: "2h ago",
    locked: false,
  },
  {
    id: 2,
    creator: "Marcus Webb",
    avatar: "MW",
    color: "bg-amber-500",
    type: "pdf",
    title: "2024 Brand Strategy Workbook",
    time: "5h ago",
    locked: false,
  },
  {
    id: 3,
    creator: "Lena Park",
    avatar: "LP",
    color: "bg-emerald-500",
    type: "image",
    title: "Behind the Scenes — Tokyo Series",
    time: "1d ago",
    locked: false,
  },
  {
    id: 4,
    creator: "Aria Chen",
    avatar: "AC",
    color: "bg-violet-500",
    type: "text",
    title: "Why I Switched to Film (Premium)",
    time: "2d ago",
    locked: true,
  },
];

export const discoverHubs: DiscoverHub[] = [
  {
    id: 1,
    name: "Dev Diaries",
    creator: "Noah Kim",
    avatar: "NK",
    color: "bg-blue-500",
    category: "Tech",
    subscribers: "2.4k",
    plans: [4, 8, 15],
  },
  {
    id: 2,
    name: "The Palette",
    creator: "Sia Osei",
    avatar: "SO",
    color: "bg-pink-500",
    category: "Art",
    subscribers: "1.1k",
    plans: [5, 12],
  },
  {
    id: 3,
    name: "Finance Unlocked",
    creator: "Ray Torres",
    avatar: "RT",
    color: "bg-teal-500",
    category: "Finance",
    subscribers: "5.8k",
    plans: [6, 14, 25],
  },
];

export const discoverCategories: string[] = [
  "All", "Tech", "Art", "Finance", "Fitness", "Music", "Writing",
];

// ─── Creator data ─────────────────────────────────────────────────────────────
export const creatorStats: CreatorStat[] = [
  { label: "Total Subscribers", value: "1,284", change: "+12%", up: true },
  { label: "Monthly Revenue",   value: "$4,860", change: "+8%",  up: true },
  { label: "Content Pieces",    value: "73",     change: "+5",   up: true },
  { label: "Avg Engagement",    value: "64%",    change: "-2%",  up: false },
];

export const creatorPlansSummary: PlanSummary[] = [
  { name: "Basic",    price: 5,  subscribers: 643, color: "bg-slate-100 border-slate-200", badge: "bg-slate-200 text-slate-700" },
  { name: "Standard", price: 12, subscribers: 481, color: "bg-blue-50 border-blue-200",   badge: "bg-blue-100 text-blue-700" },
  { name: "Premium",  price: 25, subscribers: 160, color: "bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-700" },
];

export const creatorPlansDetail: PlanDetail[] = [
  {
    name: "Basic",
    price: 5,
    billing: "monthly",
    description: "Access to all free content and text posts",
    perks: ["Text posts", "Free videos", "Community access"],
    subscribers: 643,
    color: "border-gray-200 bg-white",
  },
  {
    name: "Standard",
    price: 12,
    billing: "monthly",
    description: "Everything in Basic plus exclusive video content",
    perks: ["Everything in Basic", "Exclusive videos", "PDF downloads", "Early access"],
    subscribers: 481,
    color: "border-blue-200 bg-blue-50",
  },
  {
    name: "Premium",
    price: 25,
    billing: "monthly",
    description: "Full access to all content, live sessions, DMs",
    perks: ["Everything in Standard", "Live sessions", "Direct messaging", "Behind the scenes"],
    subscribers: 160,
    color: "border-amber-200 bg-amber-50",
  },
];

export const recentContent: ContentItem[] = [
  { title: "Deep Dive: CSS Grid Mastery",   type: "video", views: 412, date: "Today",     plan: "All" },
  { title: "Q4 Roadmap PDF",                type: "pdf",   views: 280, date: "Yesterday", plan: "Standard+" },
  { title: "Code Review Session Recap",     type: "text",  views: 198, date: "3d ago",    plan: "Premium" },
  { title: "UI Kit Vol. 3 Preview",         type: "image", views: 543, date: "5d ago",    plan: "All" },
];

export const subscribersList: Subscriber[] = [
  { name: "Alex Morgan", avatar: "AM", avatarColor: "bg-violet-500", plan: "Premium",  joined: "Jan 12, 2025", amount: "$25/mo" },
  { name: "Sam Reeves",  avatar: "SR", avatarColor: "bg-teal-500",   plan: "Standard", joined: "Feb 3, 2025",  amount: "$12/mo" },
  { name: "Chris Noel",  avatar: "CN", avatarColor: "bg-blue-500",   plan: "Basic",    joined: "Feb 14, 2025", amount: "$5/mo" },
  { name: "Petra Lund",  avatar: "PL", avatarColor: "bg-pink-500",   plan: "Standard", joined: "Feb 18, 2025", amount: "$12/mo" },
  { name: "Yuki Tanaka", avatar: "YT", avatarColor: "bg-orange-500", plan: "Premium",  joined: "Feb 22, 2025", amount: "$25/mo" },
];

export const subscriberPlanBadge: Record<string, string> = {
  Premium:  "bg-amber-50 text-amber-700",
  Standard: "bg-blue-50 text-blue-700",
  Basic:    "bg-gray-100 text-gray-600",
};

export const contentFilterTypes: string[] = ["All", "Video", "Image", "PDF", "Text"];