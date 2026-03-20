"use client"

import { useState, useRef, useEffect } from "react"

const cn = (...classes) => classes.filter(Boolean).join(" ")

const PLANS = [
  { id: "free",  label: "Free",  color: "#6B7280", bg: "#F9FAFB", ring: "#E5E7EB", badge: "bg-[#F3F4F6] text-[#374151]" },
  { id: "basic", label: "Basic", color: "#166534", bg: "#F0FDF4", ring: "#BBF7D0", badge: "bg-[#DCFCE7] text-[#166534]" },
  { id: "pro",   label: "Pro",   color: "#8A2BE2", bg: "#F5F3FF", ring: "#DDD6FE", badge: "bg-[#F3E8FF] text-[#8A2BE2]" },
  { id: "vip",   label: "VIP",   color: "#92400E", bg: "#FFFBEB", ring: "#FDE68A", badge: "bg-[#FEF3C7] text-[#92400E]" },
]

const INITIAL_CONTENT = [
  { id: 1,  plan: "free",  type: "video",   title: "Intro to Colour Theory",      views: "4.2K", date: "Mar 6",  status: "published" },
  { id: 2,  plan: "free",  type: "article", title: "My Creative Process",         views: "2.8K", date: "Mar 3",  status: "published" },
  { id: 3,  plan: "free",  type: "image",   title: "Studio Sneak Peek",           views: "1.9K", date: "Feb 28", status: "published" },
  { id: 4,  plan: "basic", type: "video",   title: "Colour Theory Pt.2",          views: "1.4K", date: "Mar 7",  status: "published" },
  { id: 5,  plan: "basic", type: "file",    title: "Starter Brush Pack",          views: "980",  date: "Mar 1",  status: "published" },
  { id: 6,  plan: "basic", type: "image",   title: "Process Walkthrough",         views: "760",  date: "Feb 25", status: "published" },
  { id: 7,  plan: "pro",   type: "video",   title: "Advanced Colour Theory Pt.3", views: "1.2K", date: "Mar 8",  status: "published" },
  { id: 8,  plan: "pro",   type: "video",   title: "Studio Setup Tour 2025",      views: "876",  date: "Mar 5",  status: "published" },
  { id: 9,  plan: "pro",   type: "article", title: "Art Business Guide 2025",     views: "—",    date: "Feb 20", status: "draft"     },
  { id: 10, plan: "vip",   type: "file",    title: "Brush Pack Vol.7",            views: "542",  date: "Mar 9",  status: "published" },
  { id: 11, plan: "vip",   type: "video",   title: "1:1 Mentoring Session",       views: "210",  date: "Mar 2",  status: "published" },
]

const Icon = {
  upload:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 1.5v8M4 4.5 7 1.5l3 3" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 10.5v1a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1" strokeLinecap="round"/></svg>,
  plus:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6.5 1v11M1 6.5h11" strokeLinecap="round"/></svg>,
  search:   <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="5.8" cy="5.8" r="4"/><path d="M9 9 12 12" strokeLinecap="round"/></svg>,
  dots:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="2.5" r="1.2" fill="currentColor"/><circle cx="7" cy="7" r="1.2" fill="currentColor"/><circle cx="7" cy="11.5" r="1.2" fill="currentColor"/></svg>,
  menu:     <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 4h12M2 8h12M2 12h12" strokeLinecap="round"/></svg>,
  video:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="0.8" y="2.5" width="11" height="8" rx="1.5"/><path d="M5 5l3.5 1.5L5 8V5Z" fill="currentColor" stroke="none"/></svg>,
  image:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="11" height="11" rx="1.5"/><circle cx="4.5" cy="4.5" r="1.2" fill="currentColor" stroke="none"/><path d="M1 9l3-3 2.5 2.5L9 6l3 3.5"/></svg>,
  file:     <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 1h5l3 3v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"/><path d="M7.5 1v3.5H11M4 7h5M4 9.5h3"/></svg>,
  article:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2.5 3h8M2.5 6h8M2.5 9h5"/></svg>,
  chevron:  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 4.5L6 7.5L9 4.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  trash:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h8M4 3V2h4v1M5 5.5v3M7 5.5v3" strokeLinecap="round"/><path d="M3 3l.5 7h5l.5-7"/></svg>,
  edit:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8.5 1.5l2 2-6 6-2.5.5.5-2.5 6-6Z" strokeLinejoin="round"/></svg>,
  check:    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  x:        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 2l7 7M9 2l-7 7" strokeLinecap="round"/></svg>,
  eye:      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6s2-4 5-4 5 4 5 4-2 4-5 4-5-4-5-4Z"/><circle cx="6" cy="6" r="1.5"/></svg>,
  settings: <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6.5" cy="6.5" r="2"/><path d="M6.5 1v1.5M6.5 10v1.5M1 6.5h1.5M10 6.5h1.5M2.8 2.8l1 1M9.2 9.2l1 1M9.2 2.8l-1 1M2.8 9.2l1-1" strokeLinecap="round"/></svg>,
  link:     <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 7a3 3 0 0 0 4.24 0l1.42-1.42a3 3 0 0 0-4.24-4.24L5 2.76" strokeLinecap="round"/><path d="M7 5a3 3 0 0 0-4.24 0L1.34 6.42a3 3 0 0 0 4.24 4.24L7 9.24" strokeLinecap="round"/></svg>,
}

