"use client"

import { useState } from "react"
import { useExploreCreators } from "@/hooks/useExplore"
import { useExploreContent } from "@/hooks/useExplore"
import type { CreatorExploreResponse } from "@/types/explore"
import type { ContentExploreResponse } from "@/types/explore"

const cn = (...c: (string | boolean | undefined)[]) => c.filter(Boolean).join(" ")

const HUB_COLORS = ["#8A2BE2", "#6366F1", "#0EA5E9", "#EC4899", "#F59E0B", "#10B981"]
const hubColor = (id: number) => HUB_COLORS[id % HUB_COLORS.length]
const initial  = (str: string) => str.charAt(0).toUpperCase()

const CONTENT_TYPE_ICON = {
  video: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor"><path d="M10 7v18l16-9L10 7Z"/></svg>
  ),
  image: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="26" height="26" rx="4"/><circle cx="11" cy="11" r="3"/><path d="M3 21l7-7 6 6 5-5 9 9"/></svg>
  ),
  pdf: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 3v18M5 14l9 9 9-9" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 24h22" strokeLinecap="round"/></svg>
  ),
  text: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 8h18M5 14h12M5 20h8" strokeLinecap="round"/></svg>
  ),
}

const CONTENT_TYPE_LABEL: Record<string, string> = {
  video: "Video",
  image: "Photo",
  pdf:   "PDF",
  text:  "Article",
}

// ─── Creator Card ─────────────────────────────────────────────────────────────
function CreatorCard({ creator }: { creator: CreatorExploreResponse }) {
  const color = hubColor(creator.id)
  const src   = creator.avatar_url

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] p-4 flex flex-col items-center text-center hover:border-[#DDD] hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all">
      <div className="relative mb-2.5">
        {src ? (
          <img src={src} alt={creator.username} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[14px] font-bold" style={{ background: color }}>
            {initial(creator.username)}
          </div>
        )}
      </div>
      <p className="text-[12px] font-semibold text-[#111] truncate w-full leading-tight">
        {creator.full_name ?? creator.username}
      </p>
      <p className="text-[10.5px] text-[#AAA] mb-2 mt-0.5">@{creator.username}</p>
      {creator.hub && (
        <p className="text-[10px] text-[#8A2BE2] font-medium truncate w-full">{creator.hub.name}</p>
      )}
    </div>
  )
}

// ─── Content Card ─────────────────────────────────────────────────────────────
function ContentCard({ item }: { item: ContentExploreResponse }) {
  const color = hubColor(item.hub.id)

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer group transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] aspect-square"
      style={{ background: `${color}12` }}
    >
      {/* Thumbnail */}
      {item.thumbnail_url && (
        <img
          src={item.thumbnail_url}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Type label */}
      <span className="absolute top-2.5 left-2.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/80 text-[#444] backdrop-blur-sm z-10">
        {CONTENT_TYPE_LABEL[item.content_type] ?? item.content_type}
      </span>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 z-10 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100">
        <p className="text-white text-[11.5px] font-semibold leading-snug line-clamp-2">{item.title}</p>
        {item.description && (
          <p className="text-white/70 text-[10px] mt-0.5 line-clamp-1">{item.description}</p>
        )}
      </div>

      {/* Hub author pill */}
      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 z-20">
        {item.hub.avatar_url ? (
          <img src={item.hub.avatar_url} alt={item.hub.name} className="w-3.5 h-3.5 rounded-full object-cover" />
        ) : (
          <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[7px] font-bold" style={{ background: color }}>
            {initial(item.hub.name)}
          </div>
        )}
        <span className="text-[9.5px] font-medium text-[#333] max-w-[80px] truncate">{item.hub.name}</span>
      </div>

      {/* Center icon (no thumbnail) */}
      {!item.thumbnail_url && (
        <div className="absolute inset-0 flex items-center justify-center opacity-15" style={{ color }}>
          {CONTENT_TYPE_ICON[item.content_type]}
        </div>
      )}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard({ rounded = "2xl" }: { rounded?: string }) {
  return <div className={cn("bg-[#F5F5F5] animate-pulse rounded-2xl")} />
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ExplorePage() {
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const debounceRef = useState<ReturnType<typeof setTimeout> | null>(null)

  const handleSearch = (value: string) => {
    setSearch(value)
    if (debounceRef[0]) clearTimeout(debounceRef[0])
    debounceRef[1](setTimeout(() => setDebouncedSearch(value), 400))
  }

  const { data: creators = [], isLoading: creatorsLoading } = useExploreCreators({
    q: debouncedSearch || undefined,
    limit: 6,
  })

  const { data: content = [], isLoading: contentLoading } = useExploreContent({
    q: debouncedSearch || undefined,
    limit: 12,
  })

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-[960px] mx-auto px-6 lg:px-10 py-8">

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-[22px] font-bold text-[#111] tracking-tight">Explore</h1>
          <p className="text-[13px] text-[#999] mt-0.5">Discover creators and content</p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CCC]" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="5.5" cy="5.5" r="4"/><path d="M9.5 9.5 13 13" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search creators, hubs, content…"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EBEBEB] rounded-xl text-[13.5px] text-[#111] placeholder:text-[#CCC] outline-none focus:border-[#8A2BE2] transition-all"
          />
        </div>

        {/* ── Creators ── */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-semibold text-[#111]">
              {debouncedSearch ? "Creators" : "Trending Creators"}
            </h2>
            {!debouncedSearch && (
              <button className="text-[12px] text-[#8A2BE2] font-medium hover:underline">See all</button>
            )}
          </div>

          {creatorsLoading ? (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#F0F0F0] p-4 h-[140px] animate-pulse" />
              ))}
            </div>
          ) : creators.length === 0 ? (
            <p className="text-[13px] text-[#999] py-6 text-center">No creators found.</p>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {creators.map(creator => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          )}
        </section>

        {/* ── Content ── */}
        <section>
          <h2 className="text-[13px] font-semibold text-[#111] mb-4">
            {debouncedSearch ? "Content" : "Top Content"}
          </h2>

          {contentLoading ? (
            <div className="grid grid-cols-4 gap-2.5" style={{ gridAutoRows: "148px" }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-[#F5F5F5] animate-pulse" />
              ))}
            </div>
          ) : content.length === 0 ? (
            <p className="text-[13px] text-[#999] py-6 text-center">No content found.</p>
          ) : (
            <div className="grid grid-cols-4 gap-2.5" style={{ gridAutoRows: "148px" }}>
              {content.map(item => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  )
}