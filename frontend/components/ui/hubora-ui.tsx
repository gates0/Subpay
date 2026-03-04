// components/ui/hubora-ui.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

/* ═══════════════════════════════════════
   CARD
═══════════════════════════════════════ */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: "none" | "sm" | "md" | "lg"
  variant?: "default" | "bordered" | "elevated"
}

export function Card({ className, hover, padding = "md", variant = "default", children, ...props }: CardProps) {
  const padMap = { none: "", sm: "p-4", md: "p-5", lg: "p-6" }
  const variantMap = {
    default:  "bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_8px_-2px_rgba(0,0,0,0.06),0_8px_24px_-4px_rgba(0,0,0,0.04)]",
    bordered: "bg-white border border-[#E5E7EB]",
    elevated: "bg-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-4px_rgba(0,0,0,0.04)]",
  }
  return (
    <div
      className={cn(
        "rounded-2xl",
        variantMap[variant],
        hover && "transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.1)] cursor-pointer",
        padMap[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════
   TAG / CHIP
═══════════════════════════════════════ */
interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "violet" | "amber" | "success" | "error" | "rose"
  size?: "sm" | "md"
  dot?: boolean
}

export function Tag({ className, variant = "default", size = "sm", dot, children, ...props }: TagProps) {
  const variantMap = {
    default: "bg-[#F3F4F6] text-[#374151]",
    violet:  "bg-[#F5F3FF] text-[#6C36F5] border border-[#DDD6FE]",
    amber:   "bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]",
    success: "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]",
    error:   "bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]",
    rose:    "bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3]",
  }
  const dotMap = {
    default: "bg-[#9CA3AF]",
    violet:  "bg-[#6C36F5]",
    amber:   "bg-[#D97706]",
    success: "bg-[#059669]",
    error:   "bg-[#DC2626]",
    rose:    "bg-[#E11D48]",
  }
  const sizeMap = { sm: "text-[11px] px-2.5 py-0.5 gap-1.5", md: "text-[12px] px-3 py-1 gap-1.5" }
  return (
    <span className={cn("inline-flex items-center rounded-full font-body font-medium", variantMap[variant], sizeMap[size], className)} {...props}>
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotMap[variant])} />}
      {children}
    </span>
  )
}

/* ═══════════════════════════════════════
   AVATAR
═══════════════════════════════════════ */
interface AvatarProps {
  src?: string
  fallback: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
  gradient?: "violet" | "teal" | "amber" | "rose" | "blue"
  ring?: boolean
}

export function Avatar({ src, fallback, size = "md", className, gradient = "violet", ring }: AvatarProps) {
  const sizeMap = { xs: "w-6 h-6 text-[10px]", sm: "w-8 h-8 text-[12px]", md: "w-10 h-10 text-[14px]", lg: "w-12 h-12 text-[18px]", xl: "w-16 h-16 text-[24px]" }
  const gradMap = {
    violet: "from-[#6C36F5] to-[#A855F7]",
    teal:   "from-[#0D9488] to-[#06B6D4]",
    amber:  "from-[#F59E0B] to-[#F97316]",
    rose:   "from-[#F43F5E] to-[#EC4899]",
    blue:   "from-[#3B82F6] to-[#6366F1]",
  }
  return (
    <div className={cn(
      "rounded-full bg-gradient-to-br flex items-center justify-center shrink-0 overflow-hidden font-display font-bold text-white",
      gradMap[gradient], sizeMap[size],
      ring && "ring-2 ring-white ring-offset-1",
      className
    )}>
      {src
        ? <img src={src} alt={fallback} className="w-full h-full object-cover" />
        : fallback[0].toUpperCase()
      }
    </div>
  )
}

/* ═══════════════════════════════════════
   BADGE
═══════════════════════════════════════ */
export function Badge({ count, variant = "violet" }: { count?: number; variant?: "violet" | "rose" | "amber" }) {
  if (!count) return null
  const map = { violet: "bg-[#6C36F5] text-white", rose: "bg-[#F43F5E] text-white", amber: "bg-[#F59E0B] text-white" }
  return (
    <span className={cn("inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-display font-bold rounded-full", map[variant])}>
      {(count ?? 0) > 99 ? "99+" : count}
    </span>
  )
}

/* ═══════════════════════════════════════
   INPUT
═══════════════════════════════════════ */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftSlot?: React.ReactNode
  rightSlot?: React.ReactNode
}

