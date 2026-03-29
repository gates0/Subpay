"use client"

import { useState, useMemo } from "react"
import {
  useNotifications,
  useUnreadCount,
  useMarkAllRead,
  useMarkOneRead,
  useDeleteNotification,
} from "@/hooks/useNotifications"
import type { NotificationResponse } from "@/types/notifications"

const cn = (...c: (string | boolean | undefined)[]) => c.filter(Boolean).join(" ")

// ─── Types & config ───────────────────────────────────────────────────────────
type NotifType =
  | "new_content"
  | "payment_success"
  | "payment_failed"
  | "subscription_expiring"
  | "subscription_cancelled"
  | "new_subscriber"
  | "subscriber_cancelled"
  | "withdrawal_update"

const TYPE_CONFIG: Record<NotifType, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  new_content: {
    color: "#8A2BE2", bg: "#F5EFFF", label: "New Content",
    icon: <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="1.5" y="1.5" width="8" height="8" rx="1.5"/><path d="M3.5 5.5h4M3.5 7h2" strokeLinecap="round"/></svg>,
  },
  payment_success: {
    color: "#10B981", bg: "#F0FDF4", label: "Payments",
    icon: <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="5.5" cy="5.5" r="4"/><path d="M3.5 5.5l1.5 1.5 2.5-2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  payment_failed: {
    color: "#EF4444", bg: "#FEF2F2", label: "Payments",
    icon: <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="5.5" cy="5.5" r="4"/><path d="M4 4l3 3M7 4l-3 3" strokeLinecap="round"/></svg>,
  },
  subscription_expiring: {
    color: "#F59E0B", bg: "#FFFBEB", label: "Subscriptions",
    icon: <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="5.5" cy="5.5" r="4"/><path d="M5.5 3v2.5l1.5 1.5" strokeLinecap="round"/></svg>,
  },
  subscription_cancelled: {
    color: "#EF4444", bg: "#FEF2F2", label: "Subscriptions",
    icon: <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5.5 1.5v8M3.5 3.5c0-.7.9-1.2 2-1.2s2 .5 2 1.2S6.6 4.7 5.5 4.7s-2 .4-2 1.2.9 1.2 2 1.2 2-.4 2-1.2"/></svg>,
  },
  new_subscriber: {
    color: "#10B981", bg: "#F0FDF4", label: "Subscribers",
    icon: <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="4.5" cy="3.5" r="2"/><path d="M1.5 9.5c0-1.7 1.3-2.8 3-2.8"/><path d="M8 6v4M6 8h4" strokeLinecap="round"/></svg>,
  },
  subscriber_cancelled: {
    color: "#6B7280", bg: "#F9FAFB", label: "Subscribers",
    icon: <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="4.5" cy="3.5" r="2"/><path d="M1.5 9.5c0-1.7 1.3-2.8 3-2.8M7 7.5l2 2M9 7.5l-2 2" strokeLinecap="round"/></svg>,
  },
  withdrawal_update: {
    color: "#6366F1", bg: "#EEF2FF", label: "Withdrawals",
    icon: <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5.5 9V2M3 4.5 5.5 2 8 4.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
}

const FILTERS = [
  { id: "all",                   label: "All"           },
  { id: "unread",                label: "Unread"        },
  { id: "new_subscriber",        label: "Subscribers"   },
  { id: "new_content",           label: "Content"       },
  { id: "payment_success",       label: "Payments"      },
  { id: "subscription_expiring", label: "Expiring"      },
  { id: "withdrawal_update",     label: "Withdrawals"   },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getGroup(iso: string): "today" | "yesterday" | "earlier" {
  const d    = new Date(iso)
  const now  = new Date()
  const diff = (now.getTime() - d.getTime()) / 86400000
  if (diff < 1) return "today"
  if (diff < 2) return "yesterday"
  return "earlier"
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60)   return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 172800) return "Yesterday"
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}

// ─── Notification Row ─────────────────────────────────────────────────────────
interface RowProps {
  notif: NotificationResponse
}

