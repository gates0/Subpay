"use client"

import { useState } from "react"

const cn = (...classes) => classes.filter(Boolean).join(" ")

// ── Data ──────────────────────────────────────────────
const BARS = [
  { month: "Aug", h: 55, v: "₦2.1M" },
  { month: "Sep", h: 62, v: "₦2.4M" },
  { month: "Oct", h: 48, v: "₦1.8M" },
  { month: "Nov", h: 70, v: "₦2.7M" },
  { month: "Dec", h: 80, v: "₦3.1M" },
  { month: "Jan", h: 74, v: "₦2.8M" },
  { month: "Feb", h: 90, v: "₦3.4M" },
  { month: "Mar", h: 100, v: "₦3.8M" },
]

const CONTENT_ROWS = [
  { type: "video",   title: "Advanced Colour Theory Pt.3",  plan: "Pro",   views: "1,243", likes: "284", status: "published" },
  { type: "image",   title: "Studio Setup Tour 2025",       plan: "Basic", views: "876",   likes: "151", status: "published" },
  { type: "file",    title: "Brush Pack Vol.7 — Download",  plan: "VIP",   views: "542",   likes: "98",  status: "published" },
  { type: "article", title: "Art Business Guide 2025",      plan: "Pro",   views: "—",     likes: "—",   status: "draft"     },
]

const TOP_CONTENT = [
  { type: "video",   title: "Colour Theory Pt.3",  views: "1,243", top: true },
  { type: "image",   title: "Studio Setup Tour",   views: "876" },
  { type: "file",    title: "Brush Pack PDF",      views: "542" },
  { type: "article", title: "Art Business Guide",  views: "401" },
]

