import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { KeyRound, Mail, Sparkles, User, LogIn, UserPlus } from 'lucide-react';

export default function Auth() {
  const { login } = useAppState();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('khushinayak96@gmail.com');
  const [name, setName] = useState('Khushi Nayak');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    // Handle signup/login
    if (isSignUp) {
      login(email, name);
    } else {
      // Allow any email for demo purposes, resolve default profile for khushinayak96@gmail.com
      const resolvedName = email.toLowerCase() === 'khushinayak96@gmail.com' ? 'Khushi Nayak' : email.split('@')[0];
      login(email, resolvedName);
    }
  };

  return (
    <div id="auth_container" className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4 transition-colors duration-300">
      <div id="auth_glow_fx" className="absolute w-[500px] h-[500px] bg-sky-200/20 dark:bg-sky-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div id="auth_card" className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none p-8 relative overflow-hidden">
        
        {/* Banner */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-400 via-indigo-500 to-sky-500" />

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md mb-3">
             L
          </div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-gray-900 dark:text-gray-100">
            Life<span className="text-sky-500">OS</span> Workspace
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1.5">
            {isSignUp ? 'Establish your personal operating system' : 'Sign in to your productivity engine'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-xs bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 p-3 rounded-lg border border-rose-100 dark:border-rose-900/40">
              {error}
            </div>
          )}

          {isSignUp && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-zinc-300 block">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Khushi Nayak"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all font-sans"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 dark:text-zinc-300 block">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                placeholder="khushinayak96@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all font-sans"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-zinc-300 block">Password</label>
              {!isSignUp && (
                <a href="#" className="text-[10px] text-sky-500 hover:underline">
                  Forgot?
                </a>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <KeyRound size={16} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-sm shadow-md shadow-indigo-200 dark:shadow-none hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSignUp ? <UserPlus size={16} /> : <LogIn size={16} />}
            {isSignUp ? 'Establish OS Account' : 'Authenticate Credentials'}
          </button>
        </form>

        {/* Demo Account Indicator */}
        {!isSignUp && (
          <div className="mt-4 p-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800/80 rounded-lg text-center flex items-center justify-center gap-2">
            <Sparkles size={12} className="text-sky-500 animate-pulse" />
            <span className="text-[11px] text-gray-500 dark:text-zinc-400 font-mono">
              Prepopulated Demo: <span className="text-sky-500 font-semibold">khushinayak96@gmail.com</span>
            </span>
          </div>
        )}

        {/* Footer Toggle */}
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800/80 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-xs text-gray-500 dark:text-zinc-400 hover:text-sky-500 hover:underline cursor-pointer"
          >
            {isSignUp ? 'Already configured? Log in here' : 'New user? Establish OS account'}
          </button>
        </div>
      </div>
    </div>
  );
}
