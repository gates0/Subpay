"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  useMyContent,
  useCreateContent,
  useUpdateContentItem,
  useDeleteContentItem,
  useTogglePublish,
} from "@/hooks/useContent";
import { useMyPlans } from "@/hooks/usePlans";
import { useOwnHub } from "@/hooks/useHubs";
import { useOwnHubStats } from "@/hooks/useHubs";
import type { ContentResponse } from "@/types/content";
import type { PlanResponse } from "@/types/plans";
import QuickActionsMenu from "@/components/dashboard/creator/EditProfileButton";

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

const CONTENT_TYPE_CONFIG = {
  video: { label: "Video", icon: "VID" },
  image: { label: "Image", icon: "IMG" },
  pdf: { label: "PDF", icon: "PDF" },
  text: { label: "Text", icon: "TXT" },
} as const;

const Icon = {
  upload: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 1.5v8M4 4.5 7 1.5l3 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.5 10.5v1a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1" strokeLinecap="round" />
    </svg>
  ),
  plus: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6.5 1v11M1 6.5h11" strokeLinecap="round" />
    </svg>
  ),
  search: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="5.8" cy="5.8" r="4" />
      <path d="M9 9 12 12" strokeLinecap="round" />
    </svg>
  ),
  dots: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="2.5" r="1.2" fill="currentColor" />
      <circle cx="7" cy="7" r="1.2" fill="currentColor" />
      <circle cx="7" cy="11.5" r="1.2" fill="currentColor" />
    </svg>
  ),
  chevron: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 4.5L6 7.5L9 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  trash: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 3h8M4 3V2h4v1M5 5.5v3M7 5.5v3" strokeLinecap="round" />
      <path d="M3 3l.5 7h5l.5-7" />
    </svg>
  ),
  edit: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8.5 1.5l2 2-6 6-2.5.5.5-2.5 6-6Z" strokeLinejoin="round" />
    </svg>
  ),
  check: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  x: (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 2l7 7M9 2l-7 7" strokeLinecap="round" />
    </svg>
  ),
  eye: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 6s2-4 5-4 5 4 5 4-2 4-5 4-5-4-5-4Z" />
      <circle cx="6" cy="6" r="1.5" />
    </svg>
  ),
  settings: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="6.5" cy="6.5" r="2" />
      <path d="M6.5 1v1.5M6.5 10v1.5M1 6.5h1.5M10 6.5h1.5M2.8 2.8l1 1M9.2 9.2l1 1M9.2 2.8l-1 1M2.8 9.2l1-1" strokeLinecap="round" />
    </svg>
  ),
  file: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 1h5l3 3v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z" />
      <path d="M7.5 1v3.5H11M4 7h5M4 9.5h3" />
    </svg>
  ),
  play: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 2.5v11l9-5.5-9-5.5Z" />
    </svg>
  ),
  download: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 1.5v7M3.5 6L6 8.5 8.5 6" />
      <path d="M1.5 9.5v1a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-1" />
    </svg>
  ),
  arrowLeft: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 2L3.5 6l4 4" />
    </svg>
  ),
  arrowRight: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 2L8.5 6l-4 4" />
    </svg>
  ),
  copyLink: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M4.5 6.5a2.8 2.8 0 0 0 3.9 0l1.3-1.3a2.8 2.8 0 0 0-3.9-3.9l-.7.7" />
      <path d="M7.5 5.5a2.8 2.8 0 0 0-3.9 0L2.3 6.8a2.8 2.8 0 0 0 3.9 3.9l.7-.7" />
    </svg>
  ),
  externalLink: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3L5 7" />
      <path d="M7 3h2v2" />
      <path d="M5 3H3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V7" />
    </svg>
  ),
  expand: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 1H11v3.5M4.5 11H1V7.5M11 1L7 5M1 11l4-4" />
    </svg>
  ),
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function formatFullDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function getVideoEmbedUrl(url: string): string | null {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
}

// ─── Blob URL hook ────────────────────────────────────────────────────────────
function useBlobUrl(url: string | null) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url) return;
    let revoked = false;
    setLoading(true);
    setError(false);
    setBlobUrl(null);
    fetch(url)
      .then((r) => r.blob())
      .then((blob) => {
        if (!revoked) {
          const obj = URL.createObjectURL(blob);
          setBlobUrl(obj);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!revoked) { setError(true); setLoading(false); }
      });
    return () => {
      revoked = true;
      setBlobUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
    };
  }, [url]);

  return { blobUrl, loading, error };
}

// ─── PDF Viewer ───────────────────────────────────────────────────────────────
function PdfViewer({ url, title }: { url: string; title: string }) {
  const { blobUrl, loading, error } = useBlobUrl(url);

  if (loading) {
    return (
      <div className="rounded-xl bg-[#FBF8FF] border border-[#EDE5F8] flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#8A2BE2] border-t-transparent animate-spin" />
        <p className="text-[13px] text-[#A08DBE]">Loading PDF…</p>
      </div>
    );
  }

  if (error || !blobUrl) {
    return (
      <div className="rounded-xl overflow-hidden border border-[#EDE5F8] flex flex-col">
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
          className="w-full border-0"
          style={{ height: 550 }}
          title={title}
        />
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#FBF8FF] border-t border-[#EDE5F8]">
          <span className="text-[11px] text-[#A08DBE]">Viewing via Google Docs</span>
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8A2BE2] hover:underline">
            {Icon.externalLink} Open original
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-[#EDE5F8] flex flex-col">
      <iframe src={blobUrl} className="w-full border-0" style={{ height: 550 }} title={title} />
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#FBF8FF] border-t border-[#EDE5F8]">
        <span className="text-[11px] text-[#A08DBE]">PDF preview</span>
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8A2BE2] hover:underline">
          {Icon.externalLink} Open original
        </a>
      </div>
    </div>
  );
}

