"use client"

import { useState } from "react"

const cn = (...c) => c.filter(Boolean).join(" ")

const SUBSCRIBERS = [
  { id:"1",  name:"Kemi Adeyemi",   handle:"@kemiadeyemi",  plan:"Pro",   joined:"Mar 1, 2026",  spent:"₦7,500",  status:"active"    },
  { id:"2",  name:"Tunde Williams", handle:"@tundewill",    plan:"VIP",   joined:"Feb 20, 2026", spent:"₦15,000", status:"active"    },
  { id:"3",  name:"Sola Okafor",    handle:"@solaokafor",   plan:"Basic", joined:"Feb 14, 2026", spent:"₦2,000",  status:"active"    },
  { id:"4",  name:"Ada Nwosu",      handle:"@adanwosu",     plan:"Pro",   joined:"Feb 10, 2026", spent:"₦5,000",  status:"active"    },
  { id:"5",  name:"Emeka Eze",      handle:"@emekaeze",     plan:"Basic", joined:"Jan 30, 2026", spent:"₦3,000",  status:"active"    },
  { id:"6",  name:"Ngozi Obi",      handle:"@ngoziobi",     plan:"VIP",   joined:"Jan 22, 2026", spent:"₦25,000", status:"active"    },
  { id:"7",  name:"Chioma Ibe",     handle:"@chiomaibe",    plan:"Pro",   joined:"Jan 15, 2026", spent:"₦10,000", status:"active"    },
  { id:"8",  name:"Bola Savage",    handle:"@bolasavage",   plan:"Basic", joined:"Jan 8, 2026",  spent:"₦1,000",  status:"cancelled" },
  { id:"9",  name:"Femi Coker",     handle:"@femicoker",    plan:"Pro",   joined:"Dec 20, 2025", spent:"₦7,500",  status:"active"    },
  { id:"10", name:"Zara Ahmed",     handle:"@zaraahmed",    plan:"VIP",   joined:"Dec 10, 2025", spent:"₦20,000", status:"active"    },
]

const PLAN_STYLE = {
  Basic: { accent:"#0D9488", light:"#F0FDFA", border:"#99F6E4" },
  Pro:   { accent:"#7C3AED", light:"#F5F3FF", border:"#DDD6FE" },
  VIP:   { accent:"#B45309", light:"#FFFBEB", border:"#FDE68A" },
}

// Avatar with initials
function Avatar({ name }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()
  // deterministic soft color from name
  const colors = [
    ["#EDE9FE","#7C3AED"], ["#F0FDFA","#0D9488"], ["#FFFBEB","#B45309"],
    ["#FEF2F2","#DC2626"], ["#EFF6FF","#2563EB"],
  ]
  const idx = name.charCodeAt(0) % colors.length
  const [bg, fg] = colors[idx]
  return (
    <div className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center shrink-0 text-[12px] font-bold border"
      style={{ background:bg, color:fg, borderColor:fg+"33" }}>
      {initials}
    </div>
  )
}

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="6" cy="6" r="4.2"/><path d="M9.5 9.5 13 13"/>
  </svg>
)

