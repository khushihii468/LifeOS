import React from 'react';
import { useAppState } from '../context/StateContext';
import { Bell, Check, Trash2, Calendar, ShieldAlert } from 'lucide-react';

export default function Notifications() {
  const { notifications, markNotificationRead, clearNotifications } = useAppState();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center py-1">
        <div>
          <h2 className="text-2xl font-bold font-sans tracking-tight text-gray-900 dark:text-zinc-50 flex items-center gap-2">
            Notification Center
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Keep track of goal milestones, expiring tasks, or risk status calculations.
          </p>
        </div>
        
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="text-xs text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            <Trash2 size={13} />
            Clear All
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="text-center py-12 p-6">
            <Bell size={36} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Clean slate folder</h3>
            <p className="text-xs text-gray-400 mt-1">
              You are completely caught up! No recent alerts or streak risk activities reported.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-zinc-850">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 flex gap-4 transition-colors ${
                  !n.read ? 'bg-sky-50/20 dark:bg-zinc-850/30' : 'hover:bg-gray-50/40'
                }`}
              >
                {/* Visual marker */}
                <div className="mt-0.5">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      n.type === 'success'
                        ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-950/20'
                        : n.type === 'warning'
                        ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/20'
                        : 'bg-sky-50 text-sky-500 dark:bg-sky-950/20'
                    }`}
                  >
                    {n.type === 'warning' ? <ShieldAlert size={15} /> : <Bell size={15} />}
                  </span>
                </div>

                {/* Info and click details */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2.5">
                    <h4 className={`text-xs font-semibold ${!n.read ? 'text-gray-900 dark:text-zinc-100 font-bold' : 'text-gray-700 dark:text-zinc-300'}`}>
                      {n.title}
                    </h4>
                    
                    <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(n.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                    {n.message}
                  </p>

                  {!n.read && (
                    <button
                      onClick={() => markNotificationRead(n.id)}
                      className="text-[10px] text-sky-500 font-bold hover:underline flex items-center gap-0.5 pt-1"
                    >
                      <Check size={11} strokeWidth={3} />
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
