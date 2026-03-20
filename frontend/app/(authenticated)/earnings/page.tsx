// app/(creator)/earnings/page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, SectionLabel, SidebarItem, Tag } from "@/components/ui/hubora-ui"
import { cn } from "@/lib/utils"

const MONTHLY = [
  { month: "Aug", gross: 2100000, net: 1890000, subs: 1820 },
  { month: "Sep", gross: 2400000, net: 2160000, subs: 1910 },
  { month: "Oct", gross: 1800000, net: 1620000, subs: 1870 },
  { month: "Nov", gross: 2700000, net: 2430000, subs: 1980 },
  { month: "Dec", gross: 3100000, net: 2790000, subs: 2020 },
  { month: "Jan", gross: 2800000, net: 2520000, subs: 2060 },
  { month: "Feb", gross: 3400000, net: 3060000, subs: 2100 },
  { month: "Mar", gross: 3800000, net: 3420000, subs: 2140 },
]

const PAYOUTS = [
  { id: "p1", date: "Mar 3, 2026",  amount: "₦3,060,000", period: "February 2026", status: "paid",    ref: "HUB-2026-0302" },
  { id: "p2", date: "Feb 3, 2026",  amount: "₦2,520,000", period: "January 2026",  status: "paid",    ref: "HUB-2026-0203" },
  { id: "p3", date: "Jan 6, 2026",  amount: "₦2,790,000", period: "December 2025", status: "paid",    ref: "HUB-2026-0106" },
  { id: "p4", date: "Dec 2, 2025",  amount: "₦2,430,000", period: "November 2025", status: "paid",    ref: "HUB-2025-1202" },
  { id: "p5", date: "Mar 31, 2026", amount: "₦3,420,000", period: "March 2026",    status: "pending", ref: "HUB-2026-0331" },
]

const fmt = (n: number) => `₦${(n / 1000000).toFixed(1)}M`

