"use client"

import { useState } from "react"

const cn = (...c) => c.filter(Boolean).join(" ")

// ─── Data ──────────────────────────────────────────────────────────────────────
const CONTENT = [
  { id:"1", type:"video", title:"Advanced Colour Theory Pt.3",          plan:"Pro",   views:1243, likes:284, status:"published", date:"Mar 8, 2026",  size:"412 MB" },
  { id:"2", type:"image", title:"Studio Setup Tour 2025",               plan:"Basic", views:876,  likes:151, status:"published", date:"Mar 6, 2026",  size:"18 MB"  },
  { id:"3", type:"pdf",   title:"Exclusive Brush Pack Vol.7",           plan:"VIP",   views:542,  likes:98,  status:"published", date:"Mar 4, 2026",  size:"24 MB"  },
  { id:"4", type:"text",  title:"Art Business Guide 2025",              plan:"Pro",   views:0,    likes:0,   status:"draft",     date:"Mar 3, 2026",  size:"—"      },
  { id:"5", type:"video", title:"Building Your Artistic Style",         plan:"Basic", views:2140, likes:389, status:"published", date:"Feb 28, 2026", size:"890 MB" },
  { id:"6", type:"video", title:"Portrait Series — Full Breakdown",     plan:"VIP",   views:430,  likes:67,  status:"published", date:"Feb 25, 2026", size:"1.2 GB" },
  { id:"7", type:"image", title:"Behind the Scenes — Commission Work",  plan:"Basic", views:0,    likes:0,   status:"draft",     date:"Feb 20, 2026", size:"—"      },
  { id:"8", type:"pdf",   title:"Colour Palette Collection Vol.3",      plan:"Pro",   views:312,  likes:44,  status:"published", date:"Feb 18, 2026", size:"8 MB"   },
]

const TYPE_CONFIG = {
  video: { label:"Video", color:"#DC2626", bg:"#FEF2F2", border:"#FECACA" },
  image: { label:"Image", color:"#059669", bg:"#ECFDF5", border:"#99F6E4" },
  pdf:   { label:"PDF",   color:"#B45309", bg:"#FFFBEB", border:"#FDE68A" },
  text:  { label:"Text",  color:"#7C3AED", bg:"#F5F3FF", border:"#DDD6FE" },
}

const PLAN_CONFIG = {
  Basic: { color:"#0D9488", bg:"#F0FDFA", border:"#99F6E4" },
  Pro:   { color:"#7C3AED", bg:"#F5F3FF", border:"#DDD6FE" },
  VIP:   { color:"#B45309", bg:"#FFFBEB", border:"#FDE68A" },
}

// ─── Icons ─────────────────────────────────────────────────────────────────────
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

