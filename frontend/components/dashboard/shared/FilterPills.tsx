"use client";

interface FilterPillsProps {
  options: string[];
  active: string;
  onChange: (value: string) => void;
}

export default function FilterPills({ options, active, onChange }: FilterPillsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            active === option
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}