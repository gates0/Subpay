"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { tokenStorage } from "@/lib/apiClient"

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F5F3FF" }}>
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#C4B5FD" strokeWidth="3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#6C36F5" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <p style={{ color: "#6C36F5", fontFamily: "sans-serif", fontSize: 14 }}>
          Signing you in…
        </p>
      </div>
    </div>
  )
}

function CallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const accessToken = searchParams.get("access_token")
    const refreshToken = searchParams.get("refresh_token")
    const isOnboarded = searchParams.get("is_onboarded") === "true"

    if (!accessToken || !refreshToken) {
      router.replace("/auth?error=oauth_failed")
      return
    }

    tokenStorage.set(accessToken, refreshToken)
    document.cookie = `hubora_session=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    router.replace(isOnboarded ? "/feed" : "/onboarding")
  }, [router, searchParams])

  return <Spinner />
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <CallbackInner />
    </Suspense>
  )
}
