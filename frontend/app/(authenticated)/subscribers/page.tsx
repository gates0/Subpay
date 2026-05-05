"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { useHubSubscribers } from "@/hooks/useSubscriptions"
import type { SubscriberResponse } from "@/types/subscriptions"

const cn = (...c: (string | boolean | undefined)[]) => c.filter(Boolean).join(" ")

const PLAN_COLORS = [
  { accent: "#8A2BE2", light: "#F4EEFF", border: "#D4B0F5" },
  { accent: "#0D9488", light: "#F0FDFA", border: "#99F6E4" },
  { accent: "#D97706", light: "#FFFBEB", border: "#FDE68A" },
  { accent: "#2563EB", light: "#EFF6FF", border: "#BFDBFE" },
  { accent: "#EC4899", light: "#FDF2F8", border: "#FBCFE8" },
]

function planColor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return PLAN_COLORS[Math.abs(h) % PLAN_COLORS.length]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

const CURRENCY: Record<string, string> = { NGN: "₦", USD: "$", EUR: "€", GBP: "£" }

function Avatar({ username, avatarUrl }: { username: string; avatarUrl?: string | null }) {
  const initials = username.slice(0, 2).toUpperCase()
  const colors = [["#F4EEFF","#8A2BE2"],["#ECFDF5","#059669"],["#FFFBEB","#D97706"],["#FEF2F2","#DC2626"],["#EFF6FF","#2563EB"]]
  const [bg, fg] = colors[username.charCodeAt(0) % colors.length]
  if (avatarUrl) return <Image src={avatarUrl} alt={username} width={36} height={36} unoptimized className="rounded-xl object-cover shrink-0 ring-1 ring-black/5" />
  return (
    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-[11.5px] font-bold" style={{ background: bg, color: fg }}>
      {initials}
    </div>
  )
}

