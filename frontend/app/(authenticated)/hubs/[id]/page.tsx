"use client";

import { useState } from "react";
import { useAuthMe } from "@/hooks/useAuth";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useHubOverview } from "@/hooks/useHubs";
import { useHubContent } from "@/hooks/useContent";
import { useHubPlans } from "@/hooks/usePlans";
import {
  useCreateSubscription,
  useMySubscriptions,
} from "@/hooks/useSubscriptions";
import { useInitializePayment } from "@/hooks/usePayments";
import type { PlanResponse } from "@/types/plans";
import type { ContentPublicResponse } from "@/types/content";

type PlanWithFeatures = PlanResponse & { features?: string[] };

/* ── Brand tokens (matches sidebar palette) ───────────────────────────────── */
const P = {
  accent: "#8A2BE2",
  accentSoft: "#F3E8FF",
  accentBorder: "#D8B4FE",
  ink: "#2D0052",
  text: "#4B3472",
  muted: "#A08DBE",
  faint: "#C4B5D4",
  border: "#EDE5F8",
  soft: "#F5EFFF",
  bg: "#FAF7FF",
  white: "#FFFFFF",
};

const initial = (s: string) => s.charAt(0).toUpperCase();

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

const TYPES: Record<string, { label: string; emoji: string }> = {
  video: { label: "Video", emoji: "▶" },
  image: { label: "Photo", emoji: "◑" },
  pdf: { label: "PDF", emoji: "▤" },
  text: { label: "Article", emoji: "¶" },
};

