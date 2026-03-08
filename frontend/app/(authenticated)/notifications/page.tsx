"use client"

import { useState } from "react"

const cn = (...c: (string | boolean | undefined)[]) => c.filter(Boolean).join(" ")

type NotifType = "like" | "comment" | "follow" | "new_post" | "milestone" | "mention" | "subscription"

interface Notif {
  id: number; type: NotifType; actor: string; actorAvatar: string; actorColor: string
  content: string; target?: string; time: string; read: boolean; group: "today" | "yesterday" | "earlier"
}

const NOTIFS: Notif[] = [
  { id: 1,  type: "follow",       actor: "DesignByKemi",  actorAvatar: "K", actorColor: "#6366F1", content: "started following you",                                                    time: "2m ago",    read: false, group: "today"     },
  { id: 2,  type: "like",         actor: "TundeCreates",  actorAvatar: "T", actorColor: "#0EA5E9", content: "liked your post",                        target: "Colour Theory Pt.3",     time: "14m ago",   read: false, group: "today"     },
  { id: 3,  type: "comment",      actor: "SeuniDraws",    actorAvatar: "S", actorColor: "#EC4899", content: "commented on",                           target: "Portrait Series II",     time: "31m ago",   read: false, group: "today"     },
  { id: 4,  type: "subscription", actor: "ChidiArt",      actorAvatar: "C", actorColor: "#F59E0B", content: "subscribed to your Pro plan",                                              time: "1h ago",    read: false, group: "today"     },
  { id: 5,  type: "milestone",    actor: "Hubora",        actorAvatar: "H", actorColor: "#8A2BE2", content: "You hit 500 followers — keep creating",                                    time: "2h ago",    read: false, group: "today"     },
  { id: 6,  type: "like",         actor: "NgoziCreative", actorAvatar: "N", actorColor: "#10B981", content: "liked your post",                        target: "Brush Pack Vol.7",       time: "3h ago",    read: true,  group: "today"     },
  { id: 7,  type: "mention",      actor: "ArtByBola",     actorAvatar: "B", actorColor: "#6366F1", content: "mentioned you in",                       target: "Best creators to follow", time: "5h ago",   read: true,  group: "today"     },
  { id: 8,  type: "new_post",     actor: "TundeCreates",  actorAvatar: "T", actorColor: "#0EA5E9", content: "published a new post",                   target: "Afrobeats Production Kit", time: "Yesterday", read: true, group: "yesterday" },
  { id: 9,  type: "follow",       actor: "AdaDesigns",    actorAvatar: "A", actorColor: "#10B981", content: "started following you",                                                    time: "Yesterday", read: true,  group: "yesterday" },
  { id: 10, type: "comment",      actor: "DesignByKemi",  actorAvatar: "K", actorColor: "#6366F1", content: "commented on",                           target: "Sketchbook Flip",        time: "Yesterday", read: true,  group: "yesterday" },
  { id: 11, type: "subscription", actor: "NgoziCreative", actorAvatar: "N", actorColor: "#10B981", content: "subscribed to your Basic plan",                                            time: "3 days ago", read: true, group: "earlier"   },
  { id: 12, type: "milestone",    actor: "Hubora",        actorAvatar: "H", actorColor: "#8A2BE2", content: "Your post reached 1,000 views",                                            time: "4 days ago", read: true, group: "earlier"   },
]

const FILTERS = [
  { id: "all",          label: "All"         },
  { id: "unread",       label: "Unread"      },
  { id: "like",         label: "Likes"       },
  { id: "comment",      label: "Comments"    },
  { id: "follow",       label: "Follows"     },
  { id: "subscription", label: "Subscribers" },
  { id: "milestone",    label: "Milestones"  },
]

const TYPE_COLOR: Record<NotifType, string> = {
  like:         "#EF4444",
  comment:      "#0EA5E9",
  follow:       "#8A2BE2",
  new_post:     "#F59E0B",
  milestone:    "#8A2BE2",
  mention:      "#6366F1",
  subscription: "#10B981",
}

const TYPE_ICON: Record<NotifType, React.ReactNode> = {
  like:         <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor"><path d="M5.5 9.5S1 6.5 1 3.5a2.3 2.3 0 0 1 4.5-.8A2.3 2.3 0 0 1 10 3.5c0 3-4.5 6-4.5 6Z"/></svg>,
  comment:      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M1.5 2h8v5.5H6.5L5.5 9 4.5 7.5H1.5V2Z" strokeLinejoin="round"/></svg>,
  follow:       <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="4.5" cy="3.5" r="2"/><path d="M1.5 9.5c0-1.7 1.3-2.8 3-2.8"/><path d="M8 6v4M6 8h4" strokeLinecap="round"/></svg>,
  new_post:     <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="1.5" y="1.5" width="8" height="8" rx="1.5"/><path d="M3.5 5.5h4M3.5 7h2" strokeLinecap="round"/></svg>,
  milestone:    <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor"><path d="M5.5 1l.9 2.6H9l-2.2 1.6.9 2.6L5.5 6.2 3.3 7.8l.9-2.6L2 3.6h2.6L5.5 1Z"/></svg>,
  mention:      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="5.5" cy="5.5" r="1.8"/><path d="M9.5 5.5a4 4 0 1 1-1.2-2.8" strokeLinecap="round"/><path d="M9.5 3v2.5H7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  subscription: <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5.5 1.5v8M3.5 3.5c0-.7.9-1.2 2-1.2s2 .5 2 1.2S6.6 4.7 5.5 4.7s-2 .4-2 1.2.9 1.2 2 1.2 2-.4 2-1.2"/></svg>,
}

