import Icon, { IconPaths } from "@/components/dashboard/shared/Icon";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import { creatorStats, creatorPlansSummary } from "@/lib/dashboardData";
import { CreatorStat, PlanSummary } from "@/types/dashboard";

function StatCard({ stat }: { stat: CreatorStat }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        {stat.label}
      </p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
      <div
        className={`mt-1 flex items-center gap-1 text-xs font-semibold ${
          stat.up ? "text-emerald-500" : "text-red-400"
        }`}
      >
        <span>{stat.up ? "↑" : "↓"}</span>
        <span>{stat.change} this month</span>
      </div>
    </div>
  );
}

function PlanSummaryCard({ plan }: { plan: PlanSummary }) {
  return (
    <div className={`rounded-2xl border p-4 ${plan.color}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${plan.badge}`}>
          {plan.name}
        </span>
        <span className="text-lg font-bold text-gray-800">
          ${plan.price}
          <span className="text-xs text-gray-400 font-medium">/mo</span>
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-800">{plan.subscribers}</p>
      <p className="text-xs text-gray-400 mt-0.5">subscribers</p>
    </div>
  );
}

export default function CreatorOverview() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Hub Overview"
        subtitle="Welcome back, Maya. Here's your hub at a glance."
        action={
          <button className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
            <Icon d={IconPaths.upload} size={15} stroke="white" />
            Upload Content
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4">
        {creatorStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Subscription Plans
        </p>
        <div className="grid grid-cols-3 gap-3">
          {creatorPlansSummary.map((plan) => (
            <PlanSummaryCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
}