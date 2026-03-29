"use client"

import { useState, useMemo } from "react"
import { useHubSubscribers } from "@/hooks/useSubscriptions"
import type { SubscriberResponse } from "@/types/subscriptions"

const cn = (...c: (string | boolean | undefined)[]) => c.filter(Boolean).join(" ")

// ─── Helpers ──────────────────────────────────────────────────────────────────
const PLAN_COLORS = [
  { accent: "#7C3AED", light: "#F5F3FF", border: "#DDD6FE" },
  { accent: "#0D9488", light: "#F0FDFA", border: "#99F6E4" },
  { accent: "#B45309", light: "#FFFBEB", border: "#FDE68A" },
  { accent: "#0EA5E9", light: "#F0F9FF", border: "#BAE6FD" },
  { accent: "#EC4899", light: "#FDF2F8", border: "#FBCFE8" },
]

function planColor(planName: string) {
  let hash = 0
  for (let i = 0; i < planName.length; i++) hash = planName.charCodeAt(i) + ((hash << 5) - hash)
  return PLAN_COLORS[Math.abs(hash) % PLAN_COLORS.length]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: "₦", USD: "$", EUR: "€", GBP: "£",
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ username, avatarUrl }: { username: string; avatarUrl?: string | null }) {
  const initials = username.slice(0, 2).toUpperCase()
  const AVATAR_COLORS = [
    ["#EDE9FE", "#7C3AED"], ["#F0FDFA", "#0D9488"], ["#FFFBEB", "#B45309"],
    ["#FEF2F2", "#DC2626"], ["#EFF6FF", "#2563EB"],
  ]
  const [bg, fg] = AVATAR_COLORS[username.charCodeAt(0) % AVATAR_COLORS.length]

  if (avatarUrl) {
    return (
      <img src={avatarUrl} alt={username} className="w-[36px] h-[36px] rounded-[10px] object-cover shrink-0 border border-[#EDE9F6]" />
    )
  }

  return (
    <div
      className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center shrink-0 text-[12px] font-bold border"
      style={{ background: bg, color: fg, borderColor: `${fg}33` }}
    >
      {initials}
    </div>
  )
}

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="6" cy="6" r="4.2"/><path d="M9.5 9.5 13 13"/>
  </svg>
)

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SubscribersPage() {
  const [planFilter, setPlanFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "cancelled">("all")
  const [search, setSearch] = useState("")

  const { data: subscribers = [], isLoading } = useHubSubscribers()

  // Unique plans from subscriber list
  const plans = useMemo(() => {
    const seen = new Map<number, { id: number; name: string }>()
    subscribers.forEach(s => {
      if (!seen.has(s.plan.id)) seen.set(s.plan.id, s.plan)
    })
    return Array.from(seen.values())
  }, [subscribers])

  const active    = subscribers.filter(s => s.status === "active").length
  const cancelled = subscribers.filter(s => s.status === "cancelled").length
  const expired   = subscribers.filter(s => s.status === "expired").length

  const filtered = subscribers.filter(s => {
    const matchesPlan   = planFilter === "all" || String(s.plan.id) === planFilter
    const matchesStatus = statusFilter === "all" || s.status === statusFilter
    const matchesSearch = s.member.username.toLowerCase().includes(search.toLowerCase())
    return matchesPlan && matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen px-8 py-8" style={{ background: "#F4F1FB" }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[24px] font-bold text-[#13111A] tracking-tight">Subscribers</h1>
          <p className="text-[13px] text-[#9B91B5] mt-1">
            {isLoading ? "Loading…" : `${active} active · ${cancelled} cancelled${expired > 0 ? ` · ${expired} expired` : ""}`}
          </p>
        </div>
      </div>

      {/* Plan breakdown cards */}
      <div
        className="grid gap-4 mb-6"
        style={{ gridTemplateColumns: `repeat(${Math.min(plans.length + 1, 5)}, 1fr)` }}
      >
        {/* All card */}
        {[
          { key: "all", label: "All", value: subscribers.length, accent: "#7C3AED", light: "#F5F3FF", border: "#DDD6FE" },
          ...plans.map(p => ({
            key: String(p.id),
            label: p.name,
            value: subscribers.filter(s => s.plan.id === p.id).length,
            ...planColor(p.name),
          })),
        ].map(card => {
          const isActive = planFilter === card.key
          return (
            <button
              key={card.key}
              onClick={() => setPlanFilter(card.key)}
              className="text-left p-5 rounded-2xl border-2 transition-all duration-150"
              style={{
                background: isActive ? card.light : "white",
                borderColor: isActive ? card.border : "#EDE9F6",
                boxShadow: isActive ? `0 4px 16px ${card.accent}18` : "0 2px 8px rgba(124,58,237,0.04)",
              }}
            >
              <p
                className="text-[28px] font-bold leading-none tracking-tight mb-1.5"
                style={{ color: isActive ? card.accent : "#13111A" }}
              >
                {isLoading ? "—" : card.value}
              </p>
              <p className="text-[12px] font-medium text-[#9B91B5]">{card.label}</p>
            </button>
          )
        })}
      </div>

      {/* Search + status filter */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-[280px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4B5FD]"><SearchIcon /></span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by username…"
            className="w-full bg-white border border-[#DDD6FE] rounded-[10px] pl-9 pr-4 py-2 text-[13px] text-[#13111A] placeholder:text-[#C4B5FD] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {(["all", "active", "cancelled"] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3.5 py-1.5 rounded-full text-[12px] font-medium capitalize border transition-all"
              style={statusFilter === s
                ? { background: "#7C3AED", color: "white", borderColor: "#7C3AED" }
                : { background: "white", color: "#6B5B9A", borderColor: "#DDD6FE" }
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-2xl border border-[#EDE9F6] overflow-hidden"
        style={{ boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}
      >
        {/* Column headers */}
        <div
          className="grid items-center gap-4 px-6 py-3.5 border-b border-[#F5F3FF]"
          style={{ gridTemplateColumns: "1fr 110px 120px 110px 90px 100px", background: "#FDFCFF" }}
        >
          {["Subscriber", "Plan", "Subscribed", "Expires", "Renews", "Status"].map(h => (
            <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-[#C4B5FD]">{h}</span>
          ))}
        </div>

        {/* Skeleton */}
        {isLoading && (
          <div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-[64px] border-b border-[#F9F7FF] animate-pulse bg-[#FDFCFF]" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && filtered.length === 0 && (
          <div className="py-16 flex flex-col items-center gap-2">
            <p className="text-[15px] font-semibold text-[#13111A]">No subscribers found</p>
            <p className="text-[13px] text-[#9B91B5]">Try adjusting your search or filter.</p>
          </div>
        )}

        {/* Rows */}
        {!isLoading && filtered.map((sub: SubscriberResponse) => {
          const pColor   = planColor(sub.plan.name)
          const isActive = sub.status === "active"
          const symbol   = CURRENCY_SYMBOLS[sub.plan.currency] ?? sub.plan.currency

          return (
            <div
              key={sub.id}
              className="group grid items-center gap-4 px-6 py-4 border-b border-[#F9F7FF] last:border-0 transition-colors hover:bg-[#FDFCFF]"
              style={{ gridTemplateColumns: "1fr 110px 120px 110px 90px 100px" }}
            >
              {/* Member */}
              <div className="flex items-center gap-3 min-w-0">
                <Avatar username={sub.member.username} avatarUrl={sub.member.avatar_url} />
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold text-[#13111A] truncate leading-tight">
                    @{sub.member.username}
                  </p>
                  <p className="text-[11.5px] text-[#9B91B5] mt-0.5">
                    {symbol}{sub.plan.price.toLocaleString()} {sub.plan.billing_cycle.replace("_", " ")}
                  </p>
                </div>
              </div>

              {/* Plan */}
              <span
                className="inline-flex items-center text-[11.5px] font-semibold px-2.5 py-1 rounded-full border w-fit"
                style={{ color: pColor.accent, background: pColor.light, borderColor: pColor.border }}
              >
                {sub.plan.name}
              </span>

              {/* Started */}
              <span className="text-[12.5px] text-[#9B91B5]">{formatDate(sub.started_at)}</span>

              {/* Expires */}
              <span className="text-[12.5px] text-[#9B91B5]">
                {sub.expires_at ? formatDate(sub.expires_at) : "—"}
              </span>

              {/* Auto-renew */}
              <span className={cn(
                "inline-flex items-center text-[11.5px] font-medium",
                sub.auto_renew ? "text-[#0D9488]" : "text-[#9B91B5]"
              )}>
                {sub.auto_renew ? "Yes" : "No"}
              </span>

              {/* Status */}
              <span className={cn(
                "inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1 rounded-full border w-fit",
                isActive
                  ? "text-[#0D9488] bg-[#F0FDFA] border-[#99F6E4]"
                  : sub.status === "expired"
                  ? "text-[#B45309] bg-[#FFFBEB] border-[#FDE68A]"
                  : "text-[#9B91B5] bg-[#F5F3FF] border-[#EDE9FE]"
              )}>
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  isActive ? "bg-[#2DD4BF]" : sub.status === "expired" ? "bg-[#F59E0B]" : "bg-[#C4B5FD]"
                )} />
                {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}