/* ── Content Card ─────────────────────────────────────────────────────────── */
function ContentCard({
  item,
  onClick,
}: {
  item: ContentPublicResponse;
  onClick: () => void;
}) {
  const cfg = TYPES[item.content_type] ?? TYPES.text;
  // Content is locked if it has plan gates but no actual content was returned
  const locked = item.plans.length > 0 && !item.file_url && !item.text_body;

  return (
    <article
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white"
      style={{
        boxShadow: `0 1px 3px rgba(45,0,82,0.06), 0 0 0 1px ${P.border}`,
        transition:
          "transform 0.25s cubic-bezier(.22,1,.36,1), box-shadow 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 16px 40px rgba(138,43,226,0.1), 0 0 0 1px ${P.accentBorder}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = `0 1px 3px rgba(45,0,82,0.06), 0 0 0 1px ${P.border}`;
      }}
    >
      {/* Thumbnail */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "16/10" }}
      >
        {item.thumbnail_url ? (
          <Image
            src={item.thumbnail_url}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 50vw, 33vw"
            unoptimized
          />
        ) : item.content_type === "video" && item.file_url ? (
          <video
            src={item.file_url}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : item.content_type === "image" && item.file_url ? (
          <Image
            src={item.file_url}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(160deg, ${P.soft}, ${P.bg})`,
            }}
          >
            {item.content_type === "video" ? (
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: P.accent,
                  boxShadow: `0 8px 30px ${P.accent}50`,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                  <path d="M6 4v12l11-6L6 4Z" />
                </svg>
              </div>
            ) : item.content_type === "text" ? (
              <div className="flex flex-col gap-2 w-3/5 opacity-25">
                {[90, 70, 85, 55, 75].map((w, i) => (
                  <div
                    key={i}
                    className="h-[3px] rounded-full"
                    style={{ width: `${w}%`, background: P.accent }}
                  />
                ))}
              </div>
            ) : (
              <span
                className="text-3xl font-black opacity-15"
                style={{ color: P.accent }}
              >
                {cfg.emoji}
              </span>
            )}
          </div>
        )}

        {/* Type chip */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
          style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
            color: P.ink,
          }}
        >
          <span style={{ fontSize: 11, lineHeight: 1 }}>{cfg.emoji}</span>
          {cfg.label}
        </div>

        {/* Lock overlay */}
        {locked && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            style={{
              background: "rgba(20,0,50,0.6)",
              backdropFilter: "blur(6px)",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <rect x="4" y="9" width="12" height="9" rx="2" />
              <path d="M7 9V6.5a3 3 0 0 1 6 0V9" />
            </svg>
            <span className="text-[10px] font-bold text-white/70 tracking-wider uppercase">
              Members only
            </span>
          </div>
        )}

        {/* Hover CTA */}
        {!locked && (
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            <div
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white"
              style={{
                background: P.accent,
                boxShadow: `0 4px 16px ${P.accent}60`,
              }}
            >
              {item.content_type === "video"
                ? "Watch"
                : item.content_type === "image"
                  ? "View"
                  : "Read"}{" "}
              →
            </div>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="p-3.5 pb-3">
        <h3
          className="text-[13px] font-semibold leading-snug line-clamp-2 mb-1.5"
          style={{ color: P.ink }}
        >
          {item.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[11px]" style={{ color: P.faint }}>
            {timeAgo(item.created_at)}
          </span>
          {item.plans.length > 0 && (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
              style={{ background: P.accentSoft, color: P.accent }}
            >
              {item.plans[0].name}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/* ── Plan Card ────────────────────────────────────────────────────────────── */
function PlanCard({
  plan,
  isSubscribed,
  onSubscribe,
  loading,
  isOwnHub,
}: {
  plan: PlanWithFeatures;
  isSubscribed: boolean;
  onSubscribe: (id: number) => void;
  loading: boolean;
  isOwnHub: boolean;
}) {
  const { mutate: initPayment, isPending: paymentPending } =
    useInitializePayment();

  const billingLabel =
    plan.billing_cycle === "monthly"
      ? "/ month"
      : plan.billing_cycle === "yearly"
        ? "/ year"
        : "";

  const handleClick = () => {
    if (isSubscribed || isOwnHub) return;
    if (plan.price === 0) {
      onSubscribe(plan.id);
      return;
    }
    initPayment(
      { plan_id: plan.id },
      {
        onSuccess: (data) => {
          window.location.href = data.checkout_url;
        },
      },
    );
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: isSubscribed ? P.accent : P.white,
        boxShadow: isSubscribed
          ? `0 16px 48px ${P.accent}30`
          : `0 1px 3px rgba(45,0,82,0.06), 0 0 0 1px ${P.border}`,
        opacity: isOwnHub ? 0.45 : 1,
        pointerEvents: isOwnHub ? "none" : "auto",
        filter: isOwnHub ? "grayscale(100%)" : "none",
      }}
    >
      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3
              className="text-[16px] font-bold"
              style={{ color: isSubscribed ? "#fff" : P.ink }}
            >
              {plan.name}
            </h3>
            {isSubscribed && (
              <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/20 text-white uppercase tracking-wider">
                Active
              </span>
            )}
          </div>
          {plan.description && (
            <p
              className="text-[12.5px] leading-relaxed"
              style={{
                color: isSubscribed ? "rgba(255,255,255,0.65)" : P.muted,
              }}
            >
              {plan.description}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-[28px] font-black leading-none"
            style={{ color: isSubscribed ? "#fff" : P.ink }}
          >
            {plan.price === 0
              ? "Free"
              : `${plan.currency} ${plan.price.toLocaleString()}`}
          </span>
          {plan.price > 0 && billingLabel && (
            <span
              className="text-[12px] font-medium"
              style={{
                color: isSubscribed ? "rgba(255,255,255,0.5)" : P.faint,
              }}
            >
              {billingLabel}
            </span>
          )}
        </div>

        {/* Features */}
        {plan.features && plan.features.length > 0 && (
          <ul className="flex flex-col gap-2">
            {plan.features.map((f, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-[12.5px]"
                style={{
                  color: isSubscribed ? "rgba(255,255,255,0.8)" : P.text,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="shrink-0 mt-px"
                  stroke={isSubscribed ? "rgba(255,255,255,0.6)" : P.accent}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 7l3 3 5-5" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        <div className="mt-auto pt-1">
          {isSubscribed ? (
            <div className="flex items-center gap-2 py-2 px-4 justify-center rounded-xl bg-white/15 w-fit mx-auto">
              <svg
                width="13"
                height="13"
                viewBox="0 0 14 14"
                fill="none"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 7l3 3 5-5" />
              </svg>
              <span className="text-[12px] font-bold text-white">
                Subscribed
              </span>
            </div>
          ) : (
            <button
              onClick={handleClick}
              disabled={loading || paymentPending}
              className="px-6 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all duration-200 disabled:opacity-50 hover:brightness-110 active:scale-[0.97] mx-auto block"
              style={{
                background: P.accent,
                boxShadow: `0 4px 16px ${P.accent}35`,
              }}
            >
              {loading || paymentPending
                ? "Processing…"
                : plan.price === 0
                  ? "Join free"
                  : `Subscribe · ${plan.currency} ${plan.price.toLocaleString()}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────────────────── */
export default function HubPage() {
  const params = useParams();
  const router = useRouter();
  const hubId = Number(params.id);

  const [activeTab, setActiveTab] = useState<"content" | "plans">("content");
  const [typeFilter, setTypeFilter] = useState("all");
  const [subscribingId, setSubscribingId] = useState<number | null>(null);

  const { data: hub, isLoading: hubLoading } = useHubOverview(hubId);
  const { data: content = [], isLoading: contentLoading } = useHubContent(hubId);
  const { data: plans = [] } = useHubPlans(hubId);
  const { data: subs = [] } = useMySubscriptions();
  const { mutate: subscribe } = useCreateSubscription();
  const { data: me } = useAuthMe();
  const isOwnHub = !!me?.username && me.username === hub?.creator?.username;

  const activePlans = plans.filter((p: PlanResponse) => p.is_active);
  const subscribedIds = new Set(
    subs
      .filter((s) => s.status === "active" && s.hub.id === hubId)
      .map((s) => s.plan.id),
  );
  const isSubscribed = subscribedIds.size > 0;

  const filteredContent =
    typeFilter === "all"
      ? content
      : content.filter(
          (c: ContentPublicResponse) => c.content_type === typeFilter,
        );

  const handleSubscribe = (planId: number) => {
    setSubscribingId(planId);
    subscribe({ plan_id: planId }, { onSettled: () => setSubscribingId(null) });
  };

  /* Loading */
  if (hubLoading) {
    return (
      <div className="min-h-screen" style={{ background: P.bg }}>
        <div className="max-w-[880px] mx-auto px-5 py-8">
          <div
            className="h-[240px] rounded-3xl animate-pulse"
            style={{ background: P.border }}
          />
          <div className="flex items-end gap-4 -mt-14 mb-6 px-2">
            <div
              className="w-20 h-20 rounded-2xl animate-pulse border-4"
              style={{ background: P.soft, borderColor: P.bg }}
            />
            <div className="flex-1">
              <div
                className="h-6 w-40 rounded-lg animate-pulse mb-2"
                style={{ background: P.border }}
              />
              <div
                className="h-4 w-24 rounded-lg animate-pulse"
                style={{ background: P.border }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl animate-pulse"
                style={{ aspectRatio: "16/10", background: P.border }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* Not found */
  if (!hub) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: P.bg }}
      >
        <div className="text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: P.soft }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              stroke={P.faint}
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <circle cx="10" cy="10" r="7" />
              <path d="M15 15l4 4" />
            </svg>
          </div>
          <p
            className="text-[15px] font-semibold mb-2"
            style={{ color: P.muted }}
          >
            Hub not found
          </p>
          <button
            onClick={() => router.back()}
            className="text-[13px] font-semibold underline underline-offset-2"
            style={{ color: P.accent }}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const contentTypes = [
    ...new Set(content.map((c: ContentPublicResponse) => c.content_type)),
  ];

  return (
    <div className="min-h-screen" style={{ background: P.bg }}>
      <div className="max-w-[880px] mx-auto px-4 sm:px-6 pb-12">
        {/* ── Top bar ── */}
        <div
          className="sticky top-0 z-30 pt-4 pb-3 mb-12 flex items-center justify-between"
          style={{ background: P.bg }}
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[13px] font-semibold transition-colors"
            style={{ color: P.muted }}
            onMouseEnter={(e) => (e.currentTarget.style.color = P.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.color = P.muted)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4L6 9l5 5" />
            </svg>
            Back
          </button>
        </div>

        {/* ── Banner ── */}
        <div
          className="relative rounded-3xl overflow-hidden mb-5"
          style={{ height: 240 }}
        >
          {hub.banner_url ? (
            <Image
              src={hub.banner_url}
              alt=""
              fill
              className="object-cover"
              sizes="880px"
              unoptimized
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(145deg, ${P.ink} 0%, ${P.accent} 70%, #C084FC 100%)`,
              }}
            >
              <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full opacity-10 bg-white" />
              <div className="absolute -left-8 -bottom-16 w-48 h-48 rounded-full opacity-[0.07] bg-white" />
              <div className="absolute inset-0 flex items-center justify-end pr-12">
                <span className="text-[180px] font-black text-white/[0.05] leading-none select-none">
                  {initial(hub.name)}
                </span>
              </div>
            </div>
          )}
          <div
            className="absolute bottom-0 inset-x-0 h-28"
            style={{
              background: `linear-gradient(to top, ${P.bg}, transparent)`,
            }}
          />
        </div>

        {/* ── Profile ── */}
        <div className="flex items-end gap-4 -mt-14 mb-5 px-1 relative z-10">
          <div
            className="w-20 h-20 rounded-2xl shrink-0 overflow-hidden flex items-center justify-center text-[30px] font-black text-white border-4"
            style={{
              background: hub.avatar_url ? P.white : P.accent,
              borderColor: P.bg,
              boxShadow: `0 8px 30px ${P.accent}30`,
            }}
          >
            {hub.avatar_url ? (
              <Image
                src={hub.avatar_url}
                alt={hub.name}
                width={80}
                height={80}
                className="object-cover"
                unoptimized
              />
            ) : (
              initial(hub.name)
            )}
          </div>

          <div className="flex-1 min-w-0 pb-0.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1
                className="text-[22px] font-black leading-tight tracking-tight"
                style={{ color: P.ink }}
              >
                {hub.name}
              </h1>
              {isSubscribed && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/60">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                  </svg>
                  Member
                </span>
              )}
            </div>
            <p className="text-[12.5px] mt-0.5" style={{ color: P.muted }}>
              @{hub.creator?.username ?? "—"}
            </p>
          </div>
        </div>

        {/* Bio */}
        {hub.description && (
          <p
            className="text-[14px] leading-relaxed mb-6 px-1 max-w-[540px]"
            style={{ color: P.text }}
          >
            {hub.description}
          </p>
        )}

        {/* ── Stats ── */}
        <div className="flex items-center gap-6 mb-7 px-1">
          {[
            { label: "posts", value: content.length.toString() },
            { label: "plans", value: activePlans.length.toString() },
          ].map((s) => (
            <div key={s.label} className="flex items-baseline gap-1.5">
              <span className="text-[18px] font-black" style={{ color: P.ink }}>
                {s.value}
              </span>
              <span
                className="text-[12px] font-medium"
                style={{ color: P.muted }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div
          className="flex items-center gap-0.5 mb-6 border-b"
          style={{ borderColor: P.border }}
        >
          {[
            {
              key: "content" as const,
              label: "Content",
              count: content.length,
            },
            {
              key: "plans" as const,
              label: "Plans",
              count: activePlans.length,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="relative px-4 py-3 text-[13px] font-semibold transition-colors"
              style={{ color: activeTab === tab.key ? P.accent : P.muted }}
            >
              {tab.label}
              <span
                className="ml-1.5 text-[11px] font-bold"
                style={{
                  color: activeTab === tab.key ? P.accentBorder : P.faint,
                }}
              >
                {tab.count}
              </span>
              {activeTab === tab.key && (
                <div
                  className="absolute bottom-0 left-4 right-4 h-[2.5px] rounded-full"
                  style={{ background: P.accent }}
                />
              )}
            </button>
          ))}
        </div>

        {/* ── Content tab ── */}
        {activeTab === "content" && (
          <div>
            {content.length > 0 && contentTypes.length > 1 && (
              <div
                className="flex gap-2 mb-6 overflow-x-auto pb-1"
                style={{ scrollbarWidth: "none" }}
              >
                {["all", ...contentTypes].map((f) => (
                  <button
                    key={f}
                    onClick={() => setTypeFilter(f)}
                    className="shrink-0 text-[12px] font-semibold px-4 py-2 rounded-xl transition-all"
                    style={
                      typeFilter === f
                        ? {
                            background: P.accent,
                            color: "#fff",
                            boxShadow: `0 2px 10px ${P.accent}35`,
                          }
                        : {
                            background: P.white,
                            color: P.muted,
                            boxShadow: `0 0 0 1px ${P.border}`,
                          }
                    }
                  >
                    {f === "all"
                      ? "All"
                      : f === "image"
                        ? "Photos"
                        : f === "text"
                          ? "Articles"
                          : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            )}

            {contentLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl animate-pulse"
                    style={{ aspectRatio: "16/10", background: P.border }}
                  />
                ))}
              </div>
            ) : filteredContent.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: P.soft,
                    border: `1px solid ${P.border}`,
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    stroke={P.faint}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M4 4h14M4 9h10M4 14h14M4 19h7" />
                  </svg>
                </div>
                <p
                  className="text-[14px] font-semibold"
                  style={{ color: P.muted }}
                >
                  No content yet
                </p>
                <p className="text-[12px]" style={{ color: P.faint }}>
                  Check back soon for updates
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredContent.map((item: ContentPublicResponse) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    onClick={() =>
                      router.push(`/content/${item.id}?hub=${hubId}`)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Plans tab ── */}
        {activeTab === "plans" && (
          <div>
            {activePlans.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: P.soft,
                    border: `1px solid ${P.border}`,
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill={P.faint}
                  >
                    <path d="M10 2l2 5h5l-4 3.5 1.5 5L10 12.5 5.5 15.5 7 10.5 3 7h5l2-5z" />
                  </svg>
                </div>
                <p
                  className="text-[14px] font-semibold"
                  style={{ color: P.muted }}
                >
                  No plans available
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activePlans.map((plan: PlanResponse) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan as PlanWithFeatures}
                    isSubscribed={subscribedIds.has(plan.id)}
                    onSubscribe={handleSubscribe}
                    loading={subscribingId === plan.id}
                    isOwnHub={isOwnHub}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
