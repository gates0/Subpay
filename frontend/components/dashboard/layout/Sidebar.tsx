import Icon, { IconPaths } from "@/components/dashboard/shared/Icon";
import Avatar from "@/components/dashboard/shared/Avatar";
import { ViewType, NavId, NavItem } from "@/types/dashboard";

const MEMBER_NAV: NavItem[] = [
  { id: "feed",          label: "My Feed",       icon: IconPaths.home },
  { id: "discover",      label: "Discover",      icon: IconPaths.compass },
  { id: "subscriptions", label: "Subscriptions", icon: IconPaths.bookmark },
  { id: "notifications", label: "Notifications", icon: IconPaths.bell, badge: 4 },
  { id: "settings",      label: "Settings",      icon: IconPaths.settings },
];

const CREATOR_NAV: NavItem[] = [
  { id: "overview",    label: "Overview",    icon: IconPaths.chart },
  { id: "content",     label: "Content",     icon: IconPaths.grid },
  { id: "subscribers", label: "Subscribers", icon: IconPaths.users },
  { id: "plans",       label: "Plans",       icon: IconPaths.dollar },
  { id: "analytics",   label: "Analytics",   icon: IconPaths.trending },
  { id: "settings",    label: "Settings",    icon: IconPaths.settings },
];

interface NavItemButtonProps {
  item: NavItem;
  active: boolean;
  onClick: (id: NavId) => void;
}

function NavItemButton({ item, active, onClick }: NavItemButtonProps) {
  return (
    <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
          ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
      }`}
    >
      <Icon d={item.icon} size={17} stroke={active ? "white" : "currentColor"} />
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge !== undefined && (
        <span
          className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
            active ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"
          }`}
        >
          {item.badge}
        </span>
      )}
    </button>
  );
}

function BecomeCreatorCTA() {
  return (
    <div className="px-4 pb-4">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4 text-white">
        <Icon d={IconPaths.crown} size={20} stroke="white" />
        <p className="mt-2 text-sm font-semibold leading-snug">Become a Creator</p>
        <p className="mt-1 text-xs text-blue-100 leading-relaxed">
          Launch your hub and start earning from your content.
        </p>
        <button className="mt-3 w-full bg-white text-blue-700 text-xs font-bold py-2 rounded-lg hover:bg-blue-50 transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
}

interface SidebarProps {
  activeNav: NavId;
  setActiveNav: (id: NavId) => void;
  view: ViewType;
}

export default function Sidebar({ activeNav, setActiveNav, view }: SidebarProps) {
  const isCreator = view === "creator";
  const navItems = isCreator ? CREATOR_NAV : MEMBER_NAV;

  return (
    <aside className="w-60 h-full bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-bold text-gray-900 tracking-tight text-lg">Hubly</span>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
          <Avatar
            initials={isCreator ? "MC" : "JD"}
            color={isCreator ? "bg-indigo-600" : "bg-blue-500"}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {isCreator ? "Maya Cole" : "Jamie Doe"}
            </p>
            <p className="text-xs text-gray-400">{isCreator ? "Creator" : "Member"}</p>
          </div>
          {isCreator && <Icon d={IconPaths.crown} size={14} stroke="#4f46e5" />}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavItemButton
            key={item.id}
            item={item}
            active={activeNav === item.id}
            onClick={setActiveNav}
          />
        ))}
      </nav>

      {!isCreator && <BecomeCreatorCTA />}

      {/* Logout */}
      <div className="px-4 pb-5">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
          <Icon d={IconPaths.logout} size={16} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}