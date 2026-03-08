"use client"

import { useState } from "react"

const cn = (...c: (string | boolean | undefined)[]) => c.filter(Boolean).join(" ")

// ── Types ─────────────────────────────────────────────
type PostType = "video" | "image" | "file" | "article"
type Plan = "Pro" | "Basic" | "VIP"

interface Post {
  id: number
  author: string
  handle: string
  avatar: string
  avatarColor: string
  plan: Plan
  time: string
  title: string
  type: PostType
  description: string
  likes: number
  comments: number
  views: string
  accent: string
  accentLight: string
  liked?: boolean
  featured?: boolean
}

// ── Mock data ──────────────────────────────────────────
const POSTS: Post[] = [
  {
    id: 1,
    author: "ArtByLola",
    handle: "@artbylola",
    avatar: "L",
    avatarColor: "linear-gradient(135deg, #8A2BE2 0%, #C084FC 100%)",
    plan: "Pro",
    time: "2h ago",
    title: "Advanced Colour Theory Pt.3 — Shadows & Depth",
    type: "video",
    description: "We're diving deep into how shadow tone shifts with ambient light. This one changed how I paint completely.",
    likes: 284,
    comments: 47,
    views: "1.2K",
    accent: "#8A2BE2",
    accentLight: "#F3E8FF",
    featured: true,
  },
  {
    id: 2,
    author: "DesignByKemi",
    handle: "@designbykemi",
    avatar: "K",
    avatarColor: "linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)",
    plan: "Basic",
    time: "5h ago",
    title: "My Lagos studio setup tour 🇳🇬",
    type: "image",
    description: "Finally got the space right. Sharing every piece of gear and why I chose it.",
    likes: 151,
    comments: 29,
    views: "876",
    accent: "#0EA5E9",
    accentLight: "#E0F2FE",
  },
  {
    id: 3,
    author: "TundeCreates",
    handle: "@tundecreates",
    avatar: "T",
    avatarColor: "linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)",
    plan: "VIP",
    time: "9h ago",
    title: "Brush Pack Vol.7 is here — 60 new textures",
    type: "file",
    description: "Months of work packed into 60 brushes optimised for Procreate and Photoshop.",
    likes: 98,
    comments: 14,
    views: "542",
    accent: "#F59E0B",
    accentLight: "#FEF3C7",
  },
  {
    id: 4,
    author: "ArtByLola",
    handle: "@artbylola",
    avatar: "L",
    avatarColor: "linear-gradient(135deg, #8A2BE2 0%, #C084FC 100%)",
    plan: "Pro",
    time: "1d ago",
    title: "The business side of being a creator in Africa",
    type: "article",
    description: "Tax, invoicing, payment processors — everything I wish I'd known in year one.",
    likes: 401,
    comments: 88,
    views: "3.1K",
    accent: "#8A2BE2",
    accentLight: "#F3E8FF",
  },
  {
    id: 5,
    author: "SeuniDraws",
    handle: "@seunidraws",
    avatar: "S",
    avatarColor: "linear-gradient(135deg, #EC4899 0%, #F9A8D4 100%)",
    plan: "Basic",
    time: "1d ago",
    title: "Sketchbook flip — January to March 2025",
    type: "image",
    description: "Three months of daily sketching. Some of my best work came from the worst days.",
    likes: 220,
    comments: 33,
    views: "980",
    accent: "#EC4899",
    accentLight: "#FCE7F3",
  },
]

const STORIES = [
  { name: "Lola",   color: "#8A2BE2", hasNew: true },
  { name: "Kemi",   color: "#0EA5E9", hasNew: true },
  { name: "Tunde",  color: "#F59E0B", hasNew: true },
  { name: "Ada",    color: "#10B981", hasNew: false },
  { name: "Seun",   color: "#EC4899", hasNew: true },
  { name: "Bola",   color: "#6366F1", hasNew: false },
  { name: "Chidi",  color: "#EF4444", hasNew: false },
  { name: "Ngozi",  color: "#8B5CF6", hasNew: true },
]

const TRENDING = [
  { tag: "#ProcreateNigeria", posts: "2.4K posts" },
  { tag: "#CreatorEconomy",   posts: "1.8K posts" },
  { tag: "#ArtByLola",        posts: "891 posts"  },
  { tag: "#SketchDaily",      posts: "640 posts"  },
]

const SUGGESTED = [
  { name: "AdaDesigns",    handle: "@adadesigns",   avatar: "A", color: "#10B981", plan: "Pro" },
  { name: "ChidiArt",      handle: "@chidiart",     avatar: "C", color: "#EF4444", plan: "VIP" },
  { name: "NgoziCreative", handle: "@ngozicreative",avatar: "N", color: "#8B5CF6", plan: "Basic" },
]

