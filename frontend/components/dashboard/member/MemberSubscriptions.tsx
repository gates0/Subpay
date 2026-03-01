import Avatar from "@/components/dashboard/shared/Avatar";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import { memberSubscriptions } from "@/lib/dashboardData";
import { MemberSubscription } from "@/types/dashboard";

function SubscriptionCard({ sub }: { sub: MemberSubscription }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm hover:border-blue-100 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar initials={sub.avatar} color={sub.color} size="lg" />
          <div>
            <p className="font-semibold text-gray-900">{sub.creator}</p>
            <p className="text-sm text-gray-400">{sub.handle}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
            {sub.plan}
          </span>
          <p className="text-sm font-semibold text-gray-700 mt-1">{sub.price}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-400">
        <span>{sub.content} pieces of content</span>
        <span>
          Renews in{" "}
          <span className="text-gray-600 font-medium">{sub.renewsIn}</span>
        </span>
        <button className="text-blue-600 font-medium hover:text-blue-700">
          Manage →
        </button>
      </div>
    </div>
  );
}

export default function MemberSubscriptions() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Subscriptions"
        subtitle="Manage your active hub memberships"
      />
      <div className="grid gap-4">
        {memberSubscriptions.map((sub) => (
          <SubscriptionCard key={sub.id} sub={sub} />
        ))}
      </div>
    </div>
  );
}