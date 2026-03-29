"use client"

import { useState } from "react"
import { useExploreContent } from "@/hooks/useExplore"
import { useExploreCreators } from "@/hooks/useExplore"
import { useMySubscriptions } from "@/hooks/useSubscriptions"
import type { ContentExploreResponse } from "@/types/explore"
import type { CreatorExploreResponse } from "@/types/explore"

const cn = (...c: (string | boolean | undefined)[]) => c.filter(Boolean).join(" ")

const HUB_COLORS = ["#8A2BE2", "#6366F1", "#0EA5E9", "#EC4899", "#F59E0B", "#10B981"]
const hubColor = (id: number) => HUB_COLORS[id % HUB_COLORS.length]
const initial  = (str: string) => str.charAt(0).toUpperCase()

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// ─── Type config ──────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  video: {
    label: "Video",
    icon: <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 2.5v7l8-3.5L2 2.5Z"/></svg>,
    centerIcon: (color: string) => (
      <div className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: color, boxShadow: `0 6px 20px ${color}66` }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="white"><path d="M5 3.5v11l10-5.5L5 3.5Z"/></svg>
      </div>
    ),
  },
  image: {
    label: "Photo",
    icon: <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="1" y="1" width="10" height="10" rx="1.5"/><circle cx="3.8" cy="3.8" r="1" fill="currentColor" stroke="none"/><path d="M1 8l3-3 2 2 2-2 3 3"/></svg>,
    centerIcon: (color: string) => (
      <div className="flex gap-1.5 opacity-40">
        {[40, 56, 40].map((h, i) => (
          <div key={i} className="w-10 rounded-lg" style={{ height: h, background: color }} />
        ))}
      </div>
    ),
  },
  pdf: {
    label: "PDF",
    icon: <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 1h4l3 3v7H3V1Z"/><path d="M7 1v3h3"/></svg>,
    centerIcon: (color: string) => (
      <div className="flex flex-col items-center gap-1 opacity-40">
        <div className="w-10 h-12 rounded-lg border-2 flex items-end justify-center pb-1.5" style={{ borderColor: color }}>
          <div className="w-5 h-1 rounded-full" style={{ background: color }} />
        </div>
      </div>
    ),
  },
  text: {
    label: "Article",
    icon: <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M1.5 3h9M1.5 6h6M1.5 9h4"/></svg>,
    centerIcon: (color: string) => (
      <div className="flex flex-col gap-1.5 opacity-30 w-24">
        {[100, 80, 90, 60].map((w, i) => (
          <div key={i} className="h-1.5 rounded-full" style={{ width: `${w}%`, background: color }} />
        ))}
      </div>
    ),
  },
} as const