// ── Type icons ─────────────────────────────────────────
const TypeIcon = ({ type }: { type: PostType }) => {
  if (type === "video")   return <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 2.5v7l8-3.5L2 2.5Z"/></svg>
  if (type === "image")   return <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="1" y="1" width="10" height="10" rx="1.5"/><circle cx="3.8" cy="3.8" r="1" fill="currentColor" stroke="none"/><path d="M1 8l3-3 2 2 2-2 3 3"/></svg>
  if (type === "file")    return <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 1h4l3 3v7H3V1Z"/><path d="M7 1v3h3"/></svg>
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M1.5 3h9M1.5 6h6M1.5 9h4"/></svg>
}

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4">
    <path d="M7 12S1.5 8 1.5 4.5a3 3 0 0 1 5.5-1.7A3 3 0 0 1 12.5 4.5C12.5 8 7 12 7 12Z"/>
  </svg>
)

// ── Plan badge ─────────────────────────────────────────
const PlanBadge = ({ plan }: { plan: Plan }) => {
  const s = {
    Pro:   "bg-[#F3E8FF] text-[#8A2BE2]",
    Basic: "bg-[#DCFCE7] text-[#15803D]",
    VIP:   "bg-[#FEF3C7] text-[#92400E]",
  }
  return <span className={cn("text-[9.5px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase", s[plan])}>{plan}</span>
}

