import { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Bot,
  BarChart3,
  Bell,
  Smartphone,
  MessageCircle,
  Globe,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Rocket,
  BookOpen,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Дашборд' },
  { id: 'stock', icon: Package, label: 'Остатки' },
  { id: 'ai', icon: Bot, label: 'ИИ Аналитик' },
  { id: 'analytics', icon: BarChart3, label: 'Аналитика' },
  { id: 'platforms', icon: Globe, label: 'Платформы' },
  { id: 'deploy', icon: Rocket, label: 'Деплой' },
  { id: 'saas', icon: BookOpen, label: 'SaaS Guide' },
];

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }: SidebarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <aside
      className={`bg-gradient-to-b from-[#1a1a2e] to-[#16213e] text-white flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } min-h-screen relative`}
    >
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <TrendingUp size={20} />
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-bold text-sm">WB Analytics</h1>
            <p className="text-[10px] text-gray-400">Pro Edition</p>
          </div>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-500 transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
              activeTab === item.id
                ? 'bg-purple-600/20 border-r-2 border-purple-400 text-purple-300'
                : 'hover:bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="w-full flex items-center gap-3 px-2 py-2 hover:bg-white/5 rounded-lg transition-colors relative"
        >
          <Bell size={18} className="text-gray-400" />
          {!collapsed && <span className="text-sm text-gray-400">Уведомления</span>}
          <span className="absolute top-1 left-7 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="w-full flex items-center gap-3 px-2 py-2 hover:bg-white/5 rounded-lg transition-colors">
          <Settings size={18} className="text-gray-400" />
          {!collapsed && <span className="text-sm text-gray-400">Настройки</span>}
        </button>
      </div>
    </aside>
  );
}
