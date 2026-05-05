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

type NotifType =
  | "new_content" | "payment_success" | "payment_failed"
  | "subscription_expiring" | "subscription_cancelled"
  | "new_subscriber" | "subscriber_cancelled" | "withdrawal_update"

const TYPE_CONFIG: Record<NotifType, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  new_content: {
    color: "#8A2BE2", bg: "#F4EEFF", label: "Content",
    icon: <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="2" width="9" height="9" rx="1.5"/><path d="M4 6.5h5M4 8.5h3"/></svg>,
  },
  payment_success: {
    color: "#059669", bg: "#ECFDF5", label: "Payment",
    icon: <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6.5" cy="6.5" r="4.5"/><path d="M4.5 6.5l1.5 1.5 2.5-2.5"/></svg>,
  },
  payment_failed: {
    color: "#DC2626", bg: "#FEF2F2", label: "Payment",
    icon: <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="6.5" cy="6.5" r="4.5"/><path d="M4.5 4.5l4 4M8.5 4.5l-4 4"/></svg>,
  },
  subscription_expiring: {
    color: "#D97706", bg: "#FFFBEB", label: "Subscription",
    icon: <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="6.5" cy="6.5" r="4.5"/><path d="M6.5 4v3l2 1.5"/></svg>,
  },
  subscription_cancelled: {
    color: "#DC2626", bg: "#FEF2F2", label: "Subscription",
    icon: <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="6.5" cy="6.5" r="4.5"/><path d="M4.5 4.5l4 4M8.5 4.5l-4 4"/></svg>,
  },
  new_subscriber: {
    color: "#059669", bg: "#ECFDF5", label: "Subscriber",
    icon: <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="5" cy="4" r="2"/><path d="M2 11c0-2 1.3-3.2 3-3.2"/><path d="M9 8v4M7 10h4"/></svg>,
  },
  subscriber_cancelled: {
    color: "#6B7280", bg: "#F9FAFB", label: "Subscriber",
    icon: <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="5" cy="4" r="2"/><path d="M2 11c0-2 1.3-3.2 3-3.2M8 8.5l2.5 2.5M10.5 8.5l-2.5 2.5"/></svg>,
  },
  withdrawal_update: {
    color: "#6366F1", bg: "#EEF2FF", label: "Withdrawal",
    icon: <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 10V3M4 5.5 6.5 3 9 5.5"/></svg>,
  },
}

const FILTERS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "new_subscriber", label: "Subscribers" },
  { id: "new_content", label: "Content" },
  { id: "payment_success", label: "Payments" },
  { id: "subscription_expiring", label: "Expiring" },
  { id: "withdrawal_update", label: "Withdrawals" },
]

function getGroup(iso: string): "today" | "yesterday" | "earlier" {
  const diff = (Date.now() - new Date(iso).getTime()) / 86400000
  if (diff < 1) return "today"
  if (diff < 2) return "yesterday"
  return "earlier"
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  if (s < 172800) return "Yesterday"
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}

