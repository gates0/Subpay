"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/hubora-ui";
import { cn } from "@/lib/utils";
import GridMotion from "@/components/ui/grid-motion";
import { useRegister, useLogin } from "@/hooks/useAuth";
import { authApi } from "@/lib/api/Auth";
import { tokenStorage, ApiError } from "@/lib/apiClient";

type Tab = "register" | "login";
type Role = "member" | "creator";

const AUTH_IMAGES = Array.from(
  { length: 28 },
  (_, i) => `/authclips/auth${i + 1}.jpeg`,
);

/** Safely extract a human-readable message from an ApiError's detail field,
 *  which may be a string OR a FastAPI validation-error array. */
function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    const detail: unknown = err.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail))
      return detail.map((e: any) => e.msg).join(", ");
  }
  return fallback;
}

function AuthPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/feed";

  const [tab, setTab] = useState<Tab>("register");
  const [role, setRole] = useState<Role>("member");

  async function handleSuccess(isOnboarded: boolean) {
    await router.push(isOnboarded ? next : "/onboarding");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex">
      <div
        className="
          w-full
          lg:w-[42%] xl:w-[38%] 2xl:w-[32%]
          min-w-0 lg:min-w-[360px]
          max-w-full lg:max-w-[560px]
          shrink-0
          flex flex-col justify-center
          px-[6%] sm:px-[8%] lg:px-[5%] xl:px-[6%]
          py-[4vh]
          overflow-y-auto
        "
        style={{ background: "#F5F3FF" }}
      >
        <div className="w-full max-w-[90%] sm:max-w-[80%] lg:max-w-[88%] xl:max-w-[85%] mx-auto animate-fade-up">
          <div className="flex items-center gap-2 mb-[3vh]">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "rgba(255,255,255,0.15)",
                boxShadow:
                  "0 0 0 6px rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.2)",
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

          <h1
            className="font-display font-bold tracking-tight text-white leading-tight"
            style={{ fontSize: "clamp(20px, 2vw, 26px)" }}
          >
            {tab === "register" ? "Create your account" : "Welcome back"}
          </h1>
          <p
            className="font-body mt-[1vh] leading-relaxed"
            style={{ fontSize: "clamp(12px, 1vw, 14px)", color: "#2D0052" }}
          >
            {tab === "register"
              ? "Join thousands of creators and fans on Hubora."
              : "Good to see you again. Sign in to continue."}
          </p>
        </div>

        <div
          className="w-full max-w-[90%] sm:max-w-[80%] lg:max-w-[88%] xl:max-w-[85%] mx-auto mt-[2vh] bg-white rounded-3xl overflow-hidden"
          style={{
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)",
          }}
        >
          <div
            className="grid grid-cols-2 p-2 gap-1.5"
            style={{
              background: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
            }}
          >
            {(["register", "login"] as Tab[]).map((t) => {
              const isActive = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "relative py-[2.5%] rounded-2xl font-display font-semibold transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden",
                    isActive
                      ? "text-white shadow-lg scale-[1.01]"
                      : "text-[#9B8EC4] hover:text-[#6C36F5] hover:bg-white/50",
                  )}
                  style={{
                    fontSize: "clamp(11px, 0.9vw, 13px)",
                    paddingTop: "clamp(8px, 1.2vh, 14px)",
                    paddingBottom: "clamp(8px, 1.2vh, 14px)",
                    ...(isActive
                      ? {
                          background:
                            "linear-gradient(135deg, #7C3AED 0%, #6C36F5 50%, #8B5CF6 100%)",
                          boxShadow:
                            "0 4px 16px rgba(108,54,245,0.45), 0 1px 0 rgba(255,255,255,0.15) inset",
                        }
                      : {}),
                  }}
                >
                  {isActive && (
                    <span
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
                        animation: "shimmer 2.4s ease-in-out infinite",
                      }}
                    />
                  )}
                  {t === "register" ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="shrink-0"
                    >
                      <path
                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                        fill="currentColor"
                        fillOpacity={isActive ? 0.9 : 0.6}
                      />
                      <path
                        d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeOpacity={isActive ? 0.9 : 0.6}
                      />
                      <path
                        d="M12 5v4M10 7h4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeOpacity={isActive ? 1 : 0.5}
                      />
                    </svg>
                  ) : (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="shrink-0"
                    >
                      <rect
                        x="2"
                        y="5"
                        width="12"
                        height="9"
                        rx="1.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeOpacity={isActive ? 0.9 : 0.6}
                      />
                      <path
                        d="M5 5V4a3 3 0 1 1 6 0v1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeOpacity={isActive ? 0.9 : 0.6}
                      />
                      <circle
                        cx="8"
                        cy="9.5"
                        r="1"
                        fill="currentColor"
                        fillOpacity={isActive ? 0.9 : 0.5}
                      />
                    </svg>
                  )}
                  {t === "register" ? "Create Account" : "Sign In"}
                </button>
              );
            })}
          </div>

          <div
            className="px-[6%] sm:px-[8%]"
            style={{
              paddingTop: "clamp(20px, 3vh, 32px)",
              paddingBottom: "clamp(20px, 3vh, 32px)",
            }}
          >
            {tab === "register" ? (
              <RegisterForm
                role={role}
                setRole={setRole}
                onSuccess={handleSuccess}
              />
            ) : (
              <LoginForm onSuccess={handleSuccess} />
            )}
          </div>
        </div>

        <p
          className="w-full max-w-[90%] sm:max-w-[80%] lg:max-w-[88%] xl:max-w-[85%] mx-auto text-center font-body mt-[2vh]"
          style={{ fontSize: "clamp(11px, 0.9vw, 13px)", color: "#2D0052" }}
        >
          {tab === "register" ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setTab("login")}
                className="font-semibold hover:underline underline-offset-2"
                style={{ color: "white" }}
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setTab("register")}
                className="font-semibold hover:underline hover:cursor-pointer underline-offset-2"
                style={{ color: "purple" }}
              >
                Sign up free
              </button>
            </>
          )}
        </p>
      </div>

      <div className="hidden lg:block flex-1 relative bg-[#F5F3FF] overflow-hidden">
        <div className="absolute z-20" style={{ bottom: "4%", left: "4%" }}>
          <div
            className="bg-white/80 backdrop-blur-md border border-[#E5E0FF] rounded-2xl max-w-[260px]"
            style={{
              padding: "clamp(12px, 2%, 20px) clamp(14px, 2.5%, 24px)",
              boxShadow: "0 4px 24px rgba(108,54,245,0.12)",
            }}
          >
            <p
              className="font-display font-bold text-[#0F0F14] leading-snug mb-1"
              style={{ fontSize: "clamp(13px, 1.1vw, 15px)" }}
            >
              Built for creators.
            </p>
            <p
              className="font-body leading-relaxed"
              style={{ fontSize: "clamp(11px, 0.9vw, 13px)", color: "#6C36F5" }}
            >
              Join 14,000+ creators earning on their own terms.
            </p>
          </div>
        </div>
        <div
          className="absolute inset-y-0 left-0 z-10 pointer-events-none"
          style={{
            width: "12%",
            background: "linear-gradient(to right, #F5F3FF, transparent)",
          }}
        />
        <GridMotion items={AUTH_IMAGES} gradientColor="#C4B5FD" />
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          60%  { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthPageInner />
    </Suspense>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER FORM
// ─────────────────────────────────────────────────────────────────────────────

function RegisterForm({
  role,
  setRole,
  onSuccess,
}: {
  role: Role;
  setRole: (r: Role) => void;
  onSuccess: (isOnboarded: boolean) => void;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const register = useRegister();
  const login = useLogin();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !fullName || !password)
      return setError("Please fill in all fields.");
    if (password.length < 8)
      return setError("Password must be at least 8 characters.");

    try {
      await register.mutateAsync({
        email,
        password,
        full_name: fullName,
      });
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(
        extractErrorMessage(err, "Something went wrong. Please try again."),
      );
    }
  }

  const isPending = register.isPending || login.isPending;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[2vh]">
      <Input
        label="Full Name"
        type="text"
        placeholder="Ada Lovelace"
        value={fullName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFullName(e.target.value)
        }
        autoComplete="name"
        disabled={isPending}
      />
      <Input
        label="Email Address"
        type="email"
        placeholder="ada@email.com"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
        autoComplete="email"
        disabled={isPending}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Min. 8 characters"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
        autoComplete="new-password"
        disabled={isPending}
      />

      {error && (
        <p
          className="text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5"
          style={{ fontSize: "clamp(11px, 0.85vw, 12.5px)" }}
        >
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        size="lg"
        className="mt-[1vh] rounded-2xl"
        disabled={isPending}
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin"
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
            >
              <circle
                cx="7.5"
                cy="7.5"
                r="6"
                stroke="white"
                strokeOpacity="0.3"
                strokeWidth="2"
              />
              <path
                d="M7.5 1.5a6 6 0 0 1 6 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Creating account…
          </span>
        ) : (
          "Create Account"
        )}
      </Button>

      <p
        className="text-center font-body text-[#9CA3AF] leading-relaxed"
        style={{ fontSize: "clamp(10px, 0.8vw, 12px)" }}
      >
        By signing up you agree to our{" "}
        <a
          href="#"
          className="text-[#6C36F5] hover:underline underline-offset-2"
        >
          Terms
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="text-[#6C36F5] hover:underline underline-offset-2"
        >
          Privacy Policy
        </a>
      </p>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#F3F4F6]" />
        <span
          className="font-body text-[#D1D5DB]"
          style={{ fontSize: "clamp(10px, 0.8vw, 12px)" }}
        >
          or
        </span>
        <div className="flex-1 h-px bg-[#F3F4F6]" />
      </div>

      <Button
        type="button"
        variant="outline"
        fullWidth
        size="lg"
        className="rounded-2xl"
        disabled={isPending}
        onClick={() => authApi.oauthLogin("google")}
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN FORM
// ─────────────────────────────────────────────────────────────────────────────

function LoginForm({
  onSuccess,
}: {
  onSuccess: (isOnboarded: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = useLogin();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) return setError("Please fill in all fields.");

    try {
      const tokens = await login.mutateAsync({ email, password });
      const maxAge = 60 * 15;
      document.cookie = `hubora_session=${tokens.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`;
      onSuccess(tokens.is_onboarded);
    } catch (err) {
      setError(
        extractErrorMessage(err, "Invalid email or password."),
      );
    }
  }

  function handleGoogle() {
    authApi.oauthLogin("google");
  }

  const isPending = login.isPending;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[2vh]">
      <Input
        label="Email Address"
        type="email"
        placeholder="you@email.com"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
        autoComplete="email"
        disabled={isPending}
      />
      <div>
        <Input
          label="Password"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          autoComplete="current-password"
          disabled={isPending}
        />
        <div className="flex justify-end mt-[1vh]">
          <a
            href="#"
            className="font-body font-medium text-[#6C36F5] hover:underline underline-offset-2"
            style={{ fontSize: "clamp(10px, 0.8vw, 12px)" }}
          >
            Forgot password?
          </a>
        </div>
      </div>

      {error && (
        <p
          className="text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5"
          style={{ fontSize: "clamp(11px, 0.85vw, 12.5px)" }}
        >
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        size="lg"
        className="rounded-2xl"
        disabled={isPending}
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin"
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
            >
              <circle
                cx="7.5"
                cy="7.5"
                r="6"
                stroke="white"
                strokeOpacity="0.3"
                strokeWidth="2"
              />
              <path
                d="M7.5 1.5a6 6 0 0 1 6 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Signing in…
          </span>
        ) : (
          "Sign In"
        )}
      </Button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#F3F4F6]" />
        <span
          className="font-body text-[#D1D5DB]"
          style={{ fontSize: "clamp(10px, 0.8vw, 12px)" }}
        >
          or
        </span>
        <div className="flex-1 h-px bg-[#F3F4F6]" />
      </div>

      <Button
        type="button"
        variant="outline"
        fullWidth
        size="lg"
        className="rounded-2xl"
        disabled={isPending}
        onClick={handleGoogle}
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>
    </form>
  );
}