// ── Post card ──────────────────────────────────────────
function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.liked ?? false)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [saved, setSaved] = useState(false)

  function toggleLike() {
    setLiked(l => !l)
    setLikeCount(c => liked ? c - 1 : c + 1)
  }

  const typeLabel = { video: "Video", image: "Photo", file: "Download", article: "Article" }[post.type]

  return (
    <article className="bg-white rounded-2xl border border-[#EDE5F8] overflow-hidden group transition-all duration-200 hover:shadow-[0_4px_24px_rgba(138,43,226,0.1)] hover:-translate-y-[1px]">

      {/* Media block */}
      <div
        className="relative h-[200px] flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${post.accentLight} 0%, ${post.accentLight}88 100%)` }}
      >
        {/* Type pill */}
        <span
          className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: post.accent, color: "white", boxShadow: `0 2px 8px ${post.accent}55` }}
        >
          <TypeIcon type={post.type} />
          {typeLabel}
        </span>

        {/* Plan badge */}
        <span className="absolute top-3 right-3"><PlanBadge plan={post.plan} /></span>

        {/* Save button */}
        <button
          onClick={() => setSaved(s => !s)}
          className={cn(
            "absolute bottom-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all",
            saved ? "bg-[#8A2BE2] text-white" : "bg-white/80 text-[#8A2BE2] opacity-0 group-hover:opacity-100"
          )}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
            <path d="M2 2h8v9L6 9 2 11V2Z" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Play button for video */}
        {post.type === "video" && (
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
            style={{ background: post.accent, boxShadow: `0 4px 16px ${post.accent}66` }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M5 3.5v9l8-4.5L5 3.5Z"/></svg>
          </div>
        )}

        {/* Image/file/article placeholder visual */}
        {post.type === "image" && (
          <div className="flex gap-1.5 opacity-40">
            {[40, 56, 40].map((h, i) => (
              <div key={i} className="w-10 rounded-lg" style={{ height: h, background: post.accent }}/>
            ))}
          </div>
        )}
        {post.type === "file" && (
          <div className="flex flex-col items-center gap-1 opacity-40">
            <div className="w-10 h-12 rounded-lg border-2 flex items-end justify-center pb-1.5" style={{ borderColor: post.accent }}>
              <div className="w-5 h-1 rounded-full" style={{ background: post.accent }}/>
            </div>
          </div>
        )}
        {post.type === "article" && (
          <div className="flex flex-col gap-1.5 opacity-30 w-24">
            {[100, 80, 90, 60].map((w, i) => (
              <div key={i} className="h-1.5 rounded-full" style={{ width: `${w}%`, background: post.accent }}/>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-4 pt-3.5 pb-3">
        {/* Author row */}
        <div className="flex items-center gap-2.5 mb-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
            style={{ background: post.avatarColor }}
          >{post.avatar}</div>
          <div className="flex-1 min-w-0">
            <span className="text-[12.5px] font-semibold text-[#2D0052]">{post.author}</span>
            <span className="text-[11px] text-[#A08DBE] ml-1.5">{post.time}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[14px] font-bold text-[#1A0040] leading-snug mb-1.5 line-clamp-2">{post.title}</h3>
        <p className="text-[12px] text-[#7C6A9A] leading-relaxed line-clamp-2 mb-3">{post.description}</p>

        {/* Stats + actions */}
        <div className="flex items-center justify-between pt-2.5 border-t border-[#F5EFFF]">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLike}
              className={cn(
                "flex items-center gap-1 text-[12px] font-semibold transition-colors",
                liked ? "text-[#8A2BE2]" : "text-[#A08DBE] hover:text-[#8A2BE2]"
              )}
            >
              <HeartIcon filled={liked} />
              {likeCount}
            </button>
            <button className="flex items-center gap-1 text-[12px] font-medium text-[#A08DBE] hover:text-[#8A2BE2] transition-colors">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M1.5 2h10v7.5H8L6.5 11.5 5 9.5H1.5V2Z" strokeLinejoin="round"/>
              </svg>
              {post.comments}
            </button>
            <span className="flex items-center gap-1 text-[11.5px] text-[#C4A8E0]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M1 6s2-4 5-4 5 4 5 4-2 4-5 4-5-4-5-4Z"/>
                <circle cx="6" cy="6" r="1.5"/>
              </svg>
              {post.views}
            </span>
          </div>
          <button className="text-[#A08DBE] hover:text-[#8A2BE2] transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M2 7 9 2v3c3 0 3 2 3 5 0 0-1.5-2-3-2v3L2 7Z" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}

// ── Featured post (wider card) ─────────────────────────
function FeaturedCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)

  return (
    <article
      className="col-span-2 bg-white rounded-2xl border border-[#EDE5F8] overflow-hidden flex gap-0 group transition-all duration-200 hover:shadow-[0_4px_24px_rgba(138,43,226,0.1)]"
    >
      {/* Media */}
      <div
        className="w-[280px] shrink-0 relative flex items-center justify-center"
        style={{ background: `linear-gradient(145deg, ${post.accentLight} 0%, ${post.accent}22 100%)` }}
      >
        <span
          className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: post.accent, color: "white" }}
        >
          <TypeIcon type={post.type} />
          Video
        </span>
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: post.accent, boxShadow: `0 6px 20px ${post.accent}66` }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="white"><path d="M6 4.5v11l10-5.5L6 4.5Z"/></svg>
        </div>
        {/* Views chip */}
        <span className="absolute bottom-3 left-3 text-[10.5px] font-semibold px-2 py-1 rounded-full bg-black/20 text-white backdrop-blur-sm">
          {post.views} views
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 px-5 py-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
              style={{ background: post.avatarColor }}>{post.avatar}</div>
            <span className="text-[12.5px] font-semibold text-[#2D0052]">{post.author}</span>
            <span className="text-[11px] text-[#A08DBE]">· {post.time}</span>
            <span className="ml-auto"><PlanBadge plan={post.plan} /></span>
          </div>
          <h2 className="text-[17px] font-bold text-[#1A0040] leading-snug mb-2">{post.title}</h2>
          <p className="text-[13px] text-[#7C6A9A] leading-relaxed line-clamp-3">{post.description}</p>
        </div>

        <div className="flex items-center gap-4 pt-3 border-t border-[#F5EFFF] mt-3">
          <button
            onClick={() => { setLiked(l => !l); setLikeCount(c => liked ? c - 1 : c + 1) }}
            className={cn("flex items-center gap-1.5 text-[12.5px] font-semibold transition-colors", liked ? "text-[#8A2BE2]" : "text-[#A08DBE] hover:text-[#8A2BE2]")}
          >
            <HeartIcon filled={liked} />
            {likeCount}
          </button>
          <button className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#A08DBE] hover:text-[#8A2BE2] transition-colors">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M1.5 2h10v7.5H8L6.5 11.5 5 9.5H1.5V2Z" strokeLinejoin="round"/></svg>
            {post.comments}
          </button>
          <button
            className="ml-auto text-[13px] font-semibold px-4 py-1.5 rounded-full text-white transition-all hover:opacity-90"
            style={{ background: post.accent }}
          >
            Watch now
          </button>
        </div>
      </div>
    </article>
  )
}