export default function SubscribersPage() {
  const [planFilter, setPlanFilter] = useState("all")
  const [search, setSearch]         = useState("")

  const filtered = SUBSCRIBERS
    .filter(s => planFilter === "all" || s.plan === planFilter)
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.handle.toLowerCase().includes(search.toLowerCase())
    )

  const active    = SUBSCRIBERS.filter(s => s.status === "active").length
  const cancelled = SUBSCRIBERS.length - active

  const planCounts = {
    Basic: SUBSCRIBERS.filter(s => s.plan === "Basic").length,
    Pro:   SUBSCRIBERS.filter(s => s.plan === "Pro").length,
    VIP:   SUBSCRIBERS.filter(s => s.plan === "VIP").length,
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="min-h-screen px-8 py-8" style={{ background:"#F4F1FB" }}>

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <h1 className="text-[24px] font-bold text-[#13111A] tracking-tight">Subscribers</h1>
            <p className="text-[13px] text-[#9B91B5] mt-1">
              {active} active · {cancelled} cancelled
            </p>
          </div>
          <button className="px-4 py-2.5 rounded-[10px] text-[13px] font-medium text-[#6B5B9A] bg-white border border-[#DDD6FE] hover:bg-[#F5F3FF] transition-colors">
            Export CSV
          </button>
        </div>

        {/* ── Plan breakdown ── */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { key:"all",   label:"All",   value:SUBSCRIBERS.length, sub:"total subscribers", accent:"#7C3AED", light:"#F5F3FF", border:"#DDD6FE" },
            { key:"Basic", label:"Basic", value:planCounts.Basic,   sub:"subscribers",       ...PLAN_STYLE.Basic },
            { key:"Pro",   label:"Pro",   value:planCounts.Pro,     sub:"subscribers",       ...PLAN_STYLE.Pro   },
            { key:"VIP",   label:"VIP",   value:planCounts.VIP,     sub:"subscribers",       ...PLAN_STYLE.VIP   },
          ].map(card => {
            const active = planFilter === card.key
            return (
              <button key={card.key} onClick={() => setPlanFilter(card.key)}
                className="text-left p-5 rounded-2xl border-2 transition-all duration-150"
                style={{
                  background: active ? card.light : "white",
                  borderColor: active ? card.border : "#EDE9F6",
                  boxShadow: active ? `0 4px 16px ${card.accent}18` : "0 2px 8px rgba(124,58,237,0.04)"
                }}>
                <p className="text-[28px] font-bold leading-none tracking-tight mb-1.5"
                  style={{ color: active ? card.accent : "#13111A" }}>
                  {card.value}
                </p>
                <p className="text-[12px] font-medium text-[#9B91B5]">
                  {card.label} {card.sub}
                </p>
              </button>
            )
          })}
        </div>

        {/* ── Search ── */}
        <div className="relative mb-4 w-[280px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4B5FD]"><SearchIcon /></span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search subscribers…"
            className="w-full bg-white border border-[#DDD6FE] rounded-[10px] pl-9 pr-4 py-2 text-[13px] text-[#13111A] placeholder:text-[#C4B5FD] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 transition-all" />
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-[#EDE9F6] overflow-hidden"
          style={{ boxShadow:"0 2px 12px rgba(124,58,237,0.06)" }}>

          {/* Column headers */}
          <div className="grid items-center gap-4 px-6 py-3.5 border-b border-[#F5F3FF]"
            style={{ gridTemplateColumns:"1fr 90px 110px 110px 100px 80px", background:"#FDFCFF" }}>
            {["Subscriber","Plan","Joined","Total spent","Status",""].map(h => (
              <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-[#C4B5FD]">{h}</span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-2">
              <p className="text-[15px] font-semibold text-[#13111A]">No subscribers found</p>
              <p className="text-[13px] text-[#9B91B5]">Try adjusting your search or filter</p>
            </div>
          ) : filtered.map(sub => {
            const pStyle = PLAN_STYLE[sub.plan]
            const isActive = sub.status === "active"

            return (
              <div key={sub.id}
                className="group grid items-center gap-4 px-6 py-4 border-b border-[#F9F7FF] last:border-0 transition-colors hover:bg-[#FDFCFF]"
                style={{ gridTemplateColumns:"1fr 90px 110px 110px 100px 80px" }}>

                {/* Subscriber */}
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={sub.name} />
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold text-[#13111A] truncate leading-tight">{sub.name}</p>
                    <p className="text-[11.5px] text-[#9B91B5] mt-0.5">{sub.handle}</p>
                  </div>
                </div>

                {/* Plan */}
                <span className="inline-flex items-center text-[11.5px] font-semibold px-2.5 py-1 rounded-full border w-fit"
                  style={{ color:pStyle.accent, background:pStyle.light, borderColor:pStyle.border }}>
                  {sub.plan}
                </span>

                {/* Joined */}
                <span className="text-[12.5px] text-[#9B91B5]">{sub.joined}</span>

                {/* Spent */}
                <span className="text-[13.5px] font-bold text-[#13111A] tabular-nums">{sub.spent}</span>

                {/* Status */}
                <span className={cn(
                  "inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1 rounded-full border w-fit",
                  isActive
                    ? "text-[#0D9488] bg-[#F0FDFA] border-[#99F6E4]"
                    : "text-[#9B91B5] bg-[#F5F3FF] border-[#EDE9FE]"
                )}>
                  <span className={cn("w-1.5 h-1.5 rounded-full shrink-0",
                    isActive ? "bg-[#2DD4BF]" : "bg-[#C4B5FD]")} />
                  {isActive ? "Active" : "Cancelled"}
                </span>

                {/* Action */}
                <button className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-[8px] text-[12px] font-medium text-[#7C3AED] bg-[#F5F3FF] border border-[#DDD6FE] hover:bg-[#EDE9FE] transition-all">
                  Message
                </button>

              </div>
            )
          })}
        </div>

      </div>
    </>
  )
}