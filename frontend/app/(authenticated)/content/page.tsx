"use client"

import { useState, useCallback } from "react"
import { useMyContent, useCreateContent, useDeleteContentItem, useTogglePublish } from "@/hooks/useContent"
import { useMyPlans } from "@/hooks/usePlans"
import type { ContentResponse } from "@/types/content"
import type { PlanResponse } from "@/types/plans"

const cn = (...c: (string | boolean | undefined)[]) => c.filter(Boolean).join(" ")

const TYPE_CONFIG = {
  video: { label: "Video", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  image: { label: "Image", color: "#059669", bg: "#ECFDF5", border: "#99F6E4" },
  pdf:   { label: "PDF",   color: "#B45309", bg: "#FFFBEB", border: "#FDE68A" },
  text:  { label: "Text",  color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M6.5 1v11M1 6.5h11"/>
  </svg>
)
const CloseIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M1.5 1.5l7 7M8.5 1.5l-7 7"/>
  </svg>
)
const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 1.5 10.5 3.5l-5.5 5.5-2.5.5.5-2.5 5.5-5.5Z"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M2 3h8M4 3V2h4v1"/><path d="M3 3l.5 7h5L9 3"/>
  </svg>
)
const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 19V8M9.5 12 14 8l4.5 4"/><path d="M5 22h18"/>
  </svg>
)

