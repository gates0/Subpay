"use client";

import { useState } from "react";
import Avatar from "@/components/dashboard/shared/Avatar";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import FilterPills from "@/components/dashboard/shared/FilterPills";
import { discoverHubs, discoverCategories } from "@/lib/dashboardData";
import { DiscoverHub } from "@/types/dashboard";

function HubCard({ hub }: { hub: DiscoverHub }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm hover:border-blue-100 transition-all">
      <div className="flex items-start gap-4">
        <Avatar initials={hub.avatar} color={hub.color} size="lg" />

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{hub.name}</p>
              <p className="text-sm text-gray-400">by {hub.creator}</p>
            </div>
            <span className="text-xs bg-gray-100 text-gray-500 font-medium px-2.5 py-1 rounded-full">
              {hub.category}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-4">
            <span className="text-xs text-gray-400">
              <span className="font-semibold text-gray-600">{hub.subscribers}</span>{" "}
              subscribers
            </span>
            <div className="flex gap-1.5">
              {hub.plans.map((price, i) => (
                <span
                  key={i}
                  className="text-xs bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded"
                >
                  ${price}/mo
                </span>
              ))}
            </div>
            <button className="ml-auto bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MemberDiscover() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered =
    activeCategory === "All"
      ? discoverHubs
      : discoverHubs.filter((h) => h.category === activeCategory);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discover Hubs"
        subtitle="Find creators worth subscribing to"
      />
      <FilterPills
        options={discoverCategories}
        active={activeCategory}
        onChange={setActiveCategory}
      />
      <div className="grid gap-4">
        {filtered.length > 0 ? (
          filtered.map((hub) => <HubCard key={hub.id} hub={hub} />)
        ) : (
          <p className="text-sm text-gray-400 py-8 text-center">
            No hubs found in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}