export function Input({ label, error, hint, leftSlot, rightSlot, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[13px] font-display font-semibold text-[#374151]">{label}</label>}
      <div className="relative">
        {leftSlot && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">{leftSlot}</div>}
        <input
          className={cn(
            "w-full bg-white border-[1.5px] border-[#E5E7EB] rounded-xl",
            "px-4 py-2.5 text-[14px] font-body text-[#0F0F14]",
            "placeholder:text-[#9CA3AF]",
            "shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]",
            "transition-all duration-150 outline-none",
            "focus:border-[#6C36F5] focus:shadow-[0_0_0_3px_rgba(108,54,245,0.1)]",
            leftSlot && "pl-10",
            rightSlot && "pr-10",
            error && "border-[#EF4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]",
            className
          )}
          {...props}
        />
        {rightSlot && <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]">{rightSlot}</div>}
      </div>
      {error && <p className="text-[12px] font-body text-[#EF4444]">{error}</p>}
      {hint && !error && <p className="text-[12px] font-body text-[#9CA3AF]">{hint}</p>}
    </div>
  )
}

/* ═══════════════════════════════════════
   TEXTAREA
═══════════════════════════════════════ */
export function Textarea({ label, className, ...props }: { label?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[13px] font-display font-semibold text-[#374151]">{label}</label>}
      <textarea
        className={cn(
          "w-full bg-white border-[1.5px] border-[#E5E7EB] rounded-xl resize-none",
          "px-4 py-3 text-[14px] font-body text-[#0F0F14]",
          "placeholder:text-[#9CA3AF]",
          "shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]",
          "transition-all duration-150 outline-none",
          "focus:border-[#6C36F5] focus:shadow-[0_0_0_3px_rgba(108,54,245,0.1)]",
          className
        )}
        {...props}
      />
    </div>
  )
}

/* ═══════════════════════════════════════
   SIDEBAR ITEM
═══════════════════════════════════════ */
export function SidebarItem({ icon, label, active, badge, onClick }: {
  icon: React.ReactNode; label: string; active?: boolean; badge?: number; onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[13px] font-body font-medium transition-all duration-150",
        active
          ? "bg-[#F5F3FF] text-[#6C36F5] font-semibold"
          : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#0F0F14]"
      )}
    >
      <span className={cn("text-[17px] w-5 flex items-center justify-center shrink-0", active ? "text-[#6C36F5]" : "text-[#9CA3AF]")}>{icon}</span>
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && <Badge count={badge} />}
    </button>
  )
}

/* ═══════════════════════════════════════
   SECTION LABEL
═══════════════════════════════════════ */
export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("font-display text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]", className)}>
      {children}
    </p>
  )
}

/* ═══════════════════════════════════════
   STAT CARD
═══════════════════════════════════════ */
export function StatCard({ label, value, change, changeType = "neutral", icon }: {
  label: string; value: string; change?: string; changeType?: "up" | "down" | "neutral"; icon?: string
}) {
  const changeColor = { up: "text-[#10B981]", down: "text-[#EF4444]", neutral: "text-[#9CA3AF]" }
  const changePrefix = { up: "↑", down: "↓", neutral: "→" }
  return (
    <Card padding="md" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="font-body text-[12px] font-medium text-[#9CA3AF] uppercase tracking-wide">{label}</p>
        {icon && <span className="text-[20px]">{icon}</span>}
      </div>
      <p className="font-display text-[28px] font-bold tracking-tight text-[#0F0F14] leading-none">{value}</p>
      {change && (
        <p className={cn("font-body text-[12px] font-medium", changeColor[changeType])}>
          {changePrefix[changeType]} {change}
        </p>
      )}
    </Card>
  )
}

