import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { KeyRound, Mail, User, LogIn, UserPlus, Leaf } from 'lucide-react';

export default function Auth() {
  const { login } = useAppState();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    
    if (isSignUp) {
      login(email, name);
    } else {
      const resolvedName = email.toLowerCase() === 'khushinayak96@gmail.com' ? 'Khushi Nayak' : email.split('@')[0];
      login(email, resolvedName);
    }
  };

  return (
    <div id="auth_container" className="fixed inset-0 flex items-center justify-center bg-[#F7F5F2] p-4 font-sans select-none overflow-y-auto">
      <div id="auth_card" className="w-full max-w-sm bg-white border border-[#E5E1DA] rounded-xl shadow-[0_4px_24px_rgba(29,29,31,0.02)] p-8 relative">
        
        {/* Subtle bookmark ribbon aesthetic */}
        <div className="absolute top-0 right-8 w-4 h-8 bg-[#C47A5A] rounded-b-sm opacity-90" />

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center mt-3">
          <div className="w-10 h-10 rounded-full bg-[#5C7C5A]/10 flex items-center justify-center text-[#5C7C5A] mb-3">
             <Leaf size={18} />
          </div>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-[#1D1D1F]">
            LifeOS Journal
          </h1>
          <p className="text-[12px] text-zinc-500 font-serif italic max-w-[240px] mt-1.5">
            {isSignUp ? 'Open a new personal operating space' : 'Authenticate credentials to open daily ledger'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {error && (
            <div className="text-[11px] bg-rose-50 text-rose-700 p-3 rounded border border-rose-100 font-medium">
              {error}
            </div>
          )}

          {isSignUp && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <User size={13} />
                </span>
                <input
                  type="text"
                  placeholder="Khushi Nayak"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-[#E5E1DA] rounded text-xs bg-[#F7F5F2]/40 text-[#1D1D1F] focus:bg-white focus:outline-none focus:border-[#5C7C5A] transition-all font-sans"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Mail size={13} />
              </span>
              <input
                type="email"
                placeholder="khushinayak96@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-[#E5E1DA] rounded text-xs bg-[#F7F5F2]/40 text-[#1D1D1F] focus:bg-white focus:outline-none focus:border-[#5C7C5A] transition-all font-sans"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block">Password</label>
              {!isSignUp && (
                <span className="text-[9px] font-mono text-zinc-400 select-none">
                  Encrypted
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <KeyRound size={13} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-[#E5E1DA] rounded text-xs bg-[#F7F5F2]/40 text-[#1D1D1F] focus:bg-white focus:outline-none focus:border-[#5C7C5A] transition-all font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-3 bg-[#5C7C5A] hover:bg-[#5C7C5A]/95 text-white font-semibold py-2 px-4 rounded text-xs transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSignUp ? <UserPlus size={13} /> : <LogIn size={13} />}
            {isSignUp ? 'Establish OS Journal' : 'Authenticate Ledger Credentials'}
          </button>
        </form>

        {/* Demo Account Indicator */}
        {!isSignUp && (
          <div className="mt-4 p-2 bg-[#ECE7DC]/50 border border-[#B5AC9E] rounded text-center flex flex-col items-center justify-center gap-1 sm:gap-1.5 select-none z-10 relative">
            <div className="flex items-center gap-1.5 justify-center">
              <Leaf size={11} className="text-[#3B5F3E]" />
              <span className="text-[10px] text-zinc-600 font-mono">
                Click here to load the sample demo:
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail('khushinayak96@gmail.com');
                setName('Khushi Nayak');
                setPassword('password123');
              }}
              className="text-[10.5px] text-[#3B5F3E] hover:underline font-bold font-mono cursor-pointer"
            >
              khushinayak96@gmail.com
            </button>
          </div>
        )}

        {/* Footer Toggle */}
        <div className="mt-6 pt-4 border-t border-[#E5E1DA]/50 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-[11px] text-zinc-500 hover:text-[#5C7C5A] hover:underline cursor-pointer"
          >
            {isSignUp ? 'Already configured? Log in here' : 'New user? Establish OS count'}
          </button>
        </div>
      </div>
    </div>
  );
}
