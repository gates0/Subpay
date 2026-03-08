"use client"

import { useState } from "react"

const cn = (...c: (string | boolean | undefined)[]) => c.filter(Boolean).join(" ")

const CATEGORIES = ["All", "Visual Art", "Music", "Photography", "Writing", "Design", "Video", "Crafts"]

const CREATORS = [
  { name: "ArtByLola",     handle: "@artbylola",     avatar: "L", color: "#8A2BE2", followers: "12.4K", verified: true  },
  { name: "DesignByKemi",  handle: "@designbykemi",  avatar: "K", color: "#6366F1", followers: "8.1K",  verified: false },
  { name: "TundeCreates",  handle: "@tundecreates",  avatar: "T", color: "#0EA5E9", followers: "5.7K",  verified: true  },
  { name: "SeuniDraws",    handle: "@seunidraws",    avatar: "S", color: "#EC4899", followers: "9.2K",  verified: false },
  { name: "ChidiArt",      handle: "@chidiart",      avatar: "C", color: "#F59E0B", followers: "3.3K",  verified: false },
  { name: "NgoziCreative", handle: "@ngozicreative", avatar: "N", color: "#10B981", followers: "6.8K",  verified: true  },
]

const POSTS = [
  { id: 1, title: "Advanced Colour Theory — Shadows",    author: "ArtByLola",     avatar: "L", color: "#8A2BE2", type: "Video",    likes: 284,  views: "1.2K", span: "tall"   },
  { id: 2, title: "Lagos Studio Tour",                   author: "DesignByKemi",  avatar: "K", color: "#6366F1", type: "Photo",    likes: 151,  views: "876",  span: "normal" },
  { id: 3, title: "Brush Pack Vol.7",                    author: "TundeCreates",  avatar: "T", color: "#0EA5E9", type: "Download", likes: 98,   views: "542",  span: "normal" },
  { id: 4, title: "Sketches — January to March",         author: "SeuniDraws",    avatar: "S", color: "#EC4899", type: "Photo",    likes: 220,  views: "980",  span: "wide"   },
  { id: 5, title: "The Business of Creating in Africa",  author: "NgoziCreative", avatar: "N", color: "#10B981", type: "Article",  likes: 401,  views: "3.1K", span: "normal" },
  { id: 6, title: "Afrobeats Production Kit",            author: "ChidiArt",      avatar: "C", color: "#F59E0B", type: "Download", likes: 66,   views: "310",  span: "normal" },
  { id: 7, title: "Portrait Series II",                  author: "ArtByLola",     avatar: "L", color: "#8A2BE2", type: "Photo",    likes: 190,  views: "740",  span: "normal" },
  { id: 8, title: "Typography in Brand Design",          author: "DesignByKemi",  avatar: "K", color: "#6366F1", type: "Article",  likes: 312,  views: "1.8K", span: "tall"   },
]

const TAGS = ["#NigerianCreators", "#ProcreateArt", "#AfricanDesign", "#SketchDaily", "#CreatorEconomy", "#DigitalArt", "#BrushPacks", "#ArtTutorial"]

