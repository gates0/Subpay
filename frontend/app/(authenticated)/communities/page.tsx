"use client"

import { useState, useMemo } from "react"
import { useExploreHubs } from "@/hooks/useExplore"
import { useMySubscriptions } from "@/hooks/useSubscriptions"
import { useInitializePayment } from "@/hooks/usePayments"
import { useHubPlans } from "@/hooks/usePlans"
import type { HubExploreResponse } from "@/types/hubs"

const cn = (...c: (string | boolean | undefined)[]) => c.filter(Boolean).join(" ")

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" as const },
  { label: "Popular", value: "popular" as const },
]

// Derived colors for hubs without avatars
const HUB_COLORS = ["#8A2BE2","#6366F1","#F59E0B","#10B981","#EC4899","#0EA5E9"]
const hubColor = (id: number) => HUB_COLORS[id % HUB_COLORS.length]
const hubInitial = (name: string) => name.charAt(0).toUpperCase()

// ─── Join Button ─────────────────────────────────────────────────────────────
// Needs a plan to initialize payment — fetches the hub's cheapest plan

function JoinButton({ hub, isSubscribed }: { hub: HubExploreResponse; isSubscribed: boolean }) {
  const { data: plans = [], isLoading: plansLoading } = useHubPlans(hub.id)
  const { mutate: initPayment, isPending } = useInitializePayment()

  if (isSubscribed) {
    return (
      <span className="shrink-0 text-[12px] font-semibold px-4 py-1.5 rounded-full bg-[#F3E8FF] text-[#8A2BE2] border border-transparent">
        Joined
      </span>
    )
  }

  const cheapestPlan = plans
    .filter(p => p.is_active)
    .sort((a, b) => a.price - b.price)[0]

  const handleJoin = () => {
    if (!cheapestPlan) return
    initPayment(
      { plan_id: cheapestPlan.id },
      {
        onSuccess: (data) => {
          window.location.href = data.checkout_url
        },
      }
    )
  }

  return (
    <button
      onClick={handleJoin}
      disabled={isPending || plansLoading || !cheapestPlan}
      className={cn(
        "shrink-0 text-[12px] font-semibold px-4 py-1.5 rounded-full border transition-all",
        "bg-white text-[#555] border-[#E0E0E0] hover:border-[#8A2BE2] hover:text-[#8A2BE2]",
        (isPending || plansLoading || !cheapestPlan) && "opacity-50 cursor-not-allowed"
      )}
    >
      {isPending ? "Redirecting…" : cheapestPlan ? `Join · ${cheapestPlan.currency} ${cheapestPlan.price}` : "No plans"}
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommunitiesPage() {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<"newest" | "popular">("newest")

  // Debounce search so we don't fire on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const debounceRef = useState<ReturnType<typeof setTimeout> | null>(null)

  const handleSearch = (value: string) => {
    setSearch(value)
    if (debounceRef[0]) clearTimeout(debounceRef[0])
    debounceRef[1](setTimeout(() => setDebouncedSearch(value), 400))
  }

  const { data: hubs = [], isLoading, isError } = useExploreHubs({
    q: debouncedSearch || undefined,
    sort_by: sort,
    limit: 50,
  })

  const { data: mySubscriptions = [] } = useMySubscriptions()

  // Set of hub IDs the user is actively subscribed to
  const subscribedHubIds = useMemo(
    () => new Set(mySubscriptions.filter(s => s.status === "active").map(s => s.hub.id)),
    [mySubscriptions]
  )

  const myHubs = hubs.filter(h => subscribedHubIds.has(h.id))

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-[960px] mx-auto px-6 lg:px-10 py-8">
        <div className="flex gap-8">

          {/* ── Main ── */}
          <div className="flex-1 min-w-0">
            <div className="mb-7">
              <h1 className="text-[22px] font-bold text-[#111] tracking-tight">Communities</h1>
              <p className="text-[13px] text-[#999] mt-0.5">Find your people. Grow together.</p>
            </div>

            {/* Search + Sort */}
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CCC]" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="5.5" cy="5.5" r="4"/><path d="M9.5 9.5 13 13" strokeLinecap="round"/>
                </svg>
                <input
                  value={search}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="Search communities…"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EBEBEB] rounded-xl text-[13.5px] text-[#111] placeholder:text-[#CCC] outline-none focus:border-[#8A2BE2] transition-all"
                />
              </div>
              <div className="flex gap-1.5">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSort(opt.value)}
                    className={cn(
                      "text-[12.5px] font-medium px-4 py-2 rounded-xl border transition-all",
                      sort === opt.value
                        ? "bg-[#111] text-white border-[#111]"
                        : "bg-white text-[#555] border-[#EBEBEB] hover:border-[#aaa]"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            {isLoading && (
              <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-[#F0F0F0] p-5 h-[110px] animate-pulse" />
                ))}
              </div>
            )}

            {isError && (
              <p className="text-[13px] text-red-500 py-8 text-center">Failed to load communities. Please try again.</p>
            )}

            {!isLoading && !isError && (
              <div className="flex flex-col gap-3">
                {hubs.length === 0 && (
                  <p className="text-[13px] text-[#999] py-8 text-center">No communities found.</p>
                )}
                {hubs.map(hub => (
                  <div key={hub.id} className="bg-white rounded-2xl border border-[#F0F0F0] p-5 flex items-start gap-4 hover:border-[#DDD] hover:shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-all">
                    {/* Avatar */}
                    {hub.avatar_url ? (
                      <img src={hub.avatar_url} alt={hub.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-[16px] font-bold shrink-0"
                        style={{ background: hubColor(hub.id) }}
                      >
                        {hubInitial(hub.name)}
                      </div>
                    )}

                    {/* Body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[14px] font-semibold text-[#111]">{hub.name}</h3>
                      </div>
                      {hub.description && (
                        <p className="text-[12.5px] text-[#777] leading-relaxed mb-3 line-clamp-2">{hub.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-[11.5px] text-[#AAA]">
                        <span>{hub.subscriber_count.toLocaleString()} members</span>
                        <span>{hub.content_count} posts</span>
                        {hub.starting_from != null && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F5F5F5] text-[#666]">
                            From {hub.currency} {hub.starting_from}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <JoinButton hub={hub} isSubscribed={subscribedHubIds.has(hub.id)} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="hidden xl:flex flex-col gap-4 w-[220px] shrink-0">

            {/* My communities */}
            <div className="bg-white rounded-2xl border border-[#F0F0F0] p-4">
              <h3 className="text-[12.5px] font-semibold text-[#111] mb-3">My Communities</h3>
              {myHubs.length === 0
                ? <p className="text-[12px] text-[#AAA]">None joined yet.</p>
                : (
                  <div className="flex flex-col gap-2.5">
                    {myHubs.map(hub => (
                      <div key={hub.id} className="flex items-center gap-2.5 cursor-pointer group">
                        {hub.avatar_url ? (
                          <img src={hub.avatar_url} alt={hub.name} className="w-7 h-7 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                            style={{ background: hubColor(hub.id) }}
                          >
                            {hubInitial(hub.name)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-[12px] font-medium text-[#111] truncate group-hover:text-[#8A2BE2] transition-colors">{hub.name}</p>
                          <p className="text-[10.5px] text-[#AAA]">{hub.subscriber_count.toLocaleString()} members</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
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
    </div>
  )
}