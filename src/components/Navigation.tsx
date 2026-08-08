import React from 'react';
import { TabType, UserProfile, NotificationItem } from '../types';
import {
  LayoutDashboard,
  ReceiptText,
  Wallet,
  BarChart3,
  Bell,
  Check,
} from 'lucide-react';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  user: UserProfile;
  notifications: NotificationItem[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean | ((prev: boolean) => boolean)) => void;
  onOpenProfile: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  user,
  notifications,
  showNotifications,
  setShowNotifications,
  onOpenProfile,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { id: 'home' as TabType, label: 'Home', icon: LayoutDashboard },
    { id: 'history' as TabType, label: 'History', icon: ReceiptText },
    { id: 'budget' as TabType, label: 'Budget', icon: Wallet },
    { id: 'analysis' as TabType, label: 'Analysis', icon: BarChart3 },
  ];

  return (
    <>
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <nav className="hidden md:flex flex-col w-64 fixed h-full border-r border-[#c6c6cd]/40 bg-white z-40 top-0 left-0 shadow-sm">
        <div className="p-6 h-16 flex items-center border-b border-[#c6c6cd]/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              W
            </div>
            <span className="font-bold text-2xl text-[#0B1C30] tracking-tight">
              WealthTrace
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 space-y-1.5 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-[#6cf8bb] text-[#00714d] shadow-sm'
                    : 'text-[#45464d] hover:bg-slate-100 hover:text-[#0B1C30]'
                }`}
              >
                <Icon
                  size={20}
                  className={`mr-3 ${
                    isActive ? 'text-[#00714d]' : 'text-[#45464d]'
                  }`}
                />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* User Card at Bottom of Sidebar */}
        <div className="p-4 border-t border-[#c6c6cd]/30">
          <button
            onClick={onOpenProfile}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs text-[#0B1C30] truncate">
                {user.name}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {user.email}
              </div>
            </div>
          </button>
        </div>
      </nav>

      {/* TopAppBar (Mobile) */}
      <header className="md:hidden fixed top-0 w-full z-50 bg-[#f8f9ff]/80 backdrop-blur-xl border-b border-[#c6c6cd]/30 h-16 flex justify-between items-center px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenProfile}
            className="focus:outline-none active:scale-95 transition-transform"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
          </button>
          <span className="font-bold text-xl text-[#0B1C30]">
            {activeTab === 'budget'
              ? 'Budget'
              : activeTab === 'home'
              ? 'Overview'
              : activeTab === 'history'
              ? 'History'
              : 'Analysis'}
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="text-[#45464d] hover:bg-slate-200/50 p-2 rounded-full active:scale-95 transition-all relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>
        </div>
      </header>

      {/* TopAppBar (Desktop) */}
      <header className="hidden md:flex md:ml-64 bg-[#f8f9ff]/80 backdrop-blur-xl border-b border-[#c6c6cd]/30 h-16 items-center px-8 sticky top-0 z-30">
        <span className="font-bold text-2xl text-[#0B1C30]">
          {activeTab === 'budget'
            ? 'Budget Planning'
            : activeTab === 'home'
            ? 'Dashboard Overview'
            : activeTab === 'history'
            ? 'Transaction History'
            : 'Financial Analysis'}
        </span>

        <div className="ml-auto flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="text-[#45464d] hover:bg-slate-200/60 p-2 rounded-full active:scale-95 transition-all relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </button>
          </div>

          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
            <span className="font-semibold text-sm text-[#0B1C30]">
              {user.name}
            </span>
          </button>
        </div>
      </header>

      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-2 py-2 bg-white/90 backdrop-blur-xl border-t border-[#c6c6cd]/40 shadow-lg z-50 rounded-t-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-transform active:scale-90 duration-200 ${
                isActive
                  ? 'bg-[#6cf8bb] text-[#00714d] font-bold shadow-sm'
                  : 'text-[#45464d] hover:text-[#0B1C30]'
              }`}
            >
              <Icon size={20} className="mb-0.5" />
              <span className="text-[11px] tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