// ─── Upload Modal ──────────────────────────────────────────────────────────────
function UploadModal({ onClose }) {
  const [dragging, setDragging] = useState(false)
  const [step, setStep] = useState(1)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(19,17,26,0.5)", backdropFilter:"blur(8px)" }}
      onClick={onClose}>
      <div className="bg-white w-full max-w-[460px] rounded-2xl border border-[#EDE9F6] overflow-hidden"
        style={{ boxShadow:"0 24px 64px rgba(124,58,237,0.16)" }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-[#F5F3FF]">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-[#C4B5FD] mb-1">
              Step {step} of 2
            </p>
            <h3 className="text-[17px] font-semibold text-[#13111A] tracking-tight">
              {step === 1 ? "Upload content" : "Set details"}
            </h3>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5F3FF] flex items-center justify-center text-[#9B91B5] hover:bg-[#EDE9FE] transition-colors">
            <CloseIcon />
          </button>
        </div>

        <div className="px-7 py-6">
          {step === 1 ? (
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); setStep(2) }}
              onClick={() => setStep(2)}
              className="cursor-pointer rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-12 gap-4 transition-all"
              style={{ borderColor: dragging ? "#7C3AED" : "#DDD6FE", background: dragging ? "#F5F3FF" : "#FDFCFF" }}>
              <span className="text-[#C4B5FD]"><UploadIcon /></span>
              <div className="text-center">
                <p className="text-[13.5px] font-medium text-[#13111A]">
                  Drop a file or <span className="text-[#7C3AED] underline underline-offset-2">browse</span>
                </p>
                <p className="text-[12px] text-[#9B91B5] mt-1">Video · Image · PDF · Text</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-2">Title</label>
                <input placeholder="Give your content a title"
                  className="w-full bg-[#FDFCFF] border border-[#DDD6FE] rounded-[10px] px-4 py-2.5 text-[13.5px] text-[#13111A] placeholder:text-[#C4B5FD] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10 transition-all" />
              </div>
              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-2">Plan access</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {["Basic", "Pro", "VIP"].map(p => {
                    const cfg = PLAN_CONFIG[p]
                    return (
                      <button key={p}
                        className="py-2.5 rounded-[9px] text-[13px] font-semibold border-2 transition-all"
                        style={{ color:cfg.color, background:cfg.bg, borderColor:cfg.border }}>
                        {p}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-widest text-[#9B91B5] mb-2">Status</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[["published","Publish now"],["draft","Save as draft"]].map(([s,label]) => (
                    <button key={s}
                      className="py-2.5 rounded-[9px] text-[13px] font-medium border-2 transition-all"
                      style={{
                        background: s==="published" ? "#7C3AED" : "white",
                        color: s==="published" ? "white" : "#6B5B9A",
                        borderColor: s==="published" ? "#7C3AED" : "#DDD6FE"
                      }}>{label}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-7 pb-6 flex gap-2.5">
          {step === 2 && (
            <button onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-[10px] text-[13px] font-medium text-[#6B5B9A] bg-[#F5F3FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] transition-colors">
              ← Back
            </button>
          )}
          <button onClick={step===1 ? ()=>setStep(2) : onClose}
            className="flex-1 py-3 rounded-[10px] text-[13.5px] font-semibold text-white transition-all"
            style={{ background:"#7C3AED", boxShadow:"0 4px 16px rgba(124,58,237,0.35)" }}>
            {step===1 ? "Continue →" : "Upload & Publish"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ContentPage() {
  const [filter, setFilter]       = useState("all")
  const [selected, setSelected]   = useState([])
  const [showUpload, setUpload]   = useState(false)

  const published = CONTENT.filter(c => c.status === "published").length
  const drafts    = CONTENT.filter(c => c.status === "draft").length

  const filtered = filter === "all" ? CONTENT : CONTENT.filter(c => c.status === filter)

  const toggleAll = e => setSelected(e.target.checked ? CONTENT.map(c => c.id) : [])
  const toggle    = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        input[type=checkbox] { accent-color: #7C3AED; width:15px; height:15px; cursor:pointer; border-radius:4px; }
      `}</style>

      <div className="min-h-screen px-8 py-8" style={{ background:"#F4F1FB" }}>

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <h1 className="text-[24px] font-bold text-[#13111A] tracking-tight">Content</h1>
            <p className="text-[13px] text-[#9B91B5] mt-1">
              {CONTENT.length} pieces · {published} published · {drafts} drafts
            </p>
          </div>
          <button onClick={() => setUpload(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13.5px] font-semibold text-white transition-all"
            style={{ background:"#7C3AED", boxShadow:"0 4px 16px rgba(124,58,237,0.3)" }}>
            <PlusIcon /> Upload Content
          </button>
        </div>

        {/* ── Filters + bulk actions ── */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            {[
              { key:"all",       label:`All (${CONTENT.length})` },
              { key:"published", label:`Published (${published})` },
              { key:"draft",     label:`Drafts (${drafts})` },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setFilter(key)}
                className="px-4 py-2 rounded-full text-[12.5px] font-medium transition-all border"
                style={filter===key
                  ? { background:"#7C3AED", color:"white", borderColor:"#7C3AED", boxShadow:"0 3px 10px rgba(124,58,237,0.3)" }
                  : { background:"white",   color:"#6B5B9A", borderColor:"#DDD6FE" }
                }>{label}</button>
            ))}
          </div>

          {selected.length > 0 && (
            <div className="flex items-center gap-2.5">
              <span className="text-[13px] text-[#9B91B5]">{selected.length} selected</span>
              <button className="px-3.5 py-1.5 rounded-[8px] text-[12.5px] font-medium text-[#0D9488] bg-[#F0FDFA] border border-[#99F6E4] hover:opacity-80 transition-all">
                Publish
              </button>
              <button className="px-3.5 py-1.5 rounded-[8px] text-[12.5px] font-medium text-red-500 bg-red-50 border border-red-200 hover:opacity-80 transition-all">
                Delete
              </button>
            </div>
          )}
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-[#EDE9F6] overflow-hidden"
          style={{ boxShadow:"0 2px 12px rgba(124,58,237,0.06)" }}>

          {/* Column headers */}
          <div className="grid items-center gap-4 px-5 py-3.5 border-b border-[#F5F3FF]"
            style={{ gridTemplateColumns:"16px 36px 1fr 90px 70px 60px 100px 72px", background:"#FDFCFF" }}>
            <input type="checkbox" onChange={toggleAll}
              checked={selected.length === CONTENT.length && CONTENT.length > 0} />
            <span />
            {["Title","Plan","Views","Likes","Status","Actions"].map(h => (
              <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-[#C4B5FD]">{h}</span>
            ))}
          </div>

          {/* Rows */}
          {filtered.map(item => {
            const tCfg = TYPE_CONFIG[item.type]
            const pCfg = PLAN_CONFIG[item.plan]
            const pub  = item.status === "published"
            const isSel = selected.includes(item.id)

            return (
              <div key={item.id}
                className="group grid items-center gap-4 px-5 py-4 border-b border-[#F9F7FF] last:border-0 transition-colors"
                style={{
                  gridTemplateColumns:"16px 36px 1fr 90px 70px 60px 100px 72px",
                  background: isSel ? "#FDFCFF" : undefined
                }}
                onMouseEnter={e => { if (!isSel) e.currentTarget.style.background="#FDFCFF" }}
                onMouseLeave={e => { if (!isSel) e.currentTarget.style.background="transparent" }}>

                {/* Checkbox */}
                <input type="checkbox" checked={isSel} onChange={() => toggle(item.id)} />

                {/* Type pill */}
                <div className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center border text-[10.5px] font-bold"
                  style={{ color:tCfg.color, background:tCfg.bg, borderColor:tCfg.border }}>
                  {tCfg.label.slice(0,3).toUpperCase()}
                </div>

                {/* Title + meta */}
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold text-[#13111A] truncate leading-tight">{item.title}</p>
                  <p className="text-[11.5px] text-[#9B91B5] mt-0.5">{item.date} · {item.size}</p>
                </div>

                {/* Plan badge */}
                <span className="inline-flex items-center text-[11.5px] font-semibold px-2.5 py-1 rounded-full border w-fit"
                  style={{ color:pCfg.color, background:pCfg.bg, borderColor:pCfg.border }}>
                  {item.plan}
                </span>

                {/* Views */}
                <span className="text-[13px] text-[#9B91B5] tabular-nums">
                  {item.views > 0 ? item.views.toLocaleString() : "—"}
                </span>

                {/* Likes */}
                <span className="text-[13px] text-[#9B91B5] tabular-nums">
                  {item.likes > 0 ? item.likes : "—"}
                </span>

                {/* Status */}
                <span className={cn(
                  "inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1 rounded-full border w-fit",
                  pub
                    ? "text-[#0D9488] bg-[#F0FDFA] border-[#99F6E4]"
                    : "text-[#9B91B5] bg-[#F5F3FF] border-[#EDE9FE]"
                )}>
                  <span className={cn("w-1.5 h-1.5 rounded-full shrink-0",
                    pub ? "bg-[#2DD4BF]" : "bg-[#C4B5FD]")} />
                  {pub ? "Live" : "Draft"}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center text-[#9B91B5] border border-[#EDE9F6] bg-white hover:text-[#7C3AED] hover:border-[#DDD6FE] hover:bg-[#F5F3FF] transition-all"
                    title="Edit">
                    <EditIcon />
                  </button>
                  <button
                    className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center text-[#9B91B5] border border-[#EDE9F6] bg-white hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                    title="Delete">
                    <TrashIcon />
                  </button>
                </div>

              </div>
            )
          })}
        </div>

      </div>

      {showUpload && <UploadModal onClose={() => setUpload(false)} />}
    </>
  )
}