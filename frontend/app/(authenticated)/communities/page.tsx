"use client"

import { useState } from "react"

const cn = (...c: (string | boolean | undefined)[]) => c.filter(Boolean).join(" ")

const CATEGORIES = ["All", "Visual Art", "Music", "Design", "Photography", "Writing", "Crafts"]

const COMMUNITIES = [
  { id: 1, name: "Nigerian Digital Artists",  description: "A space for digital artists across Nigeria to share work, get feedback, and grow together.", members: 4820, posts: 312, category: "Visual Art",  color: "#8A2BE2", avatar: "N", joined: false, active: 14 },
  { id: 2, name: "Procreate Lagos",           description: "iPad artists in Lagos connecting over tutorials, brush packs and local events.",             members: 2140, posts: 189, category: "Visual Art",  color: "#6366F1", avatar: "P", joined: true,  active: 7  },
  { id: 3, name: "Afrobeat Producers Hub",    description: "Producers, beatmakers and sound engineers sharing loops, kits and collabs.",               members: 3350, posts: 441, category: "Music",       color: "#F59E0B", avatar: "A", joined: false, active: 22 },
  { id: 4, name: "Brand & Identity Designers",description: "Show your logos, brand systems, and get critique from fellow identity designers.",          members: 1760, posts: 208, category: "Design",      color: "#10B981", avatar: "B", joined: false, active: 5  },
  { id: 5, name: "Street Photography Africa", description: "Documentary and street photographers across the continent.",                                members: 2990, posts: 523, category: "Photography", color: "#EC4899", avatar: "S", joined: true,  active: 9  },
  { id: 6, name: "African Fiction Writers",   description: "Short stories, world-building, feedback and publishing tips for fiction writers.",          members: 1230, posts: 97,  category: "Writing",     color: "#0EA5E9", avatar: "W", joined: false, active: 3  },
]

export default function CommunitiesPage() {
  const [category, setCategory] = useState("All")
  const [search, setSearch] = useState("")
  const [joined, setJoined] = useState<Record<number, boolean>>(
    Object.fromEntries(COMMUNITIES.map(c => [c.id, c.joined]))
  )

  const visible = COMMUNITIES.filter(c =>
    (category === "All" || c.category === category) &&
    (search === "" || c.name.toLowerCase().includes(search.toLowerCase()))
  )

  const myCommunities = COMMUNITIES.filter(c => joined[c.id])

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-[960px] mx-auto px-6 lg:px-10 py-8">
        <div className="flex gap-8">

          {/* Main */}
          <div className="flex-1 min-w-0">
            <div className="mb-7">
              <h1 className="text-[22px] font-bold text-[#111] tracking-tight">Communities</h1>
              <p className="text-[13px] text-[#999] mt-0.5">Find your people. Grow together.</p>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CCC]" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="5.5" cy="5.5" r="4"/><path d="M9.5 9.5 13 13" strokeLinecap="round"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search communities…"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EBEBEB] rounded-xl text-[13.5px] text-[#111] placeholder:text-[#CCC] outline-none focus:border-[#8A2BE2] transition-all"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={cn(
                    "shrink-0 text-[12.5px] font-medium px-4 py-1.5 rounded-full border transition-all",
                    category === cat ? "bg-[#111] text-white border-[#111]" : "bg-white text-[#555] border-[#EBEBEB] hover:border-[#aaa]"
                  )}
                >{cat}</button>
              ))}
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
              {visible.length === 0 && (
                <p className="text-[13px] text-[#999] py-8 text-center">No communities found.</p>
              )}
              {visible.map(c => (
                <div key={c.id} className="bg-white rounded-2xl border border-[#F0F0F0] p-5 flex items-start gap-4 hover:border-[#DDD] hover:shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-all">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-[16px] font-bold shrink-0" style={{ background: c.color }}>{c.avatar}</div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[14px] font-semibold text-[#111]">{c.name}</h3>
                      {c.active > 0 && (
                        <span className="flex items-center gap-1 text-[10.5px] font-medium text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"/>
                          {c.active} active
                        </span>
                      )}
                    </div>
                    <p className="text-[12.5px] text-[#777] leading-relaxed mb-3">{c.description}</p>
                    <div className="flex items-center gap-4 text-[11.5px] text-[#AAA]">
                      <span>{c.members.toLocaleString()} members</span>
                      <span>{c.posts} posts</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#666]">{c.category}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => setJoined(j => ({ ...j, [c.id]: !j[c.id] }))}
                    className={cn(
                      "shrink-0 text-[12px] font-semibold px-4 py-1.5 rounded-full border transition-all",
                      joined[c.id]
                        ? "bg-[#F3E8FF] text-[#8A2BE2] border-transparent"
                        : "bg-white text-[#555] border-[#E0E0E0] hover:border-[#8A2BE2] hover:text-[#8A2BE2]"
                    )}
                  >{joined[c.id] ? "Joined" : "Join"}</button>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden xl:flex flex-col gap-4 w-[220px] shrink-0">

            {/* My communities */}
            <div className="bg-white rounded-2xl border border-[#F0F0F0] p-4">
              <h3 className="text-[12.5px] font-semibold text-[#111] mb-3">My Communities</h3>
              {myCommunities.length === 0
                ? <p className="text-[12px] text-[#AAA]">None joined yet.</p>
                : <div className="flex flex-col gap-2.5">
                    {myCommunities.map(c => (
                      <div key={c.id} className="flex items-center gap-2.5 cursor-pointer group">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0" style={{ background: c.color }}>{c.avatar}</div>
                        <div className="min-w-0">
                          <p className="text-[12px] font-medium text-[#111] truncate group-hover:text-[#8A2BE2] transition-colors">{c.name}</p>
                          <p className="text-[10.5px] text-[#AAA]">{c.members.toLocaleString()} members</p>
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>

            {/* Create */}
            <div className="bg-white rounded-2xl border border-[#F0F0F0] p-4 text-center">
              <div className="w-9 h-9 rounded-full bg-[#F5F0FF] flex items-center justify-center mx-auto mb-2.5">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#8A2BE2" strokeWidth="1.6"><circle cx="8" cy="8" r="6.5"/><path d="M8 5v6M5 8h6" strokeLinecap="round"/></svg>
              </div>
              <p className="text-[13px] font-semibold text-[#111] mb-1">Start a community</p>
              <p className="text-[11.5px] text-[#999] mb-3 leading-snug">Bring your audience together in one space.</p>
              <button className="w-full bg-[#8A2BE2] text-white text-[12px] font-semibold py-2 rounded-full hover:opacity-90 transition-opacity">
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  )
}