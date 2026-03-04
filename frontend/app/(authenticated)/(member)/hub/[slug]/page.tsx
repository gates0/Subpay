// app/(member)/hub/[slug]/page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Avatar, PlanCard, SectionLabel, Tag } from "@/components/ui/hubora-ui"
import { cn } from "@/lib/utils"

type Tab = "posts" | "plans" | "about"

const POSTS = [
  { id: "1", emoji: "🎬", gradient: "from-[#4C1D95] to-[#7C3AED]",   title: "Advanced Colour Theory Pt.3",            meta: "1.2k views · 34 comments · 2h ago",  tier: "Pro",   locked: false },
  { id: "2", emoji: "🖼️", gradient: "from-[#1E3A5F] to-[#3B82F6]",  title: "Studio Setup Tour 2025",                 meta: "876 views · 51 comments · 2d ago",   tier: "Basic", locked: false },
  { id: "3", emoji: "🔒", gradient: "from-[#111827] to-[#1F2937]",   title: "Exclusive Process Video — Portrait",     meta: "VIP subscribers only",               tier: "VIP",   locked: true },
  { id: "4", emoji: "📝", gradient: "from-[#064E3B] to-[#059669]",   title: "Art Business Guide: Pricing Your Work",  meta: "401 views · 18 comments · 3d ago",   tier: "Basic", locked: false },
  { id: "5", emoji: "🎬", gradient: "from-[#7F1D1D] to-[#DC2626]",   title: "Procreate Speed Paint — Full Portrait",  meta: "2.1k views · 67 comments · 4d ago",  tier: "Pro",   locked: false },
  { id: "6", emoji: "🔒", gradient: "from-[#312E81] to-[#4338CA]",   title: "VIP Brush Pack + Colour Palettes",       meta: "VIP subscribers only",               tier: "VIP",   locked: true },
]

const PLANS = [
  { name: "Basic", price: "₦1,000", description: "Perfect for casual followers who want the essentials.", features: ["All free posts", "Community comments", "Monthly newsletter"] },
  { name: "Pro",   price: "₦2,500", description: "Full access for the dedicated fan. All content, no limits.", features: ["Everything in Basic", "All video content", "Early access", "Discord community"], featured: true },
  { name: "VIP",   price: "₦5,000", description: "The inner circle. Direct access and exclusive perks.", features: ["Everything in Pro", "1-on-1 monthly session", "Downloadable assets", "Name in credits", "Private Discord"] },
]

