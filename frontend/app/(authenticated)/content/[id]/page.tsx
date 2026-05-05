"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useHubById } from "@/hooks/useHubs";
import { useAuthMe } from "@/hooks/useAuth";
import { useHubContentItem, useToggleLike, useToggleSave } from "@/hooks/useContent";
import type { ContentPublicResponse } from "@/types/content";

/* ── Brand tokens (same as hub page) ──────────────────────────────────────── */
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

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

/* ── Like Button ──────────────────────────────────────────────────────────── */
function LikeButton({
  liked,
  count,
  onToggle,
  disabled,
}: {
  liked: boolean;
  count: number;
  onToggle: () => void;
  disabled: boolean;
}) {
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setAnimating(true);
    onToggle();
    setTimeout(() => setAnimating(false), 400);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 active:scale-[0.95]"
      style={{
        background: liked ? P.accentSoft : P.white,
        color: liked ? P.accent : P.muted,
        boxShadow: liked
          ? `0 0 0 1.5px ${P.accentBorder}`
          : `0 0 0 1px ${P.border}`,
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={liked ? P.accent : "none"}
        stroke={liked ? P.accent : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transform: animating ? "scale(1.3)" : "scale(1)",
          transition: "transform 0.3s cubic-bezier(.34,1.56,.64,1)",
        }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span>{formatCount(count)}</span>
    </button>
  );
}

/* ── Save Button ──────────────────────────────────────────────────────────── */
function SaveButton({
  saved,
  onToggle,
  disabled,
}: {
  saved: boolean;
  onToggle: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 active:scale-[0.95]"
      style={{
        background: saved ? P.accentSoft : P.white,
        color: saved ? P.accent : P.muted,
        boxShadow: saved
          ? `0 0 0 1.5px ${P.accentBorder}`
          : `0 0 0 1px ${P.border}`,
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={saved ? P.accent : "none"}
        stroke={saved ? P.accent : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      {saved ? "Saved" : "Save"}
    </button>
  );
}

/* ── Share Button ─────────────────────────────────────────────────────────── */
function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 active:scale-[0.95]"
      style={{
        background: P.white,
        color: P.muted,
        boxShadow: `0 0 0 1px ${P.border}`,
      }}
    >
      {copied ? (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={P.accent}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span style={{ color: P.accent }}>Copied!</span>
        </>
      ) : (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Share
        </>
      )}
    </button>
  );
}

/* ── Video Player ─────────────────────────────────────────────────────────── */
function VideoPlayer({ url }: { url: string }) {
  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
  );
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);

  if (youtubeMatch) {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (vimeoMatch) {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <iframe
          src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
      <video
        src={url}
        controls
        className="absolute inset-0 w-full h-full object-contain bg-black"
        playsInline
      />
    </div>
  );
}

/* ── Content Renderer ─────────────────────────────────────────────────────── */
function ContentBody({ item }: { item: ContentPublicResponse }) {
  switch (item.content_type) {
    case "video":
      return item.file_url ? (
        <VideoPlayer url={item.file_url} />
      ) : (
        <div
          className="w-full rounded-2xl flex items-center justify-center"
          style={{ aspectRatio: "16/9", background: P.soft }}
        >
          <p className="text-[14px]" style={{ color: P.muted }}>
            Video unavailable
          </p>
        </div>
      );

    case "image":
      return item.file_url ? (
        <div className="relative w-full rounded-2xl overflow-hidden">
          <Image
            src={item.file_url}
            alt={item.title}
            width={880}
            height={600}
            className="w-full h-auto object-contain rounded-2xl"
            style={{ maxHeight: "70vh" }}
            unoptimized
          />
        </div>
      ) : (
        <div
          className="w-full rounded-2xl flex items-center justify-center"
          style={{ aspectRatio: "16/10", background: P.soft }}
        >
          <p className="text-[14px]" style={{ color: P.muted }}>
            Image unavailable
          </p>
        </div>
      );

    case "pdf":
      return item.file_url ? (
        <div className="w-full rounded-2xl overflow-hidden" style={{ aspectRatio: "3/4" }}>
          <iframe
            src={item.file_url}
            className="w-full h-full border-0"
            title={item.title}
          />
        </div>
      ) : (
        <div
          className="w-full rounded-2xl flex items-center justify-center py-16"
          style={{ background: P.soft }}
        >
          <p className="text-[14px]" style={{ color: P.muted }}>
            PDF unavailable
          </p>
        </div>
      );

    case "text":
      return item.text_body ? (
        <div
          className="prose max-w-none text-[15px] leading-[1.8]"
          style={{ color: P.text }}
          dangerouslySetInnerHTML={{ __html: item.text_body }}
        />
      ) : (
        <div className="py-16 text-center">
          <p className="text-[14px]" style={{ color: P.muted }}>
            No content available
          </p>
        </div>
      );

    default:
      return null;
  }
}

/* ── Locked Overlay ───────────────────────────────────────────────────────── */
function LockedOverlay({ planName, hubId }: { planName?: string; hubId: number }) {
  const router = useRouter();
  return (
    <div
      className="w-full rounded-2xl flex flex-col items-center justify-center py-20 gap-4"
      style={{
        background: `linear-gradient(160deg, ${P.soft}, ${P.bg})`,
        border: `1px solid ${P.border}`,
      }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: P.white, boxShadow: `0 4px 20px ${P.accent}15` }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke={P.accent}
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-[16px] font-bold mb-1" style={{ color: P.ink }}>
          Members-only content
        </p>
        <p className="text-[13px] mb-4" style={{ color: P.muted }}>
          {planName
            ? `Subscribe to the ${planName} plan to unlock`
            : "Subscribe to a plan to unlock this content"}
        </p>
        <button
          onClick={() => router.push(`/hubs/${hubId}`)}
          className="px-5 py-2 rounded-xl text-[13px] font-bold text-white transition-all hover:brightness-110 active:scale-[0.97]"
          style={{
            background: P.accent,
            boxShadow: `0 4px 16px ${P.accent}35`,
          }}
        >
          View plans
        </button>
      </div>
    </div>
  );
}

/* ── Main Content Page ────────────────────────────────────────────────────── */
function ContentPageInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const contentId = Number(params.id);
  const hubId = Number(searchParams.get("hub")) || 0;

  const { data: hub } = useHubById(hubId);
  const { data: me } = useAuthMe();
  const { data: item, isLoading } = useHubContentItem(hubId, contentId);
  const { mutate: toggleLike, isPending: likePending } = useToggleLike(hubId, contentId);
  const { mutate: toggleSave, isPending: savePending } = useToggleSave();

  const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);
  const [optimisticCount, setOptimisticCount] = useState<number | null>(null);
  const [optimisticSaved, setOptimisticSaved] = useState<boolean | null>(null);

  const liked = optimisticLiked ?? item?.is_liked ?? false;
  const likeCount = optimisticCount ?? item?.like_count ?? 0;
  const saved = optimisticSaved ?? false;

  const locked = item && item.plans.length > 0 && !item.file_url && !item.text_body;
  const isOwnHub = me?.id === hub?.creator?.id;

  const handleLikeToggle = () => {
    if (!item) return;
    const newLiked = !liked;
    const newCount = newLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
    setOptimisticLiked(newLiked);
    setOptimisticCount(newCount);

    toggleLike(item.id, {
      onSuccess: (data) => {
        setOptimisticLiked(data.is_liked);
        setOptimisticCount(data.like_count);
      },
      onError: () => {
        setOptimisticLiked(null);
        setOptimisticCount(null);
      },
    });
  };

  const handleSaveToggle = () => {
    if (!item) return;
    const newSaved = !saved;
    setOptimisticSaved(newSaved);

    toggleSave(item.id, {
      onSuccess: (data) => {
        setOptimisticSaved(data.is_saved);
      },
      onError: () => {
        setOptimisticSaved(null);
      },
    });
  };

  /* Loading */
  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ background: P.bg }}>
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-8">
          <div
            className="h-5 w-16 rounded-lg animate-pulse mb-8"
            style={{ background: P.border }}
          />
          <div
            className="w-full rounded-2xl animate-pulse mb-6"
            style={{ aspectRatio: "16/9", background: P.border }}
          />
          <div
            className="h-8 w-3/4 rounded-lg animate-pulse mb-3"
            style={{ background: P.border }}
          />
          <div
            className="h-4 w-1/3 rounded-lg animate-pulse mb-6"
            style={{ background: P.border }}
          />
          <div className="flex gap-3">
            <div
              className="h-10 w-24 rounded-xl animate-pulse"
              style={{ background: P.border }}
            />
            <div
              className="h-10 w-24 rounded-xl animate-pulse"
              style={{ background: P.border }}
            />
          </div>
        </div>
      </div>
    );
  }

  /* Not found */
  if (!item) {
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
              viewBox="0 0 24 24"
              fill="none"
              stroke={P.faint}
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p
            className="text-[15px] font-semibold mb-2"
            style={{ color: P.muted }}
          >
            Content not found
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

  return (
    <div className="min-h-screen" style={{ background: P.bg }}>
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 pb-16">
        {/* ── Top bar ── */}
        <div
          className="sticky top-0 z-30 pt-4 pb-3 mb-6 flex items-center justify-between"
          style={{ background: P.bg }}
        >
          <button
            onClick={() => hubId ? router.push(`/hubs/${hubId}`) : router.back()}
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
            Back to hub
          </button>

          {/* Hub name chip */}
          {hub && (
            <button
              onClick={() => router.push(`/hubs/${hubId}`)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
              style={{
                background: P.white,
                color: P.text,
                boxShadow: `0 0 0 1px ${P.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 1.5px ${P.accentBorder}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 1px ${P.border}`;
              }}
            >
              {hub.avatar_url ? (
                <Image
                  src={hub.avatar_url}
                  alt={hub.name}
                  width={20}
                  height={20}
                  className="rounded-md object-cover"
                  unoptimized
                />
              ) : (
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black text-white"
                  style={{ background: P.accent }}
                >
                  {hub.name.charAt(0).toUpperCase()}
                </div>
              )}
              {hub.name}
            </button>
          )}
        </div>

        {/* ── Content ── */}
        <div className="mb-6">
          {locked ? (
            <LockedOverlay planName={item.plans[0]?.name} hubId={hubId} />
          ) : (
            <ContentBody item={item} />
          )}
        </div>

        {/* ── Title & Meta ── */}
        <div className="mb-5">
          <h1
            className="text-[22px] sm:text-[26px] font-black leading-tight tracking-tight mb-2"
            style={{ color: P.ink }}
          >
            {item.title}
          </h1>

          {item.description && (
            <p
              className="text-[14px] leading-relaxed mb-3"
              style={{ color: P.text }}
            >
              {item.description}
            </p>
          )}

          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[12px] font-medium" style={{ color: P.faint }}>
              {timeAgo(item.created_at)}
            </span>

            <span className="flex items-center gap-1.5 text-[12px]" style={{ color: P.faint }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {formatCount(item.view_count)} views
            </span>

            {item.plans.length > 0 && (
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                style={{ background: P.accentSoft, color: P.accent }}
              >
                {item.plans[0].name}
              </span>
            )}

            {item.is_pinned && (
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                style={{ background: "#FEF3C7", color: "#B45309" }}
              >
                Pinned
              </span>
            )}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px mb-5" style={{ background: P.border }} />

        {/* ── Actions ── */}
        <div className="flex items-center gap-3">
          {!isOwnHub && (
            <LikeButton
              liked={liked}
              count={likeCount}
              onToggle={handleLikeToggle}
              disabled={likePending}
            />
          )}
          {!isOwnHub && (
            <SaveButton
              saved={saved}
              onToggle={handleSaveToggle}
              disabled={savePending}
            />
          )}
          <ShareButton />
        </div>
      </div>
    </div>
  );
}

export default function ContentPage() {
  return (
    <Suspense>
      <ContentPageInner />
    </Suspense>
  );
}