"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useFeedContent } from "@/hooks/useFeed";
import { useExploreContent, useExploreCreators } from "@/hooks/useExplore";
import { useMySubscriptions } from "@/hooks/useSubscriptions";
import type { ContentPublicResponse } from "@/types/content";
import type { ContentExploreResponse } from "@/types/explore";
import type { SubscriptionResponse } from "@/types/subscriptions";

const initial = (s: string) => s.charAt(0).toUpperCase();
const HUB_COLORS = ["#8A2BE2", "#6366F1", "#0EA5E9", "#EC4899", "#F59E0B", "#10B981"];
const hubColor = (id: number) => HUB_COLORS[id % HUB_COLORS.length];

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

const TYPE_META: Record<string, { label: string; play?: boolean }> = {
  video: { label: "Video", play: true },
  image: { label: "Photo" },
  pdf: { label: "PDF" },
  text: { label: "Article" },
};

// ─── Feed Card ────────────────────────────────────────────────────────────────
function FeedCard({ item, onClick }: { item: ContentPublicResponse; onClick: () => void }) {
  const color = hubColor(item.hub_id);
  const meta = TYPE_META[item.content_type] ?? TYPE_META.text;

  return (
    <article
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer group"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)")}
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden flex items-center justify-center" style={{ background: `${color}12` }}>
        {item.thumbnail_url ? (
          <Image src={item.thumbnail_url} alt={item.title} fill unoptimized className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:640px) 100vw, 50vw" />
        ) : item.content_type === "video" && item.file_url ? (
          <video src={item.file_url} className="absolute inset-0 w-full h-full object-cover" muted playsInline preload="metadata" />
        ) : item.content_type === "image" && item.file_url ? (
          <Image src={item.file_url} alt={item.title} fill unoptimized className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:640px) 100vw, 50vw" />
        ) : (
          <div className="flex flex-col items-center gap-2">
            {meta.play ? (
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: color, boxShadow: `0 6px 20px ${color}55` }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M4 2.5v11l9-5.5L4 2.5Z" /></svg>
              </div>
            ) : item.content_type === "text" ? (
              <div className="w-16 flex flex-col gap-1.5 opacity-25">
                {[100, 80, 95, 65].map((w, i) => <div key={i} className="h-1.5 rounded-full" style={{ width: `${w}%`, background: color }} />)}
              </div>
            ) : (
              <div className="opacity-20 text-[40px] font-black" style={{ color }}>{meta.label[0]}</div>
            )}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Type chip */}
        <span className="absolute top-3 left-3 text-[10.5px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: color, boxShadow: `0 2px 8px ${color}55` }}>
          {meta.label}
        </span>

        {item.plans.length > 0 && (
          <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-[#8A2BE2]">
            {item.plans[0].name}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-3.5">
        <h3 className="text-[13.5px] font-bold text-[#170C28] leading-snug line-clamp-2">{item.title}</h3>
        {item.description && (
          <p className="text-[12px] text-[#8B7BA8] mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
        )}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F5F2FA]">
          <div className="flex items-center gap-3 text-[11px] text-[#BEB3D0]">
            <span>{timeAgo(item.created_at)} ago</span>
            {item.like_count > 0 && (
              <span className="flex items-center gap-1" style={{ color: item.is_liked ? "#EC4899" : undefined }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill={item.is_liked ? "#EC4899" : "none"} stroke={item.is_liked ? "#EC4899" : "currentColor"} strokeWidth="1.3">
                  <path d="M5.5 9.5S1 7 1 3.8a2.2 2.2 0 0 1 4.5-1 2.2 2.2 0 0 1 4.5 1C10 7 5.5 9.5 5.5 9.5Z" />
                </svg>
                {item.like_count}
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold text-[#8A2BE2] opacity-0 group-hover:opacity-100 transition-opacity">
            {item.content_type === "video" ? "Watch" : item.content_type === "image" ? "View" : "Read"} →
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Discover Card ────────────────────────────────────────────────────────────
function DiscoverCard({ item, onClick }: { item: ContentExploreResponse; onClick: () => void }) {
  const color = hubColor(item.hub.id);
  const meta = TYPE_META[item.content_type] ?? TYPE_META.text;

  return (
    <article
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer group"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)")}
    >
      <div className="relative h-36 overflow-hidden flex items-center justify-center" style={{ background: `${color}12` }}>
        {item.thumbnail_url ? (
          <Image src={item.thumbnail_url} alt={item.title} fill unoptimized className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:640px) 100vw, 33vw" />
        ) : item.content_type === "video" && item.file_url ? (
          <video src={item.file_url} className="absolute inset-0 w-full h-full object-cover" muted playsInline preload="metadata" />
        ) : item.content_type === "image" && item.file_url ? (
          <Image src={item.file_url} alt={item.title} fill unoptimized className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:640px) 100vw, 33vw" />
        ) : meta.play ? (
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: color }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="white"><path d="M3 1.5v10L11 6.5 3 1.5Z" /></svg>
          </div>
        ) : (
          <div className="opacity-20 text-[32px] font-black" style={{ color }}>{meta.label[0]}</div>
        )}
        <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: color }}>
          {meta.label}
        </span>
      </div>
      <div className="px-3.5 pt-3 pb-3.5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0" style={{ background: color }}>
            {initial(item.hub.name)}
          </div>
          <span className="text-[11.5px] font-semibold text-[#534670] truncate">{item.hub.name}</span>
          <span className="text-[10.5px] text-[#BEB3D0] ml-auto shrink-0">{timeAgo(item.created_at)}</span>
        </div>
        <h3 className="text-[13px] font-bold text-[#170C28] leading-snug line-clamp-2">{item.title}</h3>
      </div>
    </article>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function CardSkeleton({ tall }: { tall?: boolean }) {
  return <div className={`bg-white rounded-2xl animate-pulse ${tall ? "h-[280px]" : "h-[220px]"}`} style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }} />;
}