/* ═══════════════════════════════════════
   PLAN CARD
═══════════════════════════════════════ */
export function PlanCard({ name, price, period = "/month", description, features, featured, onSubscribe, subscribeLabel }: {
  name: string; price: string; period?: string; description: string; features: string[]
  featured?: boolean; onSubscribe?: () => void; subscribeLabel?: string
}) {
  return (
    <div className={cn(
      "relative rounded-2xl p-6 flex flex-col gap-5 transition-all duration-200",
      featured
        ? "bg-gradient-to-b from-[#6C36F5] to-[#4C1D95] text-white shadow-[0_20px_40px_-8px_rgba(108,54,245,0.5)] hover:-translate-y-1"
        : "bg-white border border-[#E5E7EB] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.1)]"
    )}>
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-white text-[#6C36F5] text-[10px] font-display font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-[0_2px_8px_-1px_rgba(108,54,245,0.3)]">
            ⭐ Most Popular
          </span>
        </div>
      )}
      <div>
        <p className={cn("font-body text-[11px] font-semibold uppercase tracking-widest mb-2", featured ? "text-[#C4B5FD]" : "text-[#9CA3AF]")}>{name}</p>
        <div className="flex items-baseline gap-1">
          <span className={cn("font-display text-[34px] font-bold tracking-tight leading-none", featured ? "text-white" : "text-[#0F0F14]")}>{price}</span>
          <span className={cn("font-body text-[13px]", featured ? "text-[#C4B5FD]" : "text-[#9CA3AF]")}>{period}</span>
        </div>
        <p className={cn("font-body text-[13px] mt-2 leading-relaxed", featured ? "text-[#DDD6FE]" : "text-[#6B7280]")}>{description}</p>
      </div>
      <ul className="flex flex-col gap-2.5 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[13px] font-body">
            <span className={cn("mt-0.5 text-[14px] shrink-0", featured ? "text-[#A5F3FC]" : "text-[#10B981]")}>✓</span>
            <span className={featured ? "text-[#EDE9FE]" : "text-[#374151]"}>{f}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onSubscribe}
        className={cn(
          "w-full py-3 rounded-xl font-display font-semibold text-[14px] transition-all duration-150 active:scale-[0.98]",
          featured
            ? "bg-white text-[#6C36F5] hover:bg-[#F5F3FF] shadow-[0_2px_8px_0_rgba(0,0,0,0.1)]"
            : "bg-[#6C36F5] text-white hover:bg-[#5B28E8] shadow-[0_4px_12px_-2px_rgba(108,54,245,0.35)] hover:shadow-[0_6px_16px_-2px_rgba(108,54,245,0.45)] hover:-translate-y-[1px]"
        )}
      >
        {subscribeLabel ?? `Subscribe ${name}`}
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════
   CONTENT TYPE ICON
═══════════════════════════════════════ */
const typeConfig = {
  video: { emoji: "🎬", bg: "bg-[#FEF2F2]", text: "text-[#EF4444]" },
  image: { emoji: "🖼️", bg: "bg-[#ECFDF5]", text: "text-[#10B981]" },
  pdf:   { emoji: "📄", bg: "bg-[#FFFBEB]", text: "text-[#F59E0B]" },
  text:  { emoji: "📝", bg: "bg-[#F5F3FF]", text: "text-[#6C36F5]" },
  audio: { emoji: "🎵", bg: "bg-[#FFF1F2]", text: "text-[#F43F5E]" },
}

export function ContentTypeIcon({ type }: { type: keyof typeof typeConfig }) {
  const cfg = typeConfig[type]
  return (
    <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0", cfg.bg)}>
      {cfg.emoji}
    </div>
  )
}

/* ═══════════════════════════════════════
   LOCKED OVERLAY
═══════════════════════════════════════ */
export function LockedOverlay({ planName }: { planName: string }) {
  return (
    <div className="mt-3 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE]">
      <span className="text-[#6C36F5]">🔒</span>
      <p className="text-[13px] font-body font-medium text-[#6C36F5]">
        Upgrade to <span className="font-semibold">{planName}</span> to unlock
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════
   HUB CARD
═══════════════════════════════════════ */
export function HubCard({ name, handle, subscriberCount, tags, plan, emoji, gradient, onClick }: {
  name: string; handle: string; subscriberCount: string; tags: string[]
  plan?: string; emoji: string; gradient: string; onClick?: () => void
}) {
  return (
    <Card hover padding="none" className="overflow-hidden" onClick={onClick}>
      <div className={cn("h-[80px] relative", gradient)}>
        <div className="absolute bottom-[-18px] left-4 w-9 h-9 rounded-2xl bg-white shadow-[0_2px_8px_-1px_rgba(0,0,0,0.15)] flex items-center justify-center text-lg">
          {emoji}
        </div>
      </div>
      <div className="p-4 pt-7">
        <h3 className="font-display font-semibold text-[14px] text-[#0F0F14] mb-0.5">{name}</h3>
        <p className="font-body text-[11px] text-[#9CA3AF] mb-2.5">{handle} · {subscriberCount} subscribers</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map(t => <Tag key={t} size="sm">{t}</Tag>)}
        </div>
        {plan && <p className="font-body text-[12px] font-semibold text-[#6C36F5]">✓ {plan}</p>}
      </div>
    </Card>
  )
}