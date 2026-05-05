"use client"

import { useState } from "react"
import { useMyPlans, useCreatePlan, useUpdatePlan, useDeletePlan, useTogglePlan } from "@/hooks/usePlans"
import { useOwnHubStats } from "@/hooks/useHubs"
import { useHubEarnings } from "@/hooks/usePayments"
import type { PlanResponse } from "@/types/plans"

const cn = (...c: (string | boolean | undefined)[]) => c.filter(Boolean).join(" ")

const PLAN_STYLES = [
  { accent: "#7C3AED", light: "#F5F3FF", border: "#DDD6FE", bar: "#8B5CF6" },
  { accent: "#0D9488", light: "#F0FDFA", border: "#99F6E4", bar: "#2DD4BF" },
  { accent: "#B45309", light: "#FFFBEB", border: "#FDE68A", bar: "#F59E0B" },
  { accent: "#0EA5E9", light: "#F0F9FF", border: "#BAE6FD", bar: "#38BDF8" },
  { accent: "#EC4899", light: "#FDF2F8", border: "#FBCFE8", bar: "#F472B6" },
]

const planStyle = (index: number) => PLAN_STYLES[index % PLAN_STYLES.length]

const BILLING_LABELS: Record<string, string> = {
  monthly:   "/ month",
  yearly:    "/ year",
  one_time:  "one-time",
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: "₦", USD: "$", EUR: "€", GBP: "£",
}

// ─── Icons ────────────────────────────────────────────────────────────────────
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

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ on, onChange, disabled }: { on: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className="relative w-[38px] h-[22px] rounded-full transition-all duration-200 shrink-0 disabled:opacity-50"
      style={{ background: on ? "#7C3AED" : "#DDD6FE" }}
    >
      <span
        className="absolute top-[3px] w-[16px] h-[16px] rounded-full bg-white transition-all duration-200"
        style={{ left: on ? "19px" : "3px", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }}
      />
    </button>
  )
}

