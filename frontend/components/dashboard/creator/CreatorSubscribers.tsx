import Avatar from "@/components/dashboard/shared/Avatar";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import { subscribersList, subscriberPlanBadge } from "@/lib/dashboardData";
import { Subscriber } from "@/types/dashboard";

function SubscriberRow({ subscriber }: { subscriber: Subscriber }) {
  return (
    <div className="grid grid-cols-12 items-center px-5 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
      <div className="col-span-5 flex items-center gap-3">
        <Avatar initials={subscriber.avatar} color={subscriber.avatarColor} size="sm" />
        <span className="text-sm font-medium text-gray-800">{subscriber.name}</span>
      </div>
      <span className="col-span-3">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            subscriberPlanBadge[subscriber.plan] ?? "bg-gray-100 text-gray-600"
          }`}
        >
          {subscriber.plan}
        </span>
      </span>
      <span className="col-span-2 text-xs text-gray-400">{subscriber.joined}</span>
      <span className="col-span-2 text-sm font-semibold text-gray-700">
        {subscriber.amount}
      </span>
    </div>
  );
}

export default function CreatorSubscribers() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscribers"
        subtitle="1,284 active subscribers across all plans"
      />

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-12 text-xs font-semibold text-gray-400 uppercase tracking-widest px-5 py-3 border-b border-gray-50">
          <span className="col-span-5">Subscriber</span>
          <span className="col-span-3">Plan</span>
          <span className="col-span-2">Joined</span>
          <span className="col-span-2">Amount</span>
        </div>

        {subscribersList.map((sub, i) => (
          <SubscriberRow key={i} subscriber={sub} />
        ))}
      </div>
    </div>
  );
}