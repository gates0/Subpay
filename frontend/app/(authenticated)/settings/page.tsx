"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe, useUpdateMe, useBecomeCreator } from "@/hooks/useUsers";
import { useCheckUsername } from "@/hooks/useOnboarding";
import Image from "next/image";
import { Camera, Loader2, Check, X, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserResponse } from "@/types/users";
import { toast } from "sonner";

const P = {
  accent: "#8A2BE2",
  accentSoft: "#F3E8FF",
  accentBorder: "#D8B4FE",
  ink: "#2D0052",
  text: "#4B3472",
  muted: "#A08DBE",
  faint: "#C4B5D4",
  border: "#EDE5F8",
  soft: "#F5EFFF",
  bg: "#FAF7FF",
};

export default function SettingsPage() {
  const { data: me } = useMe();

  if (!me) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: P.bg }}>
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: P.muted }} />
      </main>
    );
  }

  return <SettingsForm me={me} />;
}

function SettingsForm({ me }: { me: UserResponse }) {
  const router = useRouter();
  const { mutate: updateMe, isPending: savingMe } = useUpdateMe();
  const { mutate: becomeCreator, isPending: becomingCreator } = useBecomeCreator();

  const [fullName, setFullName] = useState(me.full_name ?? "");
  const [username, setUsername] = useState(me.username ?? "");
  const [bio, setBio] = useState(me.bio ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [showCreatorConfirm, setShowCreatorConfirm] = useState(false);

  const avatarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const trimmed = username.trim();
    const next = trimmed === me.username || trimmed.length < 3 ? "" : trimmed;
    const timer = setTimeout(() => setDebouncedUsername(next), 500);
    return () => clearTimeout(timer);
  }, [username, me.username]);

  const { data: usernameCheck, isFetching: checkingUsername } = useCheckUsername(debouncedUsername);
  const usernameAvailable = debouncedUsername ? (usernameCheck?.available ?? null) : null;

  const avatarSrc =
    avatarPreview ??
    (me.avatar_url ? `${process.env.NEXT_PUBLIC_API_URL}${me.avatar_url}` : null);
  const initials = (me.full_name ?? me.username ?? "?").charAt(0).toUpperCase();

  const handleAvatarChange = (f: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const isDirty =
    fullName !== (me.full_name ?? "") ||
    username !== (me.username ?? "") ||
    bio !== (me.bio ?? "") ||
    avatarPreview !== null;

  const canSave = isDirty && !savingMe && usernameAvailable !== false && !checkingUsername;

  const handleSave = () => {
    updateMe(
      {
        full_name: fullName.trim() || undefined,
        username: username.trim() || undefined,
        bio: bio.trim() || undefined,
        avatar_url: avatarPreview ?? undefined,
      },
      {
        onSuccess: () => {
          setAvatarPreview(null);
          toast.success("Profile saved");
        },
        onError: () => toast.error("Failed to save changes"),
      },
    );
  };

  const handleBecomeCreator = () => {
    becomeCreator(undefined, {
      onSuccess: () => {
        toast.success("You're now a creator! Setting up your hub…");
        router.push("/creator_dashboard");
      },
      onError: () => toast.error("Something went wrong. Please try again."),
    });
  };

  return (
    <main className="min-h-screen" style={{ background: P.bg }}>
      <div className="max-w-[600px] mx-auto px-5 py-10">

        {/* ── Page header ── */}
        <div className="mb-8">
          <h1 className="text-[26px] font-black tracking-tight" style={{ color: P.ink }}>
            Settings
          </h1>
          <p className="text-[13.5px] mt-1" style={{ color: P.muted }}>
            Manage your profile and account preferences
          </p>
        </div>

        <div className="flex flex-col gap-5">

          {/* ── Avatar hero card ── */}
          <section
            className="rounded-2xl overflow-hidden"
            style={{
              background: `linear-gradient(145deg, ${P.ink} 0%, ${P.accent} 100%)`,
              boxShadow: `0 8px 32px rgba(138,43,226,0.25)`,
            }}
          >
            <div className="px-6 py-6 flex items-center gap-5">
              <div
                className="relative group cursor-pointer shrink-0"
                onClick={() => avatarRef.current?.click()}
              >
                <div
                  className="w-[76px] h-[76px] rounded-2xl overflow-hidden flex items-center justify-center ring-2 ring-white/20"
                  style={{ background: avatarSrc ? "transparent" : "rgba(255,255,255,0.15)" }}
                >
                  {avatarSrc ? (
                    <Image src={avatarSrc} alt="Avatar" width={76} height={76} className="w-full h-full object-cover" unoptimized />
                  ) : (
                    <span className="text-white text-[30px] font-black select-none">{initials}</span>
                  )}
                </div>
                <div className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all" style={{ background: "rgba(0,0,0,0.45)" }}>
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <input
                  ref={avatarRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleAvatarChange(f);
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-[17px] leading-tight truncate">
                  {me.full_name || me.username || "—"}
                </p>
                <p className="text-white/60 text-[13px] mt-0.5">
                  @{me.username ?? "—"}
                </p>
                <button
                  onClick={() => avatarRef.current?.click()}
                  className="mt-2.5 text-[12px] font-semibold px-3 py-1 rounded-full transition-all"
                  style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
                >
                  {avatarPreview ? "Photo selected ✓" : "Change photo"}
                </button>
              </div>
            </div>
          </section>

          {/* ── Profile info ── */}
          <section
            className="rounded-2xl border px-6 py-5"
            style={{
              background: "white",
              borderColor: P.border,
              boxShadow: "0 1px 4px rgba(45,0,82,0.05)",
            }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-4" style={{ color: P.faint }}>
              Profile info
            </p>
            <div className="flex flex-col gap-4">
              <Field
                label="Full name"
                value={fullName}
                onChange={setFullName}
                placeholder="Your display name"
              />
              <Field
                label="Username"
                value={username}
                onChange={setUsername}
                placeholder="yourhandle"
                prefix="@"
                suffix={
                  checkingUsername ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: P.muted }} />
                  ) : usernameAvailable === true ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : usernameAvailable === false ? (
                    <X className="w-3.5 h-3.5 text-red-400" />
                  ) : null
                }
                hint={usernameAvailable === false ? "Username is taken" : undefined}
              />
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: P.muted }}>
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell subscribers a bit about yourself…"
                  rows={3}
                  maxLength={500}
                  className="w-full rounded-[10px] px-4 py-2.5 text-[13.5px] placeholder:text-[#C4B5D4] outline-none transition-all resize-none"
                  style={{
                    background: P.bg,
                    border: `1px solid ${P.border}`,
                    color: P.ink,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = P.accentBorder)}
                  onBlur={(e) => (e.target.style.borderColor = P.border)}
                />
                <p className="text-right text-[11px] mt-1" style={{ color: P.faint }}>
                  {bio.length}/500
                </p>
              </div>
            </div>
          </section>

          {/* ── Save button ── */}
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="w-full py-3 rounded-[12px] text-[13.5px] font-bold transition-all flex items-center justify-center gap-2 text-white"
            style={{
              background: canSave ? P.accent : `${P.accent}50`,
              boxShadow: canSave ? `0 4px 18px rgba(138,43,226,0.35)` : "none",
            }}
          >
            {savingMe && <Loader2 className="w-4 h-4 animate-spin" />}
            {savingMe ? "Saving…" : "Save changes"}
          </button>

          {/* ── Become a Creator (members only) ── */}
          {me.role === "member" && (
            <section
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: P.accentBorder, boxShadow: `0 2px 12px rgba(138,43,226,0.08)` }}
            >
              <div
                className="px-6 py-5"
                style={{ background: `linear-gradient(135deg, ${P.accentSoft} 0%, white 60%)` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: P.accent, boxShadow: `0 4px 14px rgba(138,43,226,0.35)` }}
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold" style={{ color: P.ink }}>
                      Become a Creator
                    </p>
                    <p className="text-[12.5px] leading-relaxed mt-1" style={{ color: P.text }}>
                      Publish content, set up subscription plans, and start earning from your audience.
                    </p>
                    <ul className="mt-3 flex flex-col gap-1.5">
                      {["Your own hub page", "Subscription plans & payments", "Content dashboard & analytics"].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-[12px]" style={{ color: P.text }}>
                          <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: P.accentSoft }}>
                            <Check className="w-2.5 h-2.5" style={{ color: P.accent }} />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {!showCreatorConfirm ? (
                  <button
                    onClick={() => setShowCreatorConfirm(true)}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:brightness-110 active:scale-[0.98]"
                    style={{ background: P.accent, boxShadow: `0 4px 14px rgba(138,43,226,0.35)` }}
                  >
                    Get started
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div
                    className="mt-4 rounded-xl p-4"
                    style={{ background: "white", border: `1px solid ${P.border}` }}
                  >
                    <p className="text-[13px] font-semibold mb-1" style={{ color: P.ink }}>
                      Switch to creator account?
                    </p>
                    <p className="text-[12px] mb-3" style={{ color: P.muted }}>
                      This will upgrade your account and create your hub. You can still subscribe to other creators.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleBecomeCreator}
                        disabled={becomingCreator}
                        className="flex-1 py-2 rounded-lg text-[12.5px] font-bold text-white transition-all flex items-center justify-center gap-1.5"
                        style={{ background: P.accent }}
                      >
                        {becomingCreator && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {becomingCreator ? "Upgrading…" : "Yes, become a creator"}
                      </button>
                      <button
                        onClick={() => setShowCreatorConfirm(false)}
                        className="px-4 py-2 rounded-lg text-[12.5px] font-medium transition-all"
                        style={{ background: P.soft, color: P.muted }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Account info ── */}
          <section
            className="rounded-2xl border px-6 py-5"
            style={{ background: "white", borderColor: P.border, boxShadow: "0 1px 4px rgba(45,0,82,0.05)" }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-4" style={{ color: P.faint }}>
              Account
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: P.soft }}>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: P.ink }}>Email</p>
                  <p className="text-[12px] mt-0.5" style={{ color: P.muted }}>{me.email}</p>
                </div>
                <span
                  className="text-[10.5px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: me.is_verified ? "#DCFCE7" : "#FEF9C3", color: me.is_verified ? "#15803D" : "#A16207" }}
                >
                  {me.is_verified ? "Verified" : "Unverified"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: P.ink }}>Role</p>
                  <p className="text-[12px] mt-0.5" style={{ color: P.muted }}>
                    {me.role ? me.role.charAt(0).toUpperCase() + me.role.slice(1) : "—"}
                  </p>
                </div>
                <span
                  className="text-[10.5px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: me.role === "creator" ? P.accentSoft : P.soft, color: me.role === "creator" ? P.accent : P.muted }}
                >
                  {me.role === "creator" ? "Creator" : "Member"}
                </span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: React.ReactNode;
  hint?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: P.muted }}>
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13.5px] font-medium select-none" style={{ color: P.muted }}>
            {prefix}
          </span>
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            "w-full rounded-[10px] py-2.5 text-[13.5px] outline-none transition-all",
            prefix ? "pl-8" : "px-4",
            suffix ? "pr-9" : "pr-4",
          )}
          style={{
            background: P.bg,
            border: `1px solid ${hint ? "#FCA5A5" : focused ? P.accentBorder : P.border}`,
            color: P.ink,
            boxShadow: focused ? `0 0 0 3px rgba(138,43,226,0.07)` : "none",
          }}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</span>
        )}
      </div>
      {hint && <p className="text-[11.5px] text-red-400 mt-1">{hint}</p>}
    </div>
  );
}
