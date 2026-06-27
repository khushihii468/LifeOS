import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { User, Mail, Calendar, Key, ShieldCheck, Sparkles, LogOut, Check } from 'lucide-react';

export default function Profile() {
  const { user, updateUser, logout } = useAppState();

  const [name, setName] = useState(user?.name || 'Khushi Nayak');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [success, setSuccess] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      bio,
      avatarUrl,
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold font-sans tracking-tight text-gray-900 dark:text-zinc-50">
          User Settings
        </h2>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Manage your personal operating system configurations, profile cards, and secure sessions.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-805 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <img
          src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'}
          alt="Avatar"
          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-sky-500/20"
          referrerPolicy="no-referrer"
        />
        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="font-bold text-gray-850 dark:text-zinc-150 text-base">{user.name}</h3>
            <span className="bg-sky-50 dark:bg-sky-950/20 text-sky-600 text-[10px] px-2 py-0.5 rounded-lg font-mono border border-sky-100/40">
              khushinayak96@gmail.com
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed max-w-md">{user.bio || 'Your bio details go here.'}</p>
          <div className="text-[10px] text-gray-400 font-mono flex items-center justify-center sm:justify-start gap-1">
            <Calendar size={11} />
            Established workspace: {user.joinDate}
          </div>
        </div>
      </div>

      {/* Configurations Forms */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50 dark:divide-zinc-850">
        
        {/* EDIT PROFILE DETAILS */}
        <div className="p-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-1.5">
            <User size={13} />
            Modify Workspace details
          </h4>

          {success && (
            <div className="text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl border border-emerald-100/40 mb-4 flex items-center gap-2">
              <Check size={14} strokeWidth={2.5} />
              Account updates published successfully.
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 block pb-0.5">Workspace Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-900 dark:text-zinc-50 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 block pb-0.5">Avatar URL</label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-950 focus:outline-none focus:border-sky-500 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 block pb-0.5">Short Biography</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-900 dark:text-zinc-50 focus:outline-none focus:border-sky-500 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Publish updates
            </button>
          </form>
        </div>

        {/* SECURITY & DELEGATION SENSE */}
        <div className="p-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-1.5">
            <ShieldCheck size={13} />
            Privilege & Access Control
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs p-3 bg-gray-50 dark:bg-zinc-955 rounded-xl border border-gray-100 dark:border-zinc-850">
              <div>
                <p className="font-semibold text-gray-800 dark:text-zinc-200">Session Integrity Check</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Your email session is secured with Supabase token protection.</p>
              </div>
              <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded">
                Active Client
              </span>
            </div>

            <div className="flex justify-between items-center text-xs pt-3.5 border-t border-gray-50 dark:border-zinc-850/80">
              <span className="text-gray-400 text-xs">Terminate active sessions</span>
              <button
                onClick={logout}
                className="text-xs border border-rose-200 hover:bg-rose-50/50 hover:text-rose-600 text-gray-500 py-1.5 px-3 rounded-xl flex items-center gap-1 cursor-pointer font-semibold"
              >
                <LogOut size={12} />
                Sign Out from LifeOS
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
