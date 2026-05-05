"use client";

import { useState, useCallback } from "react";
import {
  useMyContent,
  useCreateContent,
  useDeleteContentItem,
  useTogglePublish,
} from "@/hooks/useContent";
import { useMyPlans } from "@/hooks/usePlans";
import type { ContentResponse } from "@/types/content";
import type { PlanResponse } from "@/types/plans";

const cn = (...c: (string | boolean | undefined)[]) =>
  c.filter(Boolean).join(" ");

const B = {
  ink: "#2D0052",
  purple: "#8A2BE2",
  mid: "#6B4F8A",
  muted: "#A08DBE",
  faint: "#C4B5D4",
  hair: "#D4C5E8",
  border: "#EDE5F8",
  soft: "#F5EFFF",
  wash: "#FBF8FF",
  white: "#FFFFFF",
  green: "#16A34A",
  greenBg: "#DCFCE7",
  greenBd: "#BBF7D0",
};

const TYPE_CONFIG = {
  video: { short: "VID", label: "Video" },
  image: { short: "IMG", label: "Image" },
  pdf: { short: "PDF", label: "PDF" },
  text: { short: "TXT", label: "Text" },
} as const;

function detectContentType(file: File): "video" | "image" | "pdf" | "text" {
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("image/")) return "image";
  if (file.type === "application/pdf") return "pdf";
  return "text";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}
function formatFullDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function formatFileSize(bytes?: number) {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const Icon = {
  plus: (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M6.5 1v11M1 6.5h11" />
    </svg>
  ),
  close: (
    <svg
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M1 1l7 7M8 1 1 8" />
    </svg>
  ),
  trash: (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M2 3h8M4 3V2h4v1" />
      <path d="M3 3l.5 7h5L9 3" />
    </svg>
  ),
  eye: (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <path d="M1 6s2-3.8 5-3.8S11 6 11 6s-2 3.8-5 3.8S1 6 1 6Z" />
      <circle cx="6" cy="6" r="1.4" />
    </svg>
  ),
  upload: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 15V6M7.5 9.5 11 6l3.5 3.5" />
      <path d="M3.5 17h15" />
    </svg>
  ),
  arrowL: (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.5 2 3.5 6l4 4" />
    </svg>
  ),
  arrowR: (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 2 8.5 6l-4 4" />
    </svg>
  ),
  download: (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 1.5v7M3.5 6 6 8.5 8.5 6" />
      <path d="M1.5 9.5v1a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-1" />
    </svg>
  ),
  play: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 2.5v11l9-5.5-9-5.5Z" />
    </svg>
  ),
  file: (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M3 1h4l3 3v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z" />
      <path d="M6.5 1v3.5H10" />
    </svg>
  ),
  check: (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 5.5l2.5 2.5 4.5-4.5" />
    </svg>
  ),
  dots: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor">
      <circle cx="6.5" cy="2.5" r="1.1" />
      <circle cx="6.5" cy="6.5" r="1.1" />
      <circle cx="6.5" cy="10.5" r="1.1" />
    </svg>
  ),
  expand: (
    <svg
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.5 1H11v3.5M4.5 11H1V7.5M11 1L7 5M1 11l4-4" />
    </svg>
  ),
};

// ─── Status pill ──────────────────────────────────────────────────────────────
function StatusPill({
  published,
  size = "sm",
}: {
  published: boolean;
  size?: "sm" | "md";
}) {
  const sz =
    size === "md" ? "text-[11.5px] px-3 py-1" : "text-[10px] px-2 py-0.5";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold rounded-full border",
        sz,
        published ? "text-[#166534] bg-[#DCFCE7] border-[#BBF7D0]" : "",
      )}
      style={
        !published
          ? { color: B.muted, background: B.soft, borderColor: B.border }
          : {}
      }
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full shrink-0",
          published ? "bg-[#16A34A]" : "",
        )}
        style={!published ? { background: B.faint } : {}}
      />
      {published ? "Live" : "Draft"}
    </span>
  );
}

