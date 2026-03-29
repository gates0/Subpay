"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/hubora-ui"
import { useCompleteOnboarding, useCheckUsername, useOnboardingStatus } from "@/hooks/useOnboarding"
import { useResendVerification } from "@/hooks/useAuth"
import { useAuthMe } from "@/hooks/useAuth"
import { ApiError } from "@/lib/apiClient"

type Role = "member" | "creator"

// ─── Logo (shared between both screens) ──────────────────────────────────────
function Logo() {
  return (
    <div className="flex items-center gap-2 mb-10 justify-center">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "rgba(108,54,245,0.1)", boxShadow: "0 0 0 6px rgba(108,54,245,0.06)" }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1" y="1" width="6" height="6" rx="1.5" fill="#6C36F5" fillOpacity="0.9" />
          <rect x="9" y="1" width="6" height="6" rx="1.5" fill="#6C36F5" fillOpacity="0.9" />
          <rect x="1" y="9" width="6" height="6" rx="1.5" fill="#6C36F5" fillOpacity="0.9" />
          <rect x="11" y="11" width="2.5" height="2.5" rx="0.75" fill="#6C36F5" fillOpacity="0.5" />
          <rect x="13.5" y="13.5" width="2" height="2" rx="0.5" fill="#6C36F5" fillOpacity="0.3" />
        </svg>
      </div>
      <span style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: "clamp(18px, 1.6vw, 22px)",
        color: "#6C36F5",
        letterSpacing: "-0.02em",
      }}>
        Hubora
      </span>
    </div>
  )
}

// ─── Unverified wall ──────────────────────────────────────────────────────────
interface UnverifiedProps {
  email?: string
  onVerified: () => void
}

