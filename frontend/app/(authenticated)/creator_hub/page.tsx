"use client"

import { useState, useRef, useEffect } from "react"

const cn = (...c) => c.filter(Boolean).join(" ")

const PLANS = [
  {
    id: "free", label: "Free", color: "#52525B", bg: "#F4F4F5", ring: "#D4D4D8",
    badge: "bg-[#F4F4F5] text-[#52525B] border-[#E4E4E7]",
    subscribers: 890, revenue: "—", desc: "Open to everyone. No paywall.",
  },
  {
    id: "basic", label: "Basic", color: "#15803D", bg: "#F0FDF4", ring: "#86EFAC",
    badge: "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]",
    subscribers: 634, revenue: "₦48K/mo", desc: "Entry-level paid access.",
  },
  {
    id: "pro", label: "Pro", color: "#6D28D9", bg: "#F5F3FF", ring: "#C4B5FD",
    badge: "bg-[#EDE9FE] text-[#6D28D9] border-[#DDD6FE]",
    subscribers: 412, revenue: "₦180K/mo", desc: "Full access to premium content.",
  },
  {
    id: "vip", label: "VIP", color: "#92400E", bg: "#FFFBEB", ring: "#FCD34D",
    badge: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
    subscribers: 94, revenue: "₦112K/mo", desc: "Exclusive & high-ticket access.",
  },
]

const INITIAL_CONTENT = [
  { id:1,  plan:"free",  type:"video",   title:"Intro to Colour Theory",      views:"4.2K", likes:"312", date:"Mar 6",  status:"published" },
  { id:2,  plan:"free",  type:"article", title:"My Creative Process",         views:"2.8K", likes:"201", date:"Mar 3",  status:"published" },
  { id:3,  plan:"free",  type:"image",   title:"Studio Sneak Peek",           views:"1.9K", likes:"140", date:"Feb 28", status:"published" },
  { id:4,  plan:"basic", type:"video",   title:"Colour Theory Pt.2",          views:"1.4K", likes:"98",  date:"Mar 7",  status:"published" },
  { id:5,  plan:"basic", type:"file",    title:"Starter Brush Pack",          views:"980",  likes:"76",  date:"Mar 1",  status:"published" },
  { id:6,  plan:"basic", type:"image",   title:"Process Walkthrough",         views:"760",  likes:"54",  date:"Feb 25", status:"published" },
  { id:7,  plan:"pro",   type:"video",   title:"Advanced Colour Theory Pt.3", views:"1.2K", likes:"284", date:"Mar 8",  status:"published" },
  { id:8,  plan:"pro",   type:"video",   title:"Studio Setup Tour 2025",      views:"876",  likes:"151", date:"Mar 5",  status:"published" },
  { id:9,  plan:"pro",   type:"article", title:"Art Business Guide 2025",     views:"—",    likes:"—",   date:"Feb 20", status:"draft"     },
  { id:10, plan:"vip",   type:"file",    title:"Brush Pack Vol.7",            views:"542",  likes:"98",  date:"Mar 9",  status:"published" },
  { id:11, plan:"vip",   type:"video",   title:"1:1 Mentoring Session",       views:"210",  likes:"44",  date:"Mar 2",  status:"published" },
]

const SVG = {
  upload:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 9.5V2M4 4.5 7 2l3 2.5"/><path d="M1.5 10.5v1a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1"/></svg>,
  plus:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6.5 1v11M1 6.5h11"/></svg>,
  search:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="5.5" cy="5.5" r="3.8"/><path d="M8.5 8.5 11 11"/></svg>,
  dots:    <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor"><circle cx="6.5" cy="2.5" r="1.1"/><circle cx="6.5" cy="6.5" r="1.1"/><circle cx="6.5" cy="10.5" r="1.1"/></svg>,
  menu:    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M2 4h11M2 7.5h11M2 11h11"/></svg>,
  video:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="0.8" y="2.5" width="11" height="8" rx="1.5"/><path d="M5 5l3.5 1.5L5 8V5Z" fill="currentColor" stroke="none"/></svg>,
  image:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="11" height="11" rx="1.5"/><circle cx="4.5" cy="4.5" r="1.2" fill="currentColor" stroke="none"/><path d="M1 9l3-3 2.5 2.5L9 6l3 3.5"/></svg>,
  file:    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 1h5l3 3v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"/><path d="M7.5 1v3.5H11M4 7h5M4 9.5h3"/></svg>,
  article: <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2.5 3h8M2.5 6h8M2.5 9h5"/></svg>,
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
  arrowUp: <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8V2M2 5l3-3 3 3"/></svg>,
}

