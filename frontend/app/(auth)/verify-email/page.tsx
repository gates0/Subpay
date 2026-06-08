"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyEmail, useResendVerification } from "@/hooks/useAuth";
import { ApiError } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";

function VerifyEmailPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email") ?? "";

  const [status, setStatus] = useState<
    "pending" | "verifying" | "success" | "error"
  >(token ? "verifying" : "pending");
  const [errorMsg, setErrorMsg] = useState("");
  const [resent, setResent] = useState(false);

  const verifyEmail = useVerifyEmail();
  const resend = useResendVerification();

  // Auto-verify if token is in the URL
  useEffect(() => {
    if (!token) return;

    verifyEmail.mutate(token, {
      onSuccess: (data) => {
        document.cookie = `hubora_session=${data.access_token}; path=/; max-age=${60 * 15}; SameSite=Lax`;
        setStatus("success");
        setTimeout(
          () => router.push(data.is_onboarded ? "/feed" : "/onboarding"),
          2000,
        );
      },
      onError: (err) => {
        setStatus("error");
        setErrorMsg(
          err instanceof ApiError
            ? err.detail
            : "Verification failed. The link may have expired.",
        );
      },
    });
  }, [token]);

  async function handleResend() {
    if (!email) return;
    try {
      await resend.mutateAsync({ email });
      setResent(true);
    } catch (err) {
      setErrorMsg(
        err instanceof ApiError
          ? err.detail
          : "Failed to resend. Please try again.",
      );
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "#F5F3FF" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "rgba(108,54,245,0.1)",
              boxShadow: "0 0 0 6px rgba(108,54,245,0.06)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect
                x="1"
                y="1"
                width="6"
                height="6"
                rx="1.5"
                fill="#6C36F5"
                fillOpacity="0.9"
              />
              <rect
                x="9"
                y="1"
                width="6"
                height="6"
                rx="1.5"
                fill="#6C36F5"
                fillOpacity="0.9"
              />
              <rect
                x="1"
                y="9"
                width="6"
                height="6"
                rx="1.5"
                fill="#6C36F5"
                fillOpacity="0.9"
              />
              <rect
                x="11"
                y="11"
                width="2.5"
                height="2.5"
                rx="0.75"
                fill="#6C36F5"
                fillOpacity="0.5"
              />
              <rect
                x="13.5"
                y="13.5"
                width="2"
                height="2"
                rx="0.5"
                fill="#6C36F5"
                fillOpacity="0.3"
              />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(18px, 1.6vw, 22px)",
              color: "#6C36F5",
              letterSpacing: "-0.02em",
            }}
          >
            Hubora
          </span>
        </div>

        <div
          className="bg-white rounded-3xl px-8 py-10 text-center"
          style={{
            boxShadow:
              "0 8px 40px rgba(108,54,245,0.12), 0 0 0 1px rgba(108,54,245,0.08)",
          }}
        >
          {/* ── VERIFYING ── */}
          {status === "verifying" && (
            <>
              <div className="flex justify-center mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(108,54,245,0.08)" }}
                >
                  <svg
                    className="animate-spin"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                  >
                    <circle
                      cx="14"
                      cy="14"
                      r="11"
                      stroke="#DDD6FE"
                      strokeWidth="3"
                    />
                    <path
                      d="M14 3a11 11 0 0 1 11 11"
                      stroke="#6C36F5"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              <h1
                className="font-display font-bold text-[#0F0F14]"
                style={{ fontSize: "clamp(18px, 1.8vw, 22px)" }}
              >
                Verifying your email…
              </h1>
              <p
                className="font-body mt-2 text-[#6B7280]"
                style={{ fontSize: "14px" }}
              >
                Just a moment.
              </p>
            </>
          )}

          {/* ── SUCCESS ── */}
          {status === "success" && (
            <>
              <div className="flex justify-center mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(16,185,129,0.08)" }}
                >
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle
                      cx="14"
                      cy="14"
                      r="12"
                      fill="#10B981"
                      fillOpacity="0.12"
                    />
                    <path
                      d="M8 14l4.5 4.5L20 9"
                      stroke="#10B981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <h1
                className="font-display font-bold text-[#0F0F14]"
                style={{ fontSize: "clamp(18px, 1.8vw, 22px)" }}
              >
                Email verified!
              </h1>
              <p
                className="font-body mt-2 text-[#6B7280]"
                style={{ fontSize: "14px" }}
              >
                Redirecting you to finish setup…
              </p>
            </>
          )}

          {/* ── ERROR ── */}
          {status === "error" && (
            <>
              <div className="flex justify-center mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(239,68,68,0.08)" }}
                >
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle
                      cx="14"
                      cy="14"
                      r="12"
                      fill="#EF4444"
                      fillOpacity="0.12"
                    />
                    <path
                      d="M10 10l8 8M18 10l-8 8"
                      stroke="#EF4444"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              <h1
                className="font-display font-bold text-[#0F0F14]"
                style={{ fontSize: "clamp(18px, 1.8vw, 22px)" }}
              >
                Link expired
              </h1>
              <p
                className="font-body mt-2 text-[#6B7280]"
                style={{ fontSize: "14px" }}
              >
                {errorMsg}
              </p>
              {email && (
                <Button
                  type="button"
                  variant="primary"
                  fullWidth
                  size="lg"
                  className="rounded-2xl mt-6"
                  disabled={resend.isPending || resent}
                  onClick={handleResend}
                >
                  {resend.isPending
                    ? "Sending…"
                    : resent
                      ? "Email sent!"
                      : "Resend verification email"}
                </Button>
              )}
              <button
                onClick={() => router.push("/auth")}
                className="mt-4 font-body text-[#6C36F5] hover:underline underline-offset-2 text-sm"
              >
                Back to sign in
              </button>
            </>
          )}

          {/* ── PENDING — check your email ── */}
          {status === "pending" && (
            <>
              <div className="flex justify-center mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(108,54,245,0.08)" }}
                >
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect
                      x="3"
                      y="7"
                      width="22"
                      height="16"
                      rx="2.5"
                      stroke="#6C36F5"
                      strokeWidth="2"
                    />
                    <path
                      d="M3 10l11 7 11-7"
                      stroke="#6C36F5"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <h1
                className="font-display font-bold text-[#0F0F14]"
                style={{ fontSize: "clamp(18px, 1.8vw, 22px)" }}
              >
                Check your inbox
              </h1>
              <p
                className="font-body mt-2 text-[#6B7280]"
                style={{ fontSize: "14px" }}
              >
                We sent a verification link to{" "}
                {email ? (
                  <span className="font-semibold text-[#0F0F14]">{email}</span>
                ) : (
                  "your email address"
                )}
                . Click the link to continue.
              </p>

              <div
                className="mt-6 rounded-2xl px-5 py-4 text-left"
                style={{ background: "#F5F3FF" }}
              >
                <p
                  className="font-body text-[#6B7280]"
                  style={{ fontSize: "12px" }}
                >
                  Can't find it? Check your spam folder. The link expires in 24
                  hours.
                </p>
              </div>

              {email && (
                <div className="mt-6">
                  {resent ? (
                    <p
                      className="font-body text-[#10B981]"
                      style={{ fontSize: "13px" }}
                    >
                      ✓ New link sent to {email}
                    </p>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={resend.isPending}
                      className="font-body font-medium text-[#6C36F5] hover:underline underline-offset-2 disabled:opacity-50"
                      style={{ fontSize: "13px" }}
                    >
                      {resend.isPending ? "Sending…" : "Resend email"}
                    </button>
                  )}
                </div>
              )}

              <button
                onClick={() => router.push("/auth")}
                className="mt-6 font-body text-[#9CA3AF] hover:text-[#6C36F5] hover:underline underline-offset-2 text-sm transition-colors"
              >
                Back to sign in
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailPageInner />
    </Suspense>
  );
}
