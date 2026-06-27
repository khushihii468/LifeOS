import React, { useState, useEffect } from 'react';
import { StateProvider, useAppState } from './context/StateContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Goals from './components/Goals';
import Habits from './components/Habits';
import Projects from './components/Projects';
import Analytics from './components/Analytics';
import Notifications from './components/Notifications';
import Profile from './components/Profile';

import {
  Trophy,
  CheckCircle,
  Flame,
  Zap,
  FolderKanban,
  TrendingUp,
  Bell,
  User,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Compass,
  LayoutGrid,
} from 'lucide-react';

function AppContent() {
  const {
    user,
    currentTab,
    setCurrentTab,
    notifications,
    theme,
    toggleTheme,
    logout,
  } = useAppState();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<{ id: string; title: string; message: string; type: string } | null>(null);

  // Auto detect new notifications to trigger floating toast alerts
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      // Only toast if it was created within the last 5 seconds (not pre-seeded old ones)
      const diffMs = Date.now() - new Date(latest.createdAt).getTime();
      if (diffMs < 5000 && !latest.read) {
        setActiveToast({
          id: latest.id,
          title: latest.title,
          message: latest.message,
          type: latest.type,
        });

        const timer = setTimeout(() => {
          setActiveToast(null);
        }, 4000);

        return () => clearTimeout(timer);
      }
    }
  }, [notifications]);

  // If no user is logged in, show Auth Screen
  if (!user) {
    return <Auth />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Workspace Hub', icon: LayoutGrid },
    { id: 'goals', label: 'Goals Alignment', icon: Trophy },
    { id: 'habits', label: 'Habits consistency', icon: Flame },
    { id: 'projects', label: 'Kanban Boards', icon: FolderKanban },
    { id: 'analytics', label: 'Analytics & KPIs', icon: TrendingUp },
    { id: 'notifications', label: 'Notifications Hub', icon: Bell, badge: notifications.filter(n => !n.read).length },
    { id: 'profile', label: 'User Profile', icon: User },
  ];

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'goals':
        return <Goals />;
      case 'habits':
        return <Habits />;
      case 'projects':
        return <Projects />;
      case 'analytics':
        return <Analytics />;
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  const activeNavItem = navItems.find((item) => item.id === currentTab);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 font-sans text-gray-900 dark:text-zinc-100 flex transition-colors duration-300">
      
      {/* 1. DESKTOP PERMANENT SIDEBAR */}
      <aside className="hidden lg:flex flex-col justify-between w-64 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800/80 p-6 fixed h-full z-20">
        <div className="space-y-6">
          {/* Logo / Title */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg select-none">
              L
            </div>
            <span className="font-bold tracking-tight text-base font-sans">
              Life<span className="text-sky-500">OS</span> Workspace
            </span>
          </div>

          {/* Quick Profile Widget */}
          <div className="p-3.5 bg-gray-50 dark:bg-zinc-955 rounded-xl border border-gray-100 dark:border-zinc-850 flex items-center gap-3">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'}
              alt="User profile"
              className="w-9 h-9 rounded-lg object-cover ring-2 ring-sky-500/10"
              referrerPolicy="no-referrer"
            />
            <div className="overflow-hidden">
              <span className="block font-semibold text-xs leading-none truncate text-gray-800 dark:text-zinc-200">
                {user.name}
              </span>
              <span className="block text-[10px] text-gray-400 truncate mt-0.5">
                {user.email}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-sky-50 dark:bg-sky-950/20 border border-sky-100/50 dark:border-sky-900/10 text-sky-655 dark:text-sky-400 font-bold shadow-xs'
                      : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-850/50 hover:text-gray-800 dark:hover:text-zinc-205'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="bg-red-500 text-white font-bold font-mono text-[9px] px-1.5 py-0.2 rounded-full leading-normal">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div id="sidebar_actions_foot" className="pt-4 border-t border-gray-50 dark:border-zinc-850">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className="p-2 border border-gray-100 dark:border-zinc-800 hover:bg-gray-100 rounded-xl transition-all cursor-pointer text-gray-505"
              title="Toggle theme mode"
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            <button
              onClick={logout}
              className="flex items-center justify-center p-2 border border-gray-100 dark:border-zinc-800 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all cursor-pointer text-gray-505"
              title="Sign Out session"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN LAYOUT AND HEADER CONTAINER */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* TOP MOBILE BAR / DESKTOP HEADER */}
        <header className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-805 px-4 lg:px-8 py-3.5 sticky top-0 z-10 flex justify-between items-center transition-colors">
          <div className="flex items-center gap-2 lg:gap-0">
            {/* Mobile Menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 border border-gray-100 rounded-lg lg:hidden text-gray-500"
            >
              <Menu size={16} />
            </button>

            <h1 className="text-sm font-bold font-mono text-gray-800 dark:text-zinc-200">
               ~/{activeNavItem?.label.toLowerCase().replace(' ', '_')}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Small Quick mode toggles */}
            <button
              onClick={toggleTheme}
              className="p-1.5 border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg text-gray-550 transition-colors lg:hidden"
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            </button>

            {/* Quick profile indicators */}
            <div
              onClick={() => setCurrentTab('profile')}
              className="flex items-center gap-2 p-1 border border-gray-100 dark:border-zinc-800-0 rounded-lg cursor-pointer bg-gray-50/50 dark:bg-zinc-950/20"
            >
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop'}
                alt="Avatar"
                className="w-5 h-5 rounded object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="hidden sm:inline text-[10px] font-mono pr-1 text-gray-505">
                {user.name.split(' ')[0]}
              </span>
            </div>
          </div>
        </header>

        {/* 3. CORE ROUTE RENDERER VIEWS WINDOW */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
          {renderActiveTab()}
        </main>
      </div>

      {/* 4. MOBILE SLIDEOUT DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 lg:hidden backdrop-blur-xs flex">
          <div className="bg-white dark:bg-zinc-900 w-64 p-6 flex flex-col justify-between relative shadow-2xl h-full border-r border-gray-100">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white font-bold select-none text-lg">
                  L
                </div>
                <span className="font-bold text-base font-sans">
                  Life<span className="text-sky-500">OS</span> Workspace
                </span>
              </div>

              <nav className="space-y-1 pt-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 font-bold'
                          : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={15} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && item.badge > 0 ? (
                        <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full leading-normal">
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-gray-50 flex justify-between">
              <button
                onClick={toggleTheme}
                className="text-xs text-gray-400 cursor-pointer hover:text-gray-600"
              >
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
              <button
                onClick={logout}
                className="text-xs text-rose-500 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* 5. GORGEOUS POPPING FLOATING ALERTS (TOASTS) */}
      {activeToast && (
        <div
          id="system_floating_toast"
          className="fixed bottom-4 right-4 z-50 w-full max-w-sm bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl p-4 flex gap-3 animate-fade-in"
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 text-white text-[11px] font-bold ${
              activeToast.type === 'success'
                ? 'bg-emerald-500'
                : activeToast.type === 'warning'
                ? 'bg-rose-500'
                : 'bg-sky-500'
            }`}
          >
            !
          </span>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-gray-900 dark:text-zinc-50 leading-tight">
              {activeToast.title}
            </h4>
            <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5 leading-relaxed">
              {activeToast.message}
            </p>
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className="text-gray-300 hover:text-gray-500 flex-shrink-0"
          >
            <X size={12} />
          </button>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <StateProvider>
      <AppContent />
    </StateProvider>
  );
}
