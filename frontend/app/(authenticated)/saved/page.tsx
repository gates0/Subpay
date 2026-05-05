"use client";

import { useState, useMemo } from "react";
import { useMySubscriptions } from "@/hooks/useSubscriptions";
import { useHubContent } from "@/hooks/useContent";
import type { SubscriptionResponse } from "@/types/subscriptions";
import type { ContentPublicResponse } from "@/types/content";

const cn = (...c: (string | boolean | undefined)[]) =>
  c.filter(Boolean).join(" ");

const HUB_COLORS = [
  "#8A2BE2",
  "#6366F1",
  "#0EA5E9",
  "#EC4899",
  "#F59E0B",
  "#10B981",
];
const hubColor = (id: number) => HUB_COLORS[id % HUB_COLORS.length];
const initial = (str: string) => str.charAt(0).toUpperCase();

const CONTENT_TYPE_LABELS: Record<string, string> = {
  video: "Video",
  image: "Photo",
  pdf: "PDF",
  text: "Article",
};

const TYPE_FILTERS = [
  { key: "all", label: "All types" },
  { key: "video", label: "Videos" },
  { key: "image", label: "Photos" },
  { key: "text", label: "Articles" },
  { key: "pdf", label: "PDFs" },
] as const;

function formatDate(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

// ─── Content icons ────────────────────────────────────────────────────────────
const TYPE_ICONS: Record<string, React.ReactNode> = {
  video: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="currentColor">
      <path d="M8 5v18l16-9L8 5Z" />
    </svg>
  ),
  image: (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="2" y="2" width="22" height="22" rx="3" />
      <circle cx="8" cy="8" r="2.5" />
      <path d="M2 18l6-6 5 5 4-4 7 7" />
    </svg>
  ),
  pdf: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M12 3v14M5 11l7 7 7-7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M3 20h18" strokeLinecap="round" />
    </svg>
  ),
  text: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 7h16M4 12h10M4 17h7" strokeLinecap="round" />
    </svg>
  ),
};

// ─── Single hub content loader ────────────────────────────────────────────────
// Split into a component so each hub's useHubContent hook is called at the top level
interface HubContentLoaderProps {
  hubId: number;
  typeFilter: string;
  view: "grid" | "list";
}

function HubContentLoader({ hubId, typeFilter, view }: HubContentLoaderProps) {
  const { data: content = [], isLoading } = useHubContent(hubId);
  const filtered = content.filter(
    (item) => typeFilter === "all" || item.content_type === typeFilter,
  );

  if (isLoading) {
    return (
      <div
        className={cn(
          view === "grid"
            ? "grid grid-cols-2 md:grid-cols-3 gap-3"
            : "flex flex-col gap-2",
        )}
      >
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "bg-white rounded-2xl border border-[#F0F0F0] animate-pulse",
              view === "grid" ? "h-[180px]" : "h-[60px]",
            )}
          />
        ))}
      </div>
    );
  }

  return <ContentList items={filtered} view={view} />;
}

// ─── Content list (grid or list view) ────────────────────────────────────────
interface ContentListProps {
  items: ContentPublicResponse[];
  view: "grid" | "list";
}