// ─── Helpers ──────────────────────────────────────────────────────────────────
function detectContentType(file: File): "video" | "image" | "pdf" | "text" {
  if (file.type.startsWith("video/")) return "video"
  if (file.type.startsWith("image/")) return "image"
  if (file.type === "application/pdf") return "pdf"
  return "text"
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────
interface UploadModalProps {
  onClose: () => void
  plans: PlanResponse[]
}

function UploadModal({ onClose, plans }: UploadModalProps) {
  const [dragging, setDragging] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [planId, setPlanId] = useState<number | null>(null)
  const [publishNow, setPublishNow] = useState(true)
  const [textBody, setTextBody] = useState("")
  const [contentType, setContentType] = useState<"video" | "image" | "pdf" | "text">("text")

  const { mutate: createContent, isPending } = useCreateContent()

  const handleFile = (f: File) => {
    setFile(f)
    setContentType(detectContentType(f))
    setStep(2)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleSubmit = () => {
    if (!title.trim()) return
    createContent(
      {
        title: title.trim(),
        content_type: contentType,
        plan_id: planId ?? undefined,
        file: file ?? undefined,
        text_body: contentType === "text" ? textBody : undefined,
      },
      {
        onSuccess: (created) => {
          // If "publish now" is selected, toggle publish after creation
          // The API always creates as draft, so we need a separate call
          // This is handled by the parent via useTogglePublish if needed
          // For now, notify parent to toggle if publishNow is true
          onClose()
        },
      }
    )
  }

  const activePlans = plans.filter(p => p.is_active)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(19,17,26,0.5)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[460px] rounded-2xl border border-[#EDE9F6] overflow-hidden"
        style={{ boxShadow: "0 24px 64px rgba(124,58,237,0.16)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-[#F5F3FF]">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-[#C4B5FD] mb-1">
              Step {step} of 2
            </p>
            <h3 className="text-[17px] font-semibold text-[#13111A] tracking-tight">
              {step === 1 ? "Upload content" : "Set details"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5F3FF] flex items-center justify-center text-[#9B91B5] hover:bg-[#EDE9FE] transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6">
          {step === 1 ? (
            <div>
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
                className="cursor-pointer rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-12 gap-4 transition-all"
                style={{ borderColor: dragging ? "#7C3AED" : "#DDD6FE", background: dragging ? "#F5F3FF" : "#FDFCFF" }}
              >
                <span className="text-[#C4B5FD]"><UploadIcon /></span>
                <div className="text-center">
                  <p className="text-[13.5px] font-medium text-[#13111A]">
                    Drop a file or <span className="text-[#7C3AED] underline underline-offset-2">browse</span>
                  </p>
                  <p className="text-[12px] text-[#9B91B5] mt-1">Video · Image · PDF</p>
                </div>
                <input
                  id="file-input"
                  type="file"
                  accept="video/*,image/*,application/pdf"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                />
              </div>
              {/* Or write text */}
              <div className="flex items-center gap-3 my-4">
                <div className="h-px flex-1 bg-[#EDE9F6]" />
                <span className="text-[11px] text-[#C4B5FD] font-medium">or</span>
                <div className="h-px flex-1 bg-[#EDE9F6]" />
              </div>
              <button
                onClick={() => { setContentType("text"); setStep(2) }}
                className="w-full py-2.5 rounded-[10px] border border-[#DDD6FE] text-[13px] font-medium text-[#7C3AED] bg-[#F5F3FF] hover:bg-[#EDE9FE] transition-colors"
              >
                Write text content
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* File preview */}
              {file && (
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] bg-[#F5F3FF] border border-[#DDD6FE]">
                  <div
                    className="w-7 h-7 rounded-[7px] flex items-center justify-center text-[10px] font-bold border"
                    style={{
                      color: TYPE_CONFIG[contentType].color,
                      background: TYPE_CONFIG[contentType].bg,
                      borderColor: TYPE_CONFIG[contentType].border,
                    }}
                  >
                    {TYPE_CONFIG[contentType].label.slice(0, 3).toUpperCase()}
                  </div>
                  <p className="text-[12.5px] font-medium text-[#13111A] truncate flex-1">{file.name}</p>
                  <button onClick={() => { setFile(null); setStep(1) }} className="text-[#9B91B5] hover:text-red-400 transition-colors">
                    <CloseIcon />
                  </button>
                </div>
              )}

              {/* Text body */}
              {contentType === "text" && (
                <div>
                  <label className="block text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-2">Content</label>
                  <textarea
                    value={textBody}
                    onChange={e => setTextBody(e.target.value)}
                    placeholder="Write your content here…"
                    rows={4}
                    className="w-full bg-[#FDFCFF] border border-[#DDD6FE] rounded-[10px] px-4 py-2.5 text-[13.5px] text-[#13111A] placeholder:text-[#C4B5FD] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 transition-all resize-none"
                  />
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-2">Title</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Give your content a title"
                  className="w-full bg-[#FDFCFF] border border-[#DDD6FE] rounded-[10px] px-4 py-2.5 text-[13.5px] text-[#13111A] placeholder:text-[#C4B5FD] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 transition-all"
                />
              </div>

              {/* Plan access */}
              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-2">
                  Plan access <span className="normal-case font-normal text-[#C4B5FD]">(optional — leave empty for all subscribers)</span>
                </label>
                {activePlans.length === 0 ? (
                  <p className="text-[12px] text-[#C4B5FD]">No active plans yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {activePlans.map(plan => {
                      const isSelected = planId === plan.id
                      return (
                        <button
                          key={plan.id}
                          onClick={() => setPlanId(isSelected ? null : plan.id)}
                          className="px-3.5 py-2 rounded-[9px] text-[12.5px] font-semibold border-2 transition-all"
                          style={{
                            background: isSelected ? "#7C3AED" : "#F5F3FF",
                            color: isSelected ? "white" : "#7C3AED",
                            borderColor: isSelected ? "#7C3AED" : "#DDD6FE",
                          }}
                        >
                          {plan.name}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Status note */}
              <p className="text-[12px] text-[#9B91B5]">
                Content is always saved as a <strong className="text-[#7C3AED]">draft</strong> first. You can publish it from the content list.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 pb-6 flex gap-2.5">
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-[10px] text-[13px] font-medium text-[#6B5B9A] bg-[#F5F3FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] transition-colors"
            >
              ← Back
            </button>
          )}
          <button
            onClick={step === 1 ? () => setStep(2) : handleSubmit}
            disabled={step === 2 && (isPending || !title.trim())}
            className="flex-1 py-3 rounded-[10px] text-[13.5px] font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "#7C3AED", boxShadow: "0 4px 16px rgba(124,58,237,0.35)" }}
          >
            {step === 1 ? "Continue →" : isPending ? "Uploading…" : "Save as Draft"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Row ──────────────────────────────────────────────────────────────────────
interface RowProps {
  item: ContentResponse
  isSelected: boolean
  onToggle: () => void
}

function ContentRow({ item, isSelected, onToggle }: RowProps) {
  const { mutate: togglePublish, isPending: togglingPublish } = useTogglePublish()
  const { mutate: deleteItem, isPending: deleting } = useDeleteContentItem()

  const tCfg = TYPE_CONFIG[item.content_type]

  return (
    <div
      className="group grid items-center gap-4 px-5 py-4 border-b border-[#F9F7FF] last:border-0 transition-colors"
      style={{
        gridTemplateColumns: "16px 36px 1fr 120px 110px 72px",
        background: isSelected ? "#FDFCFF" : undefined,
      }}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#FDFCFF" }}
      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent" }}
    >
      {/* Checkbox */}
      <input type="checkbox" checked={isSelected} onChange={onToggle} />

      {/* Type pill */}
      <div
        className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center border text-[10.5px] font-bold"
        style={{ color: tCfg.color, background: tCfg.bg, borderColor: tCfg.border }}
      >
        {tCfg.label.slice(0, 3).toUpperCase()}
      </div>

      {/* Title + meta */}
      <div className="min-w-0">
        <p className="text-[13.5px] font-semibold text-[#13111A] truncate leading-tight">{item.title}</p>
        <p className="text-[11.5px] text-[#9B91B5] mt-0.5">
          {formatDate(item.created_at)}
          {item.plan && <span> · <span className="text-[#7C3AED]">{item.plan.name}</span></span>}
        </p>
      </div>

      {/* Plan badge */}
      <span>
        {item.plan ? (
          <span className="inline-flex items-center text-[11.5px] font-semibold px-2.5 py-1 rounded-full border bg-[#F5F3FF] border-[#DDD6FE] text-[#7C3AED]">
            {item.plan.name}
          </span>
        ) : (
          <span className="text-[11.5px] text-[#C4B5FD]">All subscribers</span>
        )}
      </span>

      {/* Status — clicking toggles publish */}
      <button
        onClick={() => togglePublish(item.id)}
        disabled={togglingPublish}
        className={cn(
          "inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1 rounded-full border w-fit transition-all disabled:opacity-50",
          item.is_published
            ? "text-[#0D9488] bg-[#F0FDFA] border-[#99F6E4] hover:opacity-70"
            : "text-[#9B91B5] bg-[#F5F3FF] border-[#EDE9FE] hover:opacity-70"
        )}
      >
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", item.is_published ? "bg-[#2DD4BF]" : "bg-[#C4B5FD]")} />
        {item.is_published ? "Live" : "Draft"}
      </button>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => togglePublish(item.id)}
          disabled={togglingPublish}
          className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center text-[#9B91B5] border border-[#EDE9F6] bg-white hover:text-[#7C3AED] hover:border-[#DDD6FE] hover:bg-[#F5F3FF] transition-all disabled:opacity-50"
          title={item.is_published ? "Unpublish" : "Publish"}
        >
          <EditIcon />
        </button>
        <button
          onClick={() => {
            if (confirm("Delete this content? This cannot be undone.")) {
              deleteItem(item.id)
            }
          }}
          disabled={deleting}
          className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center text-[#9B91B5] border border-[#EDE9F6] bg-white hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all disabled:opacity-50"
          title="Delete"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ContentPage() {
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all")
  const [selected, setSelected] = useState<number[]>([])
  const [showUpload, setShowUpload] = useState(false)

  const { data: content = [], isLoading, isError } = useMyContent()
  const { data: plans = [] } = useMyPlans()
  const { mutate: togglePublish } = useTogglePublish()
  const { mutate: deleteItem } = useDeleteContentItem()

  const published = content.filter(c => c.is_published).length
  const drafts = content.filter(c => !c.is_published).length

  const filtered = filter === "all"
    ? content
    : filter === "published"
    ? content.filter(c => c.is_published)
    : content.filter(c => !c.is_published)

  const toggleAll = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelected(e.target.checked ? filtered.map(c => c.id) : [])

  const toggleOne = useCallback((id: number) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]), [])

  const handleBulkPublish = () => {
    selected.forEach(id => togglePublish(id))
    setSelected([])
  }

  const handleBulkDelete = () => {
    if (!confirm(`Delete ${selected.length} items? This cannot be undone.`)) return
    selected.forEach(id => deleteItem(id))
    setSelected([])
  }

  return (
    <>
      <style>{`
        input[type=checkbox] { accent-color: #7C3AED; width:15px; height:15px; cursor:pointer; border-radius:4px; }
      `}</style>

      <div className="min-h-screen px-8 py-8" style={{ background: "#F4F1FB" }}>

        {/* Header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <h1 className="text-[24px] font-bold text-[#13111A] tracking-tight">Content</h1>
            {isLoading ? (
              <p className="text-[13px] text-[#9B91B5] mt-1">Loading…</p>
            ) : (
              <p className="text-[13px] text-[#9B91B5] mt-1">
                {content.length} pieces · {published} published · {drafts} drafts
              </p>
            )}
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13.5px] font-semibold text-white transition-all"
            style={{ background: "#7C3AED", boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}
          >
            <PlusIcon /> Upload Content
          </button>
        </div>

        {/* Filters + bulk actions */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            {[
              { key: "all" as const,       label: `All (${content.length})` },
              { key: "published" as const, label: `Published (${published})` },
              { key: "draft" as const,     label: `Drafts (${drafts})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setFilter(key); setSelected([]) }}
                className="px-4 py-2 rounded-full text-[12.5px] font-medium transition-all border"
                style={filter === key
                  ? { background: "#7C3AED", color: "white", borderColor: "#7C3AED", boxShadow: "0 3px 10px rgba(124,58,237,0.3)" }
                  : { background: "white", color: "#6B5B9A", borderColor: "#DDD6FE" }
                }
              >
                {label}
              </button>
            ))}
          </div>

          {selected.length > 0 && (
            <div className="flex items-center gap-2.5">
              <span className="text-[13px] text-[#9B91B5]">{selected.length} selected</span>
              <button
                onClick={handleBulkPublish}
                className="px-3.5 py-1.5 rounded-[8px] text-[12.5px] font-medium text-[#0D9488] bg-[#F0FDFA] border border-[#99F6E4] hover:opacity-80 transition-all"
              >
                Publish
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3.5 py-1.5 rounded-[8px] text-[12.5px] font-medium text-red-500 bg-red-50 border border-red-200 hover:opacity-80 transition-all"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div
          className="bg-white rounded-2xl border border-[#EDE9F6] overflow-hidden"
          style={{ boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}
        >
          {/* Column headers */}
          <div
            className="grid items-center gap-4 px-5 py-3.5 border-b border-[#F5F3FF]"
            style={{ gridTemplateColumns: "16px 36px 1fr 120px 110px 72px", background: "#FDFCFF" }}
          >
            <input
              type="checkbox"
              onChange={toggleAll}
              checked={selected.length === filtered.length && filtered.length > 0}
            />
            <span />
            {["Title", "Plan", "Status", "Actions"].map(h => (
              <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-[#C4B5FD]">{h}</span>
            ))}
          </div>

          {/* States */}
          {isLoading && (
            <div className="flex flex-col">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-[64px] border-b border-[#F9F7FF] animate-pulse bg-[#FDFCFF]" />
              ))}
            </div>
          )}

          {isError && (
            <p className="text-[13px] text-red-400 py-10 text-center">Failed to load content. Please refresh.</p>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <p className="text-[13px] text-[#9B91B5] py-10 text-center">No content here yet.</p>
          )}

          {!isLoading && !isError && filtered.map(item => (
            <ContentRow
              key={item.id}
              item={item}
              isSelected={selected.includes(item.id)}
              onToggle={() => toggleOne(item.id)}
            />
          ))}
        </div>
      </div>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          plans={plans}
        />
      )}
    </>
  )
}