"use client"

import { useState } from "react"

const cn = (...c) => c.filter(Boolean).join(" ")

const INITIAL_PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: "1000",
    description: "Perfect for casual followers who want the essentials.",
    features: ["All free posts", "Community comments", "Monthly newsletter"],
    subscribers: 890,
    active: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "2500",
    description: "Full access for the dedicated fan. All content, no limits.",
    features: ["Everything in Basic", "All video content", "Early access", "Discord community"],
    subscribers: 1020,
    active: true,
    featured: true,
  },
  {
    id: "vip",
    name: "VIP",
    price: "5000",
    description: "The inner circle. Direct access and exclusive perks.",
    features: ["Everything in Pro", "1-on-1 monthly session", "Downloadable assets", "Name in credits"],
    subscribers: 230,
    active: true,
  },
]

const PLAN_STYLE = {
  basic: { accent:"#0D9488", light:"#F0FDFA", border:"#99F6E4", bar:"#2DD4BF" },
  pro:   { accent:"#7C3AED", light:"#F5F3FF", border:"#DDD6FE", bar:"#8B5CF6" },
  vip:   { accent:"#B45309", light:"#FFFBEB", border:"#FDE68A", bar:"#F59E0B" },
}

// ─── Icons ─────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M6.5 1v11M1 6.5h11"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 6l3 3 5-5"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M1.5 2.5h8M3.5 2.5V1.5h4v1"/><path d="M2.5 2.5l.5 7h5l.5-7"/>
  </svg>
)

// ─── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ on, onChange }) {
  return (
    <button onClick={onChange}
      className="relative w-[38px] h-[22px] rounded-full transition-all duration-200 shrink-0"
      style={{ background: on ? "#7C3AED" : "#DDD6FE" }}>
      <span className="absolute top-[3px] w-[16px] h-[16px] rounded-full bg-white transition-all duration-200"
        style={{ left: on ? "19px" : "3px", boxShadow:"0 1px 3px rgba(0,0,0,0.15)" }} />
    </button>
  )
}

