import Icon from "@/components/dashboard/shared/Icon";

interface PlaceholderTabProps {
  title: string;
  subtitle: string;
  icon: string;
}

export default function PlaceholderTab({ title, subtitle, icon }: PlaceholderTabProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300 mb-4">
        <Icon d={icon} size={26} />
      </div>
      <p className="font-semibold text-gray-700">{title}</p>
      <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}