function ContentTypeIcon({ type }) {
  return (
    <div className="w-[30px] h-[30px] rounded-[8px] bg-[#F3E8FF] border border-[#EDE5F8] flex items-center justify-center shrink-0 text-[#8A2BE2]">
      {Icon[type]}
    </div>
  )
}

// ─── Upload Modal ───────────────────────────────────────────────────────────────
function UploadModal({ onClose, onAdd }) {
  const [step, setStep] = useState(1)
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState(null)
  const [form, setForm] = useState({ title: "", plan: "free", type: "video", status: "published" })
  const fileRef = useRef()

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) { setFileName(f.name); setForm(fr => ({ ...fr, title: f.name.replace(/\.[^/.]+$/, "") })); setStep(2) }
  }
  const handleFile = (e) => {
    const f = e.target.files[0]
    if (f) { setFileName(f.name); setForm(fr => ({ ...fr, title: f.name.replace(/\.[^/.]+$/, "") })); setStep(2) }
  }
  const submit = () => {
    onAdd({ id: Date.now(), ...form, views: "0", date: "Just now" })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(45,0,82,0.4)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-2xl w-full max-w-[440px] overflow-hidden border border-[#EDE5F8]" style={{ boxShadow: "0 20px 60px rgba(45,0,82,0.18)" }}>
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-[#F5EFFF]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#A08DBE] mb-0.5">Step {step} of 2</p>
            <h3 className="text-[18px] font-bold text-[#2D0052]">{step === 1 ? "Upload content" : "Set details"}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F5EFFF] flex items-center justify-center text-[#A08DBE] hover:bg-[#EDE5F8] transition-colors text-[18px] leading-none">×</button>
        </div>
        <div className="px-6 py-5">
          {step === 1 ? (
            <div onDragOver={(e) => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)}
              onDrop={handleDrop} onClick={() => fileRef.current.click()}
              className="cursor-pointer rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center py-10 gap-3"
              style={{ borderColor: dragging ? "#8A2BE2" : "#DDD6FE", background: dragging ? "#F5F3FF" : "#FBF8FF" }}>
              <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />
              <div className="w-12 h-12 rounded-xl bg-[#F3E8FF] border border-[#EDE5F8] flex items-center justify-center text-[#8A2BE2]">{Icon.upload}</div>
              <div className="text-center">
                <p className="text-[14px] font-semibold text-[#2D0052]">Drop a file or <span className="text-[#8A2BE2] underline underline-offset-2">browse</span></p>
                <p className="text-[12px] text-[#A08DBE] mt-0.5">Video, image, PDF, or document</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {fileName && (
                <div className="flex items-center gap-2.5 px-3 py-2.5 bg-[#F5F3FF] rounded-[10px] border border-[#DDD6FE]">
                  <div className="w-7 h-7 rounded-[7px] bg-[#EDE5F8] flex items-center justify-center text-[#8A2BE2]">{Icon.file}</div>
                  <span className="text-[12.5px] font-medium text-[#2D0052] truncate">{fileName}</span>
                </div>
              )}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A08DBE] mb-1.5 block">Title</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Give your content a name…"
                  className="w-full bg-[#FBF8FF] border border-[#EDE5F8] rounded-[10px] px-4 py-2.5 text-[13.5px] text-[#2D0052] placeholder:text-[#C4B5D4] outline-none focus:border-[#C084FC] transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A08DBE] mb-1.5 block">Type</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {["video","image","file","article"].map(t => (
                    <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                      className="py-2 rounded-[8px] text-[11.5px] font-semibold capitalize transition-all border"
                      style={{ background: form.type === t ? "#8A2BE2" : "#FBF8FF", color: form.type === t ? "white" : "#6B4F8A", borderColor: form.type === t ? "#8A2BE2" : "#EDE5F8" }}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A08DBE] mb-1.5 block">Plan</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {PLANS.map(p => (
                    <button key={p.id} onClick={() => setForm(f => ({ ...f, plan: p.id }))}
                      className="py-2.5 px-3 rounded-[10px] text-[12.5px] font-semibold text-left transition-all border-2"
                      style={{ background: form.plan === p.id ? p.bg : "white", color: form.plan === p.id ? p.color : "#6B4F8A", borderColor: form.plan === p.id ? p.ring : "#EDE5F8" }}>{p.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#A08DBE] mb-1.5 block">Status</label>
                <div className="flex gap-1.5">
                  {["published","draft"].map(s => (
                    <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))}
                      className="flex-1 py-2 rounded-[8px] text-[12px] font-semibold capitalize transition-all border"
                      style={{
                        background: form.status === s ? (s === "published" ? "#DCFCE7" : "#F5EFFF") : "#FBF8FF",
                        color: form.status === s ? (s === "published" ? "#166534" : "#A08DBE") : "#6B4F8A",
                        borderColor: form.status === s ? (s === "published" ? "#BBF7D0" : "#EDE5F8") : "#EDE5F8"
                      }}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="px-6 pb-6 flex gap-2">
          {step === 2 && (
            <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-[10px] text-[13px] font-semibold text-[#6B4F8A] bg-[#F5EFFF] hover:bg-[#EDE5F8] transition-colors border border-[#EDE5F8]">← Back</button>
          )}
          <button onClick={step === 1 ? () => setStep(2) : submit} disabled={step === 2 && !form.title.trim()}
            className="flex-1 py-2.5 rounded-[10px] text-[13px] font-semibold text-white transition-all disabled:opacity-40"
            style={{ background: "#8A2BE2", boxShadow: "0 4px 14px rgba(138,43,226,0.3)" }}>
            {step === 1 ? "Continue →" : "Add to Hub"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Editable Content Row ───────────────────────────────────────────────────────
function ContentRow({ item, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(item.title)
  const [showPlanMenu, setShowPlanMenu] = useState(false)
  const [showRowMenu, setShowRowMenu] = useState(false)
  const inputRef = useRef()

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  const saveTitle = () => {
    if (editTitle.trim()) onUpdate(item.id, { title: editTitle.trim() })
    else setEditTitle(item.title)
    setEditing(false)
  }

  const toggleStatus = () => onUpdate(item.id, { status: item.status === "published" ? "draft" : "published" })
  const currentPlan = PLANS.find(p => p.id === item.plan)

  return (
    <div className="group relative flex items-center gap-3 px-5 py-3 border-b border-[#F5EFFF] last:border-b-0 hover:bg-[#FBF8FF] transition-colors">
      <ContentTypeIcon type={item.type} />

      {/* Inline editable title */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        {editing ? (
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <input ref={inputRef} value={editTitle} onChange={e => setEditTitle(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") { setEditTitle(item.title); setEditing(false) } }}
              className="flex-1 min-w-0 text-[13px] font-medium text-[#2D0052] bg-white border border-[#C084FC] rounded-[7px] px-2.5 py-1 outline-none ring-2 ring-[#8A2BE2]/10" />
            <button onClick={saveTitle} className="w-6 h-6 rounded-[6px] bg-[#8A2BE2] flex items-center justify-center text-white shrink-0 hover:bg-[#7722CC] transition-colors">{Icon.check}</button>
            <button onClick={() => { setEditTitle(item.title); setEditing(false) }} className="w-6 h-6 rounded-[6px] bg-[#F5EFFF] flex items-center justify-center text-[#A08DBE] shrink-0 hover:bg-[#EDE5F8] transition-colors">{Icon.x}</button>
          </div>
        ) : (
          <span className="text-[13px] font-medium text-[#2D0052] truncate">{item.title}</span>
        )}
        {!editing && (
          <button onClick={() => setEditing(true)}
            className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-[5px] flex items-center justify-center text-[#A08DBE] hover:bg-[#F3E8FF] hover:text-[#8A2BE2] transition-all shrink-0">
            {Icon.edit}
          </button>
        )}
      </div>

      {/* Plan badge — click to reassign */}
      <div className="relative hidden sm:block">
        <button onClick={() => setShowPlanMenu(p => !p)}
          className={cn("inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full transition-all hover:opacity-80", currentPlan.badge)}>
          {currentPlan.label}
          <span className="opacity-60">{Icon.chevron}</span>
        </button>
        {showPlanMenu && (
          <div className="absolute left-0 top-8 z-20 bg-white border border-[#EDE5F8] rounded-[12px] overflow-hidden w-[130px]"
            style={{ boxShadow: "0 8px 24px rgba(45,0,82,0.12)" }}
            onMouseLeave={() => setShowPlanMenu(false)}>
            {PLANS.map(p => (
              <button key={p.id} onClick={() => { onUpdate(item.id, { plan: p.id }); setShowPlanMenu(false) }}
                className={cn("w-full text-left px-3 py-2 text-[12px] font-semibold flex items-center gap-2 transition-colors hover:bg-[#F5EFFF]",
                  item.plan === p.id ? "opacity-40 cursor-default" : "")}
                style={{ color: p.color }} disabled={item.plan === p.id}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: p.color }} />{p.label}
                {item.plan === p.id && <span className="ml-auto text-[#A08DBE]">{Icon.check}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status toggle */}
      <button onClick={toggleStatus}
        className={cn("inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all hover:opacity-80 shrink-0",
          item.status === "published" ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#F5EFFF] text-[#A08DBE] border border-[#EDE5F8]")}>
        <span className={cn("w-1.5 h-1.5 rounded-full", item.status === "published" ? "bg-[#16A34A]" : "bg-[#A08DBE]")} />
        {item.status === "published" ? "Published" : "Draft"}
      </button>

      {/* Row actions menu */}
      <div className="relative">
        <button onClick={() => setShowRowMenu(p => !p)}
          className="w-[28px] h-[28px] rounded-[7px] flex items-center justify-center text-[#A08DBE] opacity-0 group-hover:opacity-100 hover:bg-[#F3E8FF] hover:text-[#8A2BE2] transition-all">
          {Icon.dots}
        </button>
        {showRowMenu && (
          <div className="absolute right-0 top-8 z-20 bg-white border border-[#EDE5F8] rounded-[12px] overflow-hidden w-[160px]"
            style={{ boxShadow: "0 8px 24px rgba(45,0,82,0.12)" }}
            onMouseLeave={() => setShowRowMenu(false)}>
            <button onClick={() => { setEditing(true); setShowRowMenu(false) }}
              className="w-full text-left px-4 py-2.5 text-[12.5px] font-medium text-[#2D0052] hover:bg-[#F5EFFF] transition-colors flex items-center gap-2.5">
              <span className="text-[#A08DBE]">{Icon.edit}</span> Rename
            </button>
            <button className="w-full text-left px-4 py-2.5 text-[12.5px] font-medium text-[#2D0052] hover:bg-[#F5EFFF] transition-colors flex items-center gap-2.5">
              <span className="text-[#A08DBE]">{Icon.eye}</span> Preview
            </button>
            <button className="w-full text-left px-4 py-2.5 text-[12.5px] font-medium text-[#2D0052] hover:bg-[#F5EFFF] transition-colors flex items-center gap-2.5">
              <span className="text-[#A08DBE]">{Icon.link}</span> Copy link
            </button>
            <div className="border-t border-[#F5EFFF]">
              <button onClick={() => { onDelete(item.id); setShowRowMenu(false) }}
                className="w-full text-left px-4 py-2.5 text-[12.5px] font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2.5">
                <span>{Icon.trash}</span> Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Plan Section ───────────────────────────────────────────────────────────────
function PlanSection({ plan, items, onUpdate, onDelete }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="bg-white rounded-2xl border border-[#EDE5F8] overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(45,0,82,0.04)" }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#FBF8FF] transition-colors"
        style={{ borderBottom: open && items.length > 0 ? "1px solid #F5EFFF" : "none" }}>
        <div className="flex items-center gap-3">
          <span className={cn("inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full", plan.badge)}>{plan.label}</span>
          <span className="text-[13px] font-medium text-[#A08DBE] tabular-nums">{items.length} {items.length === 1 ? "piece" : "pieces"}</span>
        </div>
        <span className={cn("text-[#A08DBE] transition-transform duration-200", !open && "-rotate-90")}>{Icon.chevron}</span>
      </button>

      {open && (
        <>
          {items.length > 0 ? (
            <>
              <div className="flex items-center gap-3 px-5 py-2 bg-[#FBF8FF]">
                <div className="w-[30px] shrink-0" />
                <span className="flex-1 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#A08DBE]">Title</span>
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#A08DBE] hidden sm:block w-[70px]">Plan</span>
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#A08DBE] w-[90px]">Status</span>
                <div className="w-[28px]" />
              </div>
              {items.map(item => (
                <ContentRow key={item.id} item={item} onUpdate={onUpdate} onDelete={onDelete} />
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#F5EFFF] border border-[#EDE5F8] flex items-center justify-center text-[#C4B5D4]">{Icon.upload}</div>
              <p className="text-[13px] font-medium text-[#A08DBE]">No content in {plan.label} yet</p>
              <p className="text-[12px] text-[#C4B5D4]">Upload something or move content here</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Quick Actions Menu ─────────────────────────────────────────────────────────
function QuickActionsMenu({ onUpload, onNewPost }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className={cn("flex items-center gap-2 text-[13px] font-semibold px-4 py-2.5 rounded-[10px] transition-all border",
          open ? "bg-[#8A2BE2] text-white border-[#8A2BE2]" : "bg-white text-[#6B4F8A] border-[#EDE5F8] hover:bg-[#F3E8FF] hover:text-[#8A2BE2] hover:border-[#E0B0FF]")}
        style={open ? { boxShadow: "0 4px 14px rgba(138,43,226,0.3)" } : {}}>
        {Icon.menu}
        Quick actions
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-30 bg-white border border-[#EDE5F8] rounded-[14px] overflow-hidden w-[200px]"
          style={{ boxShadow: "0 12px 32px rgba(45,0,82,0.14)" }}>
          <div className="px-4 pt-3.5 pb-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#C4B5D4]">Create</p>
          </div>
          <button onClick={() => { onUpload(); setOpen(false) }}
            className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-[#2D0052] hover:bg-[#F5EFFF] transition-colors flex items-center gap-3">
            <span className="w-7 h-7 rounded-[8px] bg-[#F3E8FF] flex items-center justify-center text-[#8A2BE2]">{Icon.upload}</span>
            Upload content
          </button>
          <button onClick={() => { onNewPost(); setOpen(false) }}
            className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-[#2D0052] hover:bg-[#F5EFFF] transition-colors flex items-center gap-3">
            <span className="w-7 h-7 rounded-[8px] bg-[#F3E8FF] flex items-center justify-center text-[#8A2BE2]">{Icon.plus}</span>
            New post
          </button>
          <div className="border-t border-[#F5EFFF] mt-1 px-4 pt-3 pb-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#C4B5D4]">Manage</p>
          </div>
          <button className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-[#2D0052] hover:bg-[#F5EFFF] transition-colors flex items-center gap-3">
            <span className="w-7 h-7 rounded-[8px] bg-[#F3E8FF] flex items-center justify-center text-[#8A2BE2]">{Icon.settings}</span>
            Plan settings
          </button>
          <button className="w-full text-left px-4 pb-3.5 pt-2.5 text-[13px] font-semibold text-[#2D0052] hover:bg-[#F5EFFF] transition-colors flex items-center gap-3">
            <span className="w-7 h-7 rounded-[8px] bg-[#F3E8FF] flex items-center justify-center text-[#8A2BE2]">{Icon.eye}</span>
            Preview profile
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Main ───────────────────────────────────────────────────────────────────────
export default function CreatorHub() {
  const [content, setContent] = useState(INITIAL_CONTENT)
  const [showUpload, setShowUpload] = useState(false)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const add = (item) => setContent(c => [item, ...c])
  const update = (id, changes) => setContent(c => c.map(i => i.id === id ? { ...i, ...changes } : i))
  const del = (id) => setContent(c => c.filter(i => i.id !== id))

  const filtered = content.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) &&
    (typeFilter === "all" || i.type === typeFilter)
  )

  const published = content.filter(i => i.status === "published").length
  const drafts = content.filter(i => i.status === "draft").length

  return (
    <main className="flex-1 px-6 lg:px-9 py-8 lg:py-10 bg-[#FBF8FF] min-h-screen">

      {/* Header */}
      <div className="flex items-start justify-between mb-7 gap-4 flex-wrap">
        <div>
          <h1 className="text-[26px] text-[#2D0052] leading-tight font-bold">Your Hub</h1>
          <p className="text-[13px] text-[#A08DBE] mt-1">ArtByLola &nbsp;·&nbsp; {published} published &nbsp;·&nbsp; {drafts} draft{drafts !== 1 ? "s" : ""}</p>
        </div>
        <QuickActionsMenu onUpload={() => setShowUpload(true)} onNewPost={() => setShowUpload(true)} />
      </div>

      {/* Stats strip */}
      <div className="bg-white rounded-2xl border border-[#EDE5F8] p-5 mb-6" style={{ boxShadow: "0 1px 3px rgba(45,0,82,0.05)" }}>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#F5EFFF]">
          {[
            { label: "Total pieces", value: String(content.length) },
            { label: "Published",    value: String(published)       },
            { label: "Drafts",       value: String(drafts)          },
            { label: "Subscribers",  value: "2,140"                 },
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
          <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search content…"
            className="bg-white border border-[#EDE5F8] rounded-[10px] pl-9 pr-4 py-2 text-[13px] text-[#2D0052] placeholder:text-[#A08DBE] w-[190px] outline-none focus:border-[#C084FC] focus:ring-2 focus:ring-[#8A2BE2]/10 transition-all" />
        </div>
        <div className="flex items-center gap-1.5">
          {["all","video","image","file","article"].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={cn("text-[12px] font-semibold px-3.5 py-1.5 rounded-full capitalize transition-all border",
                typeFilter === t ? "bg-[#8A2BE2] text-white border-[#8A2BE2]" : "bg-white text-[#6B4F8A] border-[#EDE5F8] hover:border-[#C084FC] hover:text-[#8A2BE2]"
              )}>{t}</button>
          ))}
        </div>
        <span className="text-[12px] text-[#A08DBE] ml-1">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Plan sections */}
      <div className="flex flex-col gap-3">
        {PLANS.map(plan => (
          <PlanSection key={plan.id} plan={plan}
            items={filtered.filter(i => i.plan === plan.id)}
            onUpdate={update} onDelete={del} />
        ))}
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onAdd={add} />}
    </main>
  )
}