"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { tokenStorage } from "@/lib/apiClient"
import { onboardingApi } from "@/lib/api/Onboarding"

const BASE_URL = "https://subpay.onrender.com"

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
    const code = searchParams.get("code")

    // Scrub the code from the address bar immediately
    window.history.replaceState(null, "", "/callback")

    if (!code) {
      router.replace("/auth?error=oauth_failed")
      return
    }

    fetch(`${BASE_URL}/api/v1/auth/exchange-code?code=${code}`, {
      method: "POST",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("exchange_failed")
        const data = await res.json()
        tokenStorage.set(data.access_token, data.refresh_token)
        return onboardingApi.status()
      })
      .then((status) => {
        router.replace(status.is_onboarded ? "/feed" : "/onboarding")
      })
      .catch(() => {
        router.replace("/auth?error=oauth_failed")
      })
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