export default function SubscribersPage() {
  const [planFilter, setPlanFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "cancelled">("all")
  const [search, setSearch] = useState("")

  const { data: subscribers = [], isLoading } = useHubSubscribers()

  const plans = useMemo(() => {
    const seen = new Map<number, { id: number; name: string }>()
    subscribers.forEach(s => { if (!seen.has(s.plan.id)) seen.set(s.plan.id, s.plan) })
    return Array.from(seen.values())
  }, [subscribers])

  const active    = subscribers.filter(s => s.status === "active").length
  const cancelled = subscribers.filter(s => s.status === "cancelled").length
  const expired   = subscribers.filter(s => s.status === "expired").length

  const filtered = subscribers.filter(s => {
    const matchPlan   = planFilter === "all" || String(s.plan.id) === planFilter
    const matchStatus = statusFilter === "all" || s.status === statusFilter
    const matchSearch = s.member.username.toLowerCase().includes(search.toLowerCase())
    return matchPlan && matchStatus && matchSearch
  })

  const statCards = [
    { key: "all", label: "All", value: subscribers.length, accent: "#8A2BE2", light: "#F4EEFF", border: "#D4B0F5" },
    ...plans.map(p => ({ key: String(p.id), label: p.name, value: subscribers.filter(s => s.plan.id === p.id).length, ...planColor(p.name) })),
  ]

  return (
    <div className="min-h-screen bg-[#F7F8FC] px-6 lg:px-10 py-8">

      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[24px] font-black text-[#170C28] tracking-tight">Subscribers</h1>
        <p className="text-[13px] text-[#8B7BA8] mt-0.5">
          {isLoading ? "Loading…" : `${active} active${cancelled > 0 ? ` · ${cancelled} cancelled` : ""}${expired > 0 ? ` · ${expired} expired` : ""}`}
        </p>
      </div>

      {/* Plan stat cards */}
      <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: `repeat(${Math.min(statCards.length, 5)}, minmax(0,1fr))` }}>
        {statCards.map(card => {
          const active = planFilter === card.key
          return (
            <button
              key={card.key}
              onClick={() => setPlanFilter(card.key)}
              className="text-left px-5 py-4 rounded-2xl border-2 transition-all duration-150 bg-white"
              style={{
                borderColor: active ? card.border : "transparent",
                background: active ? card.light : "white",
                boxShadow: active ? `0 4px 16px ${card.accent}18` : "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <p className="text-[28px] font-black leading-none tracking-tight" style={{ color: active ? card.accent : "#170C28" }}>
                {isLoading ? "—" : card.value}
              </p>
              <p className="text-[11.5px] font-medium text-[#8B7BA8] mt-1.5">{card.label}</p>
            </button>
          )
        })}
      </div>

      {/* Search + filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative w-[260px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BEB3D0]" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="6" cy="6" r="4.2"/><path d="M9.5 9.5 13 13"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by username…"
            className="w-full bg-white pl-9 pr-4 py-2 rounded-xl text-[13px] text-[#170C28] placeholder:text-[#BEB3D0] outline-none transition-all"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.06)" }}
            onFocus={e => (e.target.style.boxShadow = "0 0 0 2px #8A2BE2")}
            onBlur={e => (e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.06)")}
          />
        </div>
        <div className="flex items-center gap-1.5">
          {(["all", "active", "cancelled"] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold capitalize transition-all"
              style={statusFilter === s
                ? { background: "#8A2BE2", color: "white", boxShadow: "0 2px 8px rgba(138,43,226,0.3)" }
                : { background: "white", color: "#534670", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.06)" }
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05)" }}>
        {/* Header */}
        <div className="grid gap-4 px-6 py-3.5 border-b border-[#F5F2FA]" style={{ gridTemplateColumns: "1fr 110px 120px 110px 90px 100px", background: "#FDFCFF" }}>
          {["Subscriber", "Plan", "Joined", "Expires", "Renews", "Status"].map(h => (
            <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-[#BEB3D0]">{h}</span>
          ))}
        </div>

        {isLoading && [...Array(5)].map((_, i) => (
          <div key={i} className="h-[64px] border-b border-canvas animate-pulse bg-[#FDFDFD]" />
        ))}

        {!isLoading && filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-[14px] font-bold text-[#170C28]">No subscribers found</p>
            <p className="text-[12.5px] text-[#8B7BA8] mt-1">Try adjusting your search or filter.</p>
          </div>
        )}

        {!isLoading && filtered.map((sub: SubscriberResponse) => {
          const pc     = planColor(sub.plan.name)
          const symbol = CURRENCY[sub.plan.currency] ?? sub.plan.currency
          return (
            <div
              key={sub.id}
              className="grid gap-4 items-center px-6 py-4 border-b border-canvas last:border-0 hover:bg-[#FDFCFF] transition-colors"
              style={{ gridTemplateColumns: "1fr 110px 120px 110px 90px 100px" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar username={sub.member.username} avatarUrl={sub.member.avatar_url} />
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold text-[#170C28] truncate">@{sub.member.username}</p>
                  <p className="text-[11.5px] text-[#8B7BA8] mt-0.5">{symbol}{sub.plan.price.toLocaleString()} {sub.plan.billing_cycle}</p>
                </div>
              </div>

              <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full border w-fit" style={{ color: pc.accent, background: pc.light, borderColor: pc.border }}>
                {sub.plan.name}
              </span>

              <span className="text-[12px] text-[#8B7BA8]">{formatDate(sub.started_at)}</span>
              <span className="text-[12px] text-[#8B7BA8]">{sub.expires_at ? formatDate(sub.expires_at) : "—"}</span>

              <span className={cn("text-[12px] font-medium", sub.auto_renew ? "text-[#059669]" : "text-[#BEB3D0]")}>
                {sub.auto_renew ? "Yes" : "No"}
              </span>

              <span className={cn(
                "inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border w-fit",
                sub.status === "active"    && "text-[#059669] bg-success-soft border-[#A7F3D0]",
                sub.status === "expired"   && "text-[#D97706] bg-amber-soft border-[#FDE68A]",
                sub.status === "cancelled" && "text-[#8B7BA8] bg-[#F7F5FB] border-[#E4DFF0]",
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full shrink-0",
                  sub.status === "active" && "bg-[#059669]",
                  sub.status === "expired" && "bg-[#D97706]",
                  sub.status === "cancelled" && "bg-[#BEB3D0]",
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
