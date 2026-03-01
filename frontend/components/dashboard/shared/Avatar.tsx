type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  initials: string;
  color: string;
  size?: AvatarSize;
  ring?: boolean;
  badge?: number;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "w-8  h-8  text-xs",
  md: "w-9  h-9  text-sm",
  lg: "w-12 h-12 text-sm",
  xl: "w-14 h-14 text-base",
};

const roundedClasses: Record<AvatarSize, string> = {
  sm: "rounded-full",
  md: "rounded-full",
  lg: "rounded-2xl",
  xl: "rounded-2xl",
};

export default function Avatar({
  initials,
  color,
  size = "md",
  ring = false,
  badge = 0,
}: AvatarProps) {
  return (
    <div className="relative flex-shrink-0 inline-flex">
      <div
        className={`
          ${sizeClasses[size]} ${roundedClasses[size]} ${color}
          flex items-center justify-center text-white font-bold
          ${ring ? "ring-2 ring-white" : ""}
        `}
      >
        {initials}
      </div>
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </div>
  );
}