// app/(member)/content/[id]/page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Avatar, Card, SectionLabel, Tag } from "@/components/ui/hubora-ui"
import { cn } from "@/lib/utils"

const RELATED = [
  { id: "r1", emoji: "🎬", gradient: "from-[#4C1D95] to-[#7C3AED]", title: "Colour Theory Pt.4 — Shadows & Light", meta: "45 min", locked: false },
  { id: "r2", emoji: "🖼️", gradient: "from-[#064E3B] to-[#059669]", title: "Building Your Artistic Style from Scratch", meta: "38 min", locked: false },
  { id: "r3", emoji: "📄", gradient: "from-[#7F1D1D] to-[#DC2626]",  title: "Free Brush Pack + Colour Palette PDF", meta: "Download", locked: false },
  { id: "r4", emoji: "🔒", gradient: "from-[#111827] to-[#1F2937]",  title: "Portrait Series — Full Breakdown", meta: "VIP only", locked: true },
]

const COMMENTS = [
  { id: "c1", author: "KemiAdeyemi",  initial: "K", gradient: "violet" as const, time: "1h ago",  text: "This series is honestly life-changing for my work. The section on warm/cool light interaction was exactly what I needed. Thank you!" },
  { id: "c2", author: "Tunde_Art",    initial: "T", gradient: "teal"   as const, time: "45m ago", text: "Could you do a follow-up on skin tones? This framework applied to portrait work would be incredible." },
  { id: "c3", author: "DesignByFola", initial: "D", gradient: "amber"  as const, time: "20m ago", text: "Just subscribed to Pro after watching this. Worth every naira! 🎨" },
]

