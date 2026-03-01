import Icon, { IconPaths } from "@/components/dashboard/shared/Icon";
import PageHeader from "@/components/dashboard/shared/PageHeader";
import { creatorPlansDetail } from "@/lib/dashboardData";
import { PlanDetail } from "@/types/dashboard";

function PerkItem({ perk }: { perk: string }) {
  return (
    <li className="flex items-center gap-2 text-sm text-gray-600">
      <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
        <Icon d={IconPaths.check} size={9} stroke="#10b981" strokeWidth={3} />
      </span>
      {perk}
    </li>
  );
}

function PlanCard({ plan }: { plan: PlanDetail }) {
  return (
    <div className={`rounded-2xl border p-5 ${plan.color}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-gray-900 text-lg">{plan.name}</p>
          <p className="text-sm text-gray-500 mt-0.5">{plan.description}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            ${plan.price}
            <span className="text-sm text-gray-400 font-normal">/mo</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{plan.subscribers} subscribers</p>
        </div>
      </div>

      <ul className="mt-4 space-y-1.5">
        {plan.perks.map((perk, i) => (
          <PerkItem key={i} perk={perk} />
        ))}
      </ul>

      <div className="mt-4 flex gap-2">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
          Edit
        </button>
        <button className="text-sm font-medium text-red-400 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
}

export default function CreatorPlans() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Plans"
        subtitle="Create and manage plans for your hub"
        action={
          <button className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
            <Icon d={IconPaths.plus} size={15} stroke="white" />
            New Plan
          </button>
        }
      />

      <div className="grid gap-4">
        {creatorPlansDetail.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </div>
    </div>
  );
}