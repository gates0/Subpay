"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/hubora-ui"
import { cn } from "@/lib/utils"
import GridMotion from "@/components/ui/grid-motion"

type Tab = "register" | "login"
type Role = "member" | "creator"

const AUTH_IMAGES = Array.from({ length: 28 }, (_, i) => `/authclips/auth${i + 1}.jpeg`)

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>("register")
  const [role, setRole] = useState<Role>("member")

  return (
    <main className="min-h-screen flex">

      {/* ── LEFT — Form (purple bg) ── */}
      <div className="w-full lg:w-[480px] xl:w-[520px] shrink-0 bg-#F5F3FF flex flex-col justify-center px-18 py-5 overflow-y-auto">
        <div className="w-full max-w-[380px] mx-auto animate-fade-up">

          {/* Logo */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "rgba(255,255,255,0.15)",
              boxShadow: "0 0 0 6px rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.2)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="#6C36F5" fillOpacity="0.9" />
              <rect x="9" y="1" width="6" height="6" rx="1.5" fill="#6C36F5" fillOpacity="0.9" />
              <rect x="1" y="9" width="6" height="6" rx="1.5" fill="#6C36F5" fillOpacity="0.9" />
              <rect x="11" y="11" width="2.5" height="2.5" rx="0.75" fill="#6C36F5" fillOpacity="0.5" />
              <rect x="13.5" y="13.5" width="2" height="2" rx="0.5" fill="#6C36F5" fillOpacity="0.3" />
            </svg>
          </div>
          {/* Wordmark */}
          <span style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 22,
            color: "#6C36F5",
            letterSpacing: "-0.02em",
          }}>
            Hubora
          </span>

          <h1 className="font-display text-[26px] font-bold tracking-tight text-white leading-tight">
            {tab === "register" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="font-body text-[14px] mt-2 leading-relaxed text-color-[#2D0052]">
            {tab === "register"
              ? "Join thousands of creators and fans on Hubora."
              : "Good to see you again. Sign in to continue."}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)" }}>

          {/* ── Tabs — with pizzazz ── */}
          <div className="grid grid-cols-2 p-2 gap-1.5" style={{ background: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)" }}>
            {(["register", "login"] as Tab[]).map((t) => {
              const isActive = tab === t
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "relative py-3 rounded-2xl font-display font-semibold text-[13px] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden",
                    isActive
                      ? "text-white shadow-lg scale-[1.01]"
                      : "text-[#9B8EC4] hover:text-[#6C36F5] hover:bg-white/50"
                  )}
                  style={isActive ? {
                    background: "linear-gradient(135deg, #7C3AED 0%, #6C36F5 50%, #8B5CF6 100%)",
                    boxShadow: "0 4px 16px rgba(108,54,245,0.45), 0 1px 0 rgba(255,255,255,0.15) inset",
                  } : {}}
                >
                  {/* Shimmer on active tab */}
                  {isActive && (
                    <span
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
                        animation: "shimmer 2.4s ease-in-out infinite",
                      }}
                    />
                  )}

                  {/* Icon */}
                  {t === "register" ? (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="currentColor" fillOpacity={isActive ? 0.9 : 0.6} />
                      <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity={isActive ? 0.9 : 0.6} />
                      <path d="M12 5v4M10 7h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity={isActive ? 1 : 0.5} />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
                      <rect x="2" y="5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity={isActive ? 0.9 : 0.6} />
                      <path d="M5 5V4a3 3 0 1 1 6 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity={isActive ? 0.9 : 0.6} />
                      <circle cx="8" cy="9.5" r="1" fill="currentColor" fillOpacity={isActive ? 0.9 : 0.5} />
                    </svg>
                  )}

                  {t === "register" ? "Create Account" : "Sign In"}
                </button>
              )
            })}
          </div>

          {/* Form body — more breathing room */}
          <div className="px-8 py-7">
            {tab === "register"
              ? <RegisterForm role={role} setRole={setRole} />
              : <LoginForm />
            }
          </div>
        </div>

        {/* Footer */}
        <p className="text-center font-body text-[13px] mt-5 text-[#2D0052]" >
          {tab === "register" ? (
            <>Already have an account?{" "}
              <button onClick={() => setTab("login")} className="font-semibold hover:underline underline-offset-2" style={{ color: "white" }}>
                Sign in
              </button>
            </>
          ) : (
            <>Don&apos;t have an account?{" "}
              <button onClick={() => setTab("register")} className="font-semibold hover:underline underline-offset-2" style={{ color: "white" }}>
                Sign up free
              </button>
            </>
          )}
        </p>
      </div>

      {/* ── RIGHT — GridMotion (lavender bg) ── */}
      <div className="hidden lg:block flex-1 relative bg-[#F5F3FF] overflow-hidden">

        {/* Creator social proof badge */}
        <div className="absolute bottom-10 left-10 z-20">
          <div className="bg-white/80 backdrop-blur-md border border-[#E5E0FF] rounded-2xl px-5 py-4 max-w-[260px]" style={{ boxShadow: "0 4px 24px rgba(108,54,245,0.12)" }}>
            <p className="font-display font-bold text-[#0F0F14] text-[15px] leading-snug mb-1">
              Built for creators.
            </p>
            <p className="font-body text-[#6C36F5] text-[13px] leading-relaxed text-color-[#2D0052]">
              Join 14,000+ creators earning on their own terms.
            </p>
          </div>
        </div>

        {/* Left edge fade into form panel */}
        <div
          className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #F5F3FF, transparent)" }}
        />

        <GridMotion items={AUTH_IMAGES} gradientColor="#C4B5FD" />
      </div>

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          60%  { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

    </main>
  )
}

/* ─────────────────────────────────────────
   REGISTER FORM
───────────────────────────────────────── */
function RegisterForm({ role, setRole }: { role: Role; setRole: (r: Role) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <Input label="First Name" type="text" placeholder="Ada" />
        <Input label="Last Name"  type="text" placeholder="Okonkwo" />
      </div>
      <Input label="Email Address" type="email"    placeholder="ada@email.com" />
      <Input label="Password"      type="password" placeholder="Min. 8 characters" />

      <Button variant="primary" fullWidth size="lg" className="mt-2 rounded-2xl">
        Create Account
      </Button>

      <p className="text-center font-body text-[12px] text-[#9CA3AF] leading-relaxed">
        By signing up you agree to our{" "}
        <a href="#" className="text-[#6C36F5] hover:underline underline-offset-2">Terms</a>
        {" "}and{" "}
        <a href="#" className="text-[#6C36F5] hover:underline underline-offset-2">Privacy Policy</a>
      </p>
    </div>
  )
}

/* ─────────────────────────────────────────
   LOGIN FORM
───────────────────────────────────────── */
function LoginForm() {
  return (
    <div className="flex flex-col gap-5">
      <Input label="Email Address" type="email"    placeholder="you@email.com" />

      <div>
        <Input label="Password" type="password" placeholder="Your password" />
        <div className="flex justify-end mt-2">
          <a href="#" className="font-body text-[12px] text-[#6C36F5] font-medium hover:underline underline-offset-2">
            Forgot password?
          </a>
        </div>
      </div>

      <Button variant="primary" fullWidth size="lg" className="rounded-2xl">
        Sign In
      </Button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#F3F4F6]" />
        <span className="font-body text-[12px] text-[#D1D5DB]">or</span>
        <div className="flex-1 h-px bg-[#F3F4F6]" />
      </div>

      <Button variant="outline" fullWidth size="lg" className="rounded-2xl">
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </Button>
    </div>
  )
}