export default function ContentViewPage() {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [comment, setComment] = useState("")

  return (
    <div className="min-h-screen bg-[#FAFAFA]">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#F3F4F6] px-8 py-3.5 flex items-center justify-between">
        <Button variant="ghost" size="sm" leftIcon={<span>←</span>}>Back to Feed</Button>
        <Button variant="outline" size="sm">View Hub</Button>
      </nav>

      <div className="grid grid-cols-[1fr_320px] min-h-[calc(100vh-57px)]">

        {/* Main */}
        <main className="px-10 py-8 border-r border-[#F3F4F6] min-w-0">

          {/* Video player */}
          <div
            className="w-full aspect-video rounded-3xl overflow-hidden relative cursor-pointer group mb-6 bg-gradient-to-br from-[#0F0A1E] to-[#1A1030]"
            onClick={() => setPlaying(!playing)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#6C36F5]/30 via-transparent to-[#A855F7]/10" />

            {/* Decorative blobs */}
            <div className="absolute top-8 right-12 w-32 h-32 rounded-full bg-[#6C36F5]/20 blur-2xl" />
            <div className="absolute bottom-8 left-12 w-24 h-24 rounded-full bg-[#A855F7]/15 blur-xl" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={cn(
                "w-16 h-16 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-[28px]",
                "shadow-[0_8px_32px_-4px_rgba(0,0,0,0.3)]",
                "transition-all duration-200 group-hover:scale-110 group-hover:bg-white"
              )}>
                {playing ? "⏸" : "▶"}
              </div>
            </div>

            {/* HD badge */}
            <div className="absolute top-4 right-4">
              <Tag variant="violet" size="sm">4K</Tag>
            </div>

            {/* Progress */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-10 bg-gradient-to-t from-black/50 to-transparent">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-[35%] h-full bg-white rounded-full" />
                </div>
                <span className="font-mono text-[11px] text-white/70 shrink-0">18:24 / 52:00</span>
              </div>
            </div>
          </div>

          {/* Title & meta */}
          <h1 className="font-display text-[22px] font-bold text-[#0F0F14] tracking-tight leading-tight mb-3">
            Advanced Colour Theory for Digital Artists — Part 3
          </h1>

          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <button className="flex items-center gap-2 bg-white border border-[#F3F4F6] rounded-full pl-2 pr-3.5 py-1.5 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)] hover:shadow-[0_2px_6px_0_rgba(0,0,0,0.08)] transition-all">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6C36F5] to-[#A855F7] flex items-center justify-center text-[10px]">🎨</div>
              <span className="font-display font-semibold text-[13px] text-[#0F0F14]">ArtByLola</span>
            </button>
            <span className="font-body text-[12px] text-[#9CA3AF]">👁 1,243 views</span>
            <span className="font-body text-[12px] text-[#9CA3AF]">🕐 2 hours ago</span>
            <Tag variant="violet" dot size="sm">Pro Plan</Tag>
          </div>

          {/* Reaction bar */}
          <div className="flex gap-2 py-4 border-y border-[#F3F4F6] mb-6">
            <Button
              variant={liked ? "secondary" : "outline"}
              size="sm"
              onClick={() => setLiked(!liked)}
              className={liked ? "text-[#F43F5E] bg-[#FFF1F2] border-[#FECDD3]" : ""}
              leftIcon={<span>{liked ? "❤️" : "🤍"}</span>}
            >
              {liked ? "285" : "284"} Likes
            </Button>
            <Button variant="outline" size="sm" leftIcon={<span>💬</span>}>34 Comments</Button>
            <Button
              variant={bookmarked ? "secondary" : "outline"}
              size="sm"
              onClick={() => setBookmarked(!bookmarked)}
              leftIcon={<span>🔖</span>}
            >
              {bookmarked ? "Saved" : "Bookmark"}
            </Button>
            <Button variant="outline" size="sm" leftIcon={<span>↗️</span>}>Share</Button>
          </div>

          {/* Description */}
          <Card padding="md" variant="bordered" className="mb-8">
            <p className="font-body text-[14px] text-[#6B7280] leading-relaxed">
              In this third installment of my colour theory series, we dive deep into complementary colour schemes,
              the psychology of warm vs. cool tones, and how to use contrast to create visual hierarchy in your
              digital illustrations. Whether you&apos;re working in Procreate, Photoshop, or Clip Studio Paint, these
              principles will transform your artwork.
            </p>
            <p className="font-body text-[14px] text-[#6B7280] leading-relaxed mt-3">
              We&apos;ll cover: split-complementary schemes, colour temperature in lighting, saturation and value
              relationships, and how to build a personal colour palette that defines your style.
            </p>
          </Card>

          {/* Comments */}
          <div>
            <SectionLabel className="mb-4">34 Comments</SectionLabel>

            <div className="flex gap-3 mb-6">
              <Avatar fallback="A" size="sm" gradient="violet" ring />
              <div className="flex-1 flex gap-2.5">
                <input
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Add a comment…"
                  className="flex-1 bg-white border-[1.5px] border-[#E5E7EB] rounded-2xl px-4 py-2.5 text-[14px] font-body text-[#0F0F14] placeholder:text-[#9CA3AF] shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] outline-none focus:border-[#6C36F5] focus:shadow-[0_0_0_3px_rgba(108,54,245,0.1)] transition-all"
                />
                <Button variant="primary" size="sm" disabled={!comment}>Post</Button>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {COMMENTS.map(c => (
                <div key={c.id} className="flex gap-3">
                  <Avatar fallback={c.initial} size="sm" gradient={c.gradient} ring />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-display font-semibold text-[13px] text-[#0F0F14]">{c.author}</span>
                      <span className="font-body text-[11px] text-[#9CA3AF]">{c.time}</span>
                    </div>
                    <p className="font-body text-[13px] text-[#6B7280] leading-relaxed">{c.text}</p>
                    <div className="flex gap-3 mt-2">
                      <button className="font-body text-[11px] text-[#9CA3AF] hover:text-[#F43F5E] transition-colors">❤️ 12</button>
                      <button className="font-body text-[11px] text-[#9CA3AF] hover:text-[#6C36F5] transition-colors">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="px-5 py-8 flex flex-col gap-6">

          {/* Hub card */}
          <div className="bg-white rounded-2xl p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_8px_-2px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6C36F5] to-[#A855F7] flex items-center justify-center text-lg shadow-[0_4px_12px_-2px_rgba(108,54,245,0.3)]">🎨</div>
              <div>
                <p className="font-display font-semibold text-[14px] text-[#0F0F14]">ArtByLola</p>
                <p className="font-body text-[11px] text-[#9CA3AF]">2,140 subscribers</p>
              </div>
            </div>
            <Button variant="gradient" fullWidth size="sm">View Hub & Plans</Button>
          </div>

          {/* Up Next */}
          <div>
            <SectionLabel className="mb-3">Up Next</SectionLabel>
            <div className="flex flex-col">
              {RELATED.map(item => (
                <button
                  key={item.id}
                  className={cn(
                    "flex gap-3 p-2.5 rounded-2xl text-left w-full transition-all duration-150",
                    item.locked ? "opacity-60" : "hover:bg-white hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.07)]"
                  )}
                >
                  <div className={cn("w-[76px] h-[50px] rounded-xl shrink-0 flex items-center justify-center text-xl overflow-hidden bg-gradient-to-br", item.gradient)}>
                    {item.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-semibold text-[12px] text-[#0F0F14] leading-snug line-clamp-2">{item.title}</p>
                    <p className={cn("font-body text-[11px] mt-0.5", item.locked ? "text-[#6C36F5] font-medium" : "text-[#9CA3AF]")}>{item.meta}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}