// ── Page ───────────────────────────────────────────────
export default function FeedPage() {
  const [activeFilter, setActiveFilter] = useState("All")
  const filters = ["All", "Video", "Photos", "Articles", "Downloads"]

  const featured = POSTS.find(p => p.featured)!
  const rest = POSTS.filter(p => !p.featured)

  return (
    <div className="min-h-screen bg-[#FAF8FF]">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-8 py-7">
        <div className="flex gap-7">

          {/* ── Main feed column ── */}
          <div className="flex-1 min-w-0">

            {/* Story rail */}
            <div className="flex gap-2.5 mb-5 overflow-x-auto pb-1 no-scrollbar">
              {/* Add story */}
              <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
                <div className="w-[52px] h-[52px] rounded-full border-2 border-dashed border-[#D8B4FE] flex items-center justify-center bg-white group-hover:border-[#8A2BE2] transition-colors">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#A08DBE" strokeWidth="2"><path d="M8 3v10M3 8h10" strokeLinecap="round"/></svg>
                </div>
                <span className="text-[10px] text-[#A08DBE] font-medium">Your story</span>
              </div>

              {STORIES.map((s) => (
                <div key={s.name} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer">
                  <div className={cn(
                    "w-[52px] h-[52px] rounded-full p-[2px]",
                    s.hasNew ? "bg-gradient-to-br from-[#8A2BE2] to-[#C084FC]" : "bg-[#EDE5F8]"
                  )}>
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[14px] font-bold"
                      style={{ color: s.color }}>
                      {s.name[0]}
                    </div>
                  </div>
                  <span className="text-[10px] text-[#6B4F8A] font-medium truncate w-[52px] text-center">{s.name}</span>
                </div>
              ))}
            </div>

            {/* Filter chips */}
            <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "shrink-0 text-[12.5px] font-semibold px-4 py-1.5 rounded-full border transition-all duration-150",
                    activeFilter === f
                      ? "bg-[#8A2BE2] text-white border-[#8A2BE2]"
                      : "bg-white text-[#6B4F8A] border-[#EDE5F8] hover:border-[#C4A8E0] hover:text-[#8A2BE2]"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Post grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Featured full-width card */}
              <FeaturedCard post={featured} />

              {/* Regular 2-col cards */}
              {rest.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* ── Sticky sidebar ── */}
          <div className="hidden xl:flex flex-col gap-4 w-[260px] shrink-0">

            {/* Trending */}
            <div className="bg-white rounded-2xl border border-[#EDE5F8] p-4">
              <h3 className="text-[13px] font-bold text-[#2D0052] mb-3 flex items-center gap-2">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#8A2BE2" strokeWidth="1.6"><path d="M1 10 5 6l3 3 4-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Trending
              </h3>
              <div className="flex flex-col gap-0.5">
                {TRENDING.map((t, i) => (
                  <button key={t.tag} className="flex items-center justify-between px-2 py-2 rounded-xl hover:bg-[#F5EFFF] transition-colors group text-left w-full">
                    <div>
                      <p className="text-[12.5px] font-semibold text-[#2D0052] group-hover:text-[#8A2BE2] transition-colors">{t.tag}</p>
                      <p className="text-[11px] text-[#A08DBE]">{t.posts}</p>
                    </div>
                    <span className="text-[11px] font-bold text-[#C4A8E0]">#{i + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested creators */}
            <div className="bg-white rounded-2xl border border-[#EDE5F8] p-4">
              <h3 className="text-[13px] font-bold text-[#2D0052] mb-3">Suggested Creators</h3>
              <div className="flex flex-col gap-3">
                {SUGGESTED.map(c => (
                  <div key={c.handle} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
                      style={{ background: c.color }}>
                      {c.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-semibold text-[#2D0052] truncate leading-tight">{c.name}</p>
                      <p className="text-[11px] text-[#A08DBE] leading-tight">{c.handle}</p>
                    </div>
                    <button
                      className="shrink-0 text-[11px] font-bold px-3 py-1 rounded-full border border-[#EDE5F8] text-[#8A2BE2] hover:bg-[#F3E8FF] hover:border-[#D8B4FE] transition-all"
                    >
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Active right now */}
            <div className="bg-white rounded-2xl border border-[#EDE5F8] p-4">
              <h3 className="text-[13px] font-bold text-[#2D0052] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"/>
                Active now
              </h3>
              <div className="flex -space-x-2">
                {SUGGESTED.concat([
                  { name: "Bola", handle: "@bola", avatar: "B", color: "#6366F1", plan: "Basic" },
                  { name: "Ada",  handle: "@ada",  avatar: "A", color: "#10B981", plan: "Pro" },
                ]).slice(0, 5).map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{ background: c.color }}>
                    {c.avatar}
                  </div>
                ))}
                <div className="w-7 h-7 rounded-full border-2 border-white bg-[#F3E8FF] flex items-center justify-center text-[9px] font-bold text-[#8A2BE2]">
                  +12
                </div>
              </div>
              <p className="text-[11.5px] text-[#A08DBE] mt-2">18 creators active in the last hour</p>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  )
}