export default function ExplorePage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [following, setFollowing] = useState<Set<string>>(new Set())

  function toggleFollow(handle: string) {
    setFollowing(f => { const n = new Set(f); n.has(handle) ? n.delete(handle) : n.add(handle); return n })
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-[960px] mx-auto px-6 lg:px-10 py-8">

        <div className="mb-7">
          <h1 className="text-[22px] font-bold text-[#111] tracking-tight">Explore</h1>
          <p className="text-[13px] text-[#999] mt-0.5">Discover creators and content</p>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CCC]" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="5.5" cy="5.5" r="4"/><path d="M9.5 9.5 13 13" strokeLinecap="round"/>
          </svg>
          <input
            type="text" placeholder="Search creators, content, tags…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EBEBEB] rounded-xl text-[13.5px] text-[#111] placeholder:text-[#CCC] outline-none focus:border-[#8A2BE2] transition-all"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={cn(
                "shrink-0 text-[12.5px] font-medium px-4 py-1.5 rounded-full border transition-all",
                category === c ? "bg-[#111] text-white border-[#111]" : "bg-white text-[#555] border-[#EBEBEB] hover:border-[#aaa]"
              )}
            >{c}</button>
          ))}
        </div>

        {/* Creators */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-semibold text-[#111]">Trending Creators</h2>
            <button className="text-[12px] text-[#8A2BE2] font-medium hover:underline">See all</button>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {CREATORS.map(c => (
              <div key={c.handle} className="bg-white rounded-2xl border border-[#F0F0F0] p-4 flex flex-col items-center text-center hover:border-[#DDD] hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all">
                <div className="relative mb-2.5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[14px] font-bold" style={{ background: c.color }}>{c.avatar}</div>
                  {c.verified && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#8A2BE2] border-2 border-white flex items-center justify-center">
                      <svg width="7" height="7" viewBox="0 0 7 7" fill="none" stroke="white" strokeWidth="1.4"><path d="M1 3.5l1.8 1.8L6 1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  )}
                </div>
                <p className="text-[12px] font-semibold text-[#111] truncate w-full leading-tight">{c.name}</p>
                <p className="text-[10.5px] text-[#AAA] mb-3 mt-0.5">{c.followers} followers</p>
                <button
                  onClick={() => toggleFollow(c.handle)}
                  className={cn(
                    "w-full text-[11px] font-semibold py-1.5 rounded-full border transition-all",
                    following.has(c.handle)
                      ? "bg-[#F3E8FF] text-[#8A2BE2] border-transparent"
                      : "bg-white text-[#555] border-[#E8E8E8] hover:border-[#8A2BE2] hover:text-[#8A2BE2]"
                  )}
                >{following.has(c.handle) ? "Following" : "Follow"}</button>
              </div>
            ))}
          </div>
        </section>

        {/* Mosaic */}
        <section className="mb-10">
          <h2 className="text-[13px] font-semibold text-[#111] mb-4">Top Content</h2>
          <div className="grid grid-cols-4 gap-2.5 auto-rows-[148px]">
            {POSTS.map(p => (
              <div
                key={p.id}
                className={cn(
                  "relative rounded-2xl overflow-hidden cursor-pointer group transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)]",
                  p.span === "tall" && "row-span-2",
                  p.span === "wide" && "col-span-2",
                )}
                style={{ background: `${p.color}12` }}
              >
                <span className="absolute top-2.5 left-2.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/80 text-[#444] backdrop-blur-sm z-10">{p.type}</span>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-200 z-10 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100">
                  <p className="text-white text-[11.5px] font-semibold leading-snug">{p.title}</p>
                  <p className="text-white/70 text-[10px] mt-0.5">{p.likes} likes · {p.views} views</p>
                </div>
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 z-20">
                  <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[7px] font-bold" style={{ background: p.color }}>{p.avatar}</div>
                  <span className="text-[9.5px] font-medium text-[#333]">{p.author}</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-15" style={{ color: p.color }}>
                  {p.type === "Video"    && <svg width="36" height="36" viewBox="0 0 36 36" fill="currentColor"><path d="M10 7v22l20-11L10 7Z"/></svg>}
                  {p.type === "Photo"    && <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="26" height="26" rx="4"/><circle cx="11" cy="11" r="3"/><path d="M3 21l7-7 6 6 5-5 9 9"/></svg>}
                  {p.type === "Download" && <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 3v18M5 14l9 9 9-9" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 24h22" strokeLinecap="round"/></svg>}
                  {p.type === "Article"  && <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 8h18M5 14h12M5 20h8" strokeLinecap="round"/></svg>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tags */}
        <section>
          <h2 className="text-[13px] font-semibold text-[#111] mb-3">Popular Tags</h2>
          <div className="flex flex-wrap gap-2">
            {TAGS.map(tag => (
              <button key={tag} className="text-[12.5px] font-medium px-4 py-1.5 rounded-full border border-[#EBEBEB] bg-white text-[#555] hover:border-[#8A2BE2] hover:text-[#8A2BE2] transition-all">
                {tag}
              </button>
            ))}
          </div>
        </section>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  )
}