// ── Dashboard-only icons ──────────────────────────────
const Icon = {
  upload:  (<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 1.5v8M4 4.5 7 1.5l3 3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 10.5v1a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1" strokeLinecap="round"/></svg>),
  plus:    (<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6.5 1v11M1 6.5h11" strokeLinecap="round"/></svg>),
  arrowUp: (<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 8V2M2 5l3-3 3 3" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  search:  (<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="5.8" cy="5.8" r="4"/><path d="M9 9 12 12" strokeLinecap="round"/></svg>),
  dots:    (<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="2.5" r="1.2" fill="currentColor"/><circle cx="7" cy="7" r="1.2" fill="currentColor"/><circle cx="7" cy="11.5" r="1.2" fill="currentColor"/></svg>),
  menu:    (<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 4.5h14M2 9h14M2 13.5h14" strokeLinecap="round"/></svg>),
  video:   (<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="0.8" y="2.5" width="11" height="8" rx="1.5"/><path d="M5 5l3.5 1.5L5 8V5Z" fill="currentColor" stroke="none"/></svg>),
  image:   (<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="11" height="11" rx="1.5"/><circle cx="4.5" cy="4.5" r="1.2" fill="currentColor" stroke="none"/><path d="M1 9l3-3 2.5 2.5L9 6l3 3.5"/></svg>),
  file:    (<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 1h5l3 3v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"/><path d="M7.5 1v3.5H11M4 7h5M4 9.5h3"/></svg>),
  article: (<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2.5 3h8M2.5 6h8M2.5 9h5"/></svg>),
}

// ── Small Components ──────────────────────────────────

function ContentTypeIcon({ type }) {
  return (
    <div className="w-[30px] h-[30px] rounded-[8px] bg-[#F3E8FF] border border-[#EDE5F8] flex items-center justify-center shrink-0 text-[#8A2BE2]">
      {Icon[type]}
    </div>
  )
}

function PlanTag({ plan }) {
  const styles = { Pro: "bg-[#F3E8FF] text-[#8A2BE2]", Basic: "bg-[#DCFCE7] text-[#166534]", VIP: "bg-[#FEF3C7] text-[#92400E]" }
  return <span className={cn("inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full", styles[plan])}>{plan}</span>
}

function StatusPill({ status }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full",
      status === "published" ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#F5EFFF] text-[#A08DBE] border border-[#EDE5F8]"
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full", status === "published" ? "bg-[#16A34A]" : "bg-[#A08DBE]")} />
      {status === "published" ? "Published" : "Draft"}
    </span>
  )
}

// ── Revenue Chart ──────────────────────────────────────

function RevenueChart() {
  const [activeBar, setActiveBar] = useState(7)
  const [period, setPeriod] = useState("Monthly")

  return (
    <div className="bg-white rounded-2xl border border-[#EDE5F8] p-6 mb-5"
      style={{ boxShadow: "0 1px 3px rgba(45,0,82,0.05)" }}>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h2 className="text-[17px] text-[#2D0052] tracking-tight">Revenue</h2>
          <p className="text-[12px] text-[#A08DBE] mt-0.5">Last 8 months</p>
        </div>
        <div className="flex gap-1.5">
          {["Monthly", "Weekly"].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={cn("text-[12px] font-medium px-3 py-1.5 rounded-full transition-all border",
                period === p ? "bg-[#8A2BE2] text-white border-[#8A2BE2]" : "text-[#A08DBE] border-[#EDE5F8] hover:border-[#E0B0FF] hover:text-[#8A2BE2]"
              )}>{p}</button>
          ))}
        </div>
      </div>
      <div className="flex items-end gap-1.5 h-[140px] border-b border-[#F5EFFF]">
        {BARS.map((bar, i) => (
          <div key={bar.month} className="flex-1 flex flex-col items-center justify-end h-full cursor-pointer group relative" onClick={() => setActiveBar(i)}>
            {activeBar === i && (
              <span className="absolute top-0 text-[10px] font-semibold bg-[#2D0052] text-white px-2 py-1 rounded-md whitespace-nowrap"
                style={{ boxShadow: "0 2px 6px rgba(45,0,82,0.2)" }}>{bar.v}</span>
            )}
            <div className={cn("w-full rounded-t-[6px] transition-all duration-200", activeBar === i ? "bg-[#8A2BE2]" : "bg-[#F3E8FF] group-hover:bg-[#E0B0FF]")}
              style={{ height: `${bar.h}%`, boxShadow: activeBar === i ? "0 -3px 12px rgba(138,43,226,0.2)" : "none" }} />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 mt-2.5">
        {BARS.map((bar, i) => (
          <div key={bar.month} className="flex-1 text-center">
            <span className={cn("text-[11px] font-medium", activeBar === i ? "text-[#8A2BE2] font-semibold" : "text-[#A08DBE]")}>{bar.month}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Quick Stats Strip (replaces stat cards) ────────────

function QuickStats() {
  const stats = [
    { label: "Subscribers", value: "2,140", sub: "+124 this month" },
    { label: "Revenue",     value: "₦3.8M", sub: "+18% vs last month" },
    { label: "Views",       value: "48.2K", sub: "+2.1K this week" },
    { label: "Posts",       value: "186",   sub: "4 this week" },
  ]

  return (
    <div className="bg-white rounded-2xl border border-[#EDE5F8] p-5 mb-5"
      style={{ boxShadow: "0 1px 3px rgba(45,0,82,0.05)" }}>
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#F5EFFF]">
        {stats.map((s, i) => (
          <div key={i} className={cn("flex flex-col px-5 first:pl-0 last:pr-0", i % 2 === 0 && i >= 2 && "mt-4 md:mt-0 border-t md:border-t-0 border-[#F5EFFF] pt-4 md:pt-0")}>
            <span className="text-[11.5px] font-medium text-[#A08DBE] mb-1.5">{s.label}</span>
            <span className="text-[28px] font-bold text-[#2D0052] leading-none tracking-tight mb-1">{s.value}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              {Icon.arrowUp}{s.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────

export default function CreatorDashboard() {

  return (
    <div className="flex min-h-screen bg-[#FBF8FF]">

      <div className="flex-1 min-w-0 flex flex-col">

        <main className="flex-1 px-6 lg:px-9 py-8 lg:py-10 overflow-y-auto">

          {/* Top bar */}
          <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
            <div>
              <h1 className="text-[26px] text-[#2D0052] leading-tight font-bold">Creator Dashboard</h1>
              <p className="text-[13px] text-[#A08DBE] mt-1">ArtByLola &nbsp;·&nbsp; Updated just now</p>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <button className="flex items-center gap-2 text-[13px] font-semibold text-[#6B4F8A] bg-white border border-[#EDE5F8] px-4 py-2.5 rounded-[10px] hover:bg-[#F3E8FF] hover:text-[#8A2BE2] hover:border-[#E0B0FF] transition-all">
                {Icon.plus} New Post
              </button>
              <button className="flex items-center gap-2 text-[13px] font-semibold text-white px-4 py-2.5 rounded-[10px] transition-all"
                style={{ background: "#8A2BE2", boxShadow: "0 4px 14px rgba(138,43,226,0.3)" }}>
                {Icon.upload} Upload Content
              </button>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <QuickStats />

          {/* Revenue Chart */}
          <RevenueChart />

          {/* Two col */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">

            {/* Plan Breakdown */}
            <div className="bg-white rounded-2xl border border-[#EDE5F8] p-6" style={{ boxShadow: "0 1px 3px rgba(45,0,82,0.04)" }}>
              <div className="mb-5">
                <h2 className="text-[17px] text-[#2D0052] font-semibold">Subscribers by Plan</h2>
                <p className="text-[12px] text-[#A08DBE] mt-0.5">2,140 total</p>
              </div>
              {[
                { name: "Basic", count: "890",   pct: 42, color: "#22C55E" },
                { name: "Pro",   count: "1,020", pct: 48, color: "#8A2BE2" },
                { name: "VIP",   count: "230",   pct: 10, color: "#F59E0B" },
              ].map(p => (
                <div key={p.name} className="mb-5 last:mb-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="flex items-center gap-2 text-[13px] font-semibold text-[#2D0052]">
                      <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />{p.name}
                    </span>
                    <span className="text-[12px] text-[#A08DBE] tabular-nums">{p.count} ({p.pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-[#F3E8FF] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p.pct}%`, background: p.color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Top Content */}
            <div className="bg-white rounded-2xl border border-[#EDE5F8] p-6" style={{ boxShadow: "0 1px 3px rgba(45,0,82,0.04)" }}>
              <div className="mb-4">
                <h2 className="text-[17px] text-[#2D0052] font-semibold">Top Content This Week</h2>
                <p className="text-[12px] text-[#A08DBE] mt-0.5">By view count</p>
              </div>
              <div className="flex flex-col gap-1">
                {TOP_CONTENT.map((item, i) => (
                  <div key={i} className={cn("flex items-center justify-between px-3 py-2.5 rounded-[10px] cursor-pointer transition-colors gap-3",
                    item.top ? "bg-[#F3E8FF]" : "hover:bg-[#F5EFFF]")}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ContentTypeIcon type={item.type} />
                      <span className="text-[13px] font-medium text-[#2D0052] truncate">{item.title}</span>
                    </div>
                    <span className={cn("text-[12.5px] font-semibold tabular-nums shrink-0", item.top ? "text-[#8A2BE2]" : "text-[#A08DBE]")}>
                      {item.views}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Manager */}
          <div className="bg-white rounded-2xl border border-[#EDE5F8] overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(45,0,82,0.04)" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5EFFF] gap-3 flex-wrap">
              <div>
                <h2 className="text-[17px] text-[#2D0052] font-semibold">Content Manager</h2>
                <p className="text-[12px] text-[#A08DBE] mt-0.5">186 pieces total</p>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A08DBE]">{Icon.search}</span>
                  <input type="text" placeholder="Search content…"
                    className="bg-[#FBF8FF] border border-[#EDE5F8] rounded-[9px] pl-9 pr-4 py-2 text-[13px] text-[#2D0052] placeholder:text-[#A08DBE] w-[200px] outline-none focus:border-[#E0B0FF] focus:ring-2 focus:ring-[#8A2BE2]/10 transition-all" />
                </div>
                <button className="flex items-center gap-1.5 text-[12.5px] font-semibold text-white px-3.5 py-2 rounded-[9px] transition-all"
                  style={{ background: "#8A2BE2", boxShadow: "0 3px 10px rgba(138,43,226,0.25)" }}>
                  {Icon.plus} Upload
                </button>
              </div>
            </div>

            <div className="hidden md:grid grid-cols-[32px_1fr_80px_72px_64px_108px_32px] gap-3 px-6 py-2.5 bg-[#FBF8FF] border-b border-[#F5EFFF]">
              {["", "Title", "Plan", "Views", "Likes", "Status", ""].map((h, i) => (
                <span key={i} className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#A08DBE]">{h}</span>
              ))}
            </div>

            {CONTENT_ROWS.map((row, i) => (
              <div key={i} className="group flex flex-col md:grid md:grid-cols-[32px_1fr_80px_72px_64px_108px_32px] gap-x-3 gap-y-2 items-start md:items-center px-6 py-4 border-b border-[#F5EFFF] last:border-b-0 hover:bg-[#FBF8FF] transition-colors cursor-pointer">
                <ContentTypeIcon type={row.type} />
                <span className="text-[13px] font-medium text-[#2D0052] truncate max-w-full">{row.title}</span>
                <PlanTag plan={row.plan} />
                <span className="text-[12px] text-[#A08DBE] tabular-nums md:block hidden">{row.views}</span>
                <span className="text-[12px] text-[#A08DBE] tabular-nums md:block hidden">{row.likes}</span>
                <StatusPill status={row.status} />
                <button className="w-[28px] h-[28px] rounded-[7px] flex items-center justify-center text-[#A08DBE] opacity-0 group-hover:opacity-100 hover:bg-[#F3E8FF] hover:text-[#8A2BE2] transition-all">
                  {Icon.dots}
                </button>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  )
}