const GROUP_LABEL = { today: "Today", yesterday: "Yesterday", earlier: "Earlier" }

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all")
  const [readIds, setReadIds] = useState<Set<number>>(new Set(NOTIFS.filter(n => n.read).map(n => n.id)))

  function markAllRead() { setReadIds(new Set(NOTIFS.map(n => n.id))) }
  function markRead(id: number) { setReadIds(s => new Set([...s, id])) }

  const filtered = NOTIFS.filter(n => {
    if (filter === "unread") return !readIds.has(n.id)
    if (filter !== "all")   return n.type === filter
    return true
  })

  const unreadCount = NOTIFS.filter(n => !readIds.has(n.id)).length

  const groups = (["today", "yesterday", "earlier"] as const)
    .map(g => ({ key: g, label: GROUP_LABEL[g], items: filtered.filter(n => n.group === g) }))
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
                <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-[#8A2BE2] text-white">{unreadCount}</span>
              )}
            </h1>
            <p className="text-[13px] text-[#999] mt-0.5">Stay up to date with your activity</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-[12.5px] font-medium text-[#8A2BE2] hover:underline mt-1">
              Mark all read
            </button>
          )}
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "New followers",   value: "3",  color: "#8A2BE2" },
            { label: "New subscribers", value: "2",  color: "#10B981" },
            { label: "Interactions",    value: "11", color: "#0EA5E9" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-[#F0F0F0] px-4 py-3">
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[11.5px] text-[#999] mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={cn(
                "shrink-0 text-[12.5px] font-medium px-4 py-1.5 rounded-full border transition-all",
                filter === f.id ? "bg-[#111] text-white border-[#111]" : "bg-white text-[#555] border-[#EBEBEB] hover:border-[#aaa]"
              )}
            >{f.label}</button>
          ))}
        </div>

        {/* Empty */}
        {groups.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="w-12 h-12 rounded-full bg-[#F5F0FF] flex items-center justify-center mb-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#C4A8E0" strokeWidth="1.5"><path d="M10 2a6 6 0 0 1 6 6c0 3.5 2 5.5 2 5.5H2S4 11.5 4 8a6 6 0 0 1 6-6Z"/><path d="M8 16a2 2 0 0 0 4 0"/></svg>
            </div>
            <p className="text-[14px] font-semibold text-[#333]">All caught up</p>
            <p className="text-[12.5px] text-[#AAA] mt-1">No {filter !== "all" ? filter : ""} notifications right now.</p>
          </div>
        )}

        {/* Groups */}
        <div className="flex flex-col gap-7">
          {groups.map(group => (
            <div key={group.key}>
              <p className="text-[11px] font-semibold text-[#BBB] uppercase tracking-wider mb-2">{group.label}</p>
              <div className="flex flex-col gap-1">
                {group.items.map(notif => {
                  const isRead = readIds.has(notif.id)
                  const typeColor = TYPE_COLOR[notif.type]
                  return (
                    <div
                      key={notif.id}
                      onClick={() => markRead(notif.id)}
                      className={cn(
                        "flex items-start gap-3.5 px-4 py-3.5 rounded-2xl border cursor-pointer transition-all group hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]",
                        isRead ? "bg-white border-[#F0F0F0]" : "bg-white border-[#E8E0F8]"
                      )}
                    >
                      {/* Avatar + type icon */}
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold" style={{ background: notif.actorColor }}>
                          {notif.actorAvatar}
                        </div>
                        <span
                          className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full border-2 border-white flex items-center justify-center"
                          style={{ background: typeColor, color: "white" }}
                        >{TYPE_ICON[notif.type]}</span>
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-[13px] leading-snug text-[#333]">
                          <span className="font-semibold text-[#111]">{notif.actor}</span>
                          {" "}{notif.content}
                          {notif.target && <span className="font-semibold text-[#8A2BE2]"> {notif.target}</span>}
                        </p>
                        <p className="text-[11px] text-[#BBB] mt-1">{notif.time}</p>
                      </div>

                      {/* Right side */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {!isRead && <span className="w-2 h-2 rounded-full bg-[#8A2BE2] mt-1.5"/>}
                        {notif.type === "follow" && (
                          <button onClick={e => e.stopPropagation()}
                            className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[#F5F0FF] text-[#8A2BE2] hover:bg-[#8A2BE2] hover:text-white transition-all opacity-0 group-hover:opacity-100">
                            Follow back
                          </button>
                        )}
                        {notif.type === "subscription" && (
                          <button onClick={e => e.stopPropagation()}
                            className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[#F0FDF4] text-[#10B981] opacity-0 group-hover:opacity-100 transition-all">
                            Say thanks
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  )
}