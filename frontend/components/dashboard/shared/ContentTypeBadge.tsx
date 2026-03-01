import Icon from "@/components/dashboard/shared/Icon";
import { contentTypeIcon, contentTypeBadge } from "@/lib/dashboardData";
import { ContentType } from "@/types/dashboard";

interface ContentTypeBadgeProps {
  type: ContentType;
  size?: number;
}

export default function ContentTypeBadge({
  type,
  size = 11,
}: ContentTypeBadgeProps) {
  return (
    <span
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${contentTypeBadge[type]}`}
    >
      <Icon d={contentTypeIcon[type]} size={size} />
      <span className="capitalize">{type}</span>
    </span>
  );
}