// ─── Content Thumbnail ────────────────────────────────────────────────────────
function ContentThumbnail({
  item,
  onClick,
}: {
  item: ContentResponse;
  onClick: () => void;
}) {
  const fileUrl = (item as any).file_url ?? (item as any).url ?? null;
  const thumbnailUrl = (item as any).thumbnail_url ?? null;
  const textBody = (item as any).text_body ?? (item as any).body ?? null;

  return (
    <div
      onClick={onClick}
      className="relative w-full cursor-pointer rounded-xl overflow-hidden border transition-all hover:border-[#A78BFA] hover:shadow-md group/thumb"
      style={{
        aspectRatio: "16/10",
        background: B.soft,
        borderColor: B.border,
      }}
    >
      {item.content_type === "video" &&
        (fileUrl ? (
          <>
            <video
              src={fileUrl}
              className="w-full h-full object-cover"
              poster={thumbnailUrl ?? undefined}
              preload="metadata"
              muted
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover/thumb:bg-black/10 transition-all">
              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[#8A2BE2] shadow-lg">
                {Icon.play}
              </div>
            </div>
          </>
        ) : thumbnailUrl ? (
          <>
            <img
              src={thumbnailUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover/thumb:bg-black/10 transition-all">
              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[#8A2BE2] shadow-lg">
                {Icon.play}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-[#1a0030] flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50">
              {Icon.play}
            </div>
            <p className="text-[10px] text-white/30 font-medium">Video</p>
          </div>
        ))}

      {item.content_type === "image" &&
        (fileUrl || thumbnailUrl ? (
          <img
            src={fileUrl ?? thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 20 20"
              fill="none"
              stroke="#C4B5D4"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <rect x="2" y="2" width="16" height="16" rx="3" />
              <circle cx="7" cy="7.5" r="1.5" />
              <path d="M2 14l4-4 3 3 3-4 6 6" />
            </svg>
            <p className="text-[10px] text-[#C4B5D4] font-medium">Image</p>
          </div>
        ))}

      {item.content_type === "pdf" && (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#FBF8FF]">
          <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] border border-[#EDE5F8] flex items-center justify-center text-[#8A2BE2]">
            {Icon.file}
          </div>
          <p className="text-[10px] text-[#A08DBE] font-semibold uppercase tracking-wide">
            PDF Document
          </p>
        </div>
      )}

      {item.content_type === "text" && (
        <div className="w-full h-full p-3 bg-[#FBF8FF] flex flex-col justify-start overflow-hidden">
          {textBody ? (
            <p
              className="text-[11px] text-[#6B4F8A] leading-[1.6] line-clamp-4"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {textBody}
            </p>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 18 18"
                fill="none"
                stroke="#C4B5D4"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M3 4h12M3 8h8M3 12h10M3 16h6" />
              </svg>
              <p className="text-[10px] text-[#C4B5D4] font-medium">
                Text post
              </p>
            </div>
          )}
        </div>
      )}

      {/* Expand hint on hover */}
      <div className="absolute inset-0 flex items-end justify-end p-2 opacity-0 group-hover/thumb:opacity-100 transition-opacity pointer-events-none">
        <span className="flex items-center gap-1 text-[10px] font-semibold bg-black/60 text-white px-2 py-1 rounded-full">
          {Icon.expand} Expand
        </span>
      </div>
    </div>
  );
}

// ─── Content Card ─────────────────────────────────────────────────────────────
function ContentCard({
  item,
  onPreview,
}: {
  item: ContentResponse;
  onPreview: (i: ContentResponse) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { mutate: togglePublish, isPending: toggling } = useTogglePublish();
  const { mutate: deleteItem, isPending: deleting } = useDeleteContentItem();

  return (
    <div
      className="group relative bg-white rounded-2xl border overflow-visible hover:border-[#DDD6FE] hover:shadow-lg transition-all"
      style={{
        borderColor: B.border,
        boxShadow: "0 1px 4px rgba(45,0,82,0.05)",
      }}
    >
      {/* Thumbnail */}
      <div className="p-2.5 pb-0">
        <ContentThumbnail item={item} onClick={() => onPreview(item)} />
      </div>

      {/* Card body */}
      <div className="px-3.5 pt-2.5 pb-3">
        {/* Title */}
        <button
          onClick={() => onPreview(item)}
          className="w-full text-left mb-2"
        >
          <span
            className="block text-[12.5px] font-semibold truncate leading-snug hover:text-[#8A2BE2] transition-colors"
            style={{ color: B.ink }}
          >
            {item.title}
          </span>
        </button>

        {/* Meta row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-[4px] uppercase tracking-wide border"
              style={{
                color: B.purple,
                background: B.soft,
                borderColor: B.border,
              }}
            >
              {TYPE_CONFIG[item.content_type].label}
            </span>
            <span className="text-[10.5px]" style={{ color: B.faint }}>
              {formatDate(item.created_at)}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Status toggle */}
            <button
              onClick={() => togglePublish(item.id)}
              disabled={toggling}
              className="disabled:opacity-50"
            >
              <StatusPill published={item.is_published} />
            </button>

            {/* Dots menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="opacity-0 group-hover:opacity-100 w-[22px] h-[22px] rounded-[5px] flex items-center justify-center transition-all"
                style={{ color: B.faint }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = B.soft;
                  (e.currentTarget as HTMLElement).style.color = B.purple;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLElement).style.color = B.faint;
                }}
              >
                {Icon.dots}
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 bottom-7 z-30 bg-white rounded-[12px] overflow-hidden w-[140px]"
                  style={{
                    border: `1px solid ${B.border}`,
                    boxShadow: "0 8px 24px rgba(45,0,82,0.12)",
                  }}
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <button
                    onClick={() => {
                      onPreview(item);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-[12.5px] font-medium flex items-center gap-2.5 hover:bg-[#F5EFFF] transition-colors"
                    style={{ color: B.ink }}
                  >
                    <span style={{ color: B.muted }}>{Icon.eye}</span> Preview
                  </button>
                  <div style={{ borderTop: `1px solid ${B.soft}` }}>
                    <button
                      onClick={() => {
                        if (confirm("Delete this content?")) {
                          deleteItem(item.id);
                          setMenuOpen(false);
                        }
                      }}
                      disabled={deleting}
                      className="w-full text-left px-3.5 py-2.5 text-[12.5px] font-medium flex items-center gap-2.5 hover:bg-red-50 transition-colors disabled:opacity-50 text-red-500"
                    >
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
          <span
            className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border"
            style={{
              color: B.purple,
              background: B.soft,
              borderColor: B.border,
            }}
          >
            {item.plans.length > 0 ? item.plans.map(p => p.name).join(", ") : "All"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Content Preview Modal ────────────────────────────────────────────────────
function ContentPreviewModal({
  item,
  allItems,
  onClose,
  onNavigate,
}: {
  item: ContentResponse;
  allItems: ContentResponse[];
  onClose: () => void;
  onNavigate: (i: ContentResponse) => void;
}) {
  const idx = allItems.findIndex((i) => i.id === item.id);
  const prev = idx > 0 ? allItems[idx - 1] : null;
  const next = idx < allItems.length - 1 ? allItems[idx + 1] : null;
  const { mutate: togglePublish, isPending: toggling } = useTogglePublish();

  useState(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && prev) onNavigate(prev);
      if (e.key === "ArrowRight" && next) onNavigate(next);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });
  useState(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  });

  const fileUrl = (item as any).file_url ?? (item as any).url ?? null;
  const textBody = (item as any).text_body ?? (item as any).body ?? null;
  const thumbnailUrl = (item as any).thumbnail_url ?? null;
  const fileSize = formatFileSize((item as any).file_size);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(20,0,40,0.72)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      {prev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(prev);
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all"
        >
          {Icon.arrowL}
        </button>
      )}
      {next && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(next);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all"
        >
          {Icon.arrowR}
        </button>
      )}

      <div
        className="bg-white w-full max-w-[680px] max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
        style={{
          border: `1px solid ${B.border}`,
          boxShadow: "0 32px 80px rgba(20,0,40,0.4)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-6 pt-5 pb-4 shrink-0"
          style={{ borderBottom: `1px solid ${B.soft}` }}
        >
          <div
            className="w-9 h-9 rounded-[9px] flex items-center justify-center text-[10px] font-bold border shrink-0"
            style={{
              color: B.purple,
              background: B.soft,
              borderColor: B.border,
            }}
          >
            {TYPE_CONFIG[item.content_type].short}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-[15px] font-bold truncate"
              style={{ color: B.ink }}
            >
              {item.title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-[11px]" style={{ color: B.muted }}>
                {TYPE_CONFIG[item.content_type].label}
              </span>
              <span style={{ color: B.hair }}>·</span>
              <span className="text-[11px]" style={{ color: B.muted }}>
                {formatFullDate(item.created_at)}
              </span>
              {fileSize && (
                <>
                  <span style={{ color: B.hair }}>·</span>
                  <span className="text-[11px]" style={{ color: B.muted }}>
                    {fileSize}
                  </span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors shrink-0"
            style={{ background: B.soft, color: B.muted }}
          >
            {Icon.close}
          </button>
        </div>

        {/* Preview area */}
        <div className="flex-1 overflow-auto px-6 py-5">
          {item.content_type === "video" &&
            (fileUrl ? (
              <div className="rounded-xl overflow-hidden bg-black">
                <video
                  src={fileUrl}
                  controls
                  className="w-full max-h-[400px]"
                  poster={thumbnailUrl ?? undefined}
                  preload="metadata"
                />
              </div>
            ) : (
              <div
                className="rounded-xl flex flex-col items-center justify-center py-20 gap-3"
                style={{ background: "#1a0030" }}
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/50">
                  {Icon.play}
                </div>
                <p className="text-[13px] text-white/40">
                  Video not available for preview
                </p>
              </div>
            ))}
          {item.content_type === "image" &&
            (fileUrl || thumbnailUrl ? (
              <div
                className="rounded-xl overflow-hidden flex items-center justify-center"
                style={{ background: B.soft, border: `1px solid ${B.border}` }}
              >
                <img
                  src={fileUrl ?? thumbnailUrl}
                  alt={item.title}
                  className="max-w-full max-h-[450px] object-contain"
                />
              </div>
            ) : (
              <div
                className="rounded-xl flex flex-col items-center justify-center py-20 gap-2"
                style={{ background: B.wash, border: `2px dashed ${B.border}` }}
              >
                <p className="text-[13px]" style={{ color: B.muted }}>
                  Image not available
                </p>
              </div>
            ))}
          {item.content_type === "pdf" &&
            (fileUrl ? (
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: `1px solid ${B.border}` }}
              >
                <iframe
                  src={fileUrl}
                  className="w-full border-0"
                  style={{ height: 450 }}
                  title={item.title}
                />
              </div>
            ) : (
              <div
                className="rounded-xl flex flex-col items-center justify-center py-20 gap-2"
                style={{ background: B.wash, border: `2px dashed ${B.border}` }}
              >
                <p className="text-[13px]" style={{ color: B.muted }}>
                  PDF not available
                </p>
              </div>
            ))}
          {item.content_type === "text" &&
            (textBody ? (
              <div
                className="rounded-xl px-6 py-5"
                style={{ background: B.wash, border: `1px solid ${B.border}` }}
              >
                <p
                  className="text-[14px] leading-[1.8] whitespace-pre-wrap"
                  style={{ color: B.ink, fontFamily: "Georgia, serif" }}
                >
                  {textBody}
                </p>
              </div>
            ) : (
              <div
                className="rounded-xl flex flex-col items-center justify-center py-20 gap-2"
                style={{ background: B.wash, border: `2px dashed ${B.border}` }}
              >
                <p className="text-[13px]" style={{ color: B.muted }}>
                  No text content
                </p>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderTop: `1px solid ${B.soft}`, background: B.wash }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <StatusPill published={item.is_published} size="md" />
            {item.plans.length&& (
              <span
                className="text-[11px] font-bold px-2.5 py-1 rounded-full border"
                style={{
                  color: B.purple,
                  background: B.soft,
                  borderColor: B.border,
                }}
              >
                {item.plans.map(p => p.name).join(", ")}
              </span>
            )}
            <span className="text-[11px]" style={{ color: B.faint }}>
              {idx + 1} / {allItems.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => togglePublish(item.id)}
              disabled={toggling}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-[8px] border transition-all disabled:opacity-50"
              style={{
                background: B.white,
                color: B.mid,
                borderColor: B.border,
              }}
            >
              {Icon.eye} {item.is_published ? "Unpublish" : "Publish"}
            </button>
            {fileUrl && (
              <a
                href={fileUrl}
                download={item.title}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-[8px] border transition-all"
                style={{
                  background: B.white,
                  color: B.mid,
                  borderColor: B.border,
                }}
              >
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
function UploadModal({
  onClose,
  plans,
}: {
  onClose: () => void;
  plans: PlanResponse[];
}) {
  const [dragging, setDragging] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [planId, setPlanId] = useState<number | null>(null);
  const [textBody, setTextBody] = useState("");
  const [contentType, setContentType] = useState<
    "video" | "image" | "pdf" | "text"
  >("text");

  const { mutate: createContent, isPending } = useCreateContent();

  const handleFile = (f: File) => {
    setFile(f);
    setTitle(f.name.replace(/\.[^/.]+$/, ""));
    setContentType(detectContentType(f));
    setStep(2);
  };

  const handleSubmit = (publish: boolean) => {
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
        publish,
      },
      { onSuccess: onClose },
    );
  };

  const activePlans = plans.filter((p) => p.is_active);
  const canSubmit = title.trim().length > 0 && !isPending;
  const inputCls = `w-full rounded-[10px] px-4 py-2.5 text-[13px] outline-none transition-all`;
  const inputStyle = {
    background: B.wash,
    border: `1.5px solid ${B.border}`,
    color: B.ink,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(20,0,40,0.5)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[460px] rounded-2xl overflow-hidden"
        style={{
          border: `1px solid ${B.border}`,
          boxShadow: "0 24px 64px rgba(45,0,82,0.22)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-7 pt-6 pb-5"
          style={{ borderBottom: `1px solid ${B.soft}` }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1"
                style={{ color: B.faint }}
              >
                Step {step} of 2
              </p>
              <h3
                className="text-[18px] font-bold tracking-tight"
                style={{ color: B.ink }}
              >
                {step === 1 ? "Add content" : "Set details"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors mt-0.5"
              style={{ background: B.soft, color: B.muted }}
            >
              {Icon.close}
            </button>
          </div>
          <div className="flex gap-1.5 mt-4">
            {[1, 2].map((s) => (
              <div
                key={s}
                className="h-[3px] flex-1 rounded-full transition-all duration-300"
                style={{ background: s <= step ? B.purple : B.border }}
              />
            ))}
          </div>
        </div>

        <div className="px-7 py-6">
          {step === 1 ? (
            <div className="flex flex-col gap-3">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  const f = e.dataTransfer.files[0];
                  if (f) handleFile(f);
                }}
                onClick={() =>
                  document.getElementById("file-input-cp")?.click()
                }
                className="cursor-pointer rounded-xl flex flex-col items-center justify-center py-12 gap-3 transition-all"
                style={{
                  border: `2px dashed ${dragging ? B.purple : B.border}`,
                  background: dragging ? B.soft : B.wash,
                }}
              >
                <div
                  className="w-11 h-11 rounded-[12px] flex items-center justify-center"
                  style={{
                    background: B.soft,
                    border: `1px solid ${B.border}`,
                    color: B.purple,
                  }}
                >
                  {Icon.upload}
                </div>
                <div className="text-center">
                  <p
                    className="text-[13.5px] font-semibold"
                    style={{ color: B.ink }}
                  >
                    Drop a file or{" "}
                    <span
                      style={{ color: B.purple }}
                      className="underline underline-offset-2"
                    >
                      browse
                    </span>
                  </p>
                  <p className="text-[12px] mt-1" style={{ color: B.muted }}>
                    Video · Image · PDF
                  </p>
                </div>
                <input
                  id="file-input-cp"
                  type="file"
                  accept="video/*,image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1" style={{ background: B.border }} />
                <span
                  className="text-[11px] font-medium"
                  style={{ color: B.faint }}
                >
                  or
                </span>
                <div className="h-px flex-1" style={{ background: B.border }} />
              </div>
              <button
                onClick={() => {
                  setContentType("text");
                  setStep(2);
                }}
                className="w-full py-2.5 rounded-[10px] text-[13px] font-semibold transition-colors"
                style={{
                  background: B.soft,
                  color: B.purple,
                  border: `1.5px solid ${B.border}`,
                }}
              >
                Write text content
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {file && (
                <div
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px]"
                  style={{
                    background: B.soft,
                    border: `1.5px solid ${B.border}`,
                  }}
                >
                  <span
                    className="w-7 h-7 rounded-[7px] flex items-center justify-center text-[9px] font-bold border shrink-0"
                    style={{
                      color: B.purple,
                      background: B.white,
                      borderColor: B.border,
                    }}
                  >
                    {TYPE_CONFIG[contentType].short}
                  </span>
                  <p
                    className="text-[12.5px] font-medium flex-1 truncate"
                    style={{ color: B.ink }}
                  >
                    {file.name}
                  </p>
                  <button
                    onClick={() => {
                      setFile(null);
                      setTitle("");
                      setStep(1);
                    }}
                    style={{ color: B.faint }}
                  >
                    {Icon.close}
                  </button>
                </div>
              )}
              {contentType === "text" && (
                <div>
                  <label
                    className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-2"
                    style={{ color: B.muted }}
                  >
                    Content
                  </label>
                  <textarea
                    value={textBody}
                    onChange={(e) => setTextBody(e.target.value)}
                    placeholder="Write your content here…"
                    rows={4}
                    className="resize-none"
                    style={{
                      ...inputStyle,
                      width: "100%",
                      borderRadius: 10,
                      padding: "10px 16px",
                      fontSize: 13,
                      display: "block",
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              )}
              <div>
                <label
                  className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-2"
                  style={{ color: B.muted }}
                >
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your content a title"
                  className={inputCls}
                  style={inputStyle}
                />
              </div>
              <div>
                <label
                  className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-2"
                  style={{ color: B.muted }}
                >
                  Plan access{" "}
                  <span
                    className="normal-case font-normal"
                    style={{ color: B.faint }}
                  >
                    (optional)
                  </span>
                </label>
                {activePlans.length === 0 ? (
                  <p className="text-[12px]" style={{ color: B.faint }}>
                    No active plans — visible to all subscribers.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {activePlans.map((plan) => {
                      const sel = planId === plan.id;
                      return (
                        <button
                          key={plan.id}
                          onClick={() => setPlanId(sel ? null : plan.id)}
                          className="px-3.5 py-2 rounded-[9px] text-[12.5px] font-semibold border-2 transition-all flex items-center gap-1.5"
                          style={{
                            background: sel ? B.purple : B.white,
                            color: sel ? B.white : B.mid,
                            borderColor: sel ? B.purple : B.border,
                          }}
                        >
                          {sel && (
                            <span style={{ color: "rgba(255,255,255,0.8)" }}>
                              {Icon.check}
                            </span>
                          )}
                          {plan.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div
          className="px-7 pb-6 flex flex-col gap-2"
          style={{ borderTop: `1px solid ${B.soft}`, paddingTop: 20 }}
        >
          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-[10px] text-[13.5px] font-bold text-white transition-all"
              style={{
                background: B.purple,
                boxShadow: "0 4px 16px rgba(138,43,226,0.32)",
              }}
            >
              Continue →
            </button>
          ) : (
            <>
              <div className="flex gap-2.5">
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={!canSubmit}
                  className="flex-1 py-3 rounded-[10px] text-[13px] font-semibold border-2 transition-all disabled:opacity-40"
                  style={{
                    background: B.white,
                    color: B.purple,
                    borderColor: B.purple,
                  }}
                >
                  {isPending ? "Saving…" : "Save draft"}
                </button>
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={!canSubmit}
                  className="flex-1 py-3 rounded-[10px] text-[13.5px] font-bold text-white transition-all disabled:opacity-40"
                  style={{
                    background: B.purple,
                    boxShadow: "0 4px 16px rgba(138,43,226,0.32)",
                  }}
                >
                  {isPending ? "Publishing…" : "Publish now"}
                </button>
              </div>
              <button
                onClick={() => setStep(1)}
                className="w-full py-2 text-[12px] font-medium transition-colors"
                style={{ color: B.faint }}
              >
                ← Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  value,
  label,
  accent,
}: {
  value: string | number;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-1 px-5 py-4 rounded-[14px]"
      style={{
        background: accent ? B.purple : B.white,
        border: `1px solid ${accent ? B.purple : B.border}`,
        boxShadow: accent
          ? "0 4px 16px rgba(138,43,226,0.2)"
          : "0 1px 3px rgba(45,0,82,0.04)",
      }}
    >
      <span
        className="text-[22px] font-bold leading-none tracking-tight"
        style={{ color: accent ? B.white : B.ink }}
      >
        {value}
      </span>
      <span
        className="text-[11px] font-medium"
        style={{ color: accent ? "rgba(255,255,255,0.65)" : B.muted }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ContentPage() {
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "video" | "image" | "pdf" | "text"
  >("all");
  const [showUpload, setShowUpload] = useState(false);
  const [previewItem, setPreviewItem] = useState<ContentResponse | null>(null);

  const { data: content = [], isLoading, isError } = useMyContent();
  const { data: plans = [] } = useMyPlans();
  const { mutate: togglePublish } = useTogglePublish();
  const { mutate: deleteItem } = useDeleteContentItem();

  const published = content.filter((c) => c.is_published).length;
  const drafts = content.filter((c) => !c.is_published).length;

  const filtered = content.filter((c) => {
    const statusMatch =
      filter === "all"
        ? true
        : filter === "published"
          ? c.is_published
          : !c.is_published;
    const typeMatch = typeFilter === "all" || c.content_type === typeFilter;
    return statusMatch && typeMatch;
  });

  const handlePreview = useCallback(
    (item: ContentResponse) => setPreviewItem(item),
    [],
  );
  const handleNavigate = useCallback(
    (item: ContentResponse) => setPreviewItem(item),
    [],
  );

  const FILTERS = [
    { key: "all" as const, label: "All", count: content.length },
    { key: "published" as const, label: "Published", count: published },
    { key: "draft" as const, label: "Drafts", count: drafts },
  ];

  return (
    <>
      <div
        className="min-h-screen py-8 px-6 lg:px-10"
        style={{ background: B.wash }}
      >
        {/* Page header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1
              className="text-[24px] font-bold leading-tight tracking-tight"
              style={{ color: B.ink }}
            >
              Content
            </h1>
            <p className="text-[13px] mt-1" style={{ color: B.muted }}>
              {isLoading ? "Loading…" : `${content.length} total pieces`}
            </p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-bold text-white transition-all shrink-0"
            style={{
              background: B.purple,
              boxShadow: "0 4px 14px rgba(138,43,226,0.3)",
            }}
          >
            {Icon.plus} Upload
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-7">
          <StatCard value={content.length} label="Total pieces" />
          <StatCard value={published} label="Published" accent />
          <StatCard value={drafts} label="Drafts" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 mb-6 flex-wrap">
          {/* Status tabs */}
          <div
            className="flex items-center gap-1 p-1 rounded-[11px]"
            style={{ background: B.white, border: `1px solid ${B.border}` }}
          >
            {FILTERS.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="px-3.5 py-1.5 rounded-[8px] text-[12px] font-semibold transition-all flex items-center gap-1.5"
                style={
                  filter === key
                    ? {
                        background: B.purple,
                        color: B.white,
                        boxShadow: "0 2px 8px rgba(138,43,226,0.25)",
                      }
                    : { color: B.mid }
                }
              >
                {label}
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background:
                      filter === key ? "rgba(255,255,255,0.2)" : B.soft,
                    color: filter === key ? B.white : B.muted,
                  }}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Type tabs */}
          <div
            className="flex items-center gap-1 p-1 rounded-[11px]"
            style={{ background: B.white, border: `1px solid ${B.border}` }}
          >
            {(["all", "video", "image", "pdf", "text"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className="px-3 py-1.5 rounded-[8px] text-[11.5px] font-semibold capitalize transition-all"
                style={
                  typeFilter === t
                    ? {
                        background: B.purple,
                        color: B.white,
                        boxShadow: "0 2px 8px rgba(138,43,226,0.25)",
                      }
                    : { color: B.mid }
                }
              >
                {t}
              </button>
            ))}
          </div>

          <span className="text-[12px]" style={{ color: B.faint }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border animate-pulse overflow-hidden"
                style={{ borderColor: B.border }}
              >
                <div
                  className="m-2.5 rounded-xl"
                  style={{ aspectRatio: "16/10", background: B.border }}
                />
                <div className="px-3.5 pb-3 pt-2.5 flex flex-col gap-2">
                  <div
                    className="h-3 rounded-full w-3/4"
                    style={{ background: B.border }}
                  />
                  <div
                    className="h-2.5 rounded-full w-1/2"
                    style={{ background: B.soft }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <p
            className="text-[13px] py-10 text-center"
            style={{ color: "#EF4444" }}
          >
            Failed to load content. Please refresh.
          </p>
        )}

        {/* Empty */}
        {!isLoading && !isError && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: B.soft,
                border: `1px solid ${B.border}`,
                color: B.faint,
              }}
            >
              {Icon.upload}
            </div>
            <p className="text-[13.5px] font-medium" style={{ color: B.muted }}>
              No content here yet
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="text-[12.5px] font-semibold px-4 py-2 rounded-[9px] transition-all mt-1"
              style={{
                background: B.soft,
                color: B.purple,
                border: `1px solid ${B.border}`,
              }}
            >
              Upload your first piece
            </button>
          </div>
        )}

        {/* ── Content grid ── */}
        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                onPreview={handlePreview}
              />
            ))}
          </div>
        )}
      </div>

      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} plans={plans} />
      )}

      {previewItem && (
        <ContentPreviewModal
          item={previewItem}
          allItems={filtered}
          onClose={() => setPreviewItem(null)}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
}
