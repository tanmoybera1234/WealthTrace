import React from 'react';
import { NotificationItem } from '../../types';
import { Bell, CheckCheck, Trash2, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'warning':
      case 'alert':
        return <AlertTriangle size={16} className="text-red-500 shrink-0" />;
      case 'success':
        return <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />;
      default:
        return <Info size={16} className="text-blue-500 shrink-0" />;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-4 md:right-8 top-16 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-fadeIn">
        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-[#0B1C30]" />
            <span className="font-bold text-sm text-[#0B1C30]">Notifications</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {notifications.some((n) => !n.read) && (
              <button
                onClick={onMarkAllRead}
                className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                title="Clear all"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No notifications right now
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 text-xs transition-colors ${
                  !item.read ? 'bg-amber-50/40 font-medium' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {getIcon(item.type)}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#0B1C30] mb-0.5">
                      {item.title}
                    </div>
                    <p className="text-slate-600 leading-relaxed mb-1">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(item.date)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
