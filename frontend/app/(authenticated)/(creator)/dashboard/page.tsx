// app/(creator)/dashboard/page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Avatar, Badge, SectionLabel, SidebarItem, StatCard, Tag } from "@/components/ui/hubora-ui"
import { cn } from "@/lib/utils"

const BARS = [
  { month: "Aug", height: 55, value: "₦2.1M" },
  { month: "Sep", height: 62, value: "₦2.4M" },
  { month: "Oct", height: 48, value: "₦1.8M" },
  { month: "Nov", height: 70, value: "₦2.7M" },
  { month: "Dec", height: 80, value: "₦3.1M" },
  { month: "Jan", height: 74, value: "₦2.8M" },
  { month: "Feb", height: 90, value: "₦3.4M" },
  { month: "Mar", height: 100, value: "₦3.8M" },
]

const CONTENT_ROWS = [
  { type: "🎬", title: "Advanced Colour Theory Pt.3", plan: "Pro",   views: "1,243", likes: "284", status: "published" },
  { type: "🖼️", title: "Studio Setup Tour 2025",      plan: "Basic", views: "876",   likes: "151", status: "published" },
  { type: "📄", title: "Brush Pack Vol.7 — Download", plan: "VIP",   views: "542",   likes: "98",  status: "published" },
  { type: "📝", title: "Art Business Guide 2025",      plan: "Pro",   views: "—",     likes: "—",   status: "draft" },
]

const PLANS_BREAKDOWN = [
  { name: "Basic", count: "890",   pct: 42, color: "bg-[#C4B5FD]" },
  { name: "Pro",   count: "1,020", pct: 48, color: "bg-[#6C36F5]" },
  { name: "VIP",   count: "230",   pct: 10, color: "bg-gradient-to-r from-[#F59E0B] to-[#F97316]" },
]