function UnverifiedWall({ email, onVerified }: UnverifiedProps) {
  const router = useRouter()
  const [resent, setResent] = useState(false)
  const { mutate: resend, isPending: resending } = useResendVerification()

  const handleResend = () => {
    if (!email) return
    resend(
      { email },
      { onSuccess: () => setResent(true) }
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "#F5F3FF" }}>
      <div className="w-full max-w-md">
        <Logo />
        <div
          className="bg-white rounded-3xl px-8 py-10 text-center"
          style={{ boxShadow: "0 8px 40px rgba(108,54,245,0.12), 0 0 0 1px rgba(108,54,245,0.08)" }}
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(108,54,245,0.08)" }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="3" y="7" width="22" height="16" rx="2.5" stroke="#6C36F5" strokeWidth="2" />
                <path d="M3 10l11 7 11-7" stroke="#6C36F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <h1 className="font-display font-bold text-[#0F0F14]" style={{ fontSize: "clamp(18px, 1.8vw, 22px)" }}>
            Verify your email first
          </h1>
          <p className="font-body mt-2 text-[#6B7280]" style={{ fontSize: "14px" }}>
            We sent a verification link to{" "}
            {email
              ? <span className="font-semibold text-[#0F0F14]">{email}</span>
              : "your email address"
            }. Click it to unlock this step.
          </p>

          <div className="mt-6 rounded-2xl px-5 py-4 text-left" style={{ background: "#F5F3FF" }}>
            <p className="font-body text-[#6B7280]" style={{ fontSize: "12px" }}>
              Can't find it? Check your spam folder. The link expires in 24 hours.
            </p>
          </div>

          <div className="mt-6">
            {resent ? (
              <p className="font-body text-[#10B981]" style={{ fontSize: "13px" }}>
                ✓ New link sent{email ? ` to ${email}` : ""}
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending || !email}
                className="font-body font-medium text-[#6C36F5] hover:underline underline-offset-2 disabled:opacity-50"
                style={{ fontSize: "13px" }}
              >
                {resending ? "Sending…" : "Resend verification email"}
              </button>
            )}
          </div>

          <Button
            type="button"
            variant="primary"
            fullWidth
            size="lg"
            className="rounded-2xl mt-6"
            onClick={() => { onVerified(); setResent(false) }}
          >
            I've verified my email
          </Button>

          <button
            onClick={() => router.push("/auth")}
            className="mt-4 font-body text-[#9CA3AF] hover:text-[#6C36F5] hover:underline underline-offset-2 text-sm transition-colors"
          >
            Back to sign in
          </button>
        </div>
      </div>
    </main>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter()

  const [username, setUsername]     = useState("")
  const [debouncedUsername, setDU]  = useState("")
  const [role, setRole]             = useState<Role>("member")
  const [error, setError]           = useState("")
  const [unverified, setUnverified] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Redirect if already onboarded
  const { data: status } = useOnboardingStatus()
  useEffect(() => {
    if (status?.is_onboarded) router.replace("/feed")
  }, [status, router])

  const { data: me } = useAuthMe()

  // Debounced username check — fires 400ms after the user stops typing
  const handleUsernameChange = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9_-]/g, "")
    setUsername(cleaned)
    setError("")
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDU(cleaned), 400)
  }

  const { data: usernameCheck, isFetching: checkingUsername } = useCheckUsername(debouncedUsername)
  const usernameAvailable   = usernameCheck?.available === true
  const usernameUnavailable = debouncedUsername.length >= 3 && usernameCheck?.available === false

  // Whether the check is still in-flight (typing or fetching)
  const usernameChecking = username !== debouncedUsername || checkingUsername

  const { mutateAsync: complete, isPending } = useCompleteOnboarding()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (username.length < 3) {
      setError("Username must be at least 3 characters.")
      return
    }
    if (usernameUnavailable) {
      setError("That username is already taken.")
      return
    }

    try {
      await complete({ username, role })
      router.push(role === "creator" ? "/creator_dashboard" : "/feed")
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setUnverified(true)
      } else {
        setError(err instanceof ApiError ? err.detail : "Something went wrong. Please try again.")
      }
    }
  }

  if (unverified) {
    return (
      <UnverifiedWall
        email={me?.email}
        onVerified={() => setUnverified(false)}
      />
    )
  }

  const submitDisabled =
    isPending ||
    usernameChecking ||
    usernameUnavailable ||
    username.length < 3

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "#F5F3FF" }}>
      <div className="w-full max-w-lg">
        <Logo />

        <div className="text-center mb-8">
          <h1
            className="font-display font-bold tracking-tight leading-tight"
            style={{ fontSize: "clamp(22px, 2.2vw, 30px)", color: "#0F0F14" }}
          >
            Set up your account
          </h1>
          <p className="font-body mt-2 leading-relaxed" style={{ fontSize: "clamp(13px, 1vw, 15px)", color: "#6B7280" }}>
            Just two things and you're in.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl overflow-hidden"
          style={{ boxShadow: "0 8px 40px rgba(108,54,245,0.12), 0 0 0 1px rgba(108,54,245,0.08)" }}
        >
          <div className="px-8 pt-8 pb-6 flex flex-col gap-6">

            {/* Username */}
            <div>
              <div className="relative">
                <Input
                  label="Choose a username"
                  type="text"
                  placeholder="e.g. adaeze"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUsernameChange(e.target.value)}
                  autoComplete="username"
                  disabled={isPending}
                />
                {/* Availability indicator — only show once debounced value is set */}
                {debouncedUsername.length >= 3 && (
                  <div className="absolute right-3 top-[38px] flex items-center gap-1.5">
                    {usernameChecking ? (
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="5.5" stroke="#D1D5DB" strokeWidth="2" />
                        <path d="M7 1.5a5.5 5.5 0 0 1 5.5 5.5" stroke="#6C36F5" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    ) : usernameAvailable ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6" fill="#10B981" fillOpacity="0.12" />
                          <path d="M4.5 7l1.8 1.8L9.5 5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-[#10B981]" style={{ fontSize: "11px" }}>Available</span>
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6" fill="#EF4444" fillOpacity="0.12" />
                          <path d="M5 5l4 4M9 5l-4 4" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span className="text-red-500" style={{ fontSize: "11px" }}>Taken</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <p className="mt-1.5 font-body" style={{ fontSize: "11px", color: "#9CA3AF" }}>
                Letters, numbers, hyphens and underscores only. Stored in lowercase.
              </p>
            </div>

            {/* Role */}
            <div>
              <p className="font-display font-semibold mb-3" style={{ fontSize: "13px", color: "#374151" }}>
                I want to join as a…
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(["member", "creator"] as Role[]).map(r => {
                  const isActive = role === r
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={cn(
                        "relative flex flex-col items-start gap-2 rounded-2xl border-2 p-4 text-left transition-all duration-200",
                        isActive ? "border-[#6C36F5] bg-[#F5F3FF]" : "border-[#F3F4F6] bg-white hover:border-[#DDD6FE]"
                      )}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: isActive ? "rgba(108,54,245,0.12)" : "#F9FAFB" }}
                      >
                        {r === "member" ? (
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M9 9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" fill={isActive ? "#6C36F5" : "#9CA3AF"} />
                            <path d="M2.5 16c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" stroke={isActive ? "#6C36F5" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <rect x="2" y="10" width="4" height="6" rx="1" fill={isActive ? "#6C36F5" : "#9CA3AF"} fillOpacity="0.5" />
                            <rect x="7" y="6" width="4" height="10" rx="1" fill={isActive ? "#6C36F5" : "#9CA3AF"} fillOpacity="0.75" />
                            <rect x="12" y="2" width="4" height="14" rx="1" fill={isActive ? "#6C36F5" : "#9CA3AF"} />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-display font-semibold capitalize" style={{ fontSize: "13px", color: isActive ? "#6C36F5" : "#111827" }}>
                          {r}
                        </p>
                        <p className="font-body mt-0.5 leading-relaxed" style={{ fontSize: "11px", color: "#6B7280" }}>
                          {r === "member"
                            ? "Discover and subscribe to creators"
                            : "Publish content and earn from fans"}
                        </p>
                      </div>
                      {isActive && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#6C36F5" }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.2 2.2L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
              {role === "creator" && (
                <p className="mt-2 font-body leading-relaxed" style={{ fontSize: "11px", color: "#6B7280" }}>
                  A hub will be created for you automatically. You can upgrade from member to creator later, but not the other way around.
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 font-body" style={{ fontSize: "12px" }}>
                {error}
              </p>
            )}
          </div>

          <div className="px-8 pb-8">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              className="rounded-2xl"
              disabled={submitDisabled}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <circle cx="7.5" cy="7.5" r="6" stroke="white" strokeOpacity="0.3" strokeWidth="2" />
                    <path d="M7.5 1.5a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Setting up your account…
                </span>
              ) : `Continue as ${role}`}
            </Button>
            <p className="text-center font-body mt-4" style={{ fontSize: "11px", color: "#9CA3AF" }}>
              This is a one-time setup. Your role choice is permanent.
            </p>
          </div>
        </form>
      </div>
    </main>
  )
}