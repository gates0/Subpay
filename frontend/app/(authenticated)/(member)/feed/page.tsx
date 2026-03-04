// app/(member)/feed/page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Avatar, Badge, ContentTypeIcon, HubCard, LockedOverlay, SectionLabel, SidebarItem, Tag } from "@/components/ui/hubora-ui"
import { cn } from "@/lib/utils"

const HUBS = [
  { name: "ArtByLola",    handle: "@artbylola",    emoji: "🎨", gradient: "bg-gradient-to-br from-[#6C36F5] to-[#A855F7]", subscriberCount: "2.1k", tags: ["Art", "Design"],       plan: "Pro — ₦2,500/mo" },
  { name: "TechWithKemi", handle: "@techwithkemi", emoji: "📸", gradient: "bg-gradient-to-br from-[#0D9488] to-[#06B6D4]", subscriberCount: "5.4k", tags: ["Tech", "Tutorials"],    plan: "Basic — ₦1,000/mo" },
  { name: "BeatsByDayo",  handle: "@beatsbydayo",  emoji: "🎵", gradient: "bg-gradient-to-br from-[#F59E0B] to-[#F97316]",  subscriberCount: "890",  tags: ["Music", "Production"], plan: "VIP — ₦5,000/mo" },
]

type Filter = "all" | "video" | "image" | "pdf" | "text"

const FEED = [
  { id: "1", type: "video" as const, title: "Advanced Colour Theory for Digital Artists — Part 3", hub: "ArtByLola", hubEmoji: "🎨", views: "1.2k", comments: "34", time: "2h ago", locked: false },
  { id: "2", type: "text"  as const, title: "The Ultimate Guide to Landing a Tech Job in 2025",      hub: "TechWithKemi", hubEmoji: "📸", views: "3.4k", comments: "89", time: "5h ago", locked: false },
  { id: "3", type: "pdf"   as const, title: "Exclusive Sample Pack Vol. 7 — Download Now",           hub: "BeatsByDayo",  hubEmoji: "🎵", views: "542",  comments: "12", time: "1d ago", locked: true, lockPlan: "VIP Plan" },
  { id: "4", type: "image" as const, title: "Behind the scenes — my workspace setup 2025",           hub: "ArtByLola",    hubEmoji: "🎨", views: "876",  comments: "51", time: "2d ago", locked: false },
  { id: "5", type: "video" as const, title: "Building a Full-Stack App from Scratch in 60 Minutes",  hub: "TechWithKemi", hubEmoji: "📸", views: "2.1k", comments: "44", time: "3d ago", locked: false },
]

export default function FeedPage() {
  const [filter, setFilter] = useState<Filter>("all")
  const filtered = filter === "all" ? FEED : FEED.filter(i => i.type === filter)

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <Sidebar />

      <main className="flex-1 max-w-3xl px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-[24px] font-bold text-[#0F0F14] tracking-tight">Good morning, Ada 👋</h1>
            <p className="font-body text-[13px] text-[#9CA3AF] mt-1">Here&apos;s what&apos;s new from your hubs</p>
          </div>
          <div className="flex gap-2.5">
            <Button variant="outline" size="sm" leftIcon={<span className="text-[13px]">🔍</span>}>Search</Button>
            <Button variant="primary" size="sm">Explore Hubs</Button>
          </div>
        </div>

        {/* My Hubs */}
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>My Hubs</SectionLabel>
          <a href="#" className="font-body text-[12px] text-[#6C36F5] font-medium hover:underline">See all</a>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-10 stagger">
          {HUBS.map(h => <HubCard key={h.name} {...h} />)}
        </div>

        {/* Feed */}
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>Latest Content</SectionLabel>
          <div className="flex gap-1.5">
            {(["all", "video", "image", "pdf", "text"] as Filter[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "font-body text-[11px] font-medium px-3 py-1.5 rounded-full capitalize transition-all duration-150",
                  filter === f
                    ? "bg-[#6C36F5] text-white shadow-[0_2px_8px_-1px_rgba(108,54,245,0.4)]"
                    : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#D1D5DB]"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 stagger">
          {filtered.map(item => <FeedItem key={item.id} item={item} />)}
        </div>
      </main>
    </div>
  )
}

function FeedItem({ item }: { item: typeof FEED[number] }) {
  const [liked, setLiked] = useState(false)
  return (
    <div className={cn(
      "bg-white rounded-2xl p-4 flex items-start gap-4",
      "shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_8px_-2px_rgba(0,0,0,0.06)]",
      "transition-all duration-200",
      !item.locked && "hover:-translate-y-[1px] hover:shadow-[0_4px_16px_-2px_rgba(0,0,0,0.09)] cursor-pointer"
    )}>
      <ContentTypeIcon type={item.type} />
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-[14px] text-[#0F0F14] leading-snug mb-1.5">{item.title}</h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-body text-[12px] text-[#9CA3AF]">{item.hubEmoji} {item.hub}</span>
          <span className="font-body text-[12px] text-[#9CA3AF]">👁 {item.views}</span>
          <span className="font-body text-[12px] text-[#9CA3AF]">💬 {item.comments}</span>
          <span className="font-body text-[12px] text-[#9CA3AF]">{item.time}</span>
        </div>
        {item.locked && <LockedOverlay planName={item.lockPlan!} />}
      </div>
      <div className="flex gap-1.5 shrink-0">
        {item.locked ? (
          <Button variant="icon" size="icon" className="text-[#9CA3AF]">🔒</Button>
        ) : (
          <>
            <Button variant="icon" size="icon" onClick={() => setLiked(l => !l)} className={liked ? "text-[#F43F5E] bg-[#FFF1F2] border-[#FECDD3]" : ""}>
              {liked ? "❤️" : "🤍"}
            </Button>
            <Button variant="icon" size="icon">🔖</Button>
          </>
        )}
      </div>
    </div>
  )
}

function Sidebar() {
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
          <SectionLabel className="px-3 mb-2">Discover</SectionLabel>
          <SidebarItem icon="🏠" label="Home Feed" active />
          <SidebarItem icon="🌐" label="Explore Hubs" />
          <SidebarItem icon="🔍" label="Search" />
        </nav>

        <nav className="flex flex-col gap-0.5">
          <SectionLabel className="px-3 mb-2">Subscriptions</SectionLabel>
          {HUBS.map(h => <SidebarItem key={h.name} icon={h.emoji} label={h.name} />)}
          <SidebarItem icon="＋" label="Find more hubs" />
        </nav>

        <nav className="flex flex-col gap-0.5">
          <SectionLabel className="px-3 mb-2">Account</SectionLabel>
          <SidebarItem icon="🔔" label="Notifications" badge={4} />
          <SidebarItem icon="⚙️" label="Settings" />
        </nav>
      </div>

      <div className="px-4 py-4 border-t border-[#F3F4F6]">
        <div className="flex items-center gap-3">
          <Avatar fallback="A" size="sm" gradient="violet" ring />
          <div className="min-w-0">
            <p className="font-display font-semibold text-[13px] text-[#0F0F14] truncate">Ada Okonkwo</p>
            <p className="font-body text-[11px] text-[#9CA3AF]">Member</p>
          </div>
        </div>
      </div>
    </aside>
  )
}