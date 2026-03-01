import { ViewType } from "@/types/dashboard";

interface ViewToggleBarProps {
  view: ViewType;
  onSwitch: (view: ViewType) => void;
}

const VIEWS: ViewType[] = ["member", "creator"];

export default function ViewToggleBar({ view, onSwitch }: ViewToggleBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Preview Mode
        </span>
        <span className="text-gray-200">|</span>
        <span className="text-xs text-gray-400">Toggle between dashboard views</span>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {VIEWS.map((v) => (
          <button
            key={v}
            onClick={() => onSwitch(v)}
            className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition-all capitalize ${
              view === v
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {v} View
          </button>
        ))}
      </div>
    </div>
  );
}