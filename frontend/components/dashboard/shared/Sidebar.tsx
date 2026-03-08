"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

const cn = (...classes) => classes.filter(Boolean).join(" ")

// ── Icons ─────────────────────────────────────────────
const Icon = {
  hub:         (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6.5"/><circle cx="8" cy="8" r="2.5"/><path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3"/></svg>),
  grid:        (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1.5" y="1.5" width="5" height="5" rx="1.2"/><rect x="9.5" y="1.5" width="5" height="5" rx="1.2"/><rect x="1.5" y="9.5" width="5" height="5" rx="1.2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1.2"/></svg>),
  content:     (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="12" height="12" rx="2"/><path d="M4 6h8M4 9h5"/></svg>),
  plans:       (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1.5" y="4" width="13" height="9" rx="1.5"/><path d="M4.5 4V3a2 2 0 0 1 4 0v1"/><circle cx="8" cy="8.5" r="1" fill="currentColor" stroke="none"/></svg>),
  subscribers: (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="5" r="2.5"/><path d="M1.5 13c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4"/><path d="M11 7.5c1.5.5 2.5 1.8 2.5 3.5" strokeLinecap="round"/><path d="M12 4a2 2 0 1 1 0 .01" strokeLinecap="round"/></svg>),
  earnings:    (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1.5v13M5 4.5c0-1 1.3-1.5 3-1.5s3 .5 3 1.5-1.3 1.5-3 1.5-3 .5-3 1.5 1.3 1.5 3 1.5 3-.5 3-1.5"/></svg>),
  bell:        (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1.5a5 5 0 0 1 5 5c0 3 1.5 4.5 1.5 4.5H1.5S3 9.5 3 6.5a5 5 0 0 1 5-5Z"/><path d="M6.5 13a1.5 1.5 0 0 0 3 0"/></svg>),
  settings:    (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="2.2"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.8 2.8l1.4 1.4M11.8 11.8l1.4 1.4M2.8 13.2l1.4-1.4M11.8 4.2l1.4-1.4"/></svg>),
  feed:        (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h12M2 8h8M2 12h5"/></svg>),
  explore:     (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6.5"/><path d="M10.5 5.5 9 9l-3.5 1.5L7 7l3.5-1.5Z"/></svg>),
  community:   (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="5" cy="5" r="2"/><circle cx="11" cy="5" r="2"/><circle cx="8" cy="11" r="2"/><path d="M7 5h2M6.5 9.5l-1.5-2.5M9.5 9.5l1.5-2.5"/></svg>),
  bookmark:    (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3.5 2h9a1 1 0 0 1 1 1v11l-4.5-3L4.5 14V3a1 1 0 0 0-1-1Z" strokeLinejoin="round"/></svg>),
  chevDown:    (<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  logout:      (<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5.5 13H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h2.5"/><path d="M10 10.5 13 7.5 10 4.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M13 7.5H6" strokeLinecap="round"/></svg>),
  switch:      (<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 5h11M10 2l3 3-3 3"/><path d="M13 10H2M5 7l-3 3 3 3"/></svg>),
  hubCreate:   (<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7.5" cy="7.5" r="6"/><path d="M7.5 4.5v6M4.5 7.5h6" strokeLinecap="round"/></svg>),
  menu:        (<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 4.5h14M2 9h14M2 13.5h14" strokeLinecap="round"/></svg>),
}

// ── Nav data ───────────────────────────────────────────
//
//  href values match your actual file structure:
//    /feed              → app/(authenticated)/feed/page.tsx
//    /creator_dashboard → app/(authenticated)/creator_dashboard/page.tsx
//
const NAV_DISCOVER = [
  { key: "feed",        label: "Feed",          icon: Icon.feed,      href: "/feed" },
  { key: "explore",     label: "Explore",        icon: Icon.explore,   href: "/explore" },
  { key: "communities", label: "Communities",    icon: Icon.community, href: "/communities" },
  { key: "saved",       label: "Saved",          icon: Icon.bookmark,  href: "/saved" },
  { key: "notifs",      label: "Notifications",  icon: Icon.bell,      href: "/notifications", badge: 4 },
]

const NAV_CREATOR = [
  { key: "dashboard",   label: "Dashboard",    icon: Icon.grid,        href: "/creator_dashboard" },
  { key: "hub",         label: "My Hub",        icon: Icon.hub,         href: "/hub" },
  { key: "content",     label: "Content",       icon: Icon.content,     href: "/content" },
  { key: "plans",       label: "Plans",         icon: Icon.plans,       href: "/plans" },
  { key: "subscribers", label: "Subscribers",   icon: Icon.subscribers, href: "/subscribers" },
  { key: "earnings",    label: "Earnings",      icon: Icon.earnings,    href: "/earnings" },
]

// ── Nav item ───────────────────────────────────────────
function NavItem({ item, isActive, onNavigate }) {
  return (
    <button
      onClick={() => onNavigate(item.href)}
      className={cn(
        "flex items-center gap-2.5 px-2.5 py-2.5 rounded-[10px] text-[13.5px] font-medium w-full text-left transition-all duration-150 relative",
        isActive
          ? "bg-[#F3E8FF] text-[#8A2BE2] font-semibold"
          : "text-[#6B4F8A] hover:bg-[#F5EFFF] hover:text-[#8A2BE2]"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-[#8A2BE2] rounded-r-full" />
      )}
      <span className={cn("transition-opacity", isActive ? "opacity-100" : "opacity-60")}>
        {item.icon}
      </span>
      {item.label}
      {item.badge && (
        <span className="ml-auto bg-[#8A2BE2] text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
          {item.badge}
        </span>
      )}
    </button>
  )
}

// ── Creator Hub accordion ──────────────────────────────
function CreatorHubDropdown({ pathname, onNavigate }) {
  const isCreatorActive = NAV_CREATOR.some(i => pathname.startsWith(i.href))
  // Auto-open the drawer when the user is on a creator page
  const [open, setOpen] = useState(isCreatorActive)

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "flex items-center gap-2.5 px-2.5 py-2.5 rounded-[10px] text-[13.5px] font-medium w-full text-left transition-all duration-150 relative",
          isCreatorActive
            ? "bg-[#F3E8FF] text-[#8A2BE2] font-semibold"
            : "text-[#6B4F8A] hover:bg-[#F5EFFF] hover:text-[#8A2BE2]"
        )}
      >
        {isCreatorActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-[#8A2BE2] rounded-r-full" />
        )}
        <span className={cn("transition-opacity", isCreatorActive ? "opacity-100" : "opacity-60")}>
          {Icon.hub}
        </span>
        Creator Hub
        <span className={cn("ml-auto text-[#A08DBE] transition-transform duration-200", open && "rotate-180")}>
          {Icon.chevDown}
        </span>
      </button>

      <div className={cn(
        "overflow-hidden transition-all duration-200",
        open ? "max-h-[400px] opacity-100 mt-0.5" : "max-h-0 opacity-0"
      )}>
        <div className="ml-3 pl-3 border-l-2 border-[#EDE5F8] flex flex-col gap-0.5 py-1">
          {NAV_CREATOR.map(item => {
            const isActive = pathname.startsWith(item.href)
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.href)}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-[9px] text-[13px] font-medium w-full text-left transition-all duration-150",
                  isActive
                    ? "bg-[#F3E8FF] text-[#8A2BE2] font-semibold"
                    : "text-[#6B4F8A] hover:bg-[#F5EFFF] hover:text-[#8A2BE2]"
                )}
              >
                <span className={cn("transition-opacity", isActive ? "opacity-100" : "opacity-50")}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Profile Popover ────────────────────────────────────
function ProfilePopover({ onClose }) {
  const router = useRouter()
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [onClose])

  function handleLogout() {
    // Clear the session cookie then redirect to /auth
    document.cookie = "hubora_session=; path=/; max-age=0; SameSite=Lax"
    router.push("/auth")
    router.refresh()
  }

  return (
    <div
      ref={ref}
      className="absolute bottom-[calc(100%+8px)] left-3 right-3 z-50 bg-white rounded-2xl border border-[#EDE5F8] overflow-hidden"
      style={{ boxShadow: "0 8px 30px rgba(45,0,82,0.14), 0 0 0 1px rgba(138,43,226,0.08)" }}
    >
      {/* Profile header */}
      <div className="px-4 py-3.5 border-b border-[#F5EFFF]">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-[12px] flex items-center justify-center text-white text-[16px] font-bold shrink-0"
            style={{ background: "linear-gradient(135deg, #8A2BE2 0%, #C084FC 100%)" }}
          >L</div>
          <div>
            <p className="text-[13.5px] font-bold text-[#2D0052]">ArtByLola</p>
            <p className="text-[11px] text-[#A08DBE]">lola@artbylola.co</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="py-1.5">
        {[
          { icon: Icon.hubCreate, label: "Create your Hub", accent: true,  href: "/hub/create" },
          { icon: Icon.switch,    label: "Switch Account",  accent: false,  href: "/auth" },
          { icon: Icon.settings,  label: "Settings",        accent: false,  href: "/settings" },
        ].map(({ icon, label, accent, href }) => (
          <button
            key={label}
            onClick={() => { router.push(href); onClose() }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors text-left",
              accent ? "text-[#8A2BE2] hover:bg-[#F5EFFF]" : "text-[#4B3472] hover:bg-[#F5EFFF]"
            )}
          >
            <span className={accent ? "text-[#8A2BE2]" : "text-[#A08DBE]"}>{icon}</span>
            {label}
          </button>
        ))}
        <div className="mx-3 my-1 h-px bg-[#F5EFFF]" />
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
        >
          <span className="text-red-400">{Icon.logout}</span>
          Log out
        </button>
      </div>
    </div>
  )
}

// ── Sidebar ────────────────────────────────────────────
export default function AppSidebar({ open, onClose }) {
  const router = useRouter()
  const pathname = usePathname()
  const [profileOpen, setProfileOpen] = useState(false)

  function navigate(href) {
    router.push(href)
    onClose?.()  // close mobile drawer after tapping a link
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-[#2D0052]/20 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed lg:sticky top-0 left-0 h-screen w-[240px] shrink-0 z-50",
        "bg-white border-r border-[#EDE5F8] flex flex-col transition-transform duration-300",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>

        {/* Logo — clicking always goes to feed */}
        <div
          className="flex items-center gap-2.5 px-5 py-[18px] border-b border-[#F5EFFF] cursor-pointer"
          onClick={() => navigate("/feed")}
        >
          <div
            className="w-8 h-8 rounded-[10px] bg-[#8A2BE2] flex items-center justify-center shrink-0"
            style={{ boxShadow: "0 3px 10px rgba(138,43,226,0.3)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="5.5" height="5.5" rx="1.5" fill="white" fillOpacity="0.9"/>
              <rect x="8" y="1" width="5.5" height="5.5" rx="1.5" fill="white" fillOpacity="0.9"/>
              <rect x="1" y="8" width="5.5" height="5.5" rx="1.5" fill="white" fillOpacity="0.9"/>
              <rect x="9.5" y="9.5" width="2.5" height="2.5" rx="0.75" fill="white" fillOpacity="0.5"/>
              <rect x="12" y="12" width="1.8" height="1.8" rx="0.5" fill="white" fillOpacity="0.3"/>
            </svg>
          </div>
          <span style={{ fontSize: 20, color: "#2D0052" }}>Hubora</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 flex flex-col gap-0.5">
          {NAV_DISCOVER.map(item => (
            <NavItem
              key={item.key}
              item={item}
              isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
              onNavigate={navigate}
            />
          ))}
          <CreatorHubDropdown pathname={pathname} onNavigate={navigate} />
        </nav>

        {/* Profile pill */}
        <div className="px-4 py-4 border-t border-[#F5EFFF] relative">
          {profileOpen && <ProfilePopover onClose={() => setProfileOpen(false)} />}

          <button
            onClick={() => setProfileOpen(p => !p)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-full border transition-all duration-150",
              profileOpen
                ? "bg-[#F3E8FF] border-[#D8B4FE]"
                : "bg-[#FAF7FF] border-[#EDE5F8] hover:bg-[#F3E8FF] hover:border-[#D8B4FE]"
            )}
            style={{ boxShadow: profileOpen ? "0 0 0 3px rgba(138,43,226,0.08)" : "0 1px 2px rgba(45,0,82,0.06)" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-[13px] font-bold"
              style={{ background: "linear-gradient(135deg, #8A2BE2 0%, #C084FC 100%)" }}
            >L</div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-[12.5px] font-semibold text-[#2D0052] truncate leading-tight">ArtByLola</p>
              <p className="text-[10.5px] text-[#A08DBE] leading-tight mt-[1px]">Creator</p>
            </div>
            <span className={cn(
              "text-[#C4A8E0] transition-transform duration-200 shrink-0",
              profileOpen && "rotate-180"
            )}>
              {Icon.chevDown}
            </span>
          </button>
        </div>

      </aside>
    </>
  )
}