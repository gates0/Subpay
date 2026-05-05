export const queryKeys = {
  // Auth
  authMe: ["auth", "me"] as const,

  // Onboarding
  onboardingStatus: ["onboarding", "status"] as const,
  usernameCheck: (username: string) =>
    ["onboarding", "username", username] as const,

  // Users
  userMe: ["users", "me"] as const,
  userProfile: (userId: number) => ["users", userId] as const,

  // Hubs
  hubsList: (skip: number, limit: number) =>
    ["hubs", "list", { skip, limit }] as const,
  hubOwn: ["hubs", "me"] as const,
  hubOwnStats: ["hubs", "me", "stats"] as const,
  hubById: (hubId: number) => ["hub", hubId],
  hubStats: (hubId: number) => ["hubs", hubId, "stats"] as const,
  hubContent: (hubId: number) => ["hubs", hubId, "content"] as const,

  // Plans
  plansMine: ["plans", "mine"] as const,
  planMine: (planId: number) => ["plans", "mine", planId] as const,
  plansForHub: (hubId: number) => ["plans", "hub", hubId] as const,

  // Subscriptions
  subscriptionsMine: ["subscriptions", "mine"] as const,
  subscriptionOne: (id: number) => ["subscriptions", "mine", id] as const,
  hubSubscribers: ["subscriptions", "subscribers"] as const,
  hubSubscriber: (id: number) => ["subscriptions", "subscribers", id] as const,

  // Content
  contentMine: ["content", "mine"] as const,
  contentMineItem: (id: number) => ["content", "mine", id] as const,
  contentForHub: (hubId: number) => ["content", "hub", hubId] as const,
  contentHubItem: (hubId: number, contentId: number) => [
    "content-hub-item",
    hubId,
    contentId,
  ],

  // Payments
  paymentHistory: ["payments", "history"] as const,
  hubEarnings: ["payments", "earnings"] as const,
  hubTransactions: ["payments", "transactions"] as const,

  // Notifications
  notifications: ["notifications"] as const,
  notificationsUnreadCount: ["notifications", "unread-count"] as const,

  // Explore
  exploreHubs: (params: object) => ["explore", "hubs", params] as const,
  exploreContent: (params: object) => ["explore", "content", params] as const,
  exploreCreators: (params: object) => ["explore", "creators", params] as const,

  // Feed
  feed: ["feed"],

  comments: (hubId: number, contentId: number) =>
    ["comments", hubId, contentId] as const,
  replies: (hubId: number, contentId: number, commentId: number) =>
    ["replies", hubId, contentId, commentId] as const,
  savedContent: ["saved-content"] as const,

  hubOverview: (hubId: number) => ["hub", "overview", hubId],
};
