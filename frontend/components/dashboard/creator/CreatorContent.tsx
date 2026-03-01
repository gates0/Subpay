"use client";

import { useState } from "react";
import Icon, { IconPaths } from "@/components/dashboard/shared/Icon";
import ContentTypeBadge from "@/components/dashboard/shared/ContentTypeBadge";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import FilterPills from "@/components/dashboard/shared/FilterPills";
import { recentContent, contentFilterTypes } from "@/lib/dashboardData";
import { ContentItem } from "@/types/dashboard";

function ContentRow({ item }: { item: ContentItem }) {
  return (
    <div className="grid grid-cols-12 items-center px-5 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer">
      <span className="col-span-5 text-sm font-medium text-gray-800 truncate pr-4">
        {item.title}
      </span>
      <span className="col-span-2 flex justify-center">
        <ContentTypeBadge type={item.type} />
      </span>
      <span className="col-span-2 text-sm text-gray-600 font-medium text-center">
        {item.views.toLocaleString()}
      </span>
      <span className="col-span-2">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            item.plan === "All"
              ? "bg-gray-100 text-gray-500"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          {item.plan}
        </span>
      </span>
      <span className="col-span-1 text-xs text-gray-400">{item.date}</span>
    </div>
  );
}

export default function CreatorContent() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filtered =
    activeFilter === "All"
      ? recentContent
      : recentContent.filter(
          (item) => item.type.toLowerCase() === activeFilter.toLowerCase()
        );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content"
        subtitle="Manage everything you've published"
        action={
          <button className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
            <Icon d={IconPaths.plus} size={15} stroke="white" />
            New Content
          </button>
        }
      />

      <FilterPills
        options={contentFilterTypes}
        active={activeFilter}
        onChange={setActiveFilter}
      />

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-12 text-xs font-semibold text-gray-400 uppercase tracking-widest px-5 py-3 border-b border-gray-50">
          <span className="col-span-5">Title</span>
          <span className="col-span-2 text-center">Type</span>
          <span className="col-span-2 text-center">Views</span>
          <span className="col-span-2">Plan Access</span>
          <span className="col-span-1">Date</span>
        </div>

        {filtered.length > 0 ? (
          filtered.map((item, i) => <ContentRow key={i} item={item} />)
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">
            No content of this type yet.
          </p>
        )}
      </div>
    </div>
  );
}