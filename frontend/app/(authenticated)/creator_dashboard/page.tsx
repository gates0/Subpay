"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useMyContent, useCreateContent, useUpdateContentItem, useDeleteContentItem, useTogglePublish } from "@/hooks/useContent"
import { useMyPlans } from "@/hooks/usePlans"
import { useOwnHub } from "@/hooks/useHubs"
import { useOwnHubStats } from "@/hooks/useHubs"
import type { ContentResponse } from "@/types/content"
import type { PlanResponse } from "@/types/plans"

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ")

const CONTENT_TYPE_CONFIG = {
  video: { label: "Video", icon: "VID" },
  image: { label: "Image", icon: "IMG" },
  pdf:   { label: "PDF",   icon: "PDF" },
  text:  { label: "Text",  icon: "TXT" },
} as const

const Icon = {
  upload:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 1.5v8M4 4.5 7 1.5l3 3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 10.5v1a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1" strokeLinecap="round"/></svg>,
  plus:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6.5 1v11M1 6.5h11" strokeLinecap="round"/></svg>,
  search:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="5.8" cy="5.8" r="4"/><path d="M9 9 12 12" strokeLinecap="round"/></svg>,
  dots:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="2.5" r="1.2" fill="currentColor"/><circle cx="7" cy="7" r="1.2" fill="currentColor"/><circle cx="7" cy="11.5" r="1.2" fill="currentColor"/></svg>,
  menu:     <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 4h12M2 8h12M2 12h12" strokeLinecap="round"/></svg>,
  chevron:  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 4.5L6 7.5L9 4.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  trash:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h8M4 3V2h4v1M5 5.5v3M7 5.5v3" strokeLinecap="round"/><path d="M3 3l.5 7h5l.5-7"/></svg>,
  edit:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8.5 1.5l2 2-6 6-2.5.5.5-2.5 6-6Z" strokeLinejoin="round"/></svg>,
  check:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  x:        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 2l7 7M9 2l-7 7" strokeLinecap="round"/></svg>,
  eye:      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6s2-4 5-4 5 4 5 4-2 4-5 4-5-4-5-4Z"/><circle cx="6" cy="6" r="1.5"/></svg>,
  settings: <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6.5" cy="6.5" r="2"/><path d="M6.5 1v1.5M6.5 10v1.5M1 6.5h1.5M10 6.5h1.5M2.8 2.8l1 1M9.2 9.2l1 1M9.2 2.8l-1 1M2.8 9.2l1-1" strokeLinecap="round"/></svg>,
  file:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 1h5l3 3v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"/><path d="M7.5 1v3.5H11M4 7h5M4 9.5h3"/></svg>,
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
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

  const handleFile = (f: File) => {
    setFile(f)
    setTitle(f.name.replace(/\.[^/.]+$/, ""))
    if (f.type.startsWith("video/")) setContentType("video")
    else if (f.type.startsWith("image/")) setContentType("image")
    else if (f.type === "application/pdf") setContentType("pdf")
    setStep(2)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const submit = () => {
    if (!title.trim()) return
    createContent(
      {
        title: title.trim(),
        content_type: contentType,
        plan_id: planId ?? undefined,
        file: file ?? undefined,
        text_body: contentType === "text" ? textBody : undefined,
      },
      { onSuccess: onClose }
    )
  }

  const activePlans = plans.filter(p => p.is_active)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(45,0,82,0.4)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[440px] overflow-hidden border border-[#EDE5F8]"
        style={{ boxShadow: "0 20px 60px rgba(45,0,82,0.18)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-[#F5EFFF]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#A08DBE] mb-0.5">Step {step} of 2</p>
            <h3 className="text-[18px] font-bold text-[#2D0052]">{step === 1 ? "Upload content" : "Set details"}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F5EFFF] flex items-center justify-center text-[#A08DBE] hover:bg-[#EDE5F8] transition-colors text-[18px] leading-none">×</button>
        </div>

        <div className="px-6 py-5">
          {step === 1 ? (
            <div>
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center py-10 gap-3"
                style={{ borderColor: dragging ? "#8A2BE2" : "#DDD6FE", background: dragging ? "#F5F3FF" : "#FBF8FF" }}
              >
                <input ref={fileRef} type="file" className="hidden" accept="video/*,image/*,application/pdf" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
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
              <button
                onClick={() => { setContentType("text"); setStep(2) }}
                className="w-full py-2.5 rounded-[10px] border border-[#DDD6FE] text-[13px] font-medium text-[#7C3AED] bg-[#F5F3FF] hover:bg-[#EDE9FE] transition-colors"
              >
                Write text content
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* File preview */}
              {file && (
                <div className="flex items-center gap-2.5 px-3 py-2.5 bg-[#F5F3FF] rounded-[10px] border border-[#DDD6FE]">
                  <div className="w-7 h-7 rounded-[7px] bg-[#EDE5F8] flex items-center justify-center text-[#8A2BE2]">{Icon.file}</div>
                  <span className="text-[12.5px] font-medium text-[#2D0052] truncate flex-1">{file.name}</span>
                  <button onClick={() => { setFile(null); setStep(1) }} className="text-[#A08DBE] hover:text-red-400 transition-colors">{Icon.x}</button>
                </div>
              )}

              {/* Text body */}
              {contentType === "text" && (
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A08DBE] mb-1.5 block">Content</label>
                  <textarea
                    value={textBody}
                    onChange={e => setTextBody(e.target.value)}
                    placeholder="Write your content here…"
                    rows={4}
                    className="w-full bg-[#FBF8FF] border border-[#EDE5F8] rounded-[10px] px-4 py-2.5 text-[13.5px] text-[#2D0052] placeholder:text-[#C4B5D4] outline-none focus:border-[#C084FC] transition-all resize-none"
                  />
                </div>
              )}

              {/* Title */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A08DBE] mb-1.5 block">Title</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Give your content a name…"
                  className="w-full bg-[#FBF8FF] border border-[#EDE5F8] rounded-[10px] px-4 py-2.5 text-[13.5px] text-[#2D0052] placeholder:text-[#C4B5D4] outline-none focus:border-[#C084FC] transition-all"
                />
              </div>

              {/* Plan access */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A08DBE] mb-1.5 block">
                  Plan access <span className="normal-case font-normal text-[#C4B5D4]">(optional)</span>
                </label>
                {activePlans.length === 0 ? (
                  <p className="text-[12px] text-[#C4B5D4]">No active plans yet — content will be accessible to all subscribers.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-1.5">
                    {activePlans.map(plan => (
                      <button
                        key={plan.id}
                        onClick={() => setPlanId(planId === plan.id ? null : plan.id)}
                        className="py-2.5 px-3 rounded-[10px] text-[12.5px] font-semibold text-left transition-all border-2"
                        style={{
                          background: planId === plan.id ? "#8A2BE2" : "#FBF8FF",
                          color: planId === plan.id ? "white" : "#6B4F8A",
                          borderColor: planId === plan.id ? "#8A2BE2" : "#EDE5F8",
                        }}
                      >
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
            <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-[10px] text-[13px] font-semibold text-[#6B4F8A] bg-[#F5EFFF] hover:bg-[#EDE5F8] transition-colors border border-[#EDE5F8]">← Back</button>
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

// ─── Content Row ──────────────────────────────────────────────────────────────
interface ContentRowProps {
  item: ContentResponse
  plans: PlanResponse[]
}

function ContentRow({ item, plans }: ContentRowProps) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(item.title)
  const [showPlanMenu, setShowPlanMenu] = useState(false)
  const [showRowMenu, setShowRowMenu] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { mutate: updateContent, isPending: updating } = useUpdateContentItem()
  const { mutate: deleteContent, isPending: deleting } = useDeleteContentItem()
  const { mutate: togglePublish, isPending: toggling } = useTogglePublish()

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  const saveTitle = () => {
    const trimmed = editTitle.trim()
    if (trimmed && trimmed !== item.title) {
      updateContent({ contentId: item.id, body: { title: trimmed } })
    } else {
      setEditTitle(item.title)
    }
    setEditing(false)
  }

  const handlePlanChange = (planId: number | null) => {
    updateContent({ contentId: item.id, body: { plan_id: planId } })
    setShowPlanMenu(false)
  }

  const tCfg = CONTENT_TYPE_CONFIG[item.content_type]
  const activePlans = plans.filter(p => p.is_active)

  return (
    <div className="group relative flex items-center gap-3 px-5 py-3 border-b border-[#F5EFFF] last:border-b-0 hover:bg-[#FBF8FF] transition-colors">
      {/* Type badge */}
      <div className="w-[30px] h-[30px] rounded-[8px] bg-[#F3E8FF] border border-[#EDE5F8] flex items-center justify-center shrink-0 text-[#8A2BE2] text-[9px] font-bold">
        {tCfg.icon}
      </div>

      {/* Inline editable title */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        {editing ? (
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <input
              ref={inputRef}
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") saveTitle()
                if (e.key === "Escape") { setEditTitle(item.title); setEditing(false) }
              }}
              className="flex-1 min-w-0 text-[13px] font-medium text-[#2D0052] bg-white border border-[#C084FC] rounded-[7px] px-2.5 py-1 outline-none ring-2 ring-[#8A2BE2]/10"
            />
            <button onClick={saveTitle} disabled={updating} className="w-6 h-6 rounded-[6px] bg-[#8A2BE2] flex items-center justify-center text-white shrink-0 hover:bg-[#7722CC] transition-colors disabled:opacity-50">{Icon.check}</button>
            <button onClick={() => { setEditTitle(item.title); setEditing(false) }} className="w-6 h-6 rounded-[6px] bg-[#F5EFFF] flex items-center justify-center text-[#A08DBE] shrink-0 hover:bg-[#EDE5F8] transition-colors">{Icon.x}</button>
          </div>
        ) : (
          <>
            <div className="min-w-0">
              <span className="text-[13px] font-medium text-[#2D0052] truncate block">{item.title}</span>
              <span className="text-[11px] text-[#A08DBE]">{formatDate(item.created_at)}</span>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-[5px] flex items-center justify-center text-[#A08DBE] hover:bg-[#F3E8FF] hover:text-[#8A2BE2] transition-all shrink-0"
            >
              {Icon.edit}
            </button>
          </>
        )}
      </div>

      {/* Plan badge — click to reassign */}
      <div className="relative hidden sm:block">
        <button
          onClick={() => setShowPlanMenu(p => !p)}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full transition-all hover:opacity-80 bg-[#F3E8FF] text-[#8A2BE2]"
        >
          {item.plan ? item.plan.name : "All"}
          <span className="opacity-60">{Icon.chevron}</span>
        </button>
        {showPlanMenu && (
          <div
            className="absolute left-0 top-8 z-20 bg-white border border-[#EDE5F8] rounded-[12px] overflow-hidden w-[160px]"
            style={{ boxShadow: "0 8px 24px rgba(45,0,82,0.12)" }}
            onMouseLeave={() => setShowPlanMenu(false)}
          >
            {/* All subscribers option */}
            <button
              onClick={() => handlePlanChange(null)}
              className="w-full text-left px-3 py-2 text-[12px] font-semibold flex items-center gap-2 transition-colors hover:bg-[#F5EFFF] text-[#6B4F8A]"
              disabled={item.plan === null}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#A08DBE]" />
              All subscribers
              {item.plan === null && <span className="ml-auto text-[#A08DBE]">{Icon.check}</span>}
            </button>
            {activePlans.map(plan => (
              <button
                key={plan.id}
                onClick={() => handlePlanChange(plan.id)}
                className="w-full text-left px-3 py-2 text-[12px] font-semibold flex items-center gap-2 transition-colors hover:bg-[#F5EFFF] text-[#8A2BE2]"
                disabled={item.plan?.id === plan.id}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#8A2BE2]" />
                {plan.name}
                {item.plan?.id === plan.id && <span className="ml-auto text-[#A08DBE]">{Icon.check}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status toggle */}
      <button
        onClick={() => togglePublish(item.id)}
        disabled={toggling}
        className={cn(
          "inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all hover:opacity-80 shrink-0 disabled:opacity-50",
          item.is_published
            ? "bg-[#DCFCE7] text-[#166534]"
            : "bg-[#F5EFFF] text-[#A08DBE] border border-[#EDE5F8]"
        )}
      >
        <span className={cn("w-1.5 h-1.5 rounded-full", item.is_published ? "bg-[#16A34A]" : "bg-[#A08DBE]")} />
        {item.is_published ? "Published" : "Draft"}
      </button>

      {/* Row menu */}
      <div className="relative">
        <button
          onClick={() => setShowRowMenu(p => !p)}
          className="w-[28px] h-[28px] rounded-[7px] flex items-center justify-center text-[#A08DBE] opacity-0 group-hover:opacity-100 hover:bg-[#F3E8FF] hover:text-[#8A2BE2] transition-all"
        >
          {Icon.dots}
        </button>
        {showRowMenu && (
          <div
            className="absolute right-0 top-8 z-20 bg-white border border-[#EDE5F8] rounded-[12px] overflow-hidden w-[160px]"
            style={{ boxShadow: "0 8px 24px rgba(45,0,82,0.12)" }}
            onMouseLeave={() => setShowRowMenu(false)}
          >
            <button
              onClick={() => { setEditing(true); setShowRowMenu(false) }}
              className="w-full text-left px-4 py-2.5 text-[12.5px] font-medium text-[#2D0052] hover:bg-[#F5EFFF] transition-colors flex items-center gap-2.5"
            >
              <span className="text-[#A08DBE]">{Icon.edit}</span> Rename
            </button>
            <div className="border-t border-[#F5EFFF]">
              <button
                onClick={() => {
                  if (confirm("Delete this content? This cannot be undone.")) {
                    deleteContent(item.id)
                    setShowRowMenu(false)
                  }
                }}
                disabled={deleting}
                className="w-full text-left px-4 py-2.5 text-[12.5px] font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2.5 disabled:opacity-50"
              >
                <span>{Icon.trash}</span> Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Plan Section ─────────────────────────────────────────────────────────────
interface PlanSectionProps {
  label: string
  planId: number | null
  items: ContentResponse[]
  plans: PlanResponse[]
}

function PlanSection({ label, planId, items, plans }: PlanSectionProps) {
  const [open, setOpen] = useState(true)

  return (
    <div className="bg-white rounded-2xl border border-[#EDE5F8] overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(45,0,82,0.04)" }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#FBF8FF] transition-colors"
        style={{ borderBottom: open && items.length > 0 ? "1px solid #F5EFFF" : "none" }}
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F3E8FF] text-[#8A2BE2]">
            {label}
          </span>
          <span className="text-[13px] font-medium text-[#A08DBE] tabular-nums">
            {items.length} {items.length === 1 ? "piece" : "pieces"}
          </span>
        </div>
        <span className={cn("text-[#A08DBE] transition-transform duration-200", !open && "-rotate-90")}>{Icon.chevron}</span>
      </button>

      {open && (
        <>
          {items.length > 0 ? (
            <div>
              <div className="flex items-center gap-3 px-5 py-2 bg-[#FBF8FF]">
                <div className="w-[30px] shrink-0" />
                <span className="flex-1 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#A08DBE]">Title</span>
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#A08DBE] hidden sm:block w-[100px]">Plan</span>
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#A08DBE] w-[90px]">Status</span>
                <div className="w-[28px]" />
              </div>
              {items.map(item => (
                <ContentRow key={item.id} item={item} plans={plans} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#F5EFFF] border border-[#EDE5F8] flex items-center justify-center text-[#C4B5D4]">{Icon.upload}</div>
              <p className="text-[13px] font-medium text-[#A08DBE]">No content in {label} yet</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Quick Actions ────────────────────────────────────────────────────────────
function QuickActionsMenu({ onUpload }: { onUpload: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "flex items-center gap-2 text-[13px] font-semibold px-4 py-2.5 rounded-[10px] transition-all border",
          open ? "bg-[#8A2BE2] text-white border-[#8A2BE2]" : "bg-white text-[#6B4F8A] border-[#EDE5F8] hover:bg-[#F3E8FF] hover:text-[#8A2BE2] hover:border-[#E0B0FF]"
        )}
        style={open ? { boxShadow: "0 4px 14px rgba(138,43,226,0.3)" } : {}}
      >
        {Icon.menu} Quick actions
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-30 bg-white border border-[#EDE5F8] rounded-[14px] overflow-hidden w-[200px]"
          style={{ boxShadow: "0 12px 32px rgba(45,0,82,0.14)" }}>
          <div className="px-4 pt-3.5 pb-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#C4B5D4]">Create</p>
          </div>
          <button
            onClick={() => { onUpload(); setOpen(false) }}
            className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-[#2D0052] hover:bg-[#F5EFFF] transition-colors flex items-center gap-3"
          >
            <span className="w-7 h-7 rounded-[8px] bg-[#F3E8FF] flex items-center justify-center text-[#8A2BE2]">{Icon.upload}</span>
            Upload content
          </button>
          <button
            onClick={() => { onUpload(); setOpen(false) }}
            className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-[#2D0052] hover:bg-[#F5EFFF] transition-colors flex items-center gap-3"
          >
            <span className="w-7 h-7 rounded-[8px] bg-[#F3E8FF] flex items-center justify-center text-[#8A2BE2]">{Icon.plus}</span>
            Write text post
          </button>
          <div className="border-t border-[#F5EFFF] mt-1 px-4 pt-3 pb-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#C4B5D4]">Manage</p>
          </div>
          <button className="w-full text-left px-4 pb-3.5 pt-2.5 text-[13px] font-semibold text-[#2D0052] hover:bg-[#F5EFFF] transition-colors flex items-center gap-3">
            <span className="w-7 h-7 rounded-[8px] bg-[#F3E8FF] flex items-center justify-center text-[#8A2BE2]">{Icon.settings}</span>
            Plan settings
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CreatorHub() {
  const [showUpload, setShowUpload] = useState(false)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "video" | "image" | "pdf" | "text">("all")

  const { data: hub } = useOwnHub()
  const { data: stats } = useOwnHubStats()
  const { data: content = [], isLoading } = useMyContent()
  const { data: plans = [] } = useMyPlans()

  const published = content.filter(c => c.is_published).length
  const drafts = content.filter(c => !c.is_published).length

  const filtered = content.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) &&
    (typeFilter === "all" || item.content_type === typeFilter)
  )

  // Group by plan — one section per active plan + one "All subscribers" section
  const activePlans = plans.filter(p => p.is_active)
  const ungated = filtered.filter(item => item.plan === null)
  const planGroups = activePlans.map(plan => ({
    plan,
    items: filtered.filter(item => item.plan?.id === plan.id),
  }))

  return (
    <main className="flex-1 px-6 lg:px-9 py-8 lg:py-10 bg-[#FBF8FF] min-h-screen">

      {/* Header */}
      <div className="flex items-start justify-between mb-7 gap-4 flex-wrap">
        <div>
          <h1 className="text-[26px] text-[#2D0052] leading-tight font-bold">Your Hub</h1>
          <p className="text-[13px] text-[#A08DBE] mt-1">
            {hub?.name ?? "…"} &nbsp;·&nbsp; {published} published &nbsp;·&nbsp; {drafts} {drafts !== 1 ? "drafts" : "draft"}
          </p>
        </div>
        <QuickActionsMenu onUpload={() => setShowUpload(true)} />
      </div>

      {/* Stats strip */}
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

      {/* Filters */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A08DBE]">{Icon.search}</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search content…"
            className="bg-white border border-[#EDE5F8] rounded-[10px] pl-9 pr-4 py-2 text-[13px] text-[#2D0052] placeholder:text-[#A08DBE] w-[190px] outline-none focus:border-[#C084FC] focus:ring-2 focus:ring-[#8A2BE2]/10 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {(["all", "video", "image", "pdf", "text"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                "text-[12px] font-semibold px-3.5 py-1.5 rounded-full capitalize transition-all border",
                typeFilter === t
                  ? "bg-[#8A2BE2] text-white border-[#8A2BE2]"
                  : "bg-white text-[#6B4F8A] border-[#EDE5F8] hover:border-[#C084FC] hover:text-[#8A2BE2]"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <span className="text-[12px] text-[#A08DBE] ml-1">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Plan sections */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#EDE5F8] h-[80px] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* All subscribers (ungated) */}
          <PlanSection
            label="All subscribers"
            planId={null}
            items={ungated}
            plans={plans}
          />
          {/* Per-plan sections */}
          {planGroups.map(({ plan, items }) => (
            <PlanSection
              key={plan.id}
              label={plan.name}
              planId={plan.id}
              items={items}
              plans={plans}
            />
          ))}
        </div>
      )}

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          plans={plans}
        />
      )}
    </main>
  )
}