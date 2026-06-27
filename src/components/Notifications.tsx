import React from 'react';
import { useAppState } from '../context/StateContext';
import { Bell, Check, Trash2, Calendar, ShieldAlert, Leaf } from 'lucide-react';

export default function Notifications() {
  const { notifications, markNotificationRead, clearNotifications } = useAppState();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div id="notifications_panel" className="space-y-6 max-w-2xl mx-auto animate-fade-in text-[#1D1D1F] select-none">
      
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-[#E5E1DA] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-[#5C7C5A] uppercase tracking-widest font-mono font-bold mb-1">
            <Leaf size={12} />
            <span>Section 06 — SYSTEM LEDGER</span>
          </div>
          <h2 className="text-2xl font-serif font-bold tracking-tight text-[#1D1D1F]">
            Notifications Log
          </h2>
          <p className="text-xs text-zinc-500 font-serif italic mt-0.5">
            Trace automated goal deadlines, weekly consistency indicators, and routine checklist risk levels.
          </p>
        </div>
        
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="text-xs text-[#C47A5A] hover:text-[#C47A5A]/85 hover:underline flex items-center gap-1 font-semibold cursor-pointer pb-1"
          >
            <Trash2 size={12} />
            Discard Archive
          </button>
        )}
      </div>

      {/* CORE TIMELINE SHEET */}
      <div className="bg-white border border-[#E5E1DA] rounded-lg overflow-hidden">
        {notifications.length === 0 ? (
          <div className="text-center py-16 p-6 select-none">
            <Bell size={28} className="text-zinc-300 mx-auto mb-2" />
            <h3 className="font-serif font-bold text-xs text-zinc-500">Logbook is clear</h3>
            <p className="text-[11px] text-zinc-400 mt-1">
              You are completely caught up. No recent notices or streak alerts logged.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E5E1DA]/60">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 flex gap-4 transition-colors ${
                  !n.read ? 'bg-[#5C7C5A]/3' : 'hover:bg-[#F7F5F2]/20'
                }`}
              >
                {/* Visual tactile badge */}
                <div className="mt-0.5 shrink-0">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center border ${
                      n.type === 'success'
                        ? 'bg-[#5C7C5A]/10 text-[#5C7C5A] border-[#5C7C5A]/15'
                        : n.type === 'warning'
                        ? 'bg-[#C47A5A]/10 text-[#C47A5A] border-[#C47A5A]/15'
                        : 'bg-zinc-100 text-zinc-500 border-[#E5E1DA]'
                    }`}
                  >
                    {n.type === 'warning' ? <ShieldAlert size={12} /> : <Bell size={12} />}
                  </span>
                </div>

                {/* Information details */}
                <div className="flex-1 space-y-1.5 text-left">
                  <div className="flex items-center justify-between gap-2.5">
                    <h4 className={`text-xs font-semibold ${!n.read ? 'text-[#1D1D1F] font-bold' : 'text-zinc-600'}`}>
                      {n.title}
                    </h4>
                    
                    <span className="text-[9.5px] text-zinc-400 font-mono flex items-center gap-1.5">
                      <Calendar size={10} />
                      {new Date(n.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <p className="text-xs text-zinc-500 leading-relaxed font-serif">
                    {n.message}
                  </p>

                  {!n.read && (
                    <button
                      onClick={() => markNotificationRead(n.id)}
                      className="text-[10px] text-[#5C7C5A] font-bold hover:underline flex items-center gap-0.5 pt-1"
                    >
                      <Check size={11} strokeWidth={3.5} />
                      <span>Mark reviewed</span>
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
