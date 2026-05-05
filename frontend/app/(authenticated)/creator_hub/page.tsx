"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  useMyContent,
  useCreateContent,
  useUpdateContentItem,
  useDeleteContentItem,
  useTogglePublish,
} from "@/hooks/useContent"
import { useMyPlans } from "@/hooks/usePlans"
import { useOwnHub, useOwnHubStats, useUpdateOwnHub } from "@/hooks/useHubs"
import { useHubEarnings } from "@/hooks/usePayments"
import { useMe } from "@/hooks/useUsers"
import type { ContentResponse } from "@/types/content"
import type { PlanResponse } from "@/types/plans"

const cn = (...c: (string | boolean | undefined)[]) => c.filter(Boolean).join(" ")

const CONTENT_TYPE_CONFIG = {
  video: { label: "Video", icon: "VID" },
  image: { label: "Image", icon: "IMG" },
  pdf:   { label: "PDF",   icon: "PDF" },
  text:  { label: "Text",  icon: "TXT" },
} as const

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}

function formatFullDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatFileSize(bytes?: number) {
  if (!bytes) return null
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const SVG = {
  upload:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 9.5V2M4 4.5 7 2l3 2.5"/><path d="M1.5 10.5v1a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1"/></svg>,
  plus:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6.5 1v11M1 6.5h11"/></svg>,
  search:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="5.5" cy="5.5" r="3.8"/><path d="M8.5 8.5 11 11"/></svg>,
  dots:    <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor"><circle cx="6.5" cy="2.5" r="1.1"/><circle cx="6.5" cy="6.5" r="1.1"/><circle cx="6.5" cy="10.5" r="1.1"/></svg>,
  menu:    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M2 4h11M2 7.5h11M2 11h11"/></svg>,
  chevron: <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 4L5.5 7 8.5 4"/></svg>,
  trash:   <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M2 3h8M4 3V2h4v1"/><path d="M3 3l.5 7h5L9 3"/><path d="M4.5 5.5v3M7.5 5.5v3"/></svg>,
  edit:    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7.5 1.5 9.5 3.5l-5.5 5.5-2.5.5.5-2.5 5.5-5.5Z"/></svg>,
  check:   <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 5.5l2.5 2.5 4.5-4.5"/></svg>,
  x:       <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 2l6 6M8 2l-6 6"/></svg>,
  eye:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M1 6s2-3.8 5-3.8S11 6 11 6s-2 3.8-5 3.8S1 6 1 6Z"/><circle cx="6" cy="6" r="1.4"/></svg>,
  settings:<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="6.5" cy="6.5" r="2"/><path d="M6.5 1v1.5M6.5 10v1.5M1 6.5h1.5M10 6.5h1.5M2.8 2.8l1 1M9.2 9.2l1 1M9.2 2.8l-1 1M2.8 9.2l1-1"/></svg>,
  link:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M4.5 6.5a2.8 2.8 0 0 0 3.9 0l1.3-1.3a2.8 2.8 0 0 0-3.9-3.9l-.7.7"/><path d="M7.5 5.5a2.8 2.8 0 0 0-3.9 0L2.3 6.8a2.8 2.8 0 0 0 3.9 3.9l.7-.7"/></svg>,
  camera:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1.5 4.5h10v6.5a.8.8 0 0 1-.8.8H2.3a.8.8 0 0 1-.8-.8V4.5Z"/><path d="M4 4.5l1-2.5h3l1 2.5"/><circle cx="6.5" cy="7.5" r="1.8"/></svg>,
  users:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="5" cy="4" r="2.2"/><path d="M1 11c0-2.2 1.8-4 4-4s4 1.8 4 4"/><circle cx="10" cy="4.5" r="1.7"/><path d="M12 11c0-1.7-1.3-3-3-3"/></svg>,
  revenue: <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="6.5" cy="6.5" r="5"/><path d="M6.5 3.5v6M4.5 5h2.8a1.2 1.2 0 0 1 0 2.4H5.2a1.2 1.2 0 0 0 0 2.4H8"/></svg>,
  file:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 1h5l3 3v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"/><path d="M7.5 1v3.5H11M4 7h5M4 9.5h3"/></svg>,
  arrowLeft: <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7.5 2L3.5 6l4 4"/></svg>,
  arrowRight: <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 2L8.5 6l-4 4"/></svg>,
  download: <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 1.5v7M3.5 6L6 8.5 8.5 6"/><path d="M1.5 9.5v1a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-1"/></svg>,
  play:    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5v11l9-5.5-9-5.5Z"/></svg>,
  expand:  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7.5 1H11v3.5M4.5 11H1V7.5M11 1L7 5M1 11l4-4"/></svg>,
  copyLink:<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M4.5 6.5a2.8 2.8 0 0 0 3.9 0l1.3-1.3a2.8 2.8 0 0 0-3.9-3.9l-.7.7"/><path d="M7.5 5.5a2.8 2.8 0 0 0-3.9 0L2.3 6.8a2.8 2.8 0 0 0 3.9 3.9l.7-.7"/></svg>,
}

// ─── Inline Content Preview Thumbnail ────────────────────────────────────────
function ContentThumbnail({ item, onClick }: { item: ContentResponse; onClick: () => void }) {
  const fileUrl = (item as any).file_url ?? (item as any).url ?? null
  const thumbnailUrl = (item as any).thumbnail_url ?? null
  const textBody = (item as any).text_body ?? (item as any).body ?? null

  return (
    <div
      onClick={onClick}
      className="relative w-full cursor-pointer rounded-xl overflow-hidden bg-[#F3E8FF] border border-[#EDE5F8] group/thumb transition-all hover:border-[#A78BFA] hover:shadow-md"
      style={{ aspectRatio: "16/10" }}
    >
      {/* VIDEO */}
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
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover/thumb:bg-black/10 transition-all">
              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[#8A2BE2] shadow-lg">
                {SVG.play}
              </div>
            </div>
          </>
        ) : thumbnailUrl ? (
          <>
            <img src={thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover/thumb:bg-black/10 transition-all">
              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[#8A2BE2] shadow-lg">
                {SVG.play}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-[#1a0030] flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50">{SVG.play}</div>
            <p className="text-[10px] text-white/30 font-medium">Video</p>
          </div>
        )
      )}

      {/* IMAGE */}
      {item.content_type === "image" && (
        (fileUrl || thumbnailUrl) ? (
          <img
            src={fileUrl ?? thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="#C4B5D4" strokeWidth="1.5" strokeLinecap="round">
              <rect x="2" y="2" width="16" height="16" rx="3"/>
              <circle cx="7" cy="7.5" r="1.5"/>
              <path d="M2 14l4-4 3 3 3-4 6 6"/>
            </svg>
            <p className="text-[10px] text-[#C4B5D4] font-medium">Image</p>
          </div>
        )
      )}

      {/* PDF */}
      {item.content_type === "pdf" && (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#FBF8FF]">
          <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] border border-[#EDE5F8] flex items-center justify-center text-[#8A2BE2]">{SVG.file}</div>
          <p className="text-[10px] text-[#A08DBE] font-semibold uppercase tracking-wide">PDF Document</p>
          {fileUrl && (
            <span className="text-[9px] text-[#C4B5D4]">Click to view</span>
          )}
        </div>
      )}

      {/* TEXT */}
      {item.content_type === "text" && (
        <div className="w-full h-full p-3 bg-[#FBF8FF] flex flex-col justify-start overflow-hidden">
          {textBody ? (
            <p
              className="text-[11px] text-[#6B4F8A] leading-[1.6] line-clamp-4"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {textBody}
            </p>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="#C4B5D4" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 4h12M3 8h8M3 12h10M3 16h6"/>
              </svg>
              <p className="text-[10px] text-[#C4B5D4] font-medium">Text post</p>
            </div>
          )}
        </div>
      )}

      {/* Hover overlay — "Click to expand" hint */}
      <div className="absolute inset-0 flex items-end justify-end p-2 opacity-0 group-hover/thumb:opacity-100 transition-opacity pointer-events-none">
        <span className="flex items-center gap-1 text-[10px] font-semibold bg-black/60 text-white px-2 py-1 rounded-full backdrop-blur-sm">
          {SVG.expand} Expand
        </span>
      </div>
    </div>
  )
}

// ─── Content Card (grid view with inline preview) ─────────────────────────────
interface ContentCardProps {
  item: ContentResponse
  plans: PlanResponse[]
  onPreview: (item: ContentResponse) => void
}

function ContentCard({ item, plans, onPreview }: ContentCardProps) {
  const [editing, setEditing]   = useState(false)
  const [draft, setDraft]       = useState(item.title)
  const [planOpen, setPlanOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const planRef  = useRef<HTMLDivElement>(null)
  const menuRef  = useRef<HTMLDivElement>(null)

  const { mutate: updateContent, isPending: updating } = useUpdateContentItem()
  const { mutate: deleteContent, isPending: deleting } = useDeleteContentItem()
  const { mutate: togglePublish, isPending: toggling } = useTogglePublish()

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (planRef.current && !planRef.current.contains(e.target as Node)) setPlanOpen(false)
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  const save = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== item.title) updateContent({ contentId: item.id, body: { title: trimmed } })
    else setDraft(item.title)
    setEditing(false)
  }

  const activePlans = plans.filter(p => p.is_active)
  const tCfg = CONTENT_TYPE_CONFIG[item.content_type]

  return (
    <div className="group bg-white rounded-2xl border border-[#EDE5F8] overflow-visible hover:border-[#DDD6FE] hover:shadow-lg transition-all"
      style={{ boxShadow: "0 1px 4px rgba(45,0,82,0.05)" }}>

      {/* Thumbnail — inline preview */}
      <div className="p-2.5 pb-0">
        <ContentThumbnail item={item} onClick={() => onPreview(item)} />
      </div>

      {/* Card body */}
      <div className="px-3.5 pt-2.5 pb-3">
        {/* Title row */}
        <div className="flex items-start gap-1.5 mb-2">
          {editing ? (
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <input
                ref={inputRef}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") { setDraft(item.title); setEditing(false) } }}
                className="flex-1 min-w-0 text-[12.5px] font-semibold text-[#2D0052] bg-white border border-[#A78BFA] rounded-[7px] px-2 py-1 outline-none ring-2 ring-[#8A2BE2]/10"
              />
              <button onClick={save} disabled={updating} className="w-[20px] h-[20px] rounded-[5px] bg-[#8A2BE2] flex items-center justify-center text-white shrink-0 disabled:opacity-50">{SVG.check}</button>
              <button onClick={() => { setDraft(item.title); setEditing(false) }} className="w-[20px] h-[20px] rounded-[5px] bg-[#F5EFFF] flex items-center justify-center text-[#A08DBE] shrink-0">{SVG.x}</button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onPreview(item)}
                className="flex-1 min-w-0 text-left"
              >
                <span className="block text-[12.5px] font-semibold text-[#2D0052] truncate hover:text-[#8A2BE2] transition-colors leading-snug">
                  {item.title}
                </span>
              </button>
              <button
                onClick={() => setEditing(true)}
                className="opacity-0 group-hover:opacity-100 w-[18px] h-[18px] rounded-[4px] flex items-center justify-center text-[#A08DBE] hover:bg-[#F3E8FF] hover:text-[#8A2BE2] transition-all shrink-0 mt-0.5"
              >
                {SVG.edit}
              </button>
            </>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Type badge */}
            <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-[4px] bg-[#F3E8FF] text-[#8A2BE2] border border-[#EDE5F8] uppercase tracking-wide">
              {tCfg.label}
            </span>

            {/* Date */}
            <span className="text-[10.5px] text-[#C4B5D4]">{formatDate(item.created_at)}</span>
          </div>

          {/* Status + menu */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Status toggle */}
            <button
              onClick={() => togglePublish(item.id)}
              disabled={toggling}
              className={cn(
                "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all hover:opacity-75 disabled:opacity-50",
                item.is_published ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#F5EFFF] text-[#A08DBE] border border-[#EDE5F8]"
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", item.is_published ? "bg-[#16A34A]" : "bg-[#A08DBE]")} />
              {item.is_published ? "Live" : "Draft"}
            </button>

            {/* Row menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="w-[22px] h-[22px] rounded-[5px] flex items-center justify-center text-[#C4B5D4] opacity-0 group-hover:opacity-100 hover:bg-[#F3E8FF] hover:text-[#8A2BE2] transition-all"
              >
                {SVG.dots}
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 bottom-7 z-30 bg-white border border-[#EDE5F8] rounded-[12px] overflow-hidden w-[148px]"
                  style={{ boxShadow: "0 8px 24px rgba(45,0,82,0.12)" }}
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  {[
                    { icon: SVG.eye,  label: "Preview",  fn: () => { onPreview(item); setMenuOpen(false) } },
                    { icon: SVG.edit, label: "Rename",    fn: () => { setEditing(true); setMenuOpen(false) } },
                  ].map(({ icon, label, fn }) => (
                    <button key={label} onClick={fn}
                      className="w-full text-left px-3.5 py-2.5 text-[12.5px] font-medium text-[#2D0052] hover:bg-[#F5EFFF] transition-colors flex items-center gap-2.5">
                      <span className="text-[#A08DBE]">{icon}</span>{label}
                    </button>
                  ))}
                  <div className="border-t border-[#F5EFFF]">
                    {/* Plan picker inline */}
                    <div ref={planRef}>
                      <button
                        onClick={() => setPlanOpen(o => !o)}
                        className="w-full text-left px-3.5 py-2.5 text-[12.5px] font-medium text-[#2D0052] hover:bg-[#F5EFFF] transition-colors flex items-center gap-2.5"
                      >
                        <span className="text-[#A08DBE]">{SVG.users}</span>
                        Plan
                        <span className="ml-auto text-[#C4B5D4]">{SVG.chevron}</span>
                      </button>
                      {planOpen && (
                        <div className="border-t border-[#F5EFFF] bg-[#FBF8FF]">
                          <button
                            onClick={() => { updateContent({ contentId: item.id, body: { plan_ids: [] } }); setPlanOpen(false); setMenuOpen(false) }}
                            disabled={item.plans.length === 0}
                            className="w-full text-left px-4 py-2 text-[11.5px] font-semibold text-[#6B4F8A] hover:bg-[#F5EFFF] flex items-center gap-2 disabled:opacity-40 transition-colors"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A08DBE] shrink-0" />
                            All subscribers
                            {item.plans.length === 0 && <span className="ml-auto">{SVG.check}</span>}
                          </button>
                          {activePlans.map(plan => (
                            <button key={plan.id}
                              onClick={() => { updateContent({ contentId: item.id, body: { plan_ids: [plan.id] } }); setPlanOpen(false); setMenuOpen(false) }}
                              disabled={item.plans.some(p => p.id === plan.id)}
                              className="w-full text-left px-4 py-2 text-[11.5px] font-semibold text-[#8A2BE2] hover:bg-[#F5EFFF] flex items-center gap-2 disabled:opacity-40 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8A2BE2] shrink-0" />
                              {plan.name}
                              {item.plans.some(p => p.id === plan.id) && <span className="ml-auto">{SVG.check}</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => { if (confirm("Delete this content?")) { deleteContent(item.id); setMenuOpen(false) } }}
                      disabled={deleting}
                      className="w-full text-left px-3.5 py-2.5 text-[12.5px] font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2.5 disabled:opacity-50"
                    >
                      {SVG.trash} Delete
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
          {item.plans.length > 0 ? item.plans.map(p => p.name).join(", ") : "All subscribers"}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Content Preview Modal ────────────────────────────────────────────────────
interface ContentPreviewModalProps {
  item: ContentResponse
  allItems: ContentResponse[]
  onClose: () => void
  onNavigate: (item: ContentResponse) => void
}

function ContentPreviewModal({ item, allItems, onClose, onNavigate }: ContentPreviewModalProps) {
  const currentIndex = allItems.findIndex(i => i.id === item.id)
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null

  const { mutate: togglePublish, isPending: toggling } = useTogglePublish()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft" && prevItem) onNavigate(prevItem)
      if (e.key === "ArrowRight" && nextItem) onNavigate(nextItem)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose, onNavigate, prevItem, nextItem])

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  const tCfg = CONTENT_TYPE_CONFIG[item.content_type]
  const fileUrl = (item as any).file_url ?? (item as any).url ?? null
  const textBody = (item as any).text_body ?? (item as any).body ?? null
  const fileSize = formatFileSize((item as any).file_size)
  const thumbnailUrl = (item as any).thumbnail_url ?? null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(20, 0, 40, 0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      {prevItem && (
        <button
          onClick={e => { e.stopPropagation(); onNavigate(prevItem) }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all backdrop-blur-sm"
          title="Previous (←)"
        >
          {SVG.arrowLeft}
        </button>
      )}
      {nextItem && (
        <button
          onClick={e => { e.stopPropagation(); onNavigate(nextItem) }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all backdrop-blur-sm"
          title="Next (→)"
        >
          {SVG.arrowRight}
        </button>
      )}

      <div
        className="bg-white w-full max-w-[680px] max-h-[90vh] rounded-2xl border border-[#EDE5F8] overflow-hidden flex flex-col"
        style={{ boxShadow: "0 32px 80px rgba(20, 0, 40, 0.35)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-[#F5EFFF] shrink-0">
          <div className="w-[34px] h-[34px] rounded-[9px] bg-[#F3E8FF] border border-[#EDE5F8] flex items-center justify-center shrink-0 text-[#8A2BE2] text-[10px] font-bold">
            {tCfg.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[16px] font-bold text-[#2D0052] truncate">{item.title}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-[#A08DBE]">{tCfg.label}</span>
              <span className="text-[11px] text-[#D4C5E8]">·</span>
              <span className="text-[11px] text-[#A08DBE]">{formatFullDate(item.created_at)}</span>
              {fileSize && (
                <>
                  <span className="text-[11px] text-[#D4C5E8]">·</span>
                  <span className="text-[11px] text-[#A08DBE]">{fileSize}</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5EFFF] flex items-center justify-center text-[#A08DBE] hover:bg-[#EDE5F8] hover:text-[#6B4F8A] transition-colors shrink-0"
          >
            {SVG.x}
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="px-6 py-5">
            {item.content_type === "video" && (
              fileUrl ? (
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
                <div className="rounded-xl bg-[#1a0030] flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white/60">
                    {SVG.play}
                  </div>
                  <p className="text-[13px] text-white/40">Video file not available for preview</p>
                </div>
              )
            )}
            {item.content_type === "image" && (
              fileUrl ? (
                <div className="rounded-xl overflow-hidden bg-[#F5EFFF] border border-[#EDE5F8] flex items-center justify-center">
                  <img src={fileUrl} alt={item.title} className="max-w-full max-h-[450px] object-contain" />
                </div>
              ) : thumbnailUrl ? (
                <div className="rounded-xl overflow-hidden bg-[#F5EFFF] border border-[#EDE5F8] flex items-center justify-center">
                  <img src={thumbnailUrl} alt={item.title} className="max-w-full max-h-[450px] object-contain" />
                </div>
              ) : (
                <div className="rounded-xl bg-[#FBF8FF] border-2 border-dashed border-[#EDE5F8] flex flex-col items-center justify-center py-20 gap-3">
                  <p className="text-[13px] text-[#A08DBE]">Image not available for preview</p>
                </div>
              )
            )}
            {item.content_type === "pdf" && (
              fileUrl ? (
                <div className="rounded-xl overflow-hidden border border-[#EDE5F8]">
                  <iframe src={fileUrl} className="w-full border-0" style={{ height: 450 }} title={item.title} />
                </div>
              ) : (
                <div className="rounded-xl bg-[#FBF8FF] border-2 border-dashed border-[#EDE5F8] flex flex-col items-center justify-center py-20 gap-3">
                  <p className="text-[13px] text-[#A08DBE]">PDF not available for preview</p>
                </div>
              )
            )}
            {item.content_type === "text" && (
              textBody ? (
                <div className="rounded-xl bg-[#FBF8FF] border border-[#EDE5F8] px-6 py-5">
                  <div className="text-[14px] text-[#2D0052] leading-[1.75] whitespace-pre-wrap" style={{ fontFamily: "'Georgia', serif" }}>
                    {textBody}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-[#FBF8FF] border-2 border-dashed border-[#EDE5F8] flex flex-col items-center justify-center py-20 gap-3">
                  <p className="text-[13px] text-[#A08DBE]">Text content is empty</p>
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-[#F5EFFF] shrink-0 bg-[#FBF8FF]">
          <div className="flex items-center gap-2">
            <span className={cn(
              "inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full",
              item.is_published ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#F5EFFF] text-[#A08DBE] border border-[#EDE5F8]"
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", item.is_published ? "bg-[#16A34A]" : "bg-[#A08DBE]")} />
              {item.is_published ? "Published" : "Draft"}
            </span>
            <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full border bg-[#F3E8FF] text-[#8A2BE2] border-[#EDE5F8]">
            {item.plans.length > 0 ? item.plans.map(p => p.name).join(", ") : "All subscribers"}
            </span>
            <span className="text-[11px] text-[#C4B5D4] ml-1">{currentIndex + 1} / {allItems.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => togglePublish(item.id)}
              disabled={toggling}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-[8px] transition-all border disabled:opacity-50 bg-white text-[#6B4F8A] border-[#EDE5F8] hover:bg-[#F5EFFF] hover:border-[#DDD6FE]"
            >
              {SVG.eye}
              {item.is_published ? "Unpublish" : "Publish"}
            </button>
            {fileUrl && (
              <a href={fileUrl} download={item.title} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-[8px] transition-all border bg-white text-[#6B4F8A] border-[#EDE5F8] hover:bg-[#F5EFFF] hover:border-[#DDD6FE]">
                {SVG.download} Download
              </a>
            )}
            {(item as any).public_url && (
              <button
                onClick={() => navigator.clipboard.writeText((item as any).public_url)}
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-[8px] transition-all border bg-[#8A2BE2] text-white border-[#8A2BE2] hover:bg-[#7B27CC]"
                style={{ boxShadow: "0 2px 8px rgba(138,43,226,0.2)" }}
              >
                {SVG.copyLink} Copy link
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Profile Header ───────────────────────────────────────────────────────────
function ProfileHeader() {
  const { data: hub } = useOwnHub()
  const { data: stats } = useOwnHubStats()
  const { data: earnings } = useHubEarnings()
  const { data: me } = useMe()
  const { mutate: updateHub } = useUpdateOwnHub()

  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const bannerRef = useRef<HTMLInputElement>(null)
  const avatarRef = useRef<HTMLInputElement>(null)

  const handleBanner = (f: File) => {
    const url = URL.createObjectURL(f)
    setBannerPreview(url)
  }

  const handleAvatar = (f: File) => {
    const url = URL.createObjectURL(f)
    setAvatarPreview(url)
  }

  const bannerSrc = bannerPreview ?? hub?.banner_url ?? null
  const avatarSrc = avatarPreview ?? hub?.avatar_url ?? null
  const initials  = (hub?.name ?? me?.username ?? "?").charAt(0).toUpperCase()
  const totalRevenue = earnings ? `${earnings.currency} ${earnings.total_earned.toLocaleString()}` : "—"

  return (
    <div className="bg-white rounded-2xl border border-[#EDE5F8] overflow-hidden mb-5" style={{ boxShadow: "0 1px 3px rgba(45,0,82,0.05)" }}>
      <div className="relative w-full cursor-pointer group" style={{ height: 130 }} onClick={() => bannerRef.current?.click()}>
        {bannerSrc ? (
          <img src={bannerSrc} className="w-full h-full object-cover" alt="Hub banner" />
        ) : (
          <div className="w-full h-full relative overflow-hidden" style={{ background: "#2D0052" }}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", inset: 0 }}>
              <defs><pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1" fill="rgba(255,255,255,0.08)" />
              </pattern></defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all" style={{ background: "rgba(45,0,82,0.5)", backdropFilter: "blur(2px)" }}>
          <span className="flex items-center gap-2 text-[12px] font-semibold text-white border border-white/25 bg-white/15 px-4 py-2 rounded-full">
            {SVG.camera} Change cover
          </span>
        </div>
        <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleBanner(f) }} />
      </div>

      <div className="px-6 pt-3 pb-5">
        <div className="flex items-end gap-4 -mt-10">
          <div className="relative group cursor-pointer shrink-0" onClick={() => avatarRef.current?.click()}>
            <div className="w-[64px] h-[64px] rounded-[14px] overflow-hidden border-[3px] border-white flex items-center justify-center"
              style={{ background: "#8A2BE2", boxShadow: "0 2px 10px rgba(45,0,82,0.2)" }}>
              {avatarSrc ? <img src={avatarSrc} className="w-full h-full object-cover" alt="" /> : <span className="text-white text-[22px] font-bold select-none">{initials}</span>}
            </div>
            <div className="absolute inset-0 rounded-[14px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all" style={{ background: "rgba(45,0,82,0.5)" }}>
              <span className="text-white">{SVG.camera}</span>
            </div>
            <span className="absolute bottom-[2px] right-[2px] w-[10px] h-[10px] rounded-full bg-[#16A34A] border-2 border-white" />
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleAvatar(f) }} />
          </div>
          <div className="pt-10">
            <h2 className="text-[16px] font-bold text-[#2D0052] leading-tight">{hub?.name ?? "—"}</h2>
            <p className="text-[12px] text-[#A08DBE] mt-0.5">@{me?.username ?? "—"}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 mt-4 pt-4 border-t border-[#F5EFFF]">
          {[
            { label: "Total subscribers", value: stats ? stats.total_subscribers.toLocaleString() : "—", sub: `${stats?.total_plans ?? 0} active plans` },
            { label: "Total earned",      value: totalRevenue, sub: `Balance: ${earnings ? earnings.available_balance.toLocaleString() : "—"}` },
            { label: "Content",           value: stats ? String(stats.total_content_items) : "—", sub: "total pieces" },
          ].map((s, i) => (
            <div key={s.label} className={cn("flex flex-col gap-0.5", i > 0 && "pl-5 border-l border-[#F5EFFF]", i === 0 && "pr-5")}>
              <span className="text-[11px] font-medium text-[#A08DBE]">{s.label}</span>
              <span className="text-[20px] font-bold text-[#2D0052] leading-tight tracking-tight">{s.value}</span>
              <span className="text-[10.5px] font-medium text-[#A08DBE]">{s.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Quick Actions ────────────────────────────────────────────────────────────
function QuickActionsMenu({ onUpload }: { onUpload: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={cn("flex items-center gap-2 text-[13px] font-semibold px-4 py-2.5 rounded-[10px] transition-all border",
          open ? "bg-[#8A2BE2] text-white border-[#8A2BE2]" : "bg-white text-[#6B4F8A] border-[#EDE5F8] hover:bg-[#F3E8FF] hover:text-[#8A2BE2] hover:border-[#DDD6FE]"
        )}
        style={open ? { boxShadow: "0 4px 14px rgba(138,43,226,0.3)" } : {}}
      >
        {SVG.menu} Quick actions
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-40 bg-white border border-[#EDE5F8] rounded-[14px] overflow-hidden w-[200px]"
          style={{ boxShadow: "0 12px 36px rgba(45,0,82,0.14)" }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#C4B5D4] px-4 pt-3.5 pb-1.5">Create</p>
          {[
            { icon: SVG.upload, label: "Upload content", fn: () => { onUpload(); setOpen(false) } },
            { icon: SVG.plus,   label: "Write text post", fn: () => { onUpload(); setOpen(false) } },
          ].map(({ icon, label, fn }) => (
            <button key={label} onClick={fn}
              className="w-full text-left px-3.5 py-2.5 text-[13px] font-medium text-[#2D0052] hover:bg-[#F5EFFF] transition-colors flex items-center gap-3">
              <span className="w-7 h-7 rounded-[8px] bg-[#F3E8FF] flex items-center justify-center text-[#8A2BE2] shrink-0">{icon}</span>
              {label}
            </button>
          ))}
          <div className="border-t border-[#F5EFFF] mt-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#C4B5D4] px-4 pt-3 pb-1.5">Manage</p>
            {[
              { icon: SVG.settings, label: "Plan settings" },
              { icon: SVG.eye,      label: "Preview profile" },
            ].map(({ icon, label }) => (
              <button key={label} onClick={() => setOpen(false)}
                className="w-full text-left px-3.5 py-2.5 text-[13px] font-medium text-[#2D0052] hover:bg-[#F5EFFF] transition-colors flex items-center gap-3">
                <span className="w-7 h-7 rounded-[8px] bg-[#F3E8FF] flex items-center justify-center text-[#8A2BE2] shrink-0">{icon}</span>
                {label}
              </button>
            ))}
          </div>
          <div className="h-2" />
        </div>
      )}
    </div>
  )
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────
interface UploadModalProps {
  onClose: () => void
  plans: PlanResponse[]
}

function UploadModal({ onClose, plans }: UploadModalProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [contentType, setContentType] = useState<"video" | "image" | "pdf" | "text">("video")
  const [title, setTitle] = useState("")
  const [planId, setPlanId] = useState<number | null>(null)
  const [textBody, setTextBody] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  const { mutate: createContent, isPending } = useCreateContent()

  const pickFile = (f: File) => {
    setFile(f)
    setTitle(f.name.replace(/\.[^/.]+$/, ""))
    if (f.type.startsWith("video/")) setContentType("video")
    else if (f.type.startsWith("image/")) setContentType("image")
    else if (f.type === "application/pdf") setContentType("pdf")
    setStep(2)
  }

  const submit = () => {
    if (!title.trim()) return
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
      { onSuccess: onClose }
    )
  }

  const activePlans = plans.filter(p => p.is_active)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(45,0,82,0.45)", backdropFilter: "blur(6px)" }}
      onClick={onClose}>
      <div className="bg-white w-full max-w-[430px] rounded-2xl border border-[#EDE5F8] overflow-hidden"
        style={{ boxShadow: "0 24px 64px rgba(45,0,82,0.2)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F5EFFF]">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#A08DBE] mb-0.5">Step {step} of 2</p>
            <h3 className="text-[17px] font-bold text-[#2D0052]">{step === 1 ? "Drop your content" : "Fill in the details"}</h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-[#F5EFFF] flex items-center justify-center text-[#A08DBE] hover:bg-[#EDE5F8] transition-colors">{SVG.x}</button>
        </div>
        <div className="px-6 py-5">
          {step === 1 ? (
            <div>
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) pickFile(f) }}
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-12 gap-3 transition-all"
                style={{ borderColor: dragging ? "#8A2BE2" : "#DDD6FE", background: dragging ? "#F5F3FF" : "#FBF8FF" }}
              >
                <input ref={fileRef} type="file" className="hidden" accept="video/*,image/*,application/pdf"
                  onChange={e => { const f = e.target.files?.[0]; if (f) pickFile(f) }} />
                <div className="w-11 h-11 rounded-[12px] bg-[#F3E8FF] border border-[#EDE5F8] flex items-center justify-center text-[#8A2BE2]">{SVG.upload}</div>
                <div className="text-center">
                  <p className="text-[13.5px] font-semibold text-[#2D0052]">Drop a file or <span className="text-[#8A2BE2] underline underline-offset-2">browse</span></p>
                  <p className="text-[11.5px] text-[#A08DBE] mt-1">Video · Image · PDF</p>
                </div>
              </div>
              <div className="flex items-center gap-3 my-4">
                <div className="h-px flex-1 bg-[#EDE5F8]" />
                <span className="text-[11px] text-[#A08DBE]">or</span>
                <div className="h-px flex-1 bg-[#EDE5F8]" />
              </div>
              <button
                onClick={() => { setContentType("text"); setStep(2) }}
                className="w-full py-2.5 rounded-[10px] border border-[#DDD6FE] text-[13px] font-medium text-[#8A2BE2] bg-[#F5F3FF] hover:bg-[#EDE9FE] transition-colors"
              >
                Write text content
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {file && (
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] border border-[#DDD6FE] bg-[#F5F3FF]">
                  <div className="w-7 h-7 rounded-[7px] bg-[#EDE5F8] flex items-center justify-center text-[#8A2BE2] shrink-0">{SVG.file}</div>
                  <span className="text-[12px] font-medium text-[#2D0052] truncate flex-1">{file.name}</span>
                  <button onClick={() => { setFile(null); setStep(1) }} className="text-[#A08DBE] hover:text-red-400 transition-colors">{SVG.x}</button>
                </div>
              )}
              {contentType === "text" && (
                <div>
                  <label className="block text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#A08DBE] mb-1.5">Content</label>
                  <textarea value={textBody} onChange={e => setTextBody(e.target.value)} placeholder="Write your content…" rows={4}
                    className="w-full bg-[#FBF8FF] border border-[#EDE5F8] rounded-[9px] px-3.5 py-2.5 text-[13px] text-[#2D0052] placeholder:text-[#C4B5D4] outline-none focus:border-[#A78BFA] transition-all resize-none" />
                </div>
              )}
              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#A08DBE] mb-1.5">Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Name your content…"
                  className="w-full bg-[#FBF8FF] border border-[#EDE5F8] rounded-[9px] px-3.5 py-2.5 text-[13px] text-[#2D0052] placeholder:text-[#C4B5D4] outline-none focus:border-[#A78BFA] focus:ring-2 focus:ring-[#8A2BE2]/10 transition-all" />
              </div>
              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#A08DBE] mb-1.5">
                  Plan access <span className="normal-case font-normal text-[#C4B5D4]">(optional)</span>
                </label>
                {activePlans.length === 0 ? (
                  <p className="text-[12px] text-[#C4B5D4]">No active plans — content will be visible to all subscribers.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-1.5">
                    {activePlans.map(plan => (
                      <button key={plan.id}
                        onClick={() => setPlanId(planId === plan.id ? null : plan.id)}
                        className="py-2.5 px-3 rounded-[9px] text-[12.5px] font-semibold text-left transition-all border-2"
                        style={{
                          background: planId === plan.id ? "#8A2BE2" : "white",
                          color: planId === plan.id ? "white" : "#6B4F8A",
                          borderColor: planId === plan.id ? "#8A2BE2" : "#EDE5F8",
                        }}>
                        {plan.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-[12px] text-[#A08DBE]">
                Content is always saved as a <strong className="text-[#8A2BE2]">draft</strong> first.
              </p>
            </div>
          )}
        </div>
        <div className="px-6 pb-5 flex gap-2">
          {step === 2 && (
            <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-[10px] text-[13px] font-semibold text-[#6B4F8A] bg-[#F5EFFF] hover:bg-[#EDE5F8] border border-[#EDE5F8] transition-colors">← Back</button>
          )}
          <button
            onClick={step === 1 ? () => setStep(2) : submit}
            disabled={step === 2 && (isPending || !title.trim())}
            className="flex-1 py-2.5 rounded-[10px] text-[13px] font-semibold text-white transition-all disabled:opacity-40"
            style={{ background: "#8A2BE2", boxShadow: "0 4px 14px rgba(138,43,226,0.3)" }}
          >
            {step === 1 ? "Continue →" : isPending ? "Saving…" : "Save as Draft"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Plan Section ─────────────────────────────────────────────────────────────
interface PlanSectionProps {
  label: string
  items: ContentResponse[]
  plans: PlanResponse[]
  totalSubscribers: number
  onPreview: (item: ContentResponse) => void
  accentIndex?: number
}

// Subtle opacity steps within the brand purple — no rainbow, just hierarchy
const SECTION_DIVIDER_OPACITIES = ["1", "0.55", "0.35", "0.2", "0.15"] as const

function PlanSection({ label, items, plans, totalSubscribers, onPreview, accentIndex = 0 }: PlanSectionProps) {
  const [open, setOpen] = useState(true)
  const live = items.filter(i => i.is_published).length
  // Each section gets a slightly different purple border weight to create clear visual separation
  const borderOpacity = SECTION_DIVIDER_OPACITIES[Math.min(accentIndex, SECTION_DIVIDER_OPACITIES.length - 1)]

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{
        border: `1.5px solid rgba(138,43,226,${borderOpacity})`,
        boxShadow: `0 1px 4px rgba(45,0,82,0.06)`,
      }}
    >
      {/* ── Header ── */}
      <div className="px-5 pt-4 pb-4 border-b border-[#F5EFFF]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Bold left pip — the key demarcation signal */}
            <div
              className="w-[3px] h-[38px] rounded-full shrink-0"
              style={{ background: `rgba(138,43,226,${borderOpacity})` }}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-[14px] font-bold text-[#2D0052] leading-tight truncate">{label}</h3>
                {/* Live / draft inline pill */}
                {live > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                    {live} live
                  </span>
                )}
                {items.length - live > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-[#F5EFFF] text-[#A08DBE] border border-[#EDE5F8]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C4B5D4]" />
                    {items.length - live} draft
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[11px] text-[#C4B5D4]">
                  {items.length} piece{items.length !== 1 ? "s" : ""}
                </span>
                <span className="text-[11px] text-[#D4C5E8]">·</span>
                <span className="text-[11px] text-[#C4B5D4] flex items-center gap-1">
                  {SVG.users} {totalSubscribers.toLocaleString()} subscribers
                </span>
              </div>
            </div>
          </div>

          {/* Collapse toggle */}
          <button
            onClick={() => setOpen(o => !o)}
            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[#C4B5D4] hover:bg-[#F5EFFF] hover:text-[#8A2BE2] transition-all"
          >
            <span className={cn("transition-transform duration-200 block", !open && "-rotate-90")}>
              {SVG.chevron}
            </span>
          </button>
        </div>
      </div>

      {/* ── Content grid ── */}
      {open && (
        items.length > 0 ? (
          <div className="p-4 bg-[#FBF8FF]">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {items.map(item => (
                <ContentCard key={item.id} item={item} plans={plans} onPreview={onPreview} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-2 bg-[#FBF8FF]">
            <div className="w-9 h-9 rounded-xl bg-[#F5EFFF] border border-[#EDE5F8] flex items-center justify-center text-[#C4B5D4]">{SVG.upload}</div>
            <p className="text-[13px] font-medium text-[#A08DBE]">No content in {label} yet</p>
            <p className="text-[11.5px] text-[#C4B5D4]">Upload or reassign content here</p>
          </div>
        )
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CreatorHub() {
  const [showUpload, setShowUpload] = useState(false)
  const [search, setSearch]         = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "video" | "image" | "pdf" | "text">("all")
  const [previewItem, setPreviewItem] = useState<ContentResponse | null>(null)

  const { data: content = [], isLoading } = useMyContent()
  const { data: plans = [] }              = useMyPlans()
  const { data: stats }                   = useOwnHubStats()

  const filtered = content.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) &&
    (typeFilter === "all" || item.content_type === typeFilter)
  )

  const activePlans  = plans.filter(p => p.is_active)
  const ungated = filtered.filter(item => item.plans.length === 0);
const planGroups = activePlans.map(plan => ({
  plan,
  items: filtered.filter(item => item.plans.some(p => p.id === plan.id)),
}));

  const totalSubscribers = stats?.total_subscribers ?? 0

  const handlePreview = useCallback((item: ContentResponse) => {
    setPreviewItem(item)
  }, [])

  const handleNavigate = useCallback((item: ContentResponse) => {
    setPreviewItem(item)
  }, [])

  return (
    <main className="flex-1 px-6 lg:px-9 py-8 bg-[#FBF8FF] min-h-screen">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#2D0052] leading-tight">Your Hub</h1>
          <p className="text-[12.5px] text-[#A08DBE] mt-0.5">Manage everything in one place</p>
        </div>
        <QuickActionsMenu onUpload={() => setShowUpload(true)} />
      </div>

      {/* Profile header */}
      <ProfileHeader />

      {/* Filter bar */}
      <div className="flex items-center gap-2.5 mb-5 flex-wrap">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4B5D4]">{SVG.search}</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search content…"
            className="bg-white border border-[#EDE5F8] rounded-[10px] pl-8 pr-3.5 py-2 text-[12.5px] text-[#2D0052] placeholder:text-[#C4B5D4] w-[190px] outline-none focus:border-[#A78BFA] focus:ring-2 focus:ring-[#8A2BE2]/10 transition-all"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-[#EDE5F8] rounded-[10px] p-1">
          {(["all", "video", "image", "pdf", "text"] as const).map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={cn("text-[11.5px] font-semibold px-3 py-1.5 rounded-[7px] capitalize transition-all",
                typeFilter === t ? "bg-[#8A2BE2] text-white" : "text-[#6B4F8A] hover:bg-[#F5EFFF]")}>
              {t}
            </button>
          ))}
        </div>
        <span className="text-[12px] text-[#C4B5D4]">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Plan sections */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#EDE5F8] h-[160px] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <PlanSection
            label="All subscribers"
            items={ungated}
            plans={plans}
            totalSubscribers={totalSubscribers}
            onPreview={handlePreview}
            accentIndex={0}
          />
          {planGroups.map(({ plan, items }, idx) => (
            <PlanSection
              key={plan.id}
              label={plan.name}
              items={items}
              plans={plans}
              totalSubscribers={totalSubscribers}
              onPreview={handlePreview}
              accentIndex={idx + 1}
            />
          ))}
        </div>
      )}

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} plans={plans} />}

      {previewItem && (
        <ContentPreviewModal
          item={previewItem}
          allItems={filtered}
          onClose={() => setPreviewItem(null)}
          onNavigate={handleNavigate}
        />
      )}
    </main>
  )
}