// ─── Create Plan Modal ────────────────────────────────────────────────────────
function CreatePlanModal({ onClose }: { onClose: () => void }) {
  const [name, setName]               = useState("")
  const [price, setPrice]             = useState("")
  const [currency, setCurrency]       = useState<"NGN" | "USD" | "EUR" | "GBP">("NGN")
  const [billingCycle, setBilling]    = useState<"monthly" | "yearly" | "one_time">("monthly")
  const [description, setDescription] = useState("")
  const [error, setError]             = useState("")

  const { mutate: createPlan, isPending } = useCreatePlan()

  const inputCls = "w-full bg-[#FDFCFF] border border-[#DDD6FE] rounded-[10px] px-3.5 py-2.5 text-[13.5px] text-[#13111A] placeholder:text-[#C4B5FD] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 transition-all"

  const handleSubmit = () => {
    if (!name.trim()) return setError("Plan name is required.")
    if (!price || Number(price) <= 0) return setError("Price must be greater than 0.")
    setError("")
    createPlan(
      { name: name.trim(), price: Number(price), currency, billing_cycle: billingCycle, description: description || undefined },
      { onSuccess: onClose }
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(19,17,26,0.5)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[460px] rounded-2xl border border-[#EDE9F6] overflow-hidden"
        style={{ boxShadow: "0 24px 64px rgba(124,58,237,0.16)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-[#F5F3FF]">
          <h3 className="text-[17px] font-semibold text-[#13111A] tracking-tight">New Plan</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F5F3FF] flex items-center justify-center text-[#9B91B5] hover:bg-[#EDE9FE] transition-colors text-lg">×</button>
        </div>

        <div className="px-7 py-6 flex flex-col gap-5">
          {/* Name */}
          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-2">Plan name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Pro" className={inputCls} />
          </div>

          {/* Price + Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-2">Price</label>
              <input type="number" min="1" value={price} onChange={e => setPrice(e.target.value)} placeholder="0" className={inputCls} />
            </div>
            <div>
              <label className="block text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-2">Currency</label>
              <select value={currency} onChange={e => setCurrency(e.target.value as any)} className={inputCls}>
                {["NGN", "USD", "EUR", "GBP"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Billing cycle */}
          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-2">Billing cycle</label>
            <div className="grid grid-cols-3 gap-2">
              {(["monthly", "yearly", "one_time"] as const).map(cycle => (
                <button
                  key={cycle}
                  type="button"
                  onClick={() => setBilling(cycle)}
                  className="py-2 rounded-[8px] text-[12px] font-semibold capitalize transition-all border"
                  style={{
                    background: billingCycle === cycle ? "#7C3AED" : "#FDFCFF",
                    color: billingCycle === cycle ? "white" : "#6B5B9A",
                    borderColor: billingCycle === cycle ? "#7C3AED" : "#DDD6FE",
                  }}
                >
                  {cycle.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-2">Description <span className="normal-case font-normal">(optional)</span></label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="What do subscribers get?"
              className={cn(inputCls, "resize-none leading-relaxed")}
            />
          </div>

          {error && (
            <p className="text-red-500 bg-red-50 border border-red-100 rounded-[8px] px-3 py-2 text-[12.5px]">{error}</p>
          )}
        </div>

        <div className="px-7 pb-6 flex gap-2.5">
          <button onClick={onClose} className="flex-1 py-3 rounded-[10px] text-[13px] font-medium text-[#6B5B9A] bg-[#F5F3FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 py-3 rounded-[10px] text-[13.5px] font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: "#7C3AED", boxShadow: "0 4px 16px rgba(124,58,237,0.35)" }}
          >
            {isPending ? "Creating…" : "Create Plan"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Plan Card ────────────────────────────────────────────────────────────────
interface PlanCardProps {
  plan: PlanResponse
  index: number
}

function PlanCard({ plan, index }: PlanCardProps) {
  const [editing, setEditing]         = useState(false)
  const [saved, setSaved]             = useState(false)
  const [draftName, setDraftName]     = useState(plan.name)
  const [draftPrice, setDraftPrice]   = useState(String(plan.price))
  const [draftDesc, setDraftDesc]     = useState(plan.description ?? "")

  const { mutate: updatePlan, isPending: updating } = useUpdatePlan()
  const { mutate: togglePlan, isPending: toggling }  = useTogglePlan()
  const { mutate: deletePlan, isPending: deleting }  = useDeletePlan()

  const style  = planStyle(index)
  const symbol = CURRENCY_SYMBOLS[plan.currency] ?? plan.currency

  const handleSave = () => {
    updatePlan(
      { planId: plan.id, body: { name: draftName, price: Number(draftPrice), description: draftDesc || undefined } },
      {
        onSuccess: () => {
          setSaved(true)
          setEditing(false)
          setTimeout(() => setSaved(false), 2200)
        },
      }
    )
  }

  const handleCancel = () => {
    setDraftName(plan.name)
    setDraftPrice(String(plan.price))
    setDraftDesc(plan.description ?? "")
    setEditing(false)
  }

  const inputCls = "w-full bg-[#FDFCFF] border border-[#DDD6FE] rounded-[10px] px-3.5 py-2.5 text-[13.5px] text-[#13111A] placeholder:text-[#C4B5FD] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 transition-all"

  return (
    <div
      className="bg-white rounded-2xl border overflow-hidden transition-all"
      style={{
        borderColor: "#EDE9F6",
        boxShadow: "0 2px 12px rgba(124,58,237,0.05)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "#F5F3FF" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-[15px] font-bold text-[#13111A] tracking-tight">{plan.name}</span>
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: style.light, color: style.accent }}
          >
            {plan.billing_cycle.replace("_", " ")}
          </span>
          {saved && (
            <span className="flex items-center gap-1 text-[12px] font-medium text-[#0D9488]">
              <CheckIcon /> Saved
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Toggle
            on={plan.is_active}
            onChange={() => togglePlan(plan.id)}
            disabled={toggling}
          />
          <span className="text-[11.5px] text-[#9B91B5] font-medium w-[40px]">
            {plan.is_active ? "Active" : "Paused"}
          </span>

          {editing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-3.5 py-1.5 rounded-[8px] text-[12.5px] font-medium text-[#6B5B9A] bg-[#F5F3FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={updating}
                className="px-3.5 py-1.5 rounded-[8px] text-[12.5px] font-semibold text-white transition-all disabled:opacity-50"
                style={{ background: "#7C3AED", boxShadow: "0 3px 10px rgba(124,58,237,0.3)" }}
              >
                {updating ? "Saving…" : "Save"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="px-3.5 py-1.5 rounded-[8px] text-[12.5px] font-medium text-[#6B5B9A] bg-white hover:bg-[#F5F3FF] border border-[#DDD6FE] transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete "${plan.name}"? This cannot be undone and will be blocked if subscribers are active.`)) {
                    deletePlan(plan.id)
                  }
                }}
                disabled={deleting}
                className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#9B91B5] border border-[#EDE9F6] bg-white hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all disabled:opacity-50"
                title="Delete plan"
              >
                <TrashIcon />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      {editing ? (
        <div className="p-6 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-2">Plan name</label>
              <input value={draftName} onChange={e => setDraftName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-2">Price ({plan.currency})</label>
              <input type="number" min="1" value={draftPrice} onChange={e => setDraftPrice(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-2">Description</label>
            <textarea
              value={draftDesc}
              onChange={e => setDraftDesc(e.target.value)}
              rows={2}
              className={cn(inputCls, "resize-none leading-relaxed")}
              placeholder="What do subscribers get?"
            />
          </div>
          <p className="text-[12px] text-[#9B91B5]">
            Note: currency and billing cycle cannot be changed after creation. Delete and recreate the plan if needed.
          </p>
        </div>
      ) : (
        <div className="p-6 grid grid-cols-[1fr_1fr] gap-8">
          {/* Pricing + description */}
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-3">Pricing</p>
            <p className="text-[30px] font-bold text-[#13111A] leading-none tracking-tight">
              {symbol}{Number(plan.price).toLocaleString()}
            </p>
            <p className="text-[12.5px] text-[#9B91B5] mt-1">{BILLING_LABELS[plan.billing_cycle]}</p>
            {plan.description && (
              <p className="text-[13px] text-[#6B5B9A] mt-3 leading-relaxed">{plan.description}</p>
            )}
          </div>

          {/* Status + meta */}
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-3">Details</p>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <span
                  className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0"
                  style={{ background: style.light, color: style.accent }}
                >
                  <CheckIcon />
                </span>
                <span className="text-[13px] font-medium text-[#3D2D6B]">
                  {plan.currency} pricing
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0"
                  style={{ background: style.light, color: style.accent }}
                >
                  <CheckIcon />
                </span>
                <span className="text-[13px] font-medium text-[#3D2D6B] capitalize">
                  {plan.billing_cycle.replace("_", " ")} billing
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0"
                  style={{ background: plan.is_active ? style.light : "#F5F3FF", color: plan.is_active ? style.accent : "#C4B5FD" }}
                >
                  <CheckIcon />
                </span>
                <span className="text-[13px] font-medium text-[#3D2D6B]">
                  {plan.is_active ? "Visible to members" : "Hidden from members"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PlansPage() {
  const [showCreate, setShowCreate] = useState(false)

  const { data: plans = [], isLoading } = useMyPlans()
  const { data: stats }                 = useOwnHubStats()
  const { data: earnings }              = useHubEarnings()

  const activePlans  = plans.filter(p => p.is_active)
  const currency     = earnings?.currency ?? "NGN"
  const symbol       = CURRENCY_SYMBOLS[currency] ?? currency
  const totalEarned  = earnings?.total_earned ?? 0

  return (
    <div className="min-h-screen px-8 py-8" style={{ background: "#F4F1FB" }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[24px] font-bold text-[#13111A] tracking-tight">Subscription Plans</h1>
          <p className="text-[13px] text-[#9B91B5] mt-1">Set your pricing and what each tier unlocks</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13.5px] font-semibold text-white transition-all"
          style={{ background: "#7C3AED", boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}
        >
          <PlusIcon /> Add Plan
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Total subscribers",
            value: stats ? stats.total_subscribers.toLocaleString() : "—",
            sub:   "across all plans",
          },
          {
            label: "Total earned",
            value: earnings ? `${symbol}${totalEarned.toLocaleString()}` : "—",
            sub:   "all-time revenue",
          },
          {
            label: "Active plans",
            value: isLoading ? "—" : String(activePlans.length),
            sub:   isLoading ? "" : `of ${plans.length} total`,
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-[#EDE9F6] px-6 py-5"
            style={{ boxShadow: "0 2px 12px rgba(124,58,237,0.05)" }}
          >
            <p className="text-[11.5px] text-[#9B91B5] font-medium mb-1.5">{s.label}</p>
            <p className="text-[26px] font-bold text-[#13111A] leading-none tracking-tight">{s.value}</p>
            <p className="text-[11.5px] text-[#9B91B5] mt-1.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Plan cards */}
      {isLoading ? (
        <div className="flex flex-col gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#EDE9F6] h-[140px] animate-pulse" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#EDE9F6] py-16 flex flex-col items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#F5F3FF] flex items-center justify-center text-[#C4B5FD]">
            <PlusIcon />
          </div>
          <p className="text-[13px] font-semibold text-[#9B91B5]">No plans yet</p>
          <p className="text-[12px] text-[#C4B5FD]">Create your first plan to start earning.</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-1 px-5 py-2 rounded-[10px] text-[13px] font-semibold text-white"
            style={{ background: "#7C3AED" }}
          >
            Create a plan
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mb-6">
          {plans.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>
      )}

      {/* Payout notice */}
      <div className="rounded-2xl border border-[#DDD6FE] px-6 py-5" style={{ background: "#F5F3FF" }}>
        <p className="text-[13.5px] font-semibold text-[#13111A] mb-1">Hubora takes 10%</p>
        <p className="text-[13px] text-[#6B5B9A] leading-relaxed">
          You keep 90% of all subscription revenue. Request payouts anytime from the Earnings page.
        </p>
      </div>

      {showCreate && <CreatePlanModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}