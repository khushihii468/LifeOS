import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { User, Mail, Calendar, ShieldCheck, LogOut, Check, Leaf, X } from 'lucide-react';

export default function Profile() {
  const { user, updateUser, logout, purgeAndLogout } = useAppState();

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
    setTimeout(() => setSuccess(false), 2500);
  };

  if (!user) return null;

  return (
    <div id="profile_panel" className="space-y-6 max-w-2xl mx-auto animate-fade-in text-[#1D1D1F] select-none">
      
      {/* HEADER */}
      <div className="border-b border-[#E5E1DA] pb-4 text-left">
        <div className="flex items-center gap-2 text-[10px] text-[#5C7C5A] uppercase tracking-widest font-mono font-bold mb-1">
          <Leaf size={12} />
          <span>Section 07 — DEVELOPER PREFERENCES</span>
        </div>
        <h2 className="text-2xl font-serif font-bold tracking-tight text-[#1D1D1F]">
          Planner Setup
        </h2>
        <p className="text-xs text-zinc-500 font-serif italic mt-0.5">
          Configure physical user details, customized biography templates, and session security parameters.
        </p>
      </div>

      {/* PROFILE CARD CARD */}
      <div className="bg-white border border-[#E5E1DA] p-6 rounded-lg flex flex-col sm:flex-row items-center gap-6">
        <img
          src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'}
          alt="Avatar"
          className="w-16 h-16 rounded-xl object-cover border border-[#E5E1DA] grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="font-bold text-[#1D1D1F] text-base">{user.name}</h3>
            <span className="bg-[#5C7C5A]/10 text-[#5C7C5A] border border-[#5C7C5A]/15 text-[9.5px] px-2 py-0.5 rounded leading-none font-mono uppercase font-bold tracking-wider">
              khushinayak96@gmail.com
            </span>
          </div>
          <p className="text-xs text-zinc-550 leading-relaxed max-w-md font-serif">{user.bio || 'Please publish a profile bio log.'}</p>
          <div className="text-[10px] text-zinc-400 font-mono flex items-center justify-center sm:justify-start gap-1">
            <Calendar size={11} />
            Established workspace: {user.joinDate || 'June 20, 2026'}
          </div>
        </div>
      </div>

      {/* DETAILED FORMS SECTION */}
      <div className="bg-white border border-[#E5E1DA] rounded-lg overflow-hidden divide-y divide-[#E5E1DA]/60">
        
        {/* EDIT METRIC PARAMETERS */}
        <div className="p-6">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-450 mb-4 flex items-center gap-1.5 font-mono">
            <User size={13} className="text-[#5C7C5A]" />
            Modify Workspace specs
          </h4>

          {success && (
            <div className="text-xs bg-emerald-50 text-emerald-700 p-3 rounded border border-emerald-100 mb-4 flex items-center gap-2 font-medium">
              <Check size={14} strokeWidth={3} />
              Account specifications updated successfully.
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#1D1D1F] uppercase tracking-widest block font-sans">User Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F7F5F2] border border-[#E5E1DA] rounded p-2 text-xs text-[#1D1D1F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#1D1D1F] uppercase tracking-widest block font-sans">Avatar Image URL</label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#F7F5F2] border border-[#E5E1DA] rounded p-2 text-xs text-[#1D1D1F] font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#1D1D1F] uppercase tracking-widest block font-sans">Planner Bio Outline</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-[#F7F5F2] border border-[#E5E1DA] rounded p-2 text-xs text-[#1D1D1F] leading-relaxed font-serif"
              />
            </div>

            <button
              type="submit"
              className="mt-2 bg-[#5C7C5A] hover:bg-[#5C7C5A]/90 text-white font-semibold py-1.5 px-4 rounded text-xs transition-colors shadow-sm cursor-pointer"
            >
              Publish specifications
            </button>
          </form>
        </div>

        {/* SECURITY SETTINGS PANEL */}
        <div className="p-6">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-450 mb-4 flex items-center gap-1.5 font-mono">
            <ShieldCheck size={13} className="text-[#C47A5A]" />
            Security & Session alignment
          </h4>

          <div className="space-y-3 text-left">
            <div className="flex justify-between items-center text-xs p-3.5 bg-[#F7F5F2] rounded border border-[#E5E1DA]">
              <div>
                <p className="font-semibold text-[#1D1D1F]">Session Integrity Check</p>
                <p className="text-[11px] text-zinc-450 mt-0.5">Your email session is secured with custom local cache protection.</p>
              </div>
              <span className="text-[9px] font-mono border border-[#5C7C5A]/30 text-[#5C7C5A] bg-[#5C7C5A]/5 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Active Client
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center text-xs pt-4 border-t border-[#E5E1DA]/50 select-none">
              <div className="space-y-0.5">
                <p className="text-zinc-550 font-serif italic text-xs">"Reset database state and clear local cache to establish fresh account"</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={purgeAndLogout}
                  className="text-xs border border-rose-200 bg-rose-50/10 hover:bg-rose-100/30 text-rose-700 py-1.5 px-3 rounded flex items-center gap-1 cursor-pointer transition-all font-semibold"
                >
                  <X size={12} />
                  Purge & Start Fresh
                </button>
                <button
                  onClick={logout}
                  className="text-xs border border-[#E5E1DA] hover:bg-rose-50 hover:text-rose-600 text-zinc-550 py-1.5 px-3 rounded flex items-center gap-1 cursor-pointer transition-all font-semibold"
                >
                  <LogOut size={12} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