export default function CreatorDashboard() {
  const [activeBar, setActiveBar] = useState(7)

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <CreatorSidebar />

      <main className="flex-1 px-8 py-8 overflow-y-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-[24px] font-bold text-[#0F0F14] tracking-tight">Creator Dashboard</h1>
            <p className="font-body text-[13px] text-[#9CA3AF] mt-1">ArtByLola · Updated just now</p>
          </div>
          <Button variant="gradient" size="md" leftIcon={<span>+</span>}>New Post</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6 stagger">
          <StatCard label="Subscribers"      value="2,140"  change="+124 this month"     changeType="up"  icon="👥" />
          <StatCard label="Monthly Revenue"  value="₦3.8M"  change="+18% vs last month"  changeType="up"  icon="💰" />
          <StatCard label="Total Views"      value="48.2K"  change="+2.1K this week"      changeType="up"  icon="👁" />
          <StatCard label="Content Pieces"   value="186"    change="4 published this week" changeType="up" icon="📦" />
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 mb-5 shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_8px_-2px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-[17px] text-[#0F0F14]">Revenue</h2>
              <p className="font-body text-[12px] text-[#9CA3AF] mt-0.5">Last 8 months</p>
            </div>
            <div className="flex gap-1.5">
              {["Monthly", "Weekly"].map((v, i) => (
                <button key={v} className={cn(
                  "font-body text-[12px] font-medium px-3.5 py-1.5 rounded-full transition-all",
                  i === 0 ? "bg-[#6C36F5] text-white shadow-[0_2px_8px_-1px_rgba(108,54,245,0.4)]" : "text-[#9CA3AF] hover:text-[#6B7280] border border-[#F3F4F6]"
                )}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end gap-2 h-[140px] border-b border-[#F3F4F6] mb-3 pb-0">
            {BARS.map((bar, i) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center cursor-pointer group" onClick={() => setActiveBar(i)}>
                {activeBar === i ? (
                  <span className="font-mono text-[10px] font-medium bg-[#0F0F14] text-white px-2 py-1 rounded-lg mb-2 whitespace-nowrap shadow-[0_2px_4px_-1px_rgba(0,0,0,0.2)]">
                    {bar.value}
                  </span>
                ) : <span className="h-7" />}
                <div
                  className={cn(
                    "w-full rounded-t-xl transition-all duration-200",
                    activeBar === i ? "bg-gradient-to-t from-[#6C36F5] to-[#A855F7] shadow-[0_-4px_12px_-2px_rgba(108,54,245,0.3)]" : "bg-[#F5F3FF] group-hover:bg-[#DDD6FE]"
                  )}
                  style={{ height: `${bar.height}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {BARS.map((bar, i) => (
              <div key={bar.month} className="flex-1 text-center">
                <span className={cn("font-body text-[11px]", activeBar === i ? "text-[#6C36F5] font-semibold" : "text-[#9CA3AF]")}>{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Two cols */}
        <div className="grid grid-cols-2 gap-5 mb-5">

          {/* Plan breakdown */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_8px_-2px_rgba(0,0,0,0.06)]">
            <h2 className="font-display font-bold text-[16px] text-[#0F0F14] mb-5">Subscribers by Plan</h2>
            <div className="flex flex-col gap-4">
              {PLANS_BREAKDOWN.map(p => (
                <div key={p.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-body font-medium text-[13px] text-[#374151]">{p.name}</span>
                    <span className="font-mono text-[11px] text-[#9CA3AF]">{p.count} ({p.pct}%)</span>
                  </div>
                  <div className="h-2 bg-[#F5F3FF] rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-700", p.color)} style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top content */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_8px_-2px_rgba(0,0,0,0.06)]">
            <h2 className="font-display font-bold text-[16px] text-[#0F0F14] mb-5">Top Content This Week</h2>
            <div className="flex flex-col gap-2">
              {[
                { emoji: "🎬", title: "Colour Theory Pt.3",  views: "1,243", top: true },
                { emoji: "🖼️", title: "Studio Setup Tour",  views: "876" },
                { emoji: "📄", title: "Brush Pack PDF",      views: "542" },
                { emoji: "📝", title: "Art Business Guide",  views: "401" },
              ].map((item, i) => (
                <div key={i} className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors",
                  item.top ? "bg-[#F5F3FF]" : "hover:bg-[#FAFAFA]"
                )}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[16px]">{item.emoji}</span>
                    <span className="font-body font-medium text-[13px] text-[#0F0F14]">{item.title}</span>
                  </div>
                  <span className={cn("font-mono text-[12px] font-semibold", item.top ? "text-[#6C36F5]" : "text-[#9CA3AF]")}>{item.views}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Manager */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_8px_-2px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6]">
            <h2 className="font-display font-bold text-[17px] text-[#0F0F14]">Content Manager</h2>
            <div className="flex gap-2.5">
              <input
                type="text"
                placeholder="Search content…"
                className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-xl px-3.5 py-2 text-[13px] font-body w-[200px] outline-none focus:border-[#DDD6FE] focus:bg-white transition-all"
              />
              <Button variant="primary" size="sm" leftIcon={<span>+</span>}>Upload</Button>
            </div>
          </div>

          {/* Header row */}
          <div className="grid grid-cols-[36px_1fr_90px_80px_70px_120px] gap-4 px-6 py-3 bg-[#FAFAFA] border-b border-[#F3F4F6]">
            {["", "Title", "Plan", "Views", "Likes", "Status"].map(h => (
              <span key={h} className="font-body text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">{h}</span>
            ))}
          </div>

          {CONTENT_ROWS.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-[36px_1fr_90px_80px_70px_120px] gap-4 items-center px-6 py-4 border-b border-[#F9FAFB] last:border-b-0 hover:bg-[#FAFAFA] transition-colors cursor-pointer"
            >
              <span className="text-[18px]">{row.type}</span>
              <span className="font-display font-semibold text-[13px] text-[#0F0F14] truncate">{row.title}</span>
              <Tag variant={row.plan === "VIP" ? "amber" : row.plan === "Pro" ? "violet" : "success"} size="sm" dot>{row.plan}</Tag>
              <span className="font-mono text-[12px] text-[#9CA3AF]">{row.views}</span>
              <span className="font-mono text-[12px] text-[#9CA3AF]">{row.likes}</span>
              <span className={row.status === "published" ? "status-published" : "status-draft"}>{row.status}</span>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}

function CreatorSidebar() {
  return (
    <aside className="w-[240px] shrink-0 bg-white border-r border-[#F3F4F6] sticky top-0 h-screen flex flex-col overflow-y-auto">
      <div className="px-5 py-5 border-b border-[#F3F4F6]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C36F5] to-[#A855F7] shadow-[0_4px_10px_-2px_rgba(108,54,245,0.4)] flex items-center justify-center">
            <span className="text-white font-display font-black text-[13px]">H</span>
          </div>
          <span className="font-display font-bold text-[18px] tracking-tight text-[#0F0F14]">Hubora</span>
        </div>
      </div>

      <div className="flex-1 px-3 py-5 flex flex-col gap-6 overflow-y-auto">
        <nav className="flex flex-col gap-0.5">
          <SectionLabel className="px-3 mb-2">Creator Hub</SectionLabel>
          <SidebarItem icon="📊" label="Dashboard" active />
          <SidebarItem icon="🏠" label="My Hub" />
          <SidebarItem icon="📦" label="Content" />
          <SidebarItem icon="💳" label="Plans" />
          <SidebarItem icon="👥" label="Subscribers" />
          <SidebarItem icon="💰" label="Earnings" />
        </nav>
        <nav className="flex flex-col gap-0.5">
          <SectionLabel className="px-3 mb-2">Account</SectionLabel>
          <SidebarItem icon="🌐" label="Member Feed" />
          <SidebarItem icon="🔔" label="Notifications" badge={4} />
          <SidebarItem icon="⚙️" label="Settings" />
        </nav>
      </div>

      <div className="px-4 py-4 border-t border-[#F3F4F6]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C36F5] to-[#A855F7] flex items-center justify-center text-[16px] shadow-[0_3px_8px_-2px_rgba(108,54,245,0.35)]">🎨</div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-[13px] text-[#0F0F14] truncate">ArtByLola</p>
            <p className="font-body text-[11px] text-[#6C36F5] font-medium">✨ Creator</p>
          </div>
        </div>
      </div>
    </aside>
  )
}