export default function CreatorEarningsPage() {
  const [activeBar, setActiveBar] = useState(7)
  const maxGross = Math.max(...MONTHLY.map(m => m.gross))
  const current = MONTHLY[activeBar]

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">

      <main className="flex-1 px-8 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-[24px] font-bold text-[#0F0F14] tracking-tight">Earnings</h1>
            <p className="font-body text-[13px] text-[#9CA3AF] mt-1">Your revenue breakdown and payout history</p>
          </div>
          <Button variant="outline" size="md">Download Statement</Button>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "This Month (Gross)", value: "₦3.8M", sub: "+18% vs last month",  color: "text-[#10B981]" },
            { label: "This Month (Net)",   value: "₦3.42M", sub: "After 10% platform fee", color: "text-[#9CA3AF]" },
            { label: "All-time Earned",    value: "₦22.1M", sub: "Since joining Hubora", color: "text-[#9CA3AF]" },
            { label: "Next Payout",        value: "₦3.42M", sub: "Due Mar 31, 2026",    color: "text-[#6C36F5]" },
          ].map(s => (
            <Card key={s.label} padding="md">
              <p className="font-body text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">{s.label}</p>
              <p className="font-display text-[26px] font-bold text-[#0F0F14] leading-none">{s.value}</p>
              <p className={cn("font-body text-[12px] mt-1.5", s.color)}>{s.sub}</p>
            </Card>
          ))}
        </div>

        {/* Revenue chart */}
        <Card padding="lg" className="mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-[17px] text-[#0F0F14]">Monthly Revenue</h2>
              <p className="font-body text-[12px] text-[#9CA3AF] mt-0.5">Click a bar to see details</p>
            </div>
            {/* Selected bar detail */}
            <div className="text-right">
              <p className="font-body text-[12px] text-[#9CA3AF]">{current.month} 2026</p>
              <p className="font-display font-bold text-[20px] text-[#0F0F14]">{fmt(current.gross)}</p>
              <p className="font-body text-[12px] text-[#10B981]">Net: {fmt(current.net)}</p>
            </div>
          </div>

          <div className="flex items-end gap-2 h-[140px] border-b border-[#F3F4F6] mb-3">
            {MONTHLY.map((bar, i) => (
              <div
                key={bar.month}
                className="flex-1 flex flex-col items-center cursor-pointer group"
                onClick={() => setActiveBar(i)}
              >
                <div
                  className={cn(
                    "w-full rounded-t-xl transition-all duration-200",
                    activeBar === i
                      ? "bg-gradient-to-t from-[#6C36F5] to-[#A855F7] shadow-[0_-4px_12px_-2px_rgba(108,54,245,0.3)]"
                      : "bg-[#F5F3FF] group-hover:bg-[#DDD6FE]"
                  )}
                  style={{ height: `${(bar.gross / maxGross) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {MONTHLY.map((bar, i) => (
              <div key={bar.month} className="flex-1 text-center">
                <span className={cn("font-body text-[11px]", activeBar === i ? "text-[#6C36F5] font-semibold" : "text-[#9CA3AF]")}>{bar.month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Plan revenue breakdown */}
        <div className="grid grid-cols-2 gap-5 mb-6">
          <Card padding="lg">
            <h2 className="font-display font-bold text-[16px] text-[#0F0F14] mb-5">Revenue by Plan</h2>
            <div className="flex flex-col gap-4">
              {[
                { name: "Basic", revenue: "₦890,000",  pct: 23, count: 890,  color: "bg-[#C4B5FD]" },
                { name: "Pro",   revenue: "₦2,550,000", pct: 67, count: 1020, color: "bg-[#6C36F5]" },
                { name: "VIP",   revenue: "₦1,150,000", pct: 30, count: 230,  color: "bg-gradient-to-r from-[#F59E0B] to-[#F97316]" },
              ].map(p => (
                <div key={p.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <Tag variant={p.name === "VIP" ? "amber" : p.name === "Pro" ? "violet" : "success"} size="sm" dot>{p.name}</Tag>
                      <span className="font-body text-[12px] text-[#9CA3AF]">{p.count} subs</span>
                    </div>
                    <span className="font-mono text-[12px] font-semibold text-[#0F0F14]">{p.revenue}</span>
                  </div>
                  <div className="h-2 bg-[#F5F3FF] rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-700", p.color)} style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="font-display font-bold text-[16px] text-[#0F0F14] mb-5">Bank Account</h2>
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-[#F5F3FF] border border-[#DDD6FE] rounded-2xl">
                <p className="font-body text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1">Linked Account</p>
                <p className="font-display font-bold text-[15px] text-[#0F0F14]">Zenith Bank</p>
                <p className="font-body text-[13px] text-[#6B7280] mt-0.5">•••• •••• •••• 4821</p>
                <p className="font-body text-[12px] text-[#9CA3AF] mt-0.5">Lola Adebayo</p>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <span className="font-body text-[13px] text-[#6B7280]">Payout schedule</span>
                  <span className="font-body text-[13px] font-medium text-[#0F0F14]">Every Monday</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-[13px] text-[#6B7280]">Minimum payout</span>
                  <span className="font-body text-[13px] font-medium text-[#0F0F14]">₦10,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-[13px] text-[#6B7280]">Platform fee</span>
                  <span className="font-body text-[13px] font-medium text-[#0F0F14]">10%</span>
                </div>
              </div>
              <Button variant="outline" fullWidth size="sm">Update Bank Account</Button>
            </div>
          </Card>
        </div>

        {/* Payout history */}
        <Card padding="none" className="overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
            <h2 className="font-display font-bold text-[17px] text-[#0F0F14]">Payout History</h2>
            <Button variant="ghost" size="sm">View all</Button>
          </div>
          <div className="grid grid-cols-[1fr_110px_130px_120px_80px] gap-4 px-6 py-3.5 bg-[#FAFAFA] border-b border-[#F3F4F6]">
            {["Period", "Amount", "Date", "Reference", "Status"].map(h => (
              <span key={h} className="font-body text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">{h}</span>
            ))}
          </div>
          {PAYOUTS.map(p => (
            <div
              key={p.id}
              className="grid grid-cols-[1fr_110px_130px_120px_80px] gap-4 items-center px-6 py-4 border-b border-[#F9FAFB] last:border-0 hover:bg-[#FAFAFA] transition-colors"
            >
              <span className="font-display font-semibold text-[13px] text-[#0F0F14]">{p.period}</span>
              <span className="font-mono text-[13px] font-bold text-[#0F0F14]">{p.amount}</span>
              <span className="font-body text-[12px] text-[#6B7280]">{p.date}</span>
              <span className="font-mono text-[11px] text-[#9CA3AF]">{p.ref}</span>
              <span className={p.status === "paid" ? "status-published" : "status-draft"}>{p.status}</span>
            </div>
          ))}
        </Card>

      </main>
    </div>
  )
}