// ─── Plan Card ─────────────────────────────────────────────────────────────────
function PlanCard({ plan, onUpdate }) {
  const [editing, setEditing]   = useState(false)
  const [saved, setSaved]       = useState(false)
  const [draftName, setDraftName]     = useState(plan.name)
  const [draftPrice, setDraftPrice]   = useState(plan.price)
  const [draftDesc, setDraftDesc]     = useState(plan.description)
  const [draftFeats, setDraftFeats]   = useState([...plan.features])
  const style = PLAN_STYLE[plan.id]

  const handleSave = () => {
    onUpdate(plan.id, { name:draftName, price:draftPrice, description:draftDesc, features:draftFeats })
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 2200)
  }

  const handleCancel = () => {
    setDraftName(plan.name); setDraftPrice(plan.price)
    setDraftDesc(plan.description); setDraftFeats([...plan.features])
    setEditing(false)
  }

  const inputCls = "w-full bg-[#FDFCFF] border border-[#DDD6FE] rounded-[10px] px-3.5 py-2.5 text-[13.5px] text-[#13111A] placeholder:text-[#C4B5FD] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 transition-all"

  return (
    <div className="bg-white rounded-2xl border overflow-hidden transition-all"
      style={{
        borderColor: plan.featured ? style.accent : "#EDE9F6",
        boxShadow: plan.featured
          ? `0 4px 20px ${style.accent}22`
          : "0 2px 12px rgba(124,58,237,0.05)"
      }}>

      {/* Card header */}
      <div className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor:"#F5F3FF", background: plan.featured ? style.light : "white" }}>
        <div className="flex items-center gap-3">
          <span className="text-[15px] font-bold text-[#13111A] tracking-tight">{plan.name}</span>
          {plan.featured && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ background:style.accent, color:"white" }}>
              Most popular
            </span>
          )}
          {saved && (
            <span className="flex items-center gap-1 text-[12px] font-medium text-[#0D9488]">
              <CheckIcon /> Saved
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Toggle on={plan.active} onChange={() => onUpdate(plan.id, { active: !plan.active })} />
          <span className="text-[11.5px] text-[#9B91B5] font-medium w-[38px]">
            {plan.active ? "Active" : "Paused"}
          </span>
          {editing ? (
            <>
              <button onClick={handleCancel}
                className="px-3.5 py-1.5 rounded-[8px] text-[12.5px] font-medium text-[#6B5B9A] bg-[#F5F3FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] transition-colors">
                Cancel
              </button>
              <button onClick={handleSave}
                className="px-3.5 py-1.5 rounded-[8px] text-[12.5px] font-semibold text-white transition-all"
                style={{ background:"#7C3AED", boxShadow:"0 3px 10px rgba(124,58,237,0.3)" }}>
                Save
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)}
              className="px-3.5 py-1.5 rounded-[8px] text-[12.5px] font-medium text-[#6B5B9A] bg-white hover:bg-[#F5F3FF] border border-[#DDD6FE] transition-colors">
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Card body */}
      {editing ? (
        <div className="p-6 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-2">Plan name</label>
              <input value={draftName} onChange={e => setDraftName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-2">Monthly price (₦)</label>
              <input type="number" value={draftPrice} onChange={e => setDraftPrice(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-2">Description</label>
            <textarea value={draftDesc} onChange={e => setDraftDesc(e.target.value)} rows={2}
              className={cn(inputCls, "resize-none leading-relaxed")} />
          </div>
          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-2">Features</label>
            <div className="flex flex-col gap-2">
              {draftFeats.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={f} onChange={e => setDraftFeats(fs => fs.map((x,j) => j===i ? e.target.value : x))}
                    className={cn(inputCls, "flex-1")} />
                  <button onClick={() => setDraftFeats(fs => fs.filter((_,j) => j!==i))}
                    className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#9B91B5] border border-[#EDE9F6] hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all shrink-0">
                    <TrashIcon />
                  </button>
                </div>
              ))}
              <button onClick={() => setDraftFeats(fs => [...fs, ""])}
                className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#7C3AED] hover:opacity-70 transition-opacity mt-1 self-start">
                <PlusIcon /> Add feature
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 grid grid-cols-[1fr_1fr_160px] gap-8">
          {/* Pricing */}
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-3">Pricing</p>
            <p className="text-[30px] font-bold text-[#13111A] leading-none tracking-tight">
              ₦{Number(plan.price).toLocaleString()}
            </p>
            <p className="text-[12.5px] text-[#9B91B5] mt-1">per month</p>
            <p className="text-[13px] text-[#6B5B9A] mt-3 leading-relaxed">{plan.description}</p>
          </div>

          {/* Features */}
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-3">Includes</p>
            <ul className="flex flex-col gap-2.5">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-[13px] font-medium text-[#3D2D6B]">
                  <span className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0"
                    style={{ background:style.light, color:style.accent }}>
                    <CheckIcon />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribers */}
          <div className="flex flex-col">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-3">Subscribers</p>
            <p className="text-[32px] font-bold text-[#13111A] leading-none tracking-tight"
              style={{ color:style.accent }}>
              {plan.subscribers.toLocaleString()}
            </p>
            <p className="text-[12px] text-[#9B91B5] mt-1">active this month</p>

            {/* Mini bar */}
            <div className="mt-auto pt-4">
              <div className="h-1.5 bg-[#F3F0FB] rounded-full overflow-hidden">
                <div className="h-full rounded-full"
                  style={{
                    width:`${Math.round(plan.subscribers / (890+1020+230) * 100)}%`,
                    background:style.bar
                  }} />
              </div>
              <p className="text-[11px] text-[#9B91B5] mt-1.5">
                {Math.round(plan.subscribers / (890+1020+230) * 100)}% of all subscribers
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function PlansPage() {
  const [plans, setPlans] = useState(INITIAL_PLANS)

  const updatePlan = (id, changes) =>
    setPlans(ps => ps.map(p => p.id === id ? { ...p, ...changes } : p))

  const totalSubs    = plans.reduce((a, p) => a + p.subscribers, 0)
  const totalRevenue = plans.reduce((a, p) => a + (p.active ? p.subscribers * Number(p.price) : 0), 0)

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
            <h1 className="text-[24px] font-bold text-[#13111A] tracking-tight">Subscription Plans</h1>
            <p className="text-[13px] text-[#9B91B5] mt-1">Set your pricing and what each tier unlocks</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13.5px] font-semibold text-white transition-all"
            style={{ background:"#7C3AED", boxShadow:"0 4px 16px rgba(124,58,237,0.3)" }}>
            <PlusIcon /> Add Plan
          </button>
        </div>

        {/* ── Summary strip ── */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label:"Total subscribers", value: totalSubs.toLocaleString(),        sub:"across all plans" },
            { label:"Monthly revenue",   value:`₦${(totalRevenue/1000).toFixed(0)}K`, sub:"before 10% fee" },
            { label:"Active plans",      value: plans.filter(p=>p.active).length,  sub:`of ${plans.length} total` },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#EDE9F6] px-6 py-5"
              style={{ boxShadow:"0 2px 12px rgba(124,58,237,0.05)" }}>
              <p className="text-[11.5px] text-[#9B91B5] font-medium mb-1.5">{s.label}</p>
              <p className="text-[26px] font-bold text-[#13111A] leading-none tracking-tight">{s.value}</p>
              <p className="text-[11.5px] text-[#9B91B5] mt-1.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Plan cards ── */}
        <div className="flex flex-col gap-4 mb-6">
          {plans.map(plan => (
            <PlanCard key={plan.id} plan={plan} onUpdate={updatePlan} />
          ))}
        </div>

        {/* ── Payout notice ── */}
        <div className="rounded-2xl border border-[#DDD6FE] px-6 py-5"
          style={{ background:"#F5F3FF" }}>
          <p className="text-[13.5px] font-semibold text-[#13111A] mb-1">Hubora takes 10%</p>
          <p className="text-[13px] text-[#6B5B9A] leading-relaxed">
            You keep 90% of all subscription revenue. Payouts are processed every Monday directly to your bank account.
          </p>
        </div>

      </div>
    </>
  )
}