function TypeIcon({ type }) {
  return (
    <div className="w-[30px] h-[30px] rounded-[8px] bg-[#F3E8FF] border border-[#EDE5F8] flex items-center justify-center shrink-0 text-[#8A2BE2]">
      {SVG[type]}
    </div>
  )
}

// ─── Profile Header ─────────────────────────────────────────────────────────────
function ProfileHeader({ content }) {
  const [banner, setBanner] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const bannerRef = useRef()
  const avatarRef = useRef()
  const published = content.filter(i => i.status === "published").length

  return (
    <div className="bg-white rounded-2xl border border-[#EDE5F8] overflow-hidden mb-5" style={{ boxShadow: "0 1px 3px rgba(45,0,82,0.05)" }}>
      {/* Banner */}
      <div className="relative w-full cursor-pointer group" style={{ height: 130 }}
        onClick={() => bannerRef.current.click()}>
        {banner
          ? <img src={banner} className="w-full h-full object-cover" alt="" />
          : <div className="w-full h-full relative overflow-hidden" style={{ background: "#2D0052" }}>
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position:"absolute", inset:0 }}>
                <defs><pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="1.5" cy="1.5" r="1" fill="rgba(255,255,255,0.08)" />
                </pattern></defs>
                <rect width="100%" height="100%" fill="url(#dots)" />
              </svg>
            </div>
        }
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
          style={{ background: "rgba(45,0,82,0.5)", backdropFilter: "blur(2px)" }}>
          <span className="flex items-center gap-2 text-[12px] font-semibold text-white border border-white/25 bg-white/15 px-4 py-2 rounded-full">
            {SVG.camera} Change cover
          </span>
        </div>
        <input ref={bannerRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f=e.target.files[0]; if(f) setBanner(URL.createObjectURL(f)) }} />
      </div>

      {/* Avatar + info */}
      <div className="px-6 pt-3 pb-5">
        <div className="flex items-end gap-4 -mt-10">
          <div className="relative group cursor-pointer shrink-0" onClick={() => avatarRef.current.click()}>
            <div className="w-[64px] h-[64px] rounded-[14px] overflow-hidden border-[3px] border-white flex items-center justify-center"
              style={{ background: "#8A2BE2", boxShadow: "0 2px 10px rgba(45,0,82,0.2)" }}>
              {avatar ? <img src={avatar} className="w-full h-full object-cover" alt="" />
                : <span className="text-white text-[22px] font-bold select-none">L</span>}
            </div>
            <div className="absolute inset-0 rounded-[14px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all" style={{ background: "rgba(45,0,82,0.5)" }}>
              <span className="text-white">{SVG.camera}</span>
            </div>
            <span className="absolute bottom-[2px] right-[2px] w-[10px] h-[10px] rounded-full bg-[#16A34A] border-2 border-white" />
            <input ref={avatarRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f=e.target.files[0]; if(f) setAvatar(URL.createObjectURL(f)) }} />
          </div>
          <div className="pt-10">
            <h2 className="text-[16px] font-bold text-[#2D0052] leading-tight">ArtByLola</h2>
            <p className="text-[12px] text-[#A08DBE] mt-0.5">artbylola.com · Lagos, NG</p>
          </div>
        </div>

        {/* Stats row — fully below everything */}
        <div className="grid grid-cols-3 mt-4 pt-4 border-t border-[#F5EFFF]">
          {[
            { label: "Total subscribers", value: "2,030",          sub: "+124 this month" },
            { label: "Monthly revenue",   value: "₦340K",          sub: "+18% vs last month" },
            { label: "Content published", value: String(published), sub: `${content.length} total pieces` },
          ].map((s, i) => (
            <div key={s.label} className={cn("flex flex-col gap-0.5", i > 0 && "pl-5 border-l border-[#F5EFFF]", i === 0 && "pr-5")}>
              <span className="text-[11px] font-medium text-[#A08DBE]">{s.label}</span>
              <span className="text-[20px] font-bold text-[#2D0052] leading-tight tracking-tight">{s.value}</span>
              <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-emerald-600">{SVG.arrowUp}{s.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Quick Actions ─────────────────────────────────────────────────────────────
function QuickActionsMenu({ onUpload }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className={cn("flex items-center gap-2 text-[13px] font-semibold px-4 py-2.5 rounded-[10px] transition-all border",
          open ? "bg-[#8A2BE2] text-white border-[#8A2BE2]" : "bg-white text-[#6B4F8A] border-[#EDE5F8] hover:bg-[#F3E8FF] hover:text-[#8A2BE2] hover:border-[#DDD6FE]"
        )} style={open ? { boxShadow: "0 4px 14px rgba(138,43,226,0.3)" } : {}}>
        {SVG.menu} Quick actions
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-40 bg-white border border-[#EDE5F8] rounded-[14px] overflow-hidden w-[200px]"
          style={{ boxShadow: "0 12px 36px rgba(45,0,82,0.14)" }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#C4B5D4] px-4 pt-3.5 pb-1.5">Create</p>
          {[
            { icon: SVG.upload, label: "Upload content", fn: () => { onUpload(); setOpen(false) } },
            { icon: SVG.plus,   label: "New post",       fn: () => { onUpload(); setOpen(false) } },
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
              { icon: SVG.settings, label: "Plan settings"   },
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

// ─── Upload Modal ──────────────────────────────────────────────────────────────
function UploadModal({ onClose, onAdd }) {
  const [step, setStep] = useState(1)
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState(null)
  const [form, setForm] = useState({ title:"", plan:"free", type:"video", status:"published" })
  const fileRef = useRef()

  const pickFile = f => {
    if (!f) return
    setFileName(f.name)
    setForm(fr => ({ ...fr, title: f.name.replace(/\.[^/.]+$/, "") }))
    setStep(2)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(45,0,82,0.45)", backdropFilter: "blur(6px)" }}>
      <div className="bg-white w-full max-w-[430px] rounded-2xl border border-[#EDE5F8] overflow-hidden"
        style={{ boxShadow: "0 24px 64px rgba(45,0,82,0.2)" }}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F5EFFF]">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#A08DBE] mb-0.5">Step {step} of 2</p>
            <h3 className="text-[17px] font-bold text-[#2D0052]">{step===1 ? "Drop your content" : "Fill in the details"}</h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-[#F5EFFF] flex items-center justify-center text-[#A08DBE] hover:bg-[#EDE5F8] transition-colors">{SVG.x}</button>
        </div>
        <div className="px-6 py-5">
          {step === 1 ? (
            <div onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)}
              onDrop={e=>{e.preventDefault();setDragging(false);pickFile(e.dataTransfer.files[0])}}
              onClick={()=>fileRef.current.click()}
              className="cursor-pointer rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-12 gap-3 transition-all"
              style={{ borderColor: dragging?"#8A2BE2":"#DDD6FE", background: dragging?"#F5F3FF":"#FBF8FF" }}>
              <input ref={fileRef} type="file" className="hidden" onChange={e=>pickFile(e.target.files[0])} />
              <div className="w-11 h-11 rounded-[12px] bg-[#F3E8FF] border border-[#EDE5F8] flex items-center justify-center text-[#8A2BE2]">{SVG.upload}</div>
              <div className="text-center">
                <p className="text-[13.5px] font-semibold text-[#2D0052]">Drop a file or <span className="text-[#8A2BE2] underline underline-offset-2">browse</span></p>
                <p className="text-[11.5px] text-[#A08DBE] mt-1">Video · Image · PDF · Document</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {fileName && (
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] border border-[#DDD6FE] bg-[#F5F3FF]">
                  <div className="w-7 h-7 rounded-[7px] bg-[#EDE5F8] flex items-center justify-center text-[#8A2BE2] shrink-0">{SVG.file}</div>
                  <span className="text-[12px] font-medium text-[#2D0052] truncate">{fileName}</span>
                </div>
              )}
              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#A08DBE] mb-1.5">Title</label>
                <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Name your content…"
                  className="w-full bg-[#FBF8FF] border border-[#EDE5F8] rounded-[9px] px-3.5 py-2.5 text-[13px] text-[#2D0052] placeholder:text-[#C4B5D4] outline-none focus:border-[#A78BFA] focus:ring-2 focus:ring-[#8A2BE2]/10 transition-all" />
              </div>
              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#A08DBE] mb-1.5">Type</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {["video","image","file","article"].map(t=>(
                    <button key={t} onClick={()=>setForm(f=>({...f,type:t}))}
                      className="py-2 rounded-[8px] text-[11.5px] font-semibold capitalize transition-all border"
                      style={{ background:form.type===t?"#8A2BE2":"#FBF8FF", color:form.type===t?"white":"#6B4F8A", borderColor:form.type===t?"#8A2BE2":"#EDE5F8" }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#A08DBE] mb-1.5">Plan</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {PLANS.map(p=>(
                    <button key={p.id} onClick={()=>setForm(f=>({...f,plan:p.id}))}
                      className="py-2.5 px-3 rounded-[9px] text-[12.5px] font-semibold text-left transition-all border-2"
                      style={{ background:form.plan===p.id?p.bg:"white", color:form.plan===p.id?p.color:"#6B4F8A", borderColor:form.plan===p.id?p.ring:"#EDE5F8" }}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#A08DBE] mb-1.5">Status</label>
                <div className="flex gap-1.5">
                  {[["published","#DCFCE7","#166534","#86EFAC"],["draft","#F5EFFF","#6B4F8A","#EDE5F8"]].map(([s,bg,color,border])=>(
                    <button key={s} onClick={()=>setForm(f=>({...f,status:s}))}
                      className="flex-1 py-2 rounded-[8px] text-[12px] font-semibold capitalize transition-all border-2"
                      style={{ background:form.status===s?bg:"white", color:form.status===s?color:"#6B4F8A", borderColor:form.status===s?border:"#EDE5F8" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="px-6 pb-5 flex gap-2">
          {step===2 && (
            <button onClick={()=>setStep(1)} className="flex-1 py-2.5 rounded-[10px] text-[13px] font-semibold text-[#6B4F8A] bg-[#F5EFFF] hover:bg-[#EDE5F8] border border-[#EDE5F8] transition-colors">← Back</button>
          )}
          <button
            onClick={step===1?()=>setStep(2):()=>{onAdd({id:Date.now(),...form,views:"0",likes:"0",date:"Just now"});onClose()}}
            disabled={step===2&&!form.title.trim()}
            className="flex-1 py-2.5 rounded-[10px] text-[13px] font-semibold text-white transition-all disabled:opacity-40"
            style={{ background:"#8A2BE2", boxShadow:"0 4px 14px rgba(138,43,226,0.3)" }}>
            {step===1?"Continue →":"Add to Hub"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Content Row ───────────────────────────────────────────────────────────────
function ContentRow({ item, onUpdate, onDelete }) {
  const [editing, setEditing]   = useState(false)
  const [draft, setDraft]       = useState(item.title)
  const [planOpen, setPlanOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const inputRef = useRef()
  const planRef  = useRef()
  const menuRef  = useRef()

  useEffect(()=>{ if(editing) inputRef.current?.focus() },[editing])
  useEffect(()=>{
    const h = e => {
      if(planRef.current&&!planRef.current.contains(e.target)) setPlanOpen(false)
      if(menuRef.current&&!menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener("mousedown",h)
    return ()=>document.removeEventListener("mousedown",h)
  },[])

  const save = () => { onUpdate(item.id,{title:draft.trim()||item.title}); setEditing(false) }
  const plan = PLANS.find(p=>p.id===item.plan)
  const pub  = item.status==="published"

  return (
    <div className="group flex items-center gap-3 px-5 py-3 border-b border-[#F5EFFF] last:border-b-0 hover:bg-[#FBF8FF] transition-colors">
      <TypeIcon type={item.type} />

      {/* Title */}
      <div className="flex-1 min-w-0 flex items-center gap-1.5">
        {editing ? (
          <>
            <input ref={inputRef} value={draft} onChange={e=>setDraft(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter")save();if(e.key==="Escape"){setDraft(item.title);setEditing(false)}}}
              className="flex-1 min-w-0 text-[13px] font-medium text-[#2D0052] bg-white border border-[#A78BFA] rounded-[7px] px-2.5 py-1 outline-none ring-2 ring-[#8A2BE2]/10" />
            <button onClick={save} className="w-[22px] h-[22px] rounded-[5px] bg-[#8A2BE2] flex items-center justify-center text-white shrink-0">{SVG.check}</button>
            <button onClick={()=>{setDraft(item.title);setEditing(false)}} className="w-[22px] h-[22px] rounded-[5px] bg-[#F5EFFF] flex items-center justify-center text-[#A08DBE] shrink-0">{SVG.x}</button>
          </>
        ) : (
          <>
            <span className="text-[13px] font-medium text-[#2D0052] truncate">{item.title}</span>
            <button onClick={()=>setEditing(true)}
              className="opacity-0 group-hover:opacity-100 w-[18px] h-[18px] rounded-[4px] flex items-center justify-center text-[#A08DBE] hover:bg-[#F3E8FF] hover:text-[#8A2BE2] transition-all shrink-0">
              {SVG.edit}
            </button>
          </>
        )}
      </div>

      {/* Views */}
      <span className="text-[12px] text-[#A08DBE] tabular-nums w-[48px] text-right hidden md:block">{item.views}</span>

      {/* Likes */}
      <span className="text-[12px] text-[#A08DBE] tabular-nums w-[44px] text-right hidden lg:block">{item.likes}</span>

      {/* Plan badge */}
      <div className="relative hidden sm:block shrink-0" ref={planRef}>
        <button onClick={()=>setPlanOpen(o=>!o)}
          className={cn("inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full transition-all hover:opacity-80 border",plan.badge)}>
          {plan.label}<span className="opacity-50">{SVG.chevron}</span>
        </button>
        {planOpen && (
          <div className="absolute left-0 top-8 z-20 bg-white border border-[#EDE5F8] rounded-[12px] overflow-hidden w-[130px]"
            style={{ boxShadow:"0 8px 24px rgba(45,0,82,0.12)" }}>
            {PLANS.map(p=>(
              <button key={p.id} onClick={()=>{onUpdate(item.id,{plan:p.id});setPlanOpen(false)}}
                disabled={p.id===item.plan}
                className="w-full text-left px-3 py-2 text-[12px] font-semibold flex items-center gap-2 transition-colors hover:bg-[#F5EFFF] disabled:opacity-40"
                style={{color:p.color}}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:p.color}} />{p.label}
                {p.id===item.plan&&<span className="ml-auto">{SVG.check}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <button onClick={()=>onUpdate(item.id,{status:pub?"draft":"published"})}
        className={cn("inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all hover:opacity-75 shrink-0",
          pub?"bg-[#DCFCE7] text-[#166534]":"bg-[#F5EFFF] text-[#A08DBE] border border-[#EDE5F8]")}>
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0",pub?"bg-[#16A34A]":"bg-[#A08DBE]")} />
        {pub?"Published":"Draft"}
      </button>

      {/* Row menu */}
      <div className="relative shrink-0" ref={menuRef}>
        <button onClick={()=>setMenuOpen(o=>!o)}
          className="w-[26px] h-[26px] rounded-[6px] flex items-center justify-center text-[#A08DBE] opacity-0 group-hover:opacity-100 hover:bg-[#F3E8FF] hover:text-[#8A2BE2] transition-all">
          {SVG.dots}
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-8 z-20 bg-white border border-[#EDE5F8] rounded-[12px] overflow-hidden w-[152px]"
            style={{ boxShadow:"0 8px 24px rgba(45,0,82,0.12)" }} onMouseLeave={()=>setMenuOpen(false)}>
            {[
              {icon:SVG.edit, label:"Rename",    fn:()=>{setEditing(true);setMenuOpen(false)}},
              {icon:SVG.eye,  label:"Preview",   fn:()=>setMenuOpen(false)},
              {icon:SVG.link, label:"Copy link", fn:()=>setMenuOpen(false)},
            ].map(({icon,label,fn})=>(
              <button key={label} onClick={fn}
                className="w-full text-left px-3.5 py-2.5 text-[12.5px] font-medium text-[#2D0052] hover:bg-[#F5EFFF] transition-colors flex items-center gap-2.5">
                <span className="text-[#A08DBE]">{icon}</span>{label}
              </button>
            ))}
            <div className="border-t border-[#F5EFFF]">
              <button onClick={()=>{onDelete(item.id);setMenuOpen(false)}}
                className="w-full text-left px-3.5 py-2.5 text-[12.5px] font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2.5">
                {SVG.trash} Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Plan Section ───────────────────────────────────────────────────────────────
function PlanSection({ plan, items, onUpdate, onDelete, totalSubs }) {
  const [open, setOpen] = useState(true)
  const live     = items.filter(i => i.status==="published").length
  const subPct   = Math.round((plan.subscribers / totalSubs) * 100)

  return (
    <div className="bg-white rounded-2xl border border-[#EDE5F8] overflow-visible"
      style={{ boxShadow:"0 1px 3px rgba(45,0,82,0.04)" }}>

      {/* Section header — rich plan info */}
      <div className="px-5 pt-4 pb-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={cn("inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full border", plan.badge)}>
              {plan.label}
            </span>
            <span className="text-[12.5px] text-[#A08DBE]">{plan.desc}</span>
          </div>
          <button onClick={()=>setOpen(o=>!o)}
            className={cn("text-[#C4B5D4] transition-transform duration-200 shrink-0 mt-0.5", !open&&"-rotate-90")}>
            {SVG.chevron}
          </button>
        </div>

        {/* Plan stats row */}
        <div className="grid grid-cols-3 mt-3 mb-0 gap-3">
          <div className="flex items-center gap-2.5 bg-[#FBF8FF] rounded-[10px] px-3 py-2.5 border border-[#F5EFFF]">
            <span className="w-7 h-7 rounded-[7px] bg-[#F3E8FF] flex items-center justify-center text-[#8A2BE2] shrink-0">{SVG.users}</span>
            <div>
              <p className="text-[15px] font-bold text-[#2D0052] leading-none">{plan.subscribers.toLocaleString()}</p>
              <p className="text-[10.5px] text-[#A08DBE] mt-0.5">subscribers</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-[#FBF8FF] rounded-[10px] px-3 py-2.5 border border-[#F5EFFF]">
            <span className="w-7 h-7 rounded-[7px] bg-[#F3E8FF] flex items-center justify-center text-[#8A2BE2] shrink-0">{SVG.revenue}</span>
            <div>
              <p className="text-[15px] font-bold text-[#2D0052] leading-none">{plan.revenue}</p>
              <p className="text-[10.5px] text-[#A08DBE] mt-0.5">revenue</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-[#FBF8FF] rounded-[10px] px-3 py-2.5 border border-[#F5EFFF]">
            <span className="w-7 h-7 rounded-[7px] bg-[#F3E8FF] flex items-center justify-center text-[#8A2BE2] shrink-0">{SVG.file}</span>
            <div>
              <p className="text-[15px] font-bold text-[#2D0052] leading-none">{items.length}</p>
              <p className="text-[10.5px] text-[#A08DBE] mt-0.5">{live} live · {items.length - live} draft</p>
            </div>
          </div>
        </div>

        {/* Subscriber share bar */}
        <div className="mt-3 mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10.5px] font-medium text-[#C4B5D4]">Share of total subscribers</span>
            <span className="text-[10.5px] font-semibold text-[#A08DBE]">{subPct}%</span>
          </div>
          <div className="h-1.5 bg-[#F5EFFF] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width:`${subPct}%`, background: plan.color }} />
          </div>
        </div>

        {/* Content toggle row */}
        <button onClick={()=>setOpen(o=>!o)}
          className="w-full flex items-center gap-2 py-3 border-t border-[#F5EFFF] hover:text-[#8A2BE2] transition-colors">
          <span className={cn("text-[#C4B5D4] transition-transform duration-200 shrink-0", !open&&"-rotate-90")}>{SVG.chevron}</span>
          <span className="text-[11.5px] font-semibold text-[#A08DBE]">
            {open ? "Hide" : "Show"} {items.length} piece{items.length!==1?"s":""}
          </span>
        </button>
      </div>

      {/* Content list */}
      {open && (
        items.length > 0 ? (
          <>
            <div className="flex items-center gap-3 px-5 py-2 bg-[#FBF8FF] border-t border-[#F5EFFF]">
              <div className="w-[30px] shrink-0" />
              <span className="flex-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#C4B5D4]">Title</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#C4B5D4] w-[48px] text-right hidden md:block">Views</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#C4B5D4] w-[44px] text-right hidden lg:block">Likes</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#C4B5D4] w-[80px] hidden sm:block">Plan</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#C4B5D4] w-[88px]">Status</span>
              <div className="w-[26px]" />
            </div>
            {items.map(item=>(
              <ContentRow key={item.id} item={item} onUpdate={onUpdate} onDelete={onDelete} />
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-9 gap-2 border-t border-[#F5EFFF]">
            <div className="w-9 h-9 rounded-xl bg-[#F5EFFF] border border-[#EDE5F8] flex items-center justify-center text-[#C4B5D4]">{SVG.upload}</div>
            <p className="text-[13px] font-medium text-[#A08DBE]">No content in {plan.label} yet</p>
            <p className="text-[11.5px] text-[#C4B5D4]">Upload or reassign content here</p>
          </div>
        )
      )}
    </div>
  )
}

// ─── Main ───────────────────────────────────────────────────────────────────────
export default function CreatorHub() {
  const [content, setContent]   = useState(INITIAL_CONTENT)
  const [showUpload, setUpload] = useState(false)
  const [search, setSearch]     = useState("")
  const [typeFilter, setType]   = useState("all")

  const add    = item    => setContent(c=>[item,...c])
  const update = (id,ch) => setContent(c=>c.map(i=>i.id===id?{...i,...ch}:i))
  const del    = id      => setContent(c=>c.filter(i=>i.id!==id))

  const filtered = content.filter(i=>
    i.title.toLowerCase().includes(search.toLowerCase()) &&
    (typeFilter==="all"||i.type===typeFilter)
  )

  const totalSubs = PLANS.reduce((a,p)=>a+p.subscribers,0)

  return (
    <main className="flex-1 px-6 lg:px-9 py-8 bg-[#FBF8FF] min-h-screen">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#2D0052] leading-tight">Your Hub</h1>
          <p className="text-[12.5px] text-[#A08DBE] mt-0.5">Manage everything in one place</p>
        </div>
        <QuickActionsMenu onUpload={()=>setUpload(true)} />
      </div>

      {/* Profile */}
      <ProfileHeader content={content} />

      {/* Filter bar */}
      <div className="flex items-center gap-2.5 mb-5 flex-wrap">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4B5D4]">{SVG.search}</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search content…"
            className="bg-white border border-[#EDE5F8] rounded-[10px] pl-8 pr-3.5 py-2 text-[12.5px] text-[#2D0052] placeholder:text-[#C4B5D4] w-[190px] outline-none focus:border-[#A78BFA] focus:ring-2 focus:ring-[#8A2BE2]/10 transition-all" />
        </div>
        <div className="flex items-center gap-1 bg-white border border-[#EDE5F8] rounded-[10px] p-1">
          {["all","video","image","file","article"].map(t=>(
            <button key={t} onClick={()=>setType(t)}
              className={cn("text-[11.5px] font-semibold px-3 py-1.5 rounded-[7px] capitalize transition-all",
                typeFilter===t?"bg-[#8A2BE2] text-white":"text-[#6B4F8A] hover:bg-[#F5EFFF]")}>
              {t}
            </button>
          ))}
        </div>
        <span className="text-[12px] text-[#C4B5D4]">{filtered.length} result{filtered.length!==1?"s":""}</span>
      </div>

      {/* Plan sections */}
      <div className="flex flex-col gap-4">
        {PLANS.map(plan=>(
          <PlanSection key={plan.id} plan={plan}
            items={filtered.filter(i=>i.plan===plan.id)}
            onUpdate={update} onDelete={del}
            totalSubs={totalSubs} />
        ))}
      </div>

      {showUpload && <UploadModal onClose={()=>setUpload(false)} onAdd={add} />}
    </main>
  )
}