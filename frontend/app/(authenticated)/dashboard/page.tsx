"use client";

import { useState } from "react";

// Layout
import Sidebar from "@/components/dashboard/layout/Sidebar";
import ViewToggleBar from "@/components/dashboard/layout/Togglebar";

// Member tabs
import MemberFeed from "@/components/dashboard/member/MemberFeed";
import MemberSubscriptions from "@/components/dashboard/member/MemberSubscriptions";
import MemberDiscover from "@/components/dashboard/member/MemberDiscover";

// Creator tabs
import CreatorOverview from "@/components/dashboard/creator/CreatorOverview";
import CreatorContent from "@/components/dashboard/creator/CreatorContent";
import CreatorSubscribers from "@/components/dashboard/creator/CreatorSubscribers";
import CreatorPlans from "@/components/dashboard/creator/CreatorPlans";

// Common
import PlaceholderTab from "@/components/dashboard/common/PlaceholderTab";
import { IconPaths } from "@/components/dashboard/shared/Icon";

import { ViewType, MemberNavId, CreatorNavId, NavId } from "@/types/dashboard";

// ─── Tab renderers ────────────────────────────────────────────────────────────
function MemberTabContent({ tab }: { tab: MemberNavId }) {
  switch (tab) {
    case "feed":          return <MemberFeed />;
    case "discover":      return <MemberDiscover />;
    case "subscriptions": return <MemberSubscriptions />;
    case "notifications": return <PlaceholderTab title="Notifications" subtitle="You're all caught up!" icon={IconPaths.bell} />;
    case "settings":      return <PlaceholderTab title="Settings" subtitle="Account preferences coming soon" icon={IconPaths.settings} />;
    default:              return <MemberFeed />;
  }
}

function CreatorTabContent({ tab }: { tab: CreatorNavId }) {
  switch (tab) {
    case "overview":    return <CreatorOverview />;
    case "content":     return <CreatorContent />;
    case "subscribers": return <CreatorSubscribers />;
    case "plans":       return <CreatorPlans />;
    case "analytics":   return <PlaceholderTab title="Analytics" subtitle="Detailed insights coming soon" icon={IconPaths.trending} />;
    case "settings":    return <PlaceholderTab title="Hub Settings" subtitle="Customize your hub appearance" icon={IconPaths.settings} />;
    default:            return <CreatorOverview />;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [view, setView]           = useState<ViewType>("member");
  const [activeNav, setActiveNav] = useState<NavId>("feed");

  const handleViewSwitch = (newView: ViewType): void => {
    setView(newView);
    setActiveNav(newView === "member" ? "feed" : "overview");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Outfit', system-ui, sans-serif; }
      `}</style>

      {/* Preview-only toggle — remove in production */}
      <ViewToggleBar view={view} onSwitch={handleViewSwitch} />

      <div className="pt-[53px] flex">
        <div className="fixed top-[53px] left-0 h-[calc(100vh-53px)]">
          <Sidebar
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            view={view}
          />
        </div>

        <main className="ml-60 flex-1 px-8 py-8 min-h-screen">
          <div className="max-w-3xl">
            {view === "member" ? (
              <MemberTabContent tab={activeNav as MemberNavId} />
            ) : (
              <CreatorTabContent tab={activeNav as CreatorNavId} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}