export default function HubPage() {
  const [tab, setTab] = useState<Tab>("posts")

  return (
    <div className="min-h-screen bg-[#FAFAFA]">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#F3F4F6] px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6C36F5] to-[#A855F7] flex items-center justify-center">
            <span className="text-white font-display font-black text-[11px]">H</span>
          </div>
          <span className="font-display font-bold text-[16px] text-[#0F0F14]">Hubora</span>
        </div>
        <div className="flex gap-2.5">
          <Button variant="outline" size="sm">← Back to Feed</Button>
          <Button variant="ghost" size="sm">Dashboard</Button>
        </div>
      </nav>

      {/* Cover */}
      <div className="px-8 pt-6">
        <div className="w-full h-[200px] rounded-3xl overflow-hidden relative bg-gradient-to-br from-[#4C1D95] via-[#6C36F5] to-[#A855F7]">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)" }} />
          {/* Decorative circles */}
          <div className="absolute top-8 right-16 w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm" />
          <div className="absolute bottom-6 right-32 w-14 h-14 rounded-full bg-white/10" />
          <div className="absolute top-12 left-1/3 w-8 h-8 rounded-full bg-white/15" />
        </div>
      </div>

      {/* Profile */}
      <div className="px-10 flex items-end justify-between gap-4 flex-wrap mt-[-48px] pb-6 border-b border-[#F3F4F6]">
        <div className="flex items-end gap-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#6C36F5] to-[#A855F7] border-4 border-white shadow-[0_4px_20px_-2px_rgba(108,54,245,0.3)] flex items-center justify-center text-3xl">
            🎨
          </div>
          <div className="pb-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="font-display text-[22px] font-bold text-[#0F0F14] tracking-tight">ArtByLola</h1>
              <span className="bg-[#F5F3FF] text-[#6C36F5] text-[10px] font-display font-bold px-2.5 py-1 rounded-full border border-[#DDD6FE]">✓ Creator</span>
            </div>
            <p className="font-body text-[13px] text-[#9CA3AF]">@artbylola · Digital Artist & Illustrator</p>
            <div className="flex gap-5 mt-3">
              {[["2,140", "Subscribers"], ["186", "Posts"], ["48K", "Views"]].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display font-bold text-[18px] text-[#0F0F14] leading-none">{n}</p>
                  <p className="font-body text-[11px] text-[#9CA3AF] mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2.5 pb-1">
          <Button variant="outline" size="md">💬 Message</Button>
          <Button variant="gradient" size="md" onClick={() => setTab("plans")}>Subscribe ↓</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 px-8 bg-white border-b border-[#F3F4F6]">
        {(["posts", "plans", "about"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-5 py-4 font-display font-semibold text-[13px] capitalize transition-all duration-150 border-b-2 -mb-px",
              tab === t ? "border-[#6C36F5] text-[#6C36F5]" : "border-transparent text-[#9CA3AF] hover:text-[#6B7280]"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-8 py-8">
        {tab === "posts" && (
          <div className="grid grid-cols-3 gap-5 stagger">
            {POSTS.map(p => (
              <div key={p.id} className={cn(
                "bg-white rounded-2xl overflow-hidden transition-all duration-200",
                "shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_8px_-2px_rgba(0,0,0,0.06)]",
                !p.locked && "hover:-translate-y-[2px] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)] cursor-pointer"
              )}>
                <div className={cn("h-[140px] bg-gradient-to-br flex items-center justify-center relative", p.gradient)}>
                  {p.locked && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                      <span className="text-2xl">🔒</span>
                      <Tag variant="violet" size="sm">VIP Only</Tag>
                    </div>
                  )}
                  {!p.locked && <span className="text-4xl">{p.emoji}</span>}
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-[13px] text-[#0F0F14] leading-snug mb-1.5">{p.title}</h3>
                  <p className="font-body text-[11px] text-[#9CA3AF] mb-2.5">{p.meta}</p>
                  <Tag variant={p.tier === "VIP" ? "amber" : p.tier === "Pro" ? "violet" : "success"} size="sm" dot>{p.tier}</Tag>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "plans" && (
          <div>
            <div className="text-center mb-10">
              <SectionLabel className="block mb-2">Support ArtByLola</SectionLabel>
              <h2 className="font-display text-[32px] font-bold text-[#0F0F14] tracking-tight">Choose your plan</h2>
              <p className="font-body text-[14px] text-[#9CA3AF] mt-2">Cancel anytime. No hidden fees.</p>
            </div>
            <div className="grid grid-cols-3 gap-6 max-w-[860px] mx-auto stagger">
              {PLANS.map(p => <PlanCard key={p.name} {...p} />)}
            </div>
          </div>
        )}

        {tab === "about" && (
          <div className="max-w-xl">
            <div className="bg-white rounded-2xl p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_8px_-2px_rgba(0,0,0,0.06)]">
              <h2 className="font-display text-[18px] font-bold text-[#0F0F14] mb-3">About ArtByLola</h2>
              <p className="font-body text-[14px] text-[#6B7280] leading-relaxed mb-5">
                Hi! I&apos;m Lola, a digital artist and illustrator based in Lagos, Nigeria. I&apos;ve been creating digital art for over 8 years and I&apos;m passionate about teaching others to find their artistic voice.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Digital Art", "Illustration", "Procreate", "Colour Theory", "Character Design"].map(t => (
                  <Tag key={t} variant="violet" dot>{t}</Tag>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}