// ─── Featured Card (first item, wider) ───────────────────────────────────────
function FeaturedCard({ item }: { item: ContentExploreResponse }) {
  const color     = hubColor(item.hub.id)
  const accentLight = `${color}18`
  const cfg       = TYPE_CONFIG[item.content_type]

  return (
    <article className="col-span-2 bg-white rounded-2xl border border-[#EDE5F8] overflow-hidden flex group transition-all duration-200 hover:shadow-[0_4px_24px_rgba(138,43,226,0.1)]">
      {/* Media */}
      <div
        className="w-[260px] shrink-0 relative flex items-center justify-center"
        style={{ background: `linear-gradient(145deg, ${accentLight} 0%, ${color}22 100%)` }}
      >
        <span
          className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: color, color: "white" }}
        >
          {cfg.icon}
          {cfg.label}
        </span>
        {item.thumbnail_url ? (
          <img src={item.thumbnail_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          cfg.centerIcon(color)
        )}
      </div>

      {/* Body */}
      <div className="flex-1 px-5 py-4 flex flex-col justify-between min-w-0">
        <div>
          {/* Hub row */}
          <div className="flex items-center gap-2 mb-3">
            {item.hub.avatar_url ? (
              <img src={item.hub.avatar_url} alt={item.hub.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                style={{ background: color }}>
                {initial(item.hub.name)}
              </div>
            )}
            <span className="text-[12.5px] font-semibold text-[#2D0052]">{item.hub.name}</span>
            <span className="text-[11px] text-[#A08DBE]">· {formatDate(item.created_at)}</span>
          </div>
          <h2 className="text-[17px] font-bold text-[#1A0040] leading-snug mb-2 line-clamp-2">{item.title}</h2>
          {item.description && (
            <p className="text-[13px] text-[#7C6A9A] leading-relaxed line-clamp-3">{item.description}</p>
          )}
        </div>
        <div className="flex items-center pt-3 border-t border-[#F5EFFF] mt-3">
          <button
            className="ml-auto text-[13px] font-semibold px-4 py-1.5 rounded-full text-white transition-all hover:opacity-90"
            style={{ background: color }}
          >
            {item.content_type === "video" ? "Watch now" : "Read now"}
          </button>
        </div>
      </div>
    </article>
  )
}

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ item }: { item: ContentExploreResponse }) {
  const color      = hubColor(item.hub.id)
  const accentLight = `${color}18`
  const cfg        = TYPE_CONFIG[item.content_type]

  return (
    <article className="bg-white rounded-2xl border border-[#EDE5F8] overflow-hidden group transition-all duration-200 hover:shadow-[0_4px_24px_rgba(138,43,226,0.1)] hover:-translate-y-[1px]">
      {/* Media block */}
      <div
        className="relative h-[180px] flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${accentLight} 0%, ${color}22 100%)` }}
      >
        {item.thumbnail_url ? (
          <img src={item.thumbnail_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          cfg.centerIcon(color)
        )}
        <span
          className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full z-10"
          style={{ background: color, color: "white", boxShadow: `0 2px 8px ${color}55` }}
        >
          {cfg.icon} {cfg.label}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 pt-3.5 pb-3">
        {/* Hub row */}
        <div className="flex items-center gap-2.5 mb-2.5">
          {item.hub.avatar_url ? (
            <img src={item.hub.avatar_url} alt={item.hub.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
              style={{ background: color }}>
              {initial(item.hub.name)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className="text-[12.5px] font-semibold text-[#2D0052] truncate block">{item.hub.name}</span>
          </div>
          <span className="text-[11px] text-[#A08DBE] shrink-0">{formatDate(item.created_at)}</span>
        </div>

        <h3 className="text-[13.5px] font-bold text-[#1A0040] leading-snug mb-1.5 line-clamp-2">{item.title}</h3>
        {item.description && (
          <p className="text-[12px] text-[#7C6A9A] leading-relaxed line-clamp-2">{item.description}</p>
        )}
      </div>
    </article>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function PostSkeleton({ featured = false }: { featured?: boolean }) {
  if (featured) {
    return (
      <div className="col-span-2 bg-white rounded-2xl border border-[#EDE5F8] h-[180px] animate-pulse" />
    )
  }
  return <div className="bg-white rounded-2xl border border-[#EDE5F8] h-[260px] animate-pulse" />
}

// ─── Sidebar: Subscribed Hubs ─────────────────────────────────────────────────
function SubscribedHubs() {
  const { data: subscriptions = [], isLoading } = useMySubscriptions()
  const active = subscriptions.filter(s => s.status === "active")

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-[#EDE5F8] p-4">
        <div className="h-4 w-24 bg-[#F5EFFF] rounded animate-pulse mb-3" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 bg-[#F5EFFF] rounded-xl animate-pulse mb-2" />
        ))}
      </div>
    )
  }

  if (active.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-[#EDE5F8] p-4">
      <h3 className="text-[13px] font-bold text-[#2D0052] mb-3">My Hubs</h3>
      <div className="flex flex-col gap-2">
        {active.map(sub => {
          const color = hubColor(sub.hub.id)
          return (
            <div key={sub.id} className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-[#F5EFFF] transition-colors cursor-pointer group">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                style={{ background: color }}>
                {initial(sub.hub.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-semibold text-[#2D0052] group-hover:text-[#8A2BE2] transition-colors truncate leading-tight">
                  {sub.hub.name}
                </p>
                <p className="text-[10.5px] text-[#A08DBE]">{sub.plan.name}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Sidebar: Suggested Creators ──────────────────────────────────────────────
function SuggestedCreators() {
  const { data: creators = [], isLoading } = useExploreCreators({ limit: 4 })

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-[#EDE5F8] p-4">
        <div className="h-4 w-32 bg-[#F5EFFF] rounded animate-pulse mb-3" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 bg-[#F5EFFF] rounded-xl animate-pulse mb-2" />
        ))}
      </div>
    )
  }

  if (creators.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-[#EDE5F8] p-4">
      <h3 className="text-[13px] font-bold text-[#2D0052] mb-3">Suggested Creators</h3>
      <div className="flex flex-col gap-3">
        {creators.map(creator => {
          const color = hubColor(creator.id)
          return (
            <div key={creator.id} className="flex items-center gap-2.5">
              {creator.avatar_url ? (
                <img src={creator.avatar_url} alt={creator.username} className="w-8 h-8 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
                  style={{ background: color }}>
                  {initial(creator.username)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-semibold text-[#2D0052] truncate leading-tight">
                  {creator.full_name ?? creator.username}
                </p>
                <p className="text-[11px] text-[#A08DBE] leading-tight">@{creator.username}</p>
              </div>
              {creator.hub && (
                <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F3E8FF] text-[#8A2BE2]">
                  Hub
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FeedPage() {
  const [typeFilter, setTypeFilter] = useState<"all" | "video" | "image" | "pdf" | "text">("all")

  const { data: content = [], isLoading } = useExploreContent({
    content_type: typeFilter === "all" ? undefined : typeFilter,
    limit: 20,
  })

  const [featured, ...rest] = content

  const FILTERS: { key: "all" | "video" | "image" | "pdf" | "text"; label: string }[] = [
    { key: "all",   label: "All" },
    { key: "video", label: "Video" },
    { key: "image", label: "Photos" },
    { key: "text",  label: "Articles" },
    { key: "pdf",   label: "PDFs" },
  ]

  return (
    <div className="min-h-screen bg-[#FAF8FF]">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-8 py-7">
        <div className="flex gap-7">

          {/* ── Main feed ── */}
          <div className="flex-1 min-w-0">

            {/* Filter chips */}
            <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setTypeFilter(f.key)}
                  className={cn(
                    "shrink-0 text-[12.5px] font-semibold px-4 py-1.5 rounded-full border transition-all duration-150",
                    typeFilter === f.key
                      ? "bg-[#8A2BE2] text-white border-[#8A2BE2]"
                      : "bg-white text-[#6B4F8A] border-[#EDE5F8] hover:border-[#C4A8E0] hover:text-[#8A2BE2]"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4">
                <PostSkeleton featured />
                {[...Array(4)].map((_, i) => <PostSkeleton key={i} />)}
              </div>
            ) : content.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-[13px] text-[#A08DBE]">No content found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {/* Featured — first item spans full width */}
                {featured && <FeaturedCard item={featured} />}
                {rest.map(item => (
                  <PostCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="hidden xl:flex flex-col gap-4 w-[240px] shrink-0">
            <SubscribedHubs />
            <SuggestedCreators />
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  )
}