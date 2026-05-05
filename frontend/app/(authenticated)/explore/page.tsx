"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useExploreCreators, useExploreContent } from "@/hooks/useExplore";
import type {
  CreatorExploreResponse,
  ContentExploreResponse,
} from "@/types/explore";

const cn = (...c: (string | boolean | undefined)[]) =>
  c.filter(Boolean).join(" ");

const HUB_COLORS = [
  "#8A2BE2",
  "#6366F1",
  "#0EA5E9",
  "#EC4899",
  "#F59E0B",
  "#10B981",
];
const hubColor = (id: number) => HUB_COLORS[id % HUB_COLORS.length];
const initial = (str: string) => str.charAt(0).toUpperCase();

const CONTENT_TYPE_LABEL: Record<string, string> = {
  video: "Video",
  image: "Photo",
  pdf: "PDF",
  text: "Article",
};

const ContentTypePlaceholder = ({
  type,
  color,
}: {
  type: string;
  color: string;
}) => {
  if (type === "video")
    return (
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: color, boxShadow: `0 6px 20px ${color}66` }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
          <path d="M5 3.5v11l10-5.5L5 3.5Z" />
        </svg>
      </div>
    );
  if (type === "image")
    return (
      <div className="flex gap-1.5 opacity-40">
        {[40, 56, 40].map((h, i) => (
          <div key={i} className="w-8 rounded-lg" style={{ height: h, background: color }} />
        ))}
      </div>
    );
  if (type === "pdf")
    return (
      <div
        className="w-10 h-12 rounded-lg border-2 flex items-end justify-center pb-1.5 opacity-40"
        style={{ borderColor: color }}
      >
        <div className="w-5 h-1 rounded-full" style={{ background: color }} />
      </div>
    );
  return (
    <div className="flex flex-col gap-1.5 opacity-30 w-16">
      {[100, 80, 90, 60].map((w, i) => (
        <div key={i} className="h-1.5 rounded-full" style={{ width: `${w}%`, background: color }} />
      ))}
    </div>
  );
};

// ─── Creator Pill ─────────────────────────────────────────────────────────────
function CreatorPill({ creator }: { creator: CreatorExploreResponse }) {
  const router = useRouter();
  const color = hubColor(creator.hub?.id ?? 0);

  return (
    <button
      onClick={() => creator.hub && router.push(`/hubs/${creator.hub.id}`)}
      className="flex flex-col items-center gap-2 w-[72px] shrink-0 group"
    >
      {/* Avatar ring */}
      <div
        className="w-[56px] h-[56px] rounded-full p-[2px] transition-transform group-hover:scale-105"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
          {creator.avatar_url ? (
            <Image
              src={creator.avatar_url}
              alt={creator.username}
              width={52}
              height={52}
              className="object-cover w-full h-full"
              unoptimized
            />
          ) : (
            <span
              className="text-white text-[18px] font-bold"
              style={{
                background: color,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {initial(creator.username)}
            </span>
          )}
        </div>
      </div>
      <p className="text-[10.5px] font-medium text-[#2D0052] truncate w-full text-center leading-tight">
        @{creator.username}
      </p>
    </button>
  );
}

// ─── Content Card (Instagram-style) ──────────────────────────────────────────
function ContentCard({ item }: { item: ContentExploreResponse }) {
  const router = useRouter();
  const color = hubColor(item.hub.id);

  return (
    <div
      onClick={() => router.push(`/content/${item.id}?hub=${item.hub.id}`)}
      className="relative rounded-xl overflow-hidden cursor-pointer group aspect-square"
      style={{ background: `${color}18` }}
    >
      {/* Thumbnail */}
      {item.thumbnail_url ? (
        <Image
          src={item.thumbnail_url}
          alt={item.title}
          fill
          className="object-cover hover:cursor-pointer"
          unoptimized
          sizes="(max-width: 640px) 33vw, 25vw"
        />
      ) : item.content_type === "video" && item.file_url ? (
        <video
          src={item.file_url}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="metadata"
        />
      ) : item.content_type === "image" && item.file_url ? (
        <Image
          src={item.file_url}
          alt={item.title}
          fill
          className="object-cover hover:cursor-pointer"
          unoptimized
          sizes="(max-width: 640px) 33vw, 25vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: `${color}12` }}>
          <ContentTypePlaceholder type={item.content_type} color={color} />
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex flex-col justify-end p-4.5 opacity-0 not-last:hover:cursor-pointer group-hover:opacity-100">
        <p className="text-white text-[11px] font-semibold leading-snug line-clamp-2">
          {item.title}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <div
            className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-white text-[7px] font-bold shrink-0"
            style={{ background: color }}
          >
            {initial(item.hub.name)}
          </div>
          <span className="text-white/80 text-[10px] truncate">
            {item.hub.name}
          </span>
        </div>
      </div>

      {/* Type badge */}
      <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-sm">
        {CONTENT_TYPE_LABEL[item.content_type]}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(value), 400);
  };

  const { data: creators = [], isLoading: creatorsLoading } =
    useExploreCreators({
      q: debouncedSearch || undefined,
      limit: 12,
    });

  const { data: content = [], isLoading: contentLoading } = useExploreContent({
    q: debouncedSearch || undefined,
    limit: 24,
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-[640px] mx-auto px-4 py-6">
        {/* Search */}
        <div className="relative mb-6">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CCC]"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <circle cx="5.5" cy="5.5" r="4" />
            <path d="M9.5 9.5 13 13" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search creators, hubs, content…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EBEBEB] rounded-xl text-[13.5px] text-[#111] placeholder:text-[#CCC] outline-none focus:border-[#8A2BE2] transition-all"
          />
        </div>

        {/* ── Creators strip ── */}
        <section className="mb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#A08DBE] mb-3">
            {debouncedSearch ? "Creators" : "Trending creators"}
          </p>

          {creatorsLoading ? (
            <div
              className="flex gap-4 overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none" }}
            >
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 flex flex-col items-center gap-2"
                >
                  <div className="w-[56px] h-[56px] rounded-full bg-[#EDE5F8] animate-pulse" />
                  <div className="w-12 h-2.5 rounded-full bg-[#EDE5F8] animate-pulse" />
                </div>
              ))}
            </div>
          ) : creators.length === 0 ? (
            <p className="text-[13px] text-[#999] py-4 text-center">
              No creators found.
            </p>
          ) : (
            <div
              className="flex gap-4 overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none" }}
            >
              {creators.map((creator) => (
                <CreatorPill key={creator.id} creator={creator} />
              ))}
            </div>
          )}
        </section>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1 bg-[#EDE5F8]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#C4B5D4]">
            {debouncedSearch ? "Results" : "For you"}
          </span>
          <div className="h-px flex-1 bg-[#EDE5F8]" />
        </div>

        {/* ── Content grid ── */}
        {contentLoading ? (
          <div className="grid grid-cols-3 gap-0.5">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-[#F0EBF8] animate-pulse"
              />
            ))}
          </div>
        ) : content.length === 0 ? (
          <p className="text-[13px] text-[#999] py-10 text-center">
            No content found.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-0.5">
            {content.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