// ─── Notification Row ─────────────────────────────────────────────────────────
function NotifRow({ notif }: { notif: NotificationResponse }) {
  const { mutate: markOne } = useMarkOneRead()
  const { mutate: deleteNotif, isPending: deleting } = useDeleteNotification()
  const cfg = TYPE_CONFIG[notif.type as NotifType] ?? TYPE_CONFIG.new_content

  return (
    <div
      onClick={() => { if (!notif.is_read) markOne(notif.id) }}
      className="flex items-start gap-3.5 px-4 py-3.5 rounded-2xl cursor-pointer group transition-all duration-150 bg-white"
      style={{
        boxShadow: notif.is_read
          ? "0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04)"
          : "0 1px 3px rgba(138,43,226,0.08), 0 0 0 1px rgba(138,43,226,0.15)",
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = notif.is_read
        ? "0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04)"
        : "0 1px 3px rgba(138,43,226,0.08), 0 0 0 1px rgba(138,43,226,0.15)")}
    >
      {/* Icon */}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: cfg.bg, color: cfg.color }}>
        {cfg.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-[13px] leading-snug", notif.is_read ? "font-medium text-[#534670]" : "font-bold text-[#170C28]")}>
            {notif.title}
          </p>
          <span className="text-[11px] text-[#BEB3D0] shrink-0 mt-0.5">{timeAgo(notif.created_at)}</span>
        </div>
        <p className="text-[12px] text-[#8B7BA8] mt-0.5 leading-relaxed">{notif.body}</p>
      </div>

      {/* Right */}
      <div className="flex flex-col items-center gap-2 shrink-0 ml-1">
        {!notif.is_read && (
          <span className="w-2 h-2 rounded-full mt-1.5" style={{ background: cfg.color }} />
        )}
        <button
          onClick={e => { e.stopPropagation(); deleteNotif(notif.id) }}
          disabled={deleting}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#BEB3D0] hover:text-red-400 disabled:opacity-30"
          title="Delete"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <path d="M2 3.5h9M4.5 3.5V2.5h4v1"/><path d="M3.5 3.5l.5 7h5l.5-7"/>
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
  const { data: unreadData } = useUnreadCount()
  const { mutate: markAllRead, isPending: markingAll } = useMarkAllRead()

  const unreadCount = unreadData?.unread_count ?? 0

  const stats = useMemo(() => [
    { label: "New subscribers", value: notifications.filter(n => n.type === "new_subscriber").length, color: "#059669", bg: "#ECFDF5" },
    { label: "Payment events",  value: notifications.filter(n => n.type === "payment_success" || n.type === "payment_failed").length, color: "#8A2BE2", bg: "#F4EEFF" },
    { label: "Sub alerts",      value: notifications.filter(n => n.type === "subscription_expiring" || n.type === "subscription_cancelled").length, color: "#D97706", bg: "#FFFBEB" },
  ], [notifications])

  const filtered = useMemo(() => notifications.filter(n => {
    if (filter === "unread") return !n.is_read
    if (filter === "payment_success") return n.type === "payment_success" || n.type === "payment_failed"
    if (filter !== "all") return n.type === filter
    return true
  }), [notifications, filter])

  const groups = (["today", "yesterday", "earlier"] as const)
    .map(g => ({ key: g, label: { today: "Today", yesterday: "Yesterday", earlier: "Earlier" }[g], items: filtered.filter(n => getGroup(n.created_at) === g) }))
    .filter(g => g.items.length > 0)

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <div className="max-w-[620px] mx-auto px-5 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[24px] font-black text-[#170C28] tracking-tight">Notifications</h1>
              {unreadCount > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#8A2BE2" }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-[13px] text-[#8B7BA8] mt-0.5">Stay up to date with your activity</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllRead()}
              disabled={markingAll}
              className="text-[12.5px] font-semibold text-[#8A2BE2] hover:opacity-70 transition-opacity disabled:opacity-40 mt-1"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Stats */}
        {!isLoading && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {stats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl px-4 py-3.5" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <p className="text-[22px] font-black leading-none" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[11px] text-[#8B7BA8] mt-1.5 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="shrink-0 text-[12px] font-semibold px-3.5 py-1.5 rounded-full transition-all duration-150"
              style={filter === f.id
                ? { background: "#8A2BE2", color: "white", boxShadow: "0 2px 10px rgba(138,43,226,0.3)" }
                : { background: "white", color: "#534670", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05)" }
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-[76px] bg-white rounded-2xl animate-pulse" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && groups.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#F4EEFF] flex items-center justify-center mb-4">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#8A2BE2" strokeWidth="1.5">
                <path d="M11 2a7 7 0 0 1 7 7c0 4 2 6 2 6H2s2-2 2-6a7 7 0 0 1 7-7Z"/>
                <path d="M9 18a2 2 0 0 0 4 0" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-[15px] font-bold text-[#170C28]">All caught up</p>
            <p className="text-[13px] text-[#8B7BA8] mt-1">No notifications right now.</p>
          </div>
        )}

        {/* Groups */}
        {!isLoading && (
          <div className="flex flex-col gap-7">
            {groups.map(group => (
              <div key={group.key}>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#BEB3D0] mb-3">{group.label}</p>
                <div className="flex flex-col gap-2">
                  {group.items.map(notif => <NotifRow key={notif.id} notif={notif} />)}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  )
}