function NotifRow({ notif }: RowProps) {
  const { mutate: markOne, isPending: marking }  = useMarkOneRead()
  const { mutate: deleteNotif, isPending: deleting } = useDeleteNotification()

  const cfg = TYPE_CONFIG[notif.type as NotifType] ?? TYPE_CONFIG.new_content

  const handleClick = () => {
    if (!notif.is_read) markOne(notif.id)
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-start gap-3.5 px-4 py-3.5 rounded-2xl border cursor-pointer transition-all group hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]",
        notif.is_read ? "bg-white border-[#F0F0F0]" : "bg-white border-[#E8E0F8]"
      )}
    >
      {/* Icon badge */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ background: cfg.bg, color: cfg.color }}
      >
        <div className="scale-[1.4]">{cfg.icon}</div>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-[13px] font-semibold text-[#111] leading-snug">{notif.title}</p>
        <p className="text-[12.5px] text-[#666] mt-0.5 leading-relaxed">{notif.body}</p>
        <p className="text-[11px] text-[#BBB] mt-1.5">{timeAgo(notif.created_at)}</p>
      </div>

      {/* Right */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        {!notif.is_read && (
          <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: cfg.color }} />
        )}
        <button
          onClick={e => { e.stopPropagation(); deleteNotif(notif.id) }}
          disabled={deleting}
          className="opacity-0 group-hover:opacity-100 text-[11px] text-[#CCC] hover:text-red-400 transition-all disabled:opacity-30 mt-1"
          title="Delete"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <path d="M2 3h8M4 3V2h4v1"/><path d="M3 3l.5 7h5L9 3"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const [filter, setFilter] = useState("all")

  const { data: notifications = [], isLoading } = useNotifications()
  const { data: unreadData }                     = useUnreadCount()
  const { mutate: markAllRead, isPending: markingAll } = useMarkAllRead()

  const unreadCount = unreadData?.unread_count ?? 0

  // Computed stats from notification types
  const stats = useMemo(() => {
    const newSubs    = notifications.filter(n => n.type === "new_subscriber").length
    const payments   = notifications.filter(n => n.type === "payment_success" || n.type === "payment_failed").length
    const expiring   = notifications.filter(n => n.type === "subscription_expiring" || n.type === "subscription_cancelled").length
    return [
      { label: "New subscribers", value: String(newSubs),  color: "#10B981" },
      { label: "Payment events",  value: String(payments), color: "#8A2BE2" },
      { label: "Sub alerts",      value: String(expiring), color: "#F59E0B" },
    ]
  }, [notifications])

  const filtered = useMemo(() => {
    return notifications.filter(n => {
      if (filter === "unread") return !n.is_read
      if (filter === "payment_success") return n.type === "payment_success" || n.type === "payment_failed"
      if (filter !== "all") return n.type === filter
      return true
    })
  }, [notifications, filter])

  const groups = (["today", "yesterday", "earlier"] as const)
    .map(g => ({
      key: g,
      label: { today: "Today", yesterday: "Yesterday", earlier: "Earlier" }[g],
      items: filtered.filter(n => getGroup(n.created_at) === g),
    }))
    .filter(g => g.items.length > 0)

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-[660px] mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-bold text-[#111] tracking-tight flex items-center gap-2.5">
              Notifications
              {unreadCount > 0 && (
                <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-[#8A2BE2] text-white">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-[13px] text-[#999] mt-0.5">Stay up to date with your activity</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllRead()}
              disabled={markingAll}
              className="text-[12.5px] font-medium text-[#8A2BE2] hover:underline mt-1 disabled:opacity-50"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Stats strip */}
        {!isLoading && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-[#F0F0F0] px-4 py-3">
                <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[11.5px] text-[#999] mt-0.5 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "shrink-0 text-[12.5px] font-medium px-4 py-1.5 rounded-full border transition-all",
                filter === f.id
                  ? "bg-[#111] text-white border-[#111]"
                  : "bg-white text-[#555] border-[#EBEBEB] hover:border-[#aaa]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-[80px] bg-white rounded-2xl border border-[#F0F0F0] animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && groups.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="w-12 h-12 rounded-full bg-[#F5F0FF] flex items-center justify-center mb-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#C4A8E0" strokeWidth="1.5">
                <path d="M10 2a6 6 0 0 1 6 6c0 3.5 2 5.5 2 5.5H2S4 11.5 4 8a6 6 0 0 1 6-6Z"/>
                <path d="M8 16a2 2 0 0 0 4 0"/>
              </svg>
            </div>
            <p className="text-[14px] font-semibold text-[#333]">All caught up</p>
            <p className="text-[12.5px] text-[#AAA] mt-1">
              No {filter !== "all" && filter !== "unread" ? filter.replace("_", " ") : ""} notifications right now.
            </p>
          </div>
        )}

        {/* Groups */}
        {!isLoading && (
          <div className="flex flex-col gap-7">
            {groups.map(group => (
              <div key={group.key}>
                <p className="text-[11px] font-semibold text-[#BBB] uppercase tracking-wider mb-2">
                  {group.label}
                </p>
                <div className="flex flex-col gap-1.5">
                  {group.items.map(notif => (
                    <NotifRow key={notif.id} notif={notif} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}