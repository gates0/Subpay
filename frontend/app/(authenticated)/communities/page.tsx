"use client"

import { useState, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useExploreHubs } from "@/hooks/useExplore"
import { useMySubscriptions } from "@/hooks/useSubscriptions"
import { useHubPlans } from "@/hooks/usePlans"
import type { HubExploreResponse } from "@/types/hubs"

const initial = (s: string) => s.charAt(0).toUpperCase()
const HUB_COLORS = ["#8A2BE2", "#6366F1", "#F59E0B", "#10B981", "#EC4899", "#0EA5E9"]
const hubColor = (id: number) => HUB_COLORS[id % HUB_COLORS.length]

// ─── Hub Card ─────────────────────────────────────────────────────────────────
function HubCard({ hub, isSubscribed }: { hub: HubExploreResponse; isSubscribed: boolean }) {
  const router = useRouter()
  const { data: plans = [] } = useHubPlans(hub.id)
  const color = hubColor(hub.id)
  const activePlans = plans.filter(p => p.is_active).sort((a, b) => a.price - b.price)
  const cheapest = activePlans[0]

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden cursor-pointer group transition-all duration-200"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05)" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05)")}
      onClick={() => router.push(`/hubs/${hub.id}`)}
    >
      {/* Banner */}
      <div className="relative h-[100px] overflow-hidden">
        {hub.banner_url ? (
          <Image src={hub.banner_url} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized sizes="600px" />
        ) : (
          <div className="w-full h-full" style={{ background: `linear-gradient(135deg, #1A0A2E 0%, ${color} 100%)` }}>
            <div className="absolute inset-0 opacity-[0.08]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }} />
          </div>
        )}
        {/* Gradient fade */}
        <div className="absolute inset-0 bg-linear-to-t from-white/20 to-transparent" />

        {/* Avatar */}
        <div
          className="absolute -bottom-5 left-4 w-[48px] h-[48px] rounded-xl border-2 border-white overflow-hidden flex items-center justify-center text-white text-[17px] font-bold shrink-0"
          style={{ background: hub.avatar_url ? "transparent" : color, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
        >
          {hub.avatar_url ? (
            <Image src={hub.avatar_url} alt={hub.name} fill className="object-cover" unoptimized />
          ) : initial(hub.creator.username)}
        </div>

        {isSubscribed && (
          <div className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-[#8A2BE2]">
            Joined
          </div>
        )}
      </div>

      {/* Body */}
      <div className="pt-8 px-4 pb-4">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <div className="min-w-0">
            <h3 className="text-[14px] font-bold text-[#170C28] truncate">{hub.name}</h3>
            <p className="text-[11.5px] text-[#8B7BA8] mt-0.5">@{hub.creator.username}</p>
          </div>
        </div>

        {hub.description && (
          <p className="text-[12.5px] text-[#534670] leading-relaxed mb-3 line-clamp-2">{hub.description}</p>
        )}

        {/* Plan pills */}
        {activePlans.length > 0 && (
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {activePlans.slice(0, 3).map(plan => (
              <span
                key={plan.id}
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: `${color}12`, color }}
              >
                {plan.name} · {plan.currency} {plan.price}/{plan.billing_cycle === "monthly" ? "mo" : plan.billing_cycle === "yearly" ? "yr" : "once"}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#F5F2FA]" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-3 text-[11.5px] text-[#BEB3D0]">
            <span>{hub.subscriber_count.toLocaleString()} members</span>
            <span>·</span>
            <span>{hub.content_count} posts</span>
          </div>

          {isSubscribed ? (
            <span className="text-[12px] font-semibold text-[#8A2BE2]">View →</span>
          ) : (
            <button
              onClick={() => router.push(`/hubs/${hub.id}?tab=plans`)}
              className="text-[12px] font-bold px-3.5 py-1.5 rounded-xl text-white transition-all hover:opacity-90 active:scale-[0.97]"
              style={{ background: "#8A2BE2", boxShadow: "0 2px 8px rgba(138,43,226,0.3)" }}
            >
              {cheapest ? `Join · ${cheapest.currency} ${cheapest.price}` : "See plans"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CommunitiesPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [sort, setSort] = useState<"newest" | "popular">("newest")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearch = (value: string) => {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedSearch(value), 400)
  }

  const { data: hubs = [], isLoading } = useExploreHubs({ q: debouncedSearch || undefined, sort_by: sort, limit: 50 })
  const { data: mySubscriptions = [] } = useMySubscriptions()
  const subscribedHubIds = useMemo(
    () => new Set(mySubscriptions.filter(s => s.status === "active").map(s => s.hub.id)),
    [mySubscriptions]
  )

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <div className="max-w-[680px] mx-auto px-5 py-8">

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-[24px] font-black text-[#170C28] tracking-tight">Communities</h1>
          <p className="text-[13px] text-[#8B7BA8] mt-0.5">Find your people. Grow together.</p>
        </div>

        {/* Search + sort */}
        <div className="flex gap-2.5 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#BEB3D0]" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="6" cy="6" r="4.2" /><path d="M9.5 9.5 13 13" strokeLinecap="round" />
            </svg>
            <input
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search communities…"
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl text-[13px] text-[#170C28] placeholder:text-[#BEB3D0] outline-none transition-all"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.06)" }}
              onFocus={e => (e.target.style.boxShadow = "0 0 0 2px #8A2BE2")}
              onBlur={e => (e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.06)")}
            />
          </div>
          <div className="flex bg-white rounded-xl p-1 gap-1" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.06)" }}>
            {[{ label: "New", value: "newest" as const }, { label: "Popular", value: "popular" as const }].map(opt => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className="text-[12px] font-bold px-3.5 py-1.5 rounded-[9px] transition-all"
                style={sort === opt.value
                  ? { background: "#8A2BE2", color: "white", boxShadow: "0 2px 8px rgba(138,43,226,0.3)" }
                  : { color: "#8B7BA8" }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-[220px] animate-pulse" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }} />
            ))}
          </div>
        ) : hubs.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#F4EEFF] flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#8A2BE2" strokeWidth="1.5" strokeLinecap="round"><circle cx="9" cy="9" r="6"/><path d="M15 15l4 4" /></svg>
            </div>
            <p className="text-[14px] font-bold text-[#170C28]">No communities found</p>
            <p className="text-[12.5px] text-[#8B7BA8] mt-1">Try a different search term.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {hubs.map(hub => (
              <HubCard key={hub.id} hub={hub} isSubscribed={subscribedHubIds.has(hub.id)} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
