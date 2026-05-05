"use client";

import { useState } from "react";
import AppSidebar from "@/components/dashboard/shared/Sidebar";
import { Toaster } from "sonner";

export default function HuboraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FAF8FF]">
      <Toaster position="bottom-right" />

      {/* ── Sidebar ── */}
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ── Main column ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/*
          Mobile top bar
          Hidden on lg+ because the sidebar is always visible there.
        */}
        <header
          className="lg:hidden sticky top-0 z-30 flex items-center justify-between
                     px-5 py-4 bg-white border-b border-[#EDE5F8]"
        >
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
            className="w-9 h-9 flex items-center justify-center rounded-[9px]
                       text-[#6B4F8A] hover:bg-[#F3E8FF] transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path d="M2 4.5h14M2 9h14M2 13.5h14" strokeLinecap="round" />
            </svg>
          </button>

          {/* Wordmark */}
          <span style={{ fontSize: 19, color: "#2D0052", fontWeight: 600 }}>
            Hubora
          </span>

          {/* Right slot — leave empty or put a notification bell here */}
          <div className="w-9" />
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
