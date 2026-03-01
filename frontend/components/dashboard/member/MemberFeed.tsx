import Icon, { IconPaths } from "@/components/dashboard/shared/Icon";
import Avatar from "@/components/dashboard/shared/Avatar";
import ContentTypeBadge from "@/components/dashboard/shared/ContentTypeBadge";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import { memberSubscriptions, feedItems } from "@/lib/dashboardData";
import { MemberSubscription, FeedItem } from "@/types/dashboard";

function HubAvatar({ sub }: { sub: MemberSubscription }) {
  return (
    <div className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group">
      <Avatar
        initials={sub.avatar}
        color={sub.color}
        size="lg"
        ring
        badge={sub.newContent}
      />
      <span className="text-xs text-gray-500 font-medium">
        {sub.creator.split(" ")[0]}
      </span>
    </div>
  );
}

function HubsStrip() {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
        Your Hubs
      </p>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {memberSubscriptions.map((sub) => (
          <HubAvatar key={sub.id} sub={sub} />
        ))}
        <div className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group">
          <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 group-hover:border-blue-300 group-hover:text-blue-400 transition-all">
            <Icon d={IconPaths.plus} size={18} />
          </div>
          <span className="text-xs text-gray-400">Browse</span>
        </div>
      </div>
    </div>
  );
}

function FeedCard({ item }: { item: FeedItem }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 p-4 hover:border-blue-100 hover:shadow-sm transition-all cursor-pointer ${
        item.locked ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar initials={item.avatar} color={item.color} size="md" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-800">{item.creator}</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-400">{item.time}</span>
          </div>
          <p className="text-sm text-gray-700 font-medium truncate">{item.title}</p>
        </div>

        <ContentTypeBadge type={item.type} />

        {item.locked && (
          <div className="flex items-center gap-1 bg-gray-100 text-gray-400 text-xs px-2 py-1 rounded-lg flex-shrink-0">
            <Icon d={IconPaths.lock} size={10} />
            Upgrade
          </div>
        )}
      </div>
    </div>
  );
}

export default function MemberFeed() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Feed"
        subtitle="Latest from your subscribed hubs"
        action={
          <button className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
            <Icon d={IconPaths.compass} size={15} stroke="white" />
            Discover Hubs
          </button>
        }
      />
      <HubsStrip />
      <div className="space-y-3">
        {feedItems.map((item) => (
          <FeedCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}