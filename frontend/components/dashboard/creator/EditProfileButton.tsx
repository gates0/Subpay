"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Upload, Plus, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionsMenuProps {
  onUpload: () => void;
  onEditProfile: () => void;
}

export default function QuickActionsMenu({
  onUpload,
  onEditProfile,
}: QuickActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const close = () => setOpen(false);

  const actions = [
    {
      icon: <Pencil className="w-3.5 h-3.5" />,
      label: "Edit hub",
      fn: () => { onEditProfile(); close(); },
    },
    {
      icon: <Upload className="w-3.5 h-3.5" />,
      label: "Upload content",
      fn: () => { onUpload(); close(); },
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 text-[13px] font-semibold px-4 py-2.5 rounded-[10px] transition-all border",
          open
            ? "bg-[#8A2BE2] text-white border-[#8A2BE2]"
            : "bg-white text-[#6B4F8A] border-[#EDE5F8] hover:bg-[#F3E8FF] hover:text-[#8A2BE2] hover:border-[#DDD6FE]",
        )}
        style={open ? { boxShadow: "0 4px 14px rgba(138,43,226,0.3)" } : {}}
      >
        <Menu className="w-4 h-4" />
        Quick actions
      </button>

      {open && (
        <div
          className="absolute right-0 top-12 z-40 bg-white border border-[#EDE5F8] rounded-[14px] overflow-hidden w-[192px]"
          style={{ boxShadow: "0 12px 36px rgba(45,0,82,0.14)" }}
        >
          <div className="py-1.5">
            {actions.map(({ icon, label, fn }) => (
              <button
                key={label}
                onClick={fn}
                className="w-full text-left px-3.5 py-2.5 text-[13px] font-medium text-[#2D0052] hover:bg-[#F5EFFF] transition-colors flex items-center gap-3"
              >
                <span className="w-7 h-7 rounded-[8px] bg-[#F3E8FF] flex items-center justify-center text-[#8A2BE2] shrink-0">
                  {icon}
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}