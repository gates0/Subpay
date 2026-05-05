// components/ContentPreviewPopover.tsx
"use client"

import type { ContentResponse } from "@/types/content"

const TYPE_CONFIG = {
  video: { label: "Video" },
  image: { label: "Image" },
  pdf:   { label: "PDF"   },
  text:  { label: "Text"  },
} as const

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function StatusPill({ published }: { published: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full border"
      style={published
        ? { color: "#166534", background: "#DCFCE7", borderColor: "#BBF7D0" }
        : { color: "#A08DBE", background: "#F5EFFF", borderColor: "#EDE5F8" }
      }
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: published ? "#16A34A" : "#A08DBE" }}
      />
      {published ? "Live" : "Draft"}
    </span>
  )
}

interface ContentPreviewPopoverProps {
  item: ContentResponse
}

export default function ContentPreviewPopover({ item }: ContentPreviewPopoverProps) {
  const fileUrl      = (item as any).file_url ?? (item as any).url ?? null
  const thumbnailUrl = (item as any).thumbnail_url ?? null
  const textBody     = (item as any).text_body ?? (item as any).body ?? null

  return (
    <div
      className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-50
                 w-[220px] bg-white rounded-[14px] border-[1.5px] border-[#DDD6FE]
                 overflow-hidden pointer-events-none
                 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100
                 transition-all duration-150"
      style={{ boxShadow: "0 8px 28px rgba(45,0,82,0.14)" }}
    >
      {/* ── Thumbnail ── */}
      <div className="w-full relative" style={{ aspectRatio: "16/10" }}>

        {item.content_type === "video" && (
          fileUrl ? (
            <>
              <video
                src={fileUrl}
                className="w-full h-full object-cover"
                poster={thumbnailUrl ?? undefined}
                preload="metadata"
                muted
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[#8A2BE2]">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4 2.5v11l9-5.5-9-5.5Z"/>
                  </svg>
                </div>
              </div>
            </>
          ) : thumbnailUrl ? (
            <>
              <img src={thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[#8A2BE2]">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4 2.5v11l9-5.5-9-5.5Z"/>
                  </svg>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-[#1a0030] flex flex-col items-center justify-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4 2.5v11l9-5.5-9-5.5Z"/>
                </svg>
              </div>
              <span className="text-[9px] text-white/30 font-medium">Video</span>
            </div>
          )
        )}

        {item.content_type === "image" && (
          (fileUrl || thumbnailUrl) ? (
            <img
              src={fileUrl ?? thumbnailUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#F3E8FF] flex flex-col items-center justify-center gap-1.5">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#C4B5D4" strokeWidth="1.4" strokeLinecap="round">
                <rect x="2" y="2" width="16" height="16" rx="3"/>
                <circle cx="7" cy="7.5" r="1.5"/>
                <path d="M2 14l4-4 3 3 3-4 6 6"/>
              </svg>
              <span className="text-[9px] text-[#C4B5D4] font-medium">Image</span>
            </div>
          )
        )}

        {item.content_type === "pdf" && (
          <div className="w-full h-full bg-[#FBF8FF] flex flex-col items-center justify-center gap-1.5">
            <div className="w-8 h-8 rounded-[9px] bg-[#F3E8FF] border border-[#EDE5F8] flex items-center justify-center text-[#8A2BE2]">
              <svg width="12" height="12" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 1h5l3 3v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"/>
                <path d="M7.5 1v3.5H11M4 7h5M4 9.5h3"/>
              </svg>
            </div>
            <span className="text-[9px] text-[#A08DBE] font-semibold uppercase tracking-wide">
              PDF Document
            </span>
          </div>
        )}

        {item.content_type === "text" && (
          <div className="w-full h-full bg-[#FBF8FF] p-3 flex flex-col justify-start overflow-hidden">
            {textBody ? (
              <p
                className="text-[11px] text-[#6B4F8A] leading-[1.6] line-clamp-4"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {textBody}
              </p>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-1.5">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#C4B5D4" strokeWidth="1.4" strokeLinecap="round">
                  <path d="M3 4h12M3 8h8M3 12h10M3 16h6"/>
                </svg>
                <span className="text-[9px] text-[#C4B5D4] font-medium">Text post</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="px-3 pt-2.5 pb-3">
        <p
          className="text-[12px] font-semibold text-[#2D0052] leading-snug mb-1.5"
          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {item.title}
        </p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <StatusPill published={item.is_published} />
          <span className="text-[10.5px] text-[#A08DBE]">
            {TYPE_CONFIG[item.content_type].label} · {formatDate(item.created_at)}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1 text-[10.5px] font-semibold text-[#8A2BE2] bg-[#F3E8FF] border border-[#EDE5F8] rounded-[6px] px-2 py-1 w-fit">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M7.5 1H11v3.5M4.5 11H1V7.5M11 1L7 5M1 11l4-4"/>
          </svg>
          Click to expand
        </div>
      </div>
    </div>
  )
}