// ─── Sidebar: My Hubs ─────────────────────────────────────────────────────────
function HubsSidebar({ subscriptions, onNav }: { subscriptions: SubscriptionResponse[]; onNav: (h: string) => void }) {
  const unique = subscriptions.filter((s, i, arr) => i === arr.findIndex(x => x.hub.id === s.hub.id));
  if (unique.length === 0) return null;
  return (
    <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)" }}>
      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#BEB3D0] mb-3">My Hubs</p>
      <div className="flex flex-col gap-0.5">
        {unique.map(sub => {
          const c = hubColor(sub.hub.id);
          return (
            <button key={sub.hub.id} onClick={() => onNav(`/hubs/${sub.hub.id}`)} className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-[#F7F5FB] transition-colors text-left w-full group">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: c }}>{initial(sub.hub.name)}</div>
              <span className="text-[12.5px] font-semibold text-[#170C28] group-hover:text-[#8A2BE2] transition-colors truncate">{sub.hub.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FeedPage() {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: subscriptions = [], isLoading: subsLoading } = useMySubscriptions();
  const { data: feedContent = [], isLoading: feedLoading } = useFeedContent();
  const { data: exploreContent = [], isLoading: exploreLoading } = useExploreContent({ limit: 6 });
  const { data: creators = [] } = useExploreCreators({ limit: 4 });

  const activeSubscriptions = subscriptions.filter(s => s.status === "active");
  const hasSubscriptions = activeSubscriptions.length > 0;

  const FILTERS = [
    { key: "all", label: "All" },
    { key: "video", label: "Video" },
    { key: "image", label: "Photos" },
    { key: "text", label: "Articles" },
    { key: "pdf", label: "PDFs" },
  ];

  const filteredFeed = typeFilter === "all" ? feedContent : feedContent.filter(i => i.content_type === typeFilter);

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <div className="max-w-[1080px] mx-auto px-6 py-8">
        <div className="flex gap-7">

          {/* ── Main ── */}
          <div className="flex-1 min-w-0">

            {/* Header */}
            <div className="mb-7">
              <h1 className="text-[22px] font-black text-[#170C28] tracking-tight">Your Feed</h1>
              <p className="text-[13px] text-[#8B7BA8] mt-0.5">Content from creators you follow</p>
            </div>

            {/* Filters */}
            {hasSubscriptions && (
              <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
                {FILTERS.map(f => (
                  <button
                    key={f.key}
                    onClick={() => setTypeFilter(f.key)}
                    className="shrink-0 text-[12.5px] font-semibold px-4 py-1.5 rounded-full transition-all duration-150"
                    style={typeFilter === f.key
                      ? { background: "#8A2BE2", color: "white", boxShadow: "0 2px 10px rgba(138,43,226,0.3)" }
                      : { background: "white", color: "#534670", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05)" }
                    }
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}

            {/* Feed content */}
            {feedLoading || subsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => <CardSkeleton key={i} tall />)}
              </div>
            ) : !hasSubscriptions ? (
              <div className="bg-white rounded-2xl p-10 text-center" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div className="w-14 h-14 rounded-2xl bg-[#F4EEFF] flex items-center justify-center mx-auto mb-4">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#8A2BE2" strokeWidth="1.5"><circle cx="11" cy="11" r="9" /><path d="M11 7v4l3 2" strokeLinecap="round" /></svg>
                </div>
                <h3 className="text-[15px] font-bold text-[#170C28] mb-1">No subscriptions yet</h3>
                <p className="text-[13px] text-[#8B7BA8] mb-5">Subscribe to creators to see their content here.</p>
                <button onClick={() => router.push("/explore")} className="px-6 py-2.5 rounded-xl text-[13px] font-bold text-white" style={{ background: "#8A2BE2", boxShadow: "0 4px 14px rgba(138,43,226,0.3)" }}>
                  Discover Creators
                </button>
              </div>
            ) : filteredFeed.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-[13px] text-[#8B7BA8]">No {typeFilter === "all" ? "" : typeFilter + " "}content yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredFeed.map(item => (
                  <FeedCard key={item.id} item={item} onClick={() => router.push(`/content/${item.id}?hub=${item.hub_id}`)} />
                ))}
              </div>
            )}

            {/* Discover section */}
            {exploreContent.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-[17px] font-black text-[#170C28]">Discover</h2>
                    <p className="text-[12px] text-[#8B7BA8]">Free content across the platform</p>
                  </div>
                  <button onClick={() => router.push("/explore")} className="text-[12px] font-bold text-[#8A2BE2] hover:opacity-70 transition-opacity">
                    See all →
                  </button>
                </div>
                {exploreLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exploreContent.slice(0, 6).map(item => (
                      <DiscoverCard key={item.id} item={item} onClick={() => router.push(`/content/${item.id}?hub=${item.hub.id}`)} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="hidden xl:flex flex-col gap-4 w-[220px] shrink-0">
            <HubsSidebar subscriptions={activeSubscriptions} onNav={href => router.push(href)} />

            {/* Suggested creators */}
            {creators.length > 0 && (
              <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)" }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#BEB3D0] mb-3">Suggested</p>
                <div className="flex flex-col gap-0.5">
                  {creators.map(c => {
                    const col = hubColor(typeof c.id === "string" ? c.id.charCodeAt(0) : 0);
                    return (
                      <button key={c.id} onClick={() => c.hub && router.push(`/hubs/${c.hub.id}`)} className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-[#F7F5FB] transition-colors text-left w-full group">
                        {c.avatar_url ? (
                          <Image src={c.avatar_url} alt={c.username} width={28} height={28} unoptimized className="rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: col }}>{initial(c.username)}</div>
                        )}
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold text-[#170C28] truncate leading-tight">{c.full_name ?? c.username}</p>
                          <p className="text-[10.5px] text-[#BEB3D0] leading-tight">@{c.username}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
}