// ─── Content Thumbnail ────────────────────────────────────────────────────────
function ContentThumbnail({ item, onClick }: { item: ContentResponse; onClick: () => void }) {
  const fileUrl = (item as any).file_url ?? (item as any).url ?? null;
  const thumbnailUrl = (item as any).thumbnail_url ?? null;
  const textBody = (item as any).text_body ?? (item as any).body ?? null;

  return (
    <div
      onClick={onClick}
      className="relative w-full cursor-pointer rounded-xl overflow-hidden bg-[#F3E8FF] border border-[#EDE5F8] group/thumb transition-all hover:border-[#A78BFA] hover:shadow-md"
      style={{ aspectRatio: "16/10" }}
    >
      {item.content_type === "video" && (
        fileUrl || thumbnailUrl ? (
          <>
            {thumbnailUrl
              ? <img src={thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-[#1a0030]" />
            }
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover/thumb:bg-black/10 transition-all">
              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[#8A2BE2] shadow-lg">
                {Icon.play}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-[#1a0030] flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50">{Icon.play}</div>
            <p className="text-[10px] text-white/30 font-medium">Video</p>
          </div>
        )
      )}

      {item.content_type === "image" && (
        (fileUrl || thumbnailUrl) ? (
          <img src={fileUrl ?? thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="#C4B5D4" strokeWidth="1.5" strokeLinecap="round">
              <rect x="2" y="2" width="16" height="16" rx="3" /><circle cx="7" cy="7.5" r="1.5" /><path d="M2 14l4-4 3 3 3-4 6 6" />
            </svg>
            <p className="text-[10px] text-[#C4B5D4] font-medium">Image</p>
          </div>
        )
      )}

      {item.content_type === "pdf" && (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#FBF8FF]">
          <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] border border-[#EDE5F8] flex items-center justify-center text-[#8A2BE2]">{Icon.file}</div>
          <p className="text-[10px] text-[#A08DBE] font-semibold uppercase tracking-wide">PDF Document</p>
          {fileUrl && <span className="text-[9px] text-[#C4B5D4]">Click to view</span>}
        </div>
      )}

      {item.content_type === "text" && (
        <div className="w-full h-full p-3 bg-[#FBF8FF] flex flex-col justify-start overflow-hidden">
          {textBody ? (
            <p className="text-[11px] text-[#6B4F8A] leading-[1.6] line-clamp-4" style={{ fontFamily: "'Georgia', serif" }}>
              {textBody}
            </p>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="#C4B5D4" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 4h12M3 8h8M3 12h10M3 16h6" />
              </svg>
              <p className="text-[10px] text-[#C4B5D4] font-medium">Text post</p>
            </div>
          )}
        </div>
      )}

      <div className="absolute inset-0 flex items-end justify-end p-2 opacity-0 group-hover/thumb:opacity-100 transition-opacity pointer-events-none">
        <span className="flex items-center gap-1 text-[10px] font-semibold bg-black/60 text-white px-2 py-1 rounded-full backdrop-blur-sm">
          {Icon.expand} Expand
        </span>
      </div>
    </div>
  );
}

// ─── Preview Body ─────────────────────────────────────────────────────────────
function PreviewBody({ item }: { item: ContentResponse }) {
  const fileUrl = (item as any).file_url ?? null;
  const textBody = (item as any).text_body ?? (item as any).body ?? null;
  const thumbnailUrl = (item as any).thumbnail_url ?? null;

  if (item.content_type === "video") {
    if (!fileUrl) {
      return (
        <div className="rounded-xl bg-[#1a0030] flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white/60">{Icon.play}</div>
          <p className="text-[13px] text-white/40">Video file not available for preview</p>
        </div>
      );
    }
    const embedUrl = getVideoEmbedUrl(fileUrl);
    if (embedUrl) {
      return (
        <div className="rounded-xl overflow-hidden bg-black" style={{ aspectRatio: "16/9" }}>
          <iframe src={embedUrl} className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen />
        </div>
      );
    }
    return (
      <div className="rounded-xl overflow-hidden bg-black">
        <video src={fileUrl} controls className="w-full max-h-[480px]"
          poster={thumbnailUrl ?? undefined} preload="metadata" playsInline />
      </div>
    );
  }

  if (item.content_type === "image") {
    const src = fileUrl ?? thumbnailUrl;
    if (!src) {
      return (
        <div className="rounded-xl bg-[#FBF8FF] border-2 border-dashed border-[#EDE5F8] flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-[13px] text-[#A08DBE]">Image not available for preview</p>
        </div>
      );
    }
    return (
      <div className="rounded-xl overflow-hidden bg-[#F5EFFF] border border-[#EDE5F8] flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={item.title} className="max-w-full max-h-[450px] object-contain" />
      </div>
    );
  }

  if (item.content_type === "pdf") {
    if (!fileUrl) {
      return (
        <div className="rounded-xl bg-[#FBF8FF] border-2 border-dashed border-[#EDE5F8] flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#F3E8FF] border border-[#EDE5F8] flex items-center justify-center text-[#8A2BE2]">{Icon.file}</div>
          <p className="text-[13px] text-[#A08DBE]">PDF not available for preview</p>
        </div>
      );
    }
    return <PdfViewer url={fileUrl} title={item.title} />;
  }

  if (item.content_type === "text") {
    if (!textBody) {
      return (
        <div className="rounded-xl bg-[#FBF8FF] border-2 border-dashed border-[#EDE5F8] flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-[13px] text-[#A08DBE]">Text content is empty</p>
        </div>
      );
    }
    return (
      <div className="rounded-xl bg-[#FBF8FF] border border-[#EDE5F8] px-6 py-5">
        <div className="text-[14px] text-[#2D0052] leading-[1.75] whitespace-pre-wrap" style={{ fontFamily: "'Georgia', serif" }}>
          {textBody}
        </div>
      </div>
    );
  }

  return null;
}

// ─── Inline Peek ──────────────────────────────────────────────────────────────
function InlinePeek({ item }: { item: ContentResponse }) {
  const fileUrl = (item as any).file_url ?? null;
  const textBody = (item as any).text_body ?? (item as any).body ?? null;
  const thumbnailUrl = (item as any).thumbnail_url ?? null;

  if (item.content_type === "text") {
    return (
      <div className="mx-5 mb-3 rounded-xl bg-[#FBF8FF] border border-[#EDE5F8] px-5 py-4">
        <p className="text-[13px] text-[#2D0052] leading-relaxed whitespace-pre-wrap line-clamp-6"
          style={{ fontFamily: "'Georgia', serif" }}>
          {textBody ?? "No content."}
        </p>
      </div>
    );
  }

  if (item.content_type === "image") {
    const src = fileUrl ?? thumbnailUrl;
    if (!src) return null;
    return (
      <div className="mx-5 mb-3 rounded-xl overflow-hidden border border-[#EDE5F8] bg-[#F5EFFF] flex items-center justify-center" style={{ maxHeight: 260 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={item.title} className="max-w-full object-contain" style={{ maxHeight: 260 }} />
      </div>
    );
  }

  if (item.content_type === "video") {
    if (!fileUrl) return null;
    const embedUrl = getVideoEmbedUrl(fileUrl);
    if (embedUrl) {
      return (
        <div className="mx-5 mb-3 rounded-xl overflow-hidden bg-black" style={{ aspectRatio: "16/9" }}>
          <iframe src={embedUrl} className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen />
        </div>
      );
    }
    return (
      <div className="mx-5 mb-3 rounded-xl overflow-hidden bg-black">
        <video src={fileUrl} controls className="w-full" poster={thumbnailUrl ?? undefined}
          preload="metadata" playsInline style={{ maxHeight: 260 }} />
      </div>
    );
  }

  if (item.content_type === "pdf") {
    if (!fileUrl) return null;
    return <div className="mx-5 mb-3"><PdfViewer url={fileUrl} title={item.title} /></div>;
  }

  return null;
}

// ─── Content Preview Modal ────────────────────────────────────────────────────
interface ContentPreviewModalProps {
  item: ContentResponse;
  allItems: ContentResponse[];
  onClose: () => void;
  onNavigate: (item: ContentResponse) => void;
}

function ContentPreviewModal({ item, allItems, onClose, onNavigate }: ContentPreviewModalProps) {
  const currentIndex = allItems.findIndex((i) => i.id === item.id);
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  const { mutate: togglePublish, isPending: toggling } = useTogglePublish();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && prevItem) onNavigate(prevItem);
      if (e.key === "ArrowRight" && nextItem) onNavigate(nextItem);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onNavigate, prevItem, nextItem]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const tCfg = CONTENT_TYPE_CONFIG[item.content_type];
  const fileUrl = (item as any).file_url ?? (item as any).url ?? null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(20, 0, 40, 0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      {prevItem && (
        <button onClick={(e) => { e.stopPropagation(); onNavigate(prevItem); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all backdrop-blur-sm"
          title="Previous (←)">
          {Icon.arrowLeft}
        </button>
      )}
      {nextItem && (
        <button onClick={(e) => { e.stopPropagation(); onNavigate(nextItem); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all backdrop-blur-sm"
          title="Next (→)">
          {Icon.arrowRight}
        </button>
      )}

      <div
        className="bg-white w-full max-w-[720px] max-h-[90vh] rounded-2xl border border-[#EDE5F8] overflow-hidden flex flex-col"
        style={{ boxShadow: "0 32px 80px rgba(20, 0, 40, 0.35)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-[#F5EFFF] shrink-0">
          <div className="w-[34px] h-[34px] rounded-[9px] bg-[#F3E8FF] border border-[#EDE5F8] flex items-center justify-center shrink-0 text-[#8A2BE2] text-[10px] font-bold">
            {tCfg.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[16px] font-bold text-[#2D0052] truncate">{item.title}</h3>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-[11px] text-[#A08DBE]">{tCfg.label}</span>
              <span className="text-[11px] text-[#D4C5E8]">·</span>
              <span className="text-[11px] text-[#A08DBE]">{formatFullDate(item.created_at)}</span>
              {(item as any).view_count > 0 && (
                <>
                  <span className="text-[11px] text-[#D4C5E8]">·</span>
                  <span className="text-[11px] text-[#A08DBE]">{(item as any).view_count} views</span>
                </>
              )}
              {(item as any).like_count > 0 && (
                <>
                  <span className="text-[11px] text-[#D4C5E8]">·</span>
                  <span className="text-[11px] text-[#A08DBE]">{(item as any).like_count} likes</span>
                </>
              )}
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5EFFF] flex items-center justify-center text-[#A08DBE] hover:bg-[#EDE5F8] hover:text-[#6B4F8A] transition-colors shrink-0">
            {Icon.x}
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto">
          <div className="px-6 py-5 flex flex-col gap-4">
            <PreviewBody item={item} />
            {(item as any).description && (
              <p className="text-[13px] text-[#6B4F8A] leading-relaxed px-1">{(item as any).description}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#F5EFFF] shrink-0 bg-[#FBF8FF]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              "inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full",
              item.is_published ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#F5EFFF] text-[#A08DBE] border border-[#EDE5F8]",
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", item.is_published ? "bg-[#16A34A]" : "bg-[#A08DBE]")} />
              {item.is_published ? "Published" : "Draft"}
            </span>
            <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full border bg-[#F3E8FF] text-[#8A2BE2] border-[#EDE5F8]">
              {item.plans.length > 0 ? item.plans.map((p) => p.name).join(", ") : "All subscribers"}
            </span>
            <span className="text-[11px] text-[#C4B5D4] ml-1">{currentIndex + 1} / {allItems.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => togglePublish(item.id)} disabled={toggling}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all border disabled:opacity-50 bg-white text-[#6B4F8A] border-[#EDE5F8] hover:bg-[#F5EFFF] hover:border-[#DDD6FE]">
              {Icon.eye}
              {item.is_published ? "Unpublish" : "Publish"}
            </button>
            {fileUrl && (
              <a href={fileUrl} download={item.title} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all border bg-white text-[#6B4F8A] border-[#EDE5F8] hover:bg-[#F5EFFF] hover:border-[#DDD6FE]">
                {Icon.download} Download
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────
interface UploadModalProps {
  onClose: () => void;
  plans: PlanResponse[];
}

function UploadModal({ onClose, plans }: UploadModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [contentType, setContentType] = useState<"video" | "image" | "pdf" | "text">("video");
  const [title, setTitle] = useState("");
  const [planId, setPlanId] = useState<number | null>(null);
  const [textBody, setTextBody] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const { mutate: createContent, isPending } = useCreateContent();

  const handleFile = (f: File) => {
    setFile(f);
    setTitle(f.name.replace(/\.[^/.]+$/, ""));
    if (f.type.startsWith("video/")) setContentType("video");
    else if (f.type.startsWith("image/")) setContentType("image");
    else if (f.type === "application/pdf") setContentType("pdf");
    setStep(2);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const submit = () => {
    if (!title.trim()) return;
    createContent(
      {
        fields: {
          title: title.trim(),
          content_type: contentType,
          plan_id: planId ?? undefined,
          file: file ?? undefined,
          text_body: contentType === "text" ? textBody : undefined,
        },
      },
      { onSuccess: onClose },
    );
  };

  const activePlans = plans.filter((p) => p.is_active);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(45,0,82,0.4)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[440px] overflow-hidden border border-[#EDE5F8]"
        style={{ boxShadow: "0 20px 60px rgba(45,0,82,0.18)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-[#F5EFFF]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#A08DBE] mb-0.5">Step {step} of 2</p>
            <h3 className="text-[18px] font-bold text-[#2D0052]">{step === 1 ? "Upload content" : "Set details"}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F5EFFF] flex items-center justify-center text-[#A08DBE] hover:bg-[#EDE5F8] transition-colors text-[18px] leading-none">×</button>
        </div>

        <div className="px-6 py-5">
          {step === 1 ? (
            <div>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center py-10 gap-3"
                style={{ borderColor: dragging ? "#8A2BE2" : "#DDD6FE", background: dragging ? "#F5F3FF" : "#FBF8FF" }}
              >
                <input ref={fileRef} type="file" className="hidden" accept="video/*,image/*,application/pdf"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                <div className="w-12 h-12 rounded-xl bg-[#F3E8FF] border border-[#EDE5F8] flex items-center justify-center text-[#8A2BE2]">{Icon.upload}</div>
                <div className="text-center">
                  <p className="text-[14px] font-semibold text-[#2D0052]">Drop a file or <span className="text-[#8A2BE2] underline underline-offset-2">browse</span></p>
                  <p className="text-[12px] text-[#A08DBE] mt-0.5">Video, image, or PDF</p>
                </div>
              </div>
              <div className="flex items-center gap-3 my-4">
                <div className="h-px flex-1 bg-[#EDE5F8]" />
                <span className="text-[11px] text-[#A08DBE]">or</span>
                <div className="h-px flex-1 bg-[#EDE5F8]" />
              </div>
              <button onClick={() => { setContentType("text"); setStep(2); }}
                className="w-full py-2.5 rounded-md border border-[#DDD6FE] text-[13px] font-medium text-[#7C3AED] bg-[#F5F3FF] hover:bg-[#EDE9FE] transition-colors">
                Write text content
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {file && (
                <div className="flex items-center gap-2.5 px-3 py-2.5 bg-[#F5F3FF] rounded-md border border-[#DDD6FE]">
                  <div className="w-7 h-7 rounded-[7px] bg-[#EDE5F8] flex items-center justify-center text-[#8A2BE2]">{Icon.file}</div>
                  <span className="text-[12.5px] font-medium text-[#2D0052] truncate flex-1">{file.name}</span>
                  <button onClick={() => { setFile(null); setStep(1); }} className="text-[#A08DBE] hover:text-red-400 transition-colors">{Icon.x}</button>
                </div>
              )}
              {contentType === "text" && (
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A08DBE] mb-1.5 block">Content</label>
                  <textarea value={textBody} onChange={(e) => setTextBody(e.target.value)} placeholder="Write your content here…" rows={4}
                    className="w-full bg-[#FBF8FF] border border-[#EDE5F8] rounded-md px-4 py-2.5 text-[13.5px] text-[#2D0052] placeholder:text-[#C4B5D4] outline-none focus:border-[#C084FC] transition-all resize-none" />
                </div>
              )}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A08DBE] mb-1.5 block">Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your content a name…"
                  className="w-full bg-[#FBF8FF] border border-[#EDE5F8] rounded-md px-4 py-2.5 text-[13.5px] text-[#2D0052] placeholder:text-[#C4B5D4] outline-none focus:border-[#C084FC] transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A08DBE] mb-1.5 block">
                  Plan access <span className="normal-case font-normal text-[#C4B5D4]">(optional)</span>
                </label>
                {activePlans.length === 0 ? (
                  <p className="text-[12px] text-[#C4B5D4]">No active plans yet — content will be accessible to all subscribers.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-1.5">
                    {activePlans.map((plan) => (
                      <button key={plan.id} onClick={() => setPlanId(planId === plan.id ? null : plan.id)}
                        className="py-2.5 px-3 rounded-md text-[12.5px] font-semibold text-left transition-all border-2"
                        style={{ background: planId === plan.id ? "#8A2BE2" : "#FBF8FF", color: planId === plan.id ? "white" : "#6B4F8A", borderColor: planId === plan.id ? "#8A2BE2" : "#EDE5F8" }}>
                        {plan.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-[12px] text-[#A08DBE]">
                Content is always saved as a <strong className="text-[#8A2BE2]">draft</strong> first. Publish it from the list.
              </p>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex gap-2">
          {step === 2 && (
            <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-md text-[13px] font-semibold text-[#6B4F8A] bg-[#F5EFFF] hover:bg-[#EDE5F8] transition-colors border border-[#EDE5F8]">
              ← Back
            </button>
          )}
          <button
            onClick={step === 1 ? () => setStep(2) : submit}
            disabled={step === 2 && (isPending || !title.trim())}
            className="flex-1 py-2.5 rounded-md text-[13px] font-semibold text-white transition-all disabled:opacity-40"
            style={{ background: "#8A2BE2", boxShadow: "0 4px 14px rgba(138,43,226,0.3)" }}
          >
            {step === 1 ? "Continue →" : isPending ? "Saving…" : "Save as Draft"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Content Card (grid view with thumbnail) ──────────────────────────────────
interface ContentCardProps {
  item: ContentResponse;
  plans: PlanResponse[];
  onPreview: (item: ContentResponse) => void;
}

function ContentCard({ item, plans, onPreview }: ContentCardProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [showPlanMenu, setShowPlanMenu] = useState(false);
  const [showRowMenu, setShowRowMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const planRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { mutate: updateContent, isPending: updating } = useUpdateContentItem();
  const { mutate: deleteContent, isPending: deleting } = useDeleteContentItem();
  const { mutate: togglePublish, isPending: toggling } = useTogglePublish();

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (planRef.current && !planRef.current.contains(e.target as Node)) setShowPlanMenu(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowRowMenu(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const saveTitle = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== item.title) updateContent({ contentId: item.id, body: { title: trimmed } });
    else setEditTitle(item.title);
    setEditing(false);
  };

  const tCfg = CONTENT_TYPE_CONFIG[item.content_type];
  const activePlans = plans.filter((p) => p.is_active);

  return (
    <div className="group bg-white rounded-2xl border border-[#EDE5F8] overflow-visible hover:border-[#DDD6FE] hover:shadow-lg transition-all"
      style={{ boxShadow: "0 1px 4px rgba(45,0,82,0.05)" }}>

      {/* Thumbnail */}
      <div className="p-2.5 pb-0">
        <ContentThumbnail item={item} onClick={() => onPreview(item)} />
      </div>

      {/* Card body */}
      <div className="px-3.5 pt-2.5 pb-3">
        {/* Title */}
        <div className="flex items-start gap-1.5 mb-2">
          {editing ? (
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <input ref={inputRef} value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") { setEditTitle(item.title); setEditing(false); } }}
                className="flex-1 min-w-0 text-[12.5px] font-semibold text-[#2D0052] bg-white border border-[#A78BFA] rounded-[7px] px-2 py-1 outline-none ring-2 ring-[#8A2BE2]/10" />
              <button onClick={saveTitle} disabled={updating} className="w-[20px] h-[20px] rounded-[5px] bg-[#8A2BE2] flex items-center justify-center text-white shrink-0 disabled:opacity-50">{Icon.check}</button>
              <button onClick={() => { setEditTitle(item.title); setEditing(false); }} className="w-[20px] h-[20px] rounded-[5px] bg-[#F5EFFF] flex items-center justify-center text-[#A08DBE] shrink-0">{Icon.x}</button>
            </div>
          ) : (
            <>
              <button onClick={() => onPreview(item)} className="flex-1 min-w-0 text-left">
                <span className="block text-[12.5px] font-semibold text-[#2D0052] truncate hover:text-[#8A2BE2] transition-colors leading-snug">{item.title}</span>
              </button>
              <button onClick={() => setEditing(true)}
                className="opacity-0 group-hover:opacity-100 w-[18px] h-[18px] rounded-[4px] flex items-center justify-center text-[#A08DBE] hover:bg-[#F3E8FF] hover:text-[#8A2BE2] transition-all shrink-0 mt-0.5">
                {Icon.edit}
              </button>
            </>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-[4px] bg-[#F3E8FF] text-[#8A2BE2] border border-[#EDE5F8] uppercase tracking-wide">
              {tCfg.label}
            </span>
            <span className="text-[10.5px] text-[#C4B5D4]">{formatDate(item.created_at)}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => togglePublish(item.id)} disabled={toggling}
              className={cn(
                "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all hover:opacity-75 disabled:opacity-50",
                item.is_published ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#F5EFFF] text-[#A08DBE] border border-[#EDE5F8]",
              )}>
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", item.is_published ? "bg-[#16A34A]" : "bg-[#A08DBE]")} />
              {item.is_published ? "Live" : "Draft"}
            </button>

            {/* Row menu */}
            <div className="relative" ref={menuRef}>
              <button onClick={() => setShowRowMenu((o) => !o)}
                className="w-[22px] h-[22px] rounded-[5px] flex items-center justify-center text-[#C4B5D4] opacity-0 group-hover:opacity-100 hover:bg-[#F3E8FF] hover:text-[#8A2BE2] transition-all">
                {Icon.dots}
              </button>
              {showRowMenu && (
                <div className="absolute right-0 bottom-7 z-30 bg-white border border-[#EDE5F8] rounded-[12px] overflow-hidden w-[148px]"
                  style={{ boxShadow: "0 8px 24px rgba(45,0,82,0.12)" }}
                  onMouseLeave={() => setShowRowMenu(false)}>
                  {[
                    { icon: Icon.eye,  label: "Preview", fn: () => { onPreview(item); setShowRowMenu(false); } },
                    { icon: Icon.edit, label: "Rename",  fn: () => { setEditing(true); setShowRowMenu(false); } },
                  ].map(({ icon, label, fn }) => (
                    <button key={label} onClick={fn}
                      className="w-full text-left px-3.5 py-2.5 text-[12.5px] font-medium text-[#2D0052] hover:bg-[#F5EFFF] transition-colors flex items-center gap-2.5">
                      <span className="text-[#A08DBE]">{icon}</span>{label}
                    </button>
                  ))}
                  <div className="border-t border-[#F5EFFF]">
                    {/* Plan picker */}
                    <div ref={planRef}>
                      <button onClick={() => setShowPlanMenu((o) => !o)}
                        className="w-full text-left px-3.5 py-2.5 text-[12.5px] font-medium text-[#2D0052] hover:bg-[#F5EFFF] transition-colors flex items-center gap-2.5">
                        <span className="text-[#A08DBE]">
                          <svg width="12" height="12" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="5" cy="4" r="2.2"/><path d="M1 11c0-2.2 1.8-4 4-4s4 1.8 4 4"/><circle cx="10" cy="4.5" r="1.7"/><path d="M12 11c0-1.7-1.3-3-3-3"/></svg>
                        </span>
                        Plan
                        <span className="ml-auto text-[#C4B5D4]">{Icon.chevron}</span>
                      </button>
                      {showPlanMenu && (
                        <div className="border-t border-[#F5EFFF] bg-[#FBF8FF]">
                          <button
                            onClick={() => { updateContent({ contentId: item.id, body: { plan_ids: [] } }); setShowPlanMenu(false); setShowRowMenu(false); }}
                            disabled={item.plans.length === 0}
                            className="w-full text-left px-4 py-2 text-[11.5px] font-semibold text-[#6B4F8A] hover:bg-[#F5EFFF] flex items-center gap-2 disabled:opacity-40 transition-colors">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A08DBE] shrink-0" />
                            All subscribers
                            {item.plans.length === 0 && <span className="ml-auto">{Icon.check}</span>}
                          </button>
                          {activePlans.map((plan) => (
                            <button key={plan.id}
                              onClick={() => { updateContent({ contentId: item.id, body: { plan_ids: [plan.id] } }); setShowPlanMenu(false); setShowRowMenu(false); }}
                              disabled={item.plans.some((p) => p.id === plan.id)}
                              className="w-full text-left px-4 py-2 text-[11.5px] font-semibold text-[#8A2BE2] hover:bg-[#F5EFFF] flex items-center gap-2 disabled:opacity-40 transition-colors">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8A2BE2] shrink-0" />
                              {plan.name}
                              {item.plans.some((p) => p.id === plan.id) && <span className="ml-auto">{Icon.check}</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => { if (confirm("Delete this content?")) { deleteContent(item.id); setShowRowMenu(false); } }}
                      disabled={deleting}
                      className="w-full text-left px-3.5 py-2.5 text-[12.5px] font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2.5 disabled:opacity-50">
                      {Icon.trash} Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Plan badge */}
        <div className="mt-2">
          <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border bg-[#F3E8FF] text-[#8A2BE2] border-[#EDE5F8]">
            {item.plans.length > 0 ? item.plans.map((p) => p.name).join(", ") : "All subscribers"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Content Row (list view with inline peek) ─────────────────────────────────
interface ContentRowProps {
  item: ContentResponse;
  plans: PlanResponse[];
  onPreview: (item: ContentResponse) => void;
}

function ContentRow({ item, plans, onPreview }: ContentRowProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [showPlanMenu, setShowPlanMenu] = useState(false);
  const [showRowMenu, setShowRowMenu] = useState(false);
  const [peekOpen, setPeekOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: updateContent, isPending: updating } = useUpdateContentItem();
  const { mutate: deleteContent, isPending: deleting } = useDeleteContentItem();
  const { mutate: togglePublish, isPending: toggling } = useTogglePublish();

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const saveTitle = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== item.title) updateContent({ contentId: item.id, body: { title: trimmed } });
    else setEditTitle(item.title);
    setEditing(false);
  };

  const tCfg = CONTENT_TYPE_CONFIG[item.content_type];
  const activePlans = plans.filter((p) => p.is_active);

  return (
    <div className="group relative flex flex-col border-b border-[#F5EFFF] last:border-b-0 transition-colors hover:bg-[#FBF8FF]">
      <div className="flex items-center gap-3 px-5 py-3">
        {/* Type badge — toggles inline peek */}
        <button
          onClick={() => setPeekOpen((o) => !o)}
          className={cn(
            "w-[30px] h-[30px] rounded-lg border flex items-center justify-center shrink-0 text-[9px] font-bold transition-all",
            peekOpen
              ? "bg-[#8A2BE2] text-white border-[#8A2BE2]"
              : "bg-[#F3E8FF] border-[#EDE5F8] text-[#8A2BE2] hover:bg-[#EDE5F8] hover:border-[#DDD6FE]",
          )}
          title={peekOpen ? "Close preview" : "Quick preview"}
        >
          {tCfg.icon}
        </button>

        <div className="flex-1 min-w-0 flex items-center gap-2">
          {editing ? (
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <input ref={inputRef} value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") { setEditTitle(item.title); setEditing(false); } }}
                className="flex-1 min-w-0 text-[13px] font-medium text-[#2D0052] bg-white border border-[#C084FC] rounded-[7px] px-2.5 py-1 outline-none ring-2 ring-[#8A2BE2]/10" />
              <button onClick={saveTitle} disabled={updating} className="w-6 h-6 rounded-sm bg-[#8A2BE2] flex items-center justify-center text-white shrink-0 disabled:opacity-50">{Icon.check}</button>
              <button onClick={() => { setEditTitle(item.title); setEditing(false); }} className="w-6 h-6 rounded-sm bg-[#F5EFFF] flex items-center justify-center text-[#A08DBE] shrink-0">{Icon.x}</button>
            </div>
          ) : (
            <>
              <button onClick={() => onPreview(item)} className="min-w-0 text-left">
                <span className="text-[13px] font-medium text-[#2D0052] truncate block hover:text-[#8A2BE2] transition-colors">{item.title}</span>
                <span className="text-[11px] text-[#A08DBE]">{formatDate(item.created_at)}</span>
              </button>
              <button onClick={() => setEditing(true)}
                className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-[5px] flex items-center justify-center text-[#A08DBE] hover:bg-[#F3E8FF] hover:text-[#8A2BE2] transition-all shrink-0">
                {Icon.edit}
              </button>
            </>
          )}
        </div>

        {/* Plan dropdown */}
        <div className="relative hidden sm:block">
          <button onClick={() => setShowPlanMenu((p) => !p)}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full transition-all hover:opacity-80 bg-[#F3E8FF] text-[#8A2BE2]">
            {item.plans.length > 0 ? item.plans.map((p) => p.name).join(", ") : "All"}
            <span className="opacity-60">{Icon.chevron}</span>
          </button>
          {showPlanMenu && (
            <div className="absolute left-0 top-8 z-20 bg-white border border-[#EDE5F8] rounded-xl overflow-hidden w-[160px]"
              style={{ boxShadow: "0 8px 24px rgba(45,0,82,0.12)" }} onMouseLeave={() => setShowPlanMenu(false)}>
              <button onClick={() => { updateContent({ contentId: item.id, body: { plan_ids: [] } }); setShowPlanMenu(false); }}
                className="w-full text-left px-3 py-2 text-[12px] font-semibold flex items-center gap-2 transition-colors hover:bg-[#F5EFFF] text-[#6B4F8A]"
                disabled={item.plans.length === 0}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#A08DBE]" />
                All subscribers
                {item.plans.length === 0 && <span className="ml-auto text-[#A08DBE]">{Icon.check}</span>}
              </button>
              {activePlans.map((plan) => (
                <button key={plan.id} onClick={() => { updateContent({ contentId: item.id, body: { plan_ids: [plan.id] } }); setShowPlanMenu(false); }}
                  className="w-full text-left px-3 py-2 text-[12px] font-semibold flex items-center gap-2 transition-colors hover:bg-[#F5EFFF] text-[#8A2BE2]"
                  disabled={item.plans.some((p) => p.id === plan.id)}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#8A2BE2]" />
                  {plan.name}
                  {item.plans.some((p) => p.id === plan.id) && <span className="ml-auto text-[#A08DBE]">{Icon.check}</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => togglePublish(item.id)} disabled={toggling}
          className={cn(
            "inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all hover:opacity-80 shrink-0 disabled:opacity-50",
            item.is_published ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#F5EFFF] text-[#A08DBE] border border-[#EDE5F8]",
          )}>
          <span className={cn("w-1.5 h-1.5 rounded-full", item.is_published ? "bg-[#16A34A]" : "bg-[#A08DBE]")} />
          {item.is_published ? "Published" : "Draft"}
        </button>

        <div className="relative">
          <button onClick={() => setShowRowMenu((p) => !p)}
            className="w-[28px] h-[28px] rounded-[7px] flex items-center justify-center text-[#A08DBE] opacity-0 group-hover:opacity-100 hover:bg-[#F3E8FF] hover:text-[#8A2BE2] transition-all">
            {Icon.dots}
          </button>
          {showRowMenu && (
            <div className="absolute right-0 top-8 z-20 bg-white border border-[#EDE5F8] rounded-xl overflow-hidden w-[160px]"
              style={{ boxShadow: "0 8px 24px rgba(45,0,82,0.12)" }} onMouseLeave={() => setShowRowMenu(false)}>
              <button onClick={() => { onPreview(item); setShowRowMenu(false); }}
                className="w-full text-left px-4 py-2.5 text-[12.5px] font-medium text-[#2D0052] hover:bg-[#F5EFFF] transition-colors flex items-center gap-2.5">
                <span className="text-[#A08DBE]">{Icon.eye}</span> Preview
              </button>
              <button onClick={() => { setEditing(true); setShowRowMenu(false); }}
                className="w-full text-left px-4 py-2.5 text-[12.5px] font-medium text-[#2D0052] hover:bg-[#F5EFFF] transition-colors flex items-center gap-2.5">
                <span className="text-[#A08DBE]">{Icon.edit}</span> Rename
              </button>
              <div className="border-t border-[#F5EFFF]">
                <button onClick={() => { if (confirm("Delete this content? This cannot be undone.")) { deleteContent(item.id); setShowRowMenu(false); } }}
                  disabled={deleting}
                  className="w-full text-left px-4 py-2.5 text-[12.5px] font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2.5 disabled:opacity-50">
                  <span>{Icon.trash}</span> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inline peek panel */}
      {peekOpen && (
        <div className="border-t border-[#F5EFFF] pt-3 pb-1">
          <InlinePeek item={item} />
          <div className="flex justify-end px-5 pb-3">
            <button onClick={() => { onPreview(item); setPeekOpen(false); }}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg text-white transition-all"
              style={{ background: "#8A2BE2", boxShadow: "0 2px 8px rgba(138,43,226,0.2)" }}>
              {Icon.eye} Open full view
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Plan Section ─────────────────────────────────────────────────────────────
interface PlanSectionProps {
  label: string;
  planId: number | null;
  items: ContentResponse[];
  plans: PlanResponse[];
  onPreview: (item: ContentResponse) => void;
  viewMode: "grid" | "list";
}

function PlanSection({ label, items, plans, onPreview, viewMode }: PlanSectionProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-[#EDE5F8] overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(45,0,82,0.04)" }}>
      <button onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#FBF8FF] transition-colors"
        style={{ borderBottom: open && items.length > 0 ? "1px solid #F5EFFF" : "none" }}>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F3E8FF] text-[#8A2BE2]">{label}</span>
          <span className="text-[13px] font-medium text-[#A08DBE] tabular-nums">{items.length} {items.length === 1 ? "piece" : "pieces"}</span>
        </div>
        <span className={cn("text-[#A08DBE] transition-transform duration-200", !open && "-rotate-90")}>{Icon.chevron}</span>
      </button>

      {open && (
        items.length > 0 ? (
          viewMode === "grid" ? (
            <div className="p-4 bg-[#FBF8FF]">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {items.map((item) => (
                  <ContentCard key={item.id} item={item} plans={plans} onPreview={onPreview} />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 px-5 py-2 bg-[#FBF8FF]">
                <div className="w-[30px] shrink-0" />
                <span className="flex-1 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#A08DBE]">Title</span>
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#A08DBE] hidden sm:block w-[100px]">Plan</span>
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#A08DBE] w-[90px]">Status</span>
                <div className="w-[28px]" />
              </div>
              {items.map((item) => (
                <ContentRow key={item.id} item={item} plans={plans} onPreview={onPreview} />
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#F5EFFF] border border-[#EDE5F8] flex items-center justify-center text-[#C4B5D4]">{Icon.upload}</div>
            <p className="text-[13px] font-medium text-[#A08DBE]">No content in {label} yet</p>
          </div>
        )
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CreatorHub() {
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "video" | "image" | "pdf" | "text">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [previewItem, setPreviewItem] = useState<ContentResponse | null>(null);

  const { data: hub } = useOwnHub();
  const { data: stats } = useOwnHubStats();
  const { data: content = [], isLoading } = useMyContent();
  const { data: plans = [] } = useMyPlans();

  const published = content.filter((c) => c.is_published).length;
  const drafts = content.filter((c) => !c.is_published).length;

  const filtered = content.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter === "all" || item.content_type === typeFilter),
  );

  const activePlans = plans.filter((p) => p.is_active);
  const ungated = filtered.filter((item) => item.plans.length === 0);
  const planGroups = activePlans.map((plan) => ({
    plan,
    items: filtered.filter((item) => item.plans.some((p) => p.id === plan.id)),
  }));

  const handlePreview = useCallback((item: ContentResponse) => { setPreviewItem(item); }, []);
  const handleNavigate = useCallback((item: ContentResponse) => { setPreviewItem(item); }, []);

  return (
    <main className="flex-1 px-6 lg:px-9 py-8 lg:py-10 bg-[#FBF8FF] min-h-screen">
      <div className="flex items-start justify-between mb-7 gap-4 flex-wrap">
        <div>
          <h1 className="text-[26px] text-[#2D0052] leading-tight font-bold">Your Hub</h1>
          <p className="text-[13px] text-[#A08DBE] mt-1">
            {hub?.name ?? "…"} &nbsp;·&nbsp; {published} published &nbsp;·&nbsp; {drafts} {drafts !== 1 ? "drafts" : "draft"}
          </p>
        </div>
        <QuickActionsMenu onUpload={() => setShowUpload(true)} onEditProfile={() => {}} />
      </div>

      {/* Stats bar */}
      <div className="bg-white rounded-2xl border border-[#EDE5F8] p-5 mb-6" style={{ boxShadow: "0 1px 3px rgba(45,0,82,0.05)" }}>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#F5EFFF]">
          {[
            { label: "Total pieces",  value: isLoading ? "—" : String(content.length) },
            { label: "Published",     value: isLoading ? "—" : String(published) },
            { label: "Drafts",        value: isLoading ? "—" : String(drafts) },
            { label: "Subscribers",   value: stats ? stats.total_subscribers.toLocaleString() : "—" },
          ].map((s, i) => (
            <div key={i} className={cn("flex flex-col px-5 first:pl-0 last:pr-0", i >= 2 && "mt-4 md:mt-0")}>
              <span className="text-[11.5px] font-medium text-[#A08DBE] mb-1.5">{s.label}</span>
              <span className="text-[26px] font-bold text-[#2D0052] leading-none tracking-tight">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter + view toggle bar */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A08DBE]">{Icon.search}</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search content…"
            className="bg-white border border-[#EDE5F8] rounded-md pl-9 pr-4 py-2 text-[13px] text-[#2D0052] placeholder:text-[#A08DBE] w-[190px] outline-none focus:border-[#C084FC] focus:ring-2 focus:ring-[#8A2BE2]/10 transition-all" />
        </div>
        <div className="flex items-center gap-1.5">
          {(["all", "video", "image", "pdf", "text"] as const).map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={cn(
                "text-[12px] font-semibold px-3.5 py-1.5 rounded-full capitalize transition-all border",
                typeFilter === t ? "bg-[#8A2BE2] text-white border-[#8A2BE2]" : "bg-white text-[#6B4F8A] border-[#EDE5F8] hover:border-[#C084FC] hover:text-[#8A2BE2]",
              )}>
              {t}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-white border border-[#EDE5F8] rounded-lg p-1 ml-auto">
          <button onClick={() => setViewMode("list")}
            className={cn("px-2.5 py-1 rounded-[6px] text-[11px] font-semibold transition-all", viewMode === "list" ? "bg-[#8A2BE2] text-white" : "text-[#6B4F8A] hover:bg-[#F5EFFF]")}>
            List
          </button>
          <button onClick={() => setViewMode("grid")}
            className={cn("px-2.5 py-1 rounded-[6px] text-[11px] font-semibold transition-all", viewMode === "grid" ? "bg-[#8A2BE2] text-white" : "text-[#6B4F8A] hover:bg-[#F5EFFF]")}>
            Grid
          </button>
        </div>

        <span className="text-[12px] text-[#A08DBE]">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#EDE5F8] h-[80px] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <PlanSection label="All subscribers" planId={null} items={ungated} plans={plans} onPreview={handlePreview} viewMode={viewMode} />
          {planGroups.map(({ plan, items }) => (
            <PlanSection key={plan.id} label={plan.name} planId={plan.id} items={items} plans={plans} onPreview={handlePreview} viewMode={viewMode} />
          ))}
        </div>
      )}

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} plans={plans} />}

      {previewItem && (
        <ContentPreviewModal item={previewItem} allItems={filtered} onClose={() => setPreviewItem(null)} onNavigate={handleNavigate} />
      )}
    </main>
  );
}