function ContentList({ items, view }: ContentListProps) {
  if (items.length === 0) return null;

  if (view === "grid") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item) => {
          const color = "#8A2BE2"; // items don't carry hub color in ContentPublicResponse
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden group hover:border-[#DDD] hover:shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition-all"
            >
              {/* Thumbnail or placeholder */}
              <div
                className="h-[110px] relative flex items-center justify-center"
                style={{ background: "#8A2BE210" }}
              >
                {item.thumbnail_url ? (
                  <img
                    src={item.thumbnail_url}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : item.content_type === "video" && item.file_url ? (
                  <video
                    src={item.file_url}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : item.content_type === "image" && item.file_url ? (
                  <img
                    src={item.file_url}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="opacity-15 text-[#8A2BE2]">
                    {TYPE_ICONS[item.content_type]}
                  </div>
                )}
                <span className="absolute top-2.5 left-2.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/80 text-[#444] z-10">
                  {CONTENT_TYPE_LABELS[item.content_type] ?? item.content_type}
                </span>
                {item.is_pinned && (
                  <span className="absolute top-2.5 right-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#8A2BE2] text-white z-10">
                    Pinned
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-[12.5px] font-semibold text-[#111] leading-snug line-clamp-2 mb-2">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 text-[10.5px] text-[#AAA]">
                  {item.plans.length ? (
                    <span className="text-[#8A2BE2] font-medium">
                      {item.plans.map((p) => p.name).join(", ")}
                    </span>
                  ) : (
                    <span>All subscribers</span>
                  )}
                  <span className="ml-auto">{formatDate(item.created_at)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl border border-[#F0F0F0] px-4 py-3.5 flex items-center gap-4 group hover:border-[#DDD] transition-all"
        >
          <div className="w-1 h-8 rounded-full shrink-0 bg-[#8A2BE2]" />
          <div className="flex-1 min-w-0">
            <p className="text-[13.5px] font-semibold text-[#111] truncate">
              {item.title}
            </p>
            <div className="flex items-center gap-2 text-[11.5px] text-[#AAA] mt-0.5">
              <span>
                {CONTENT_TYPE_LABELS[item.content_type] ?? item.content_type}
              </span>
              <span>·</span>
              <span>
                {item.plans.map((p) => p.name).join(", ") ?? "All subscribers"}
              </span>
              <span>·</span>
              <span>{formatDate(item.created_at)}</span>
            </div>
          </div>
          {item.is_pinned && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F3E8FF] text-[#8A2BE2] shrink-0">
              Pinned
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── All hubs content (renders one HubContentLoader per subscription) ─────────
interface AllHubsContentProps {
  subscriptions: SubscriptionResponse[];
  typeFilter: string;
  view: "grid" | "list";
}

function AllHubsContent({
  subscriptions,
  typeFilter,
  view,
}: AllHubsContentProps) {
  const uniqueHubs = subscriptions.filter(
    (sub, index, self) => index === self.findIndex((s) => s.hub.id === sub.hub.id),
  );

  return (
    <div className="flex flex-col gap-8">
      {uniqueHubs.map((sub) => (
        <div key={sub.hub.id}>
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
              style={{ background: hubColor(sub.hub.id) }}
            >
              {initial(sub.hub.name)}
            </div>
            <p className="text-[12.5px] font-semibold text-[#555]">
              {sub.hub.name}
            </p>
          </div>
          <HubContentLoader
            hubId={sub.hub.id}
            typeFilter={typeFilter}
            view={view}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SavedPage() {
  const [selectedHubId, setSelectedHubId] = useState<number | "all">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const { data: subscriptions = [], isLoading: subsLoading } =
    useMySubscriptions();
  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "active",
  );

  const uniqueHubs = activeSubscriptions.filter(
    (sub, index, self) => index === self.findIndex((s) => s.hub.id === sub.hub.id),
  );

  const selectedHub = activeSubscriptions.find(
    (s) => s.hub.id === selectedHubId,
  );

  const heading =
    selectedHubId === "all"
      ? "All Content"
      : (selectedHub?.hub.name ?? "Content");

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-[960px] mx-auto px-6 lg:px-10 py-8">
        <div className="flex gap-8">
          {/* ── Left nav — subscribed hubs ── */}
          <div className="hidden lg:flex flex-col w-[180px] shrink-0 gap-0.5 pt-1">
            <p className="text-[11px] font-semibold text-[#BBB] uppercase tracking-wider px-2 mb-2">
              My Hubs
            </p>

            {subsLoading ? (
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-9 rounded-xl bg-[#F0F0F0] animate-pulse mb-1"
                />
              ))
            ) : (
              <>
                {/* All */}
                <button
                  onClick={() => setSelectedHubId("all")}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all text-[13px]",
                    selectedHubId === "all"
                      ? "bg-white border border-[#EEE] text-[#111] font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                      : "text-[#777] hover:text-[#111] font-medium",
                  )}
                >
                  <span>All Hubs</span>
                  <span
                    className={cn(
                      "text-[11px] font-semibold",
                      selectedHubId === "all"
                        ? "text-[#8A2BE2]"
                        : "text-[#CCC]",
                    )}
                  >
                    {uniqueHubs.length}
                  </span>
                </button>

                {/* Per hub */}
                {uniqueHubs.map((sub) => (
                  <button
                    key={sub.hub.id}
                    onClick={() => setSelectedHubId(sub.hub.id)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all text-[13px]",
                      selectedHubId === sub.hub.id
                        ? "bg-white border border-[#EEE] text-[#111] font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                        : "text-[#777] hover:text-[#111] font-medium",
                    )}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0"
                      style={{ background: hubColor(sub.hub.id) }}
                    >
                      {initial(sub.hub.name)}
                    </div>
                    <span className="truncate flex-1">{sub.hub.name}</span>
                  </button>
                ))}

                {uniqueHubs.length === 0 && (
                  <p className="text-[12px] text-[#CCC] px-3 py-2">
                    No active subscriptions.
                  </p>
                )}
              </>
            )}
          </div>

          {/* ── Main ── */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-end justify-between mb-5">
              <div>
                <h1 className="text-[22px] font-bold text-[#111] tracking-tight">
                  {heading}
                </h1>
                {selectedHub && (
                  <p className="text-[13px] text-[#999] mt-0.5">
                    {selectedHub.plan.name} plan
                  </p>
                )}
              </div>
              {/* View toggle */}
              <div className="flex bg-white border border-[#EBEBEB] rounded-xl overflow-hidden">
                {(["grid", "list"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={cn(
                      "px-3 py-2 transition-colors",
                      view === v
                        ? "bg-[#F5F0FF] text-[#8A2BE2]"
                        : "text-[#BBB] hover:text-[#555]",
                    )}
                  >
                    {v === "grid" ? (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect x="1" y="1" width="4.5" height="4.5" rx="1" />
                        <rect x="7.5" y="1" width="4.5" height="4.5" rx="1" />
                        <rect x="1" y="7.5" width="4.5" height="4.5" rx="1" />
                        <rect x="7.5" y="7.5" width="4.5" height="4.5" rx="1" />
                      </svg>
                    ) : (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          d="M1 3h11M1 6.5h11M1 10h11"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Type filter chips */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
              {TYPE_FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setTypeFilter(f.key)}
                  className={cn(
                    "shrink-0 text-[12.5px] font-medium px-4 py-1.5 rounded-full border transition-all",
                    typeFilter === f.key
                      ? "bg-[#111] text-white border-[#111]"
                      : "bg-white text-[#555] border-[#EBEBEB] hover:border-[#aaa]",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* No subscriptions empty state */}
            {!subsLoading && activeSubscriptions.length === 0 && (
              <div className="flex flex-col items-center py-20 text-center">
                <div className="w-12 h-12 rounded-full bg-[#F5F0FF] flex items-center justify-center mb-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="#C4A8E0"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M5 3h10a1 1 0 0 1 1 1v14l-6-4-6 4V4a1 1 0 0 1 1-1Z"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-[14px] font-semibold text-[#333]">
                  No subscriptions yet
                </p>
                <p className="text-[12.5px] text-[#AAA] mt-1">
                  Subscribe to a hub to access its content here.
                </p>
              </div>
            )}

            {/* Content */}
            {!subsLoading &&
              activeSubscriptions.length > 0 &&
              (selectedHubId === "all" ? (
                <AllHubsContent
                  subscriptions={activeSubscriptions}
                  typeFilter={typeFilter}
                  view={view}
                />
              ) : (
                <HubContentLoader
                  hubId={selectedHubId as number}
                  typeFilter={typeFilter}
                  view={view}
                />
              ))}
          </div>
        </div>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
}
