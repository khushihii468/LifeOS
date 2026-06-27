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

import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Flame,
  FolderKanban,
  TrendingUp,
  Bell,
  User,
  LogOut,
  Search,
  CheckCircle,
  X,
  Compass,
  LayoutGrid,
  Command,
  FileText,
  Calendar,
  Leaf,
  Settings,
  HelpCircle,
  Folder,
} from 'lucide-react';

// Formatter for quiet journal clock
function formatTopBarClock(date: Date) {
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minStr = minutes < 10 ? '0' + minutes : minutes;
  return `${weekday}, ${month} ${day} — ${hours}:${minStr} ${ampm}`;
}

// Nature-inspired colorful design themes for each planner segment
function getTabTheme(tabId: string) {
  switch (tabId) {
    case 'dashboard':
      return {
        accent: '#2D6A4F', // Lush Deep Fern Green
        brandClass: 'text-[#2D6A4F]',
        bannerText: 'Fern Canopy — Overview of your day'
      };
    case 'goals':
      return {
        accent: '#D35400', // Warm Autumn Copper Maple Red-Orange
        brandClass: 'text-[#D35400]',
        bannerText: 'Maple Trail — Roadmap & active lifepath alignments'
      };
    case 'habits':
      return {
        accent: '#C0392B', // Rowan Berry / Wildwood Crimson Red
        brandClass: 'text-[#C0392B]',
        bannerText: 'Rowan Berry — Habits & routine consistency tracking'
      };
    case 'projects':
      return {
        accent: '#1F618D', // Alpine River / Lake Blue-Teal
        brandClass: 'text-[#1F618D]',
        bannerText: 'Cascade Creek — Sprint boards, checklists & checklists'
      };
    case 'analytics':
      return {
        accent: '#6C3483', // Nightshade Blueberry / Heather Purple
        brandClass: 'text-[#6C3483]',
        bannerText: 'Nightshade Heather — Trailing metrics and retrospective calculations'
      };
    case 'notifications':
      return {
        accent: '#7E5109', // Forest Pinecone Clay / Cedar Ocre
        brandClass: 'text-[#7E5109]',
        bannerText: 'Clay Soil — Automated ledger records and alerts'
      };
    case 'profile':
      return {
        accent: '#8C5338', // Golden Birch Bark / Honey Chestnut
        brandClass: 'text-[#8C5338]',
        bannerText: 'Sweet Birch — User configurations & personal setup'
      };
    default:
      return {
        accent: '#2D6A4F',
        brandClass: 'text-[#2D6A4F]',
        bannerText: 'Woodland Overview'
      };
  }
}

function AppContent() {
  const {
    user,
    currentTab,
    setCurrentTab,
    notifications,
    logout,
    habits,
    goals,
    projects,
    toggleHabitLog,
  } = useAppState();

  const activeTheme = getTabTheme(currentTab);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [activeToast, setActiveToast] = useState<{ id: string; title: string; message: string; type: string } | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut listener (⌘K or Ctrl K) for global Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setActiveMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleOutsideClick = () => setActiveMenu(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Display toast alerts beautifully
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      const diffMs = Date.now() - new Date(latest.createdAt).getTime();
      if (diffMs < 4000 && !latest.read) {
        setActiveToast({
          id: latest.id,
          title: latest.title,
          message: latest.message,
          type: latest.type,
        });

        const timer = setTimeout(() => {
          setActiveToast(null);
        }, 3500);

        return () => clearTimeout(timer);
      }
    }
  }, [notifications]);

  if (!user) {
    return <Auth />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Planner Hub', icon: LayoutGrid, tooltip: 'Overview of your day' },
    { id: 'goals', label: 'Objectives', icon: Trophy, tooltip: 'Roadmap & goals' },
    { id: 'habits', label: 'Daily Routines', icon: Flame, tooltip: 'Habits & consistency' },
    { id: 'projects', label: 'Task List', icon: FolderKanban, tooltip: 'Sprint boards & checklists' },
    { id: 'analytics', label: 'Retrospective', icon: TrendingUp, tooltip: 'KPI logs & charts' },
    { id: 'notifications', label: 'Journal Logs', icon: Bell, badge: notifications.filter(n => !n.read).length, tooltip: 'Notifications archive' },
    { id: 'profile', label: 'Planner Setup', icon: User, tooltip: 'User customizations' },
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

  const todayStr = new Date().toISOString().split('T')[0];

  // Search filter list for our clean Spotlight dialog
  const filteredPaletteItems = (() => {
    const query = commandSearch.trim().toLowerCase();
    const items: Array<{
      category: string;
      title: string;
      subtitle?: string;
      action: () => void;
      element?: React.ReactNode;
    }> = [];

    navItems.forEach(item => {
      items.push({
        category: 'Navigation',
        title: `Go to ${item.label}`,
        subtitle: `Switch view to ${item.tooltip.toLowerCase()}`,
        action: () => {
          setCurrentTab(item.id);
          setCommandPaletteOpen(false);
        }
      });
    });

    items.push({
      category: 'Account Actions',
      title: 'Sign Out session',
      subtitle: 'Close daily log safely',
      action: () => {
        logout();
        setCommandPaletteOpen(false);
      }
    });

    habits.forEach(habit => {
      const isLoggedToday = habit.logs.some(l => l.date === todayStr);
      items.push({
        category: 'Routines Tracker',
        title: `${isLoggedToday ? 'Unmark' : 'Log'} Habit: ${habit.name}`,
        subtitle: `${habit.streak}d streak • Daily • Target: ${habit.targetPerDay}x`,
        action: () => {
          toggleHabitLog(habit.id, todayStr);
        },
        element: (
          <span className={`text-[10px] px-2 py-0.5 rounded border ${
            isLoggedToday 
              ? 'bg-[#5C7C5A]/10 text-[#5C7C5A] border-[#5C7C5A]/40' 
              : 'bg-[#F7F5F2] text-zinc-500 border-[#E5E1DA]'
          }`}>
            {isLoggedToday ? 'Logged' : 'Click to Log'}
          </span>
        )
      });
    });

    goals.forEach(goal => {
      items.push({
        category: 'Roadmap Objectives',
        title: goal.title,
        subtitle: `Priority: ${goal.priority} • Progress: ${goal.progress}% • Due: ${goal.targetDate}`,
        action: () => {
          setCurrentTab('goals');
          setCommandPaletteOpen(false);
        }
      });
    });

    projects.forEach(project => {
      items.push({
        category: 'Task Lists',
        title: project.name,
        subtitle: `${project.tasks.length} subtasks • Priority: ${project.priority} • Target: ${project.dueDate}`,
        action: () => {
          setCurrentTab('projects');
          setCommandPaletteOpen(false);
        }
      });
    });

    if (!query) return items;

    return items.filter(
      item =>
        item.title.toLowerCase().includes(query) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(query)) ||
        item.category.toLowerCase().includes(query)
    );
  })();

  const activeNavItem = navItems.find((item) => item.id === currentTab);

  return (
    <div className="min-h-screen bg-[#F7F5F2] text-[#1D1D1F] pb-24 lg:pb-12 font-sans relative antialiased">
      
      {/* Elegant, flat header mimicking a physical planner cover top-edge */}
      <div className="h-11 w-full fixed top-0 inset-x-0 z-40 bg-white border-b border-[#E5E1DA] flex justify-between items-center px-6 text-[12px] select-none">
        
        {/* Left Side: Soft Human branding and index buttons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'branding' ? null : 'branding'); }}
            className="text-[#5C7C5A] hover:opacity-80 transition-opacity flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <Leaf size={14} />
            <span className="font-serif italic font-bold">LifeOS Planner</span>
          </button>
          
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'notebook' ? null : 'notebook'); }}
              className={`px-2 py-0.5 rounded text-zinc-500 hover:text-[#1D1D1F] hover:bg-[#F7F5F2] cursor-pointer transition-colors ${activeMenu === 'notebook' ? 'bg-[#F7F5F2] text-[#1D1D1F]' : ''}`}
            >
              Modules
            </button>
            {activeMenu === 'notebook' && (
              <div className="absolute left-0 mt-2.5 w-52 bg-white border border-[#E5E1DA] rounded-lg shadow-sm p-1 flex flex-col z-50 text-[11px]">
                <div className="px-2 py-1 text-[9px] font-bold text-zinc-400 uppercase tracking-widest border-b border-[#F7F5F2] mb-1.5">
                  Planner Chapters
                </div>
                {navItems.map(item => (
                  <button key={item.id} onClick={() => { setCurrentTab(item.id); setActiveMenu(null); }} className="w-full text-left px-2 py-1.5 rounded hover:bg-[#F7F5F2] text-zinc-700 hover:text-[#1D1D1F] flex items-center gap-2 cursor-pointer transition-colors">
                    <item.icon size={12} className="text-[#5C7C5A] opacity-80" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-[#E5E1DA] select-none">|</span>
          <span className="text-[11px] text-zinc-450 uppercase tracking-wider font-mono">
            {activeNavItem?.label}
          </span>
        </div>

        {/* Center: Spotlight Box trigger styled like an index label */}
        <div 
          onClick={() => setCommandPaletteOpen(true)}
          className="mx-4 flex-1 max-w-[240px] h-6.5 bg-[#F7F5F2] hover:bg-white border border-[#E5E1DA] rounded-md flex items-center justify-between px-2.5 text-zinc-450 cursor-pointer transition-all text-[11px]"
        >
          <div className="flex items-center gap-1.5">
            <Search size={11} className="text-[#5C7C5A] shrink-0" />
            <span className="truncate">Search notes & logs...</span>
          </div>
          <div className="flex items-center gap-0.5 text-[8.5px] font-mono text-zinc-400 bg-white border border-[#E5E1DA] px-1 rounded-sm">
            <span>⌘K</span>
          </div>
        </div>

        {/* Right Side: Simple Paper specs & Clock */}
        <div className="flex items-center gap-4">
          <span className="text-[11.5px] font-serif italic text-zinc-550 select-none">
            {formatTopBarClock(currentTime)}
          </span>
          <span className="text-[#E5E1DA] select-none">|</span>
          
          <button 
            onClick={() => setCurrentTab('profile')}
            className="flex items-center gap-1.5 border border-[#E5E1DA] pl-1 pr-2 py-0.5 rounded-full hover:bg-[#F7F5F2] transition-colors"
          >
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
              className="w-4 h-4 rounded-full object-cover grayscale opacity-90 border border-[#E5E1DA]"
              referrerPolicy="no-referrer"
              alt="Avatar"
            />
            <span className="text-[10px] font-semibold text-zinc-700">
              {user.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>

      {/* Main Container styled like a pristine leaf of high-grade paper on a physical desk */}
      <main className="pt-20 px-4 md:px-8 max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="bg-white border border-[#E5E1DA] rounded-xl p-6 md:p-10 shadow-[0_2px_12px_rgba(29,29,31,0.03)] relative overflow-hidden"
          >
            {/* Dynamic visual woodland segment marker bar */}
            <div 
              className="absolute top-0 inset-x-0 h-1.5 transition-all duration-300"
              style={{ backgroundColor: activeTheme.accent }}
            />
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FIXED DOCK: Elegant physical planner tab rails */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white border border-[#E5E1DA] px-3.5 py-2.5 rounded-full shadow-sm flex gap-2 items-center justify-center select-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const itemTheme = getTabTheme(item.id);
          return (
            <div key={item.id} className="relative group flex flex-col items-center">
              <motion.button
                onClick={() => setCurrentTab(item.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.12 }}
                className={`w-9.5 h-9.5 rounded-full flex items-center justify-center cursor-pointer transition-all relative ${
                  isActive
                    ? 'text-white'
                    : 'bg-transparent hover:bg-[#F7F5F2] text-zinc-550 hover:text-[#1D1D1F]'
                }`}
                style={isActive ? { backgroundColor: itemTheme.accent } : undefined}
              >
                <Icon size={16} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-1 bg-[#C47A5A] text-white font-mono text-[8.5px] px-1 rounded-full leading-normal">
                    {item.badge}
                  </span>
                ) : null}
              </motion.button>
              
              {/* Discrete page indicator tick underneath */}
              {isActive && (
                <div 
                  className="absolute -bottom-1 w-1.5 h-0.5 rounded-full" 
                  style={{ backgroundColor: activeTheme.accent }}
                />
              )}

              {/* Tooltip hovering tag */}
              <div className="absolute opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all pointer-events-none duration-150 whitespace-nowrap bg-[#1D1D1F] border border-zinc-800 text-white px-2.5 py-1 text-[10px] rounded shadow-md z-50 flex flex-col items-center bottom-14"
              >
                <span className="font-semibold">{item.label}</span>
              </div>
            </div>
          );
        })}

        <div className="w-px h-6 bg-[#E5E1DA] mx-1" />

        {/* Quiet signout button */}
        <button
          onClick={logout}
          className="w-9.5 h-9.5 rounded-full bg-transparent hover:bg-rose-50 text-zinc-450 hover:text-[#C47A5A] flex items-center justify-center cursor-pointer transition-colors"
          title="Sign out of OS session"
        >
          <LogOut size={16} />
        </button>
      </nav>

      {/* COSY SPOTLIGHT COMMAND PALETTE OVERLAY */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <div id="raycast_modal_dim" className="fixed inset-0 bg-[#343434]/25 z-50 flex items-start justify-center pt-24 px-4 select-none">
            <div className="absolute inset-0 cursor-pointer" onClick={() => setCommandPaletteOpen(false)} />
            
            <motion.div
              initial={{ scale: 0.98, y: -8, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: -8, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="bg-white border border-[#E5E1DA] w-full max-w-lg rounded-xl shadow-sm overflow-hidden z-50 flex flex-col text-[#1D1D1F]"
            >
              {/* Header Box search field */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E5E1DA] bg-white">
                <Search size={15} className="text-[#5C7C5A] shrink-0" />
                <input
                  type="text"
                  placeholder="Type a command to search habits, objectives, or views..."
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-xs text-[#1D1D1F] placeholder-zinc-400 font-sans"
                  autoFocus
                />
                <div onClick={() => setCommandPaletteOpen(false)} className="text-[9px] bg-[#F7F5F2] border border-[#E5E1DA] font-mono px-1.5 py-0.5 rounded cursor-pointer text-zinc-500">
                  ESC
                </div>
              </div>

              {/* Items List Box */}
              <div className="max-h-[300px] overflow-y-auto p-2 bg-white">
                {filteredPaletteItems.length === 0 ? (
                  <div className="text-center py-8 text-xs text-zinc-450 font-serif italic">
                    No records found for "{commandSearch}"
                  </div>
                ) : (
                  Object.entries(
                    filteredPaletteItems.reduce((acc, current) => {
                      if (!acc[current.category]) acc[current.category] = [];
                      acc[current.category].push(current);
                      return acc;
                      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    }, {} as Record<string, any[]>)
                  ).map(([cat, sectionItems]) => (
                    <div key={cat} className="mb-2">
                      <div className="text-[9px] font-bold text-[#5C7C5A] uppercase tracking-widest pl-3.5 pt-2 pb-1 text-left">
                        {cat}
                      </div>

                      {sectionItems.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            item.action();
                          }}
                          className="w-full flex items-center justify-between text-left px-3.5 py-2 rounded-lg hover:bg-[#F7F5F2] transition-colors cursor-pointer group"
                        >
                          <div className="overflow-hidden mr-2">
                            <div className="font-semibold text-xs text-[#1D1D1F] truncate">
                              {item.title}
                            </div>
                            {item.subtitle && (
                              <div className="text-[10px] text-zinc-450 truncate mt-0.5">
                                {item.subtitle}
                              </div>
                            )}
                          </div>
                          {item.element ? item.element : (
                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[9px] text-[#5C7C5A] bg-[#5C7C5A]/10 border border-[#5C7C5A]/25 px-1.5 py-0.5 rounded shrink-0">
                              <span>Open</span>
                              <Command size={8} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ))
                )}
              </div>

              {/* Helper instruction footer */}
              <div className="border-t border-[#E5E1DA] bg-[#F7F5F2]/50 text-[10px] text-zinc-500 px-4.5 py-2.5 flex items-center justify-between">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1 font-mono"><span className="border border-[#E5E1DA] font-bold px-1 rounded bg-white">↵</span> select</span>
                  <span className="flex items-center gap-1 font-mono"><span className="border border-[#E5E1DA] font-bold px-1 rounded bg-white">⌘K</span> toggle logs finder</span>
                </div>
                <span className="font-serif italic text-zinc-455">LifeOS Paper Index</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUIET, TOAST NOTICES */}
      {activeToast && (
        <div id="system_floating_toast" className="fixed bottom-22 right-6 z-50 w-full max-w-sm bg-white border border-[#E5E1DA] rounded-xl shadow-md p-4 flex gap-3 animate-fade-in text-[#1D1D1F]">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 text-white text-[10px] font-bold ${
              activeToast.type === 'success'
                ? 'bg-[#5C7C5A]'
                : activeToast.type === 'warning'
                ? 'bg-[#C47A5A]'
                : 'bg-zinc-650'
            }`}
          >
            ✓
          </span>
          <div className="flex-1">
            <h4 className="text-xs font-semibold leading-tight text-[#1D1D1F]">
              {activeToast.title}
            </h4>
            <p className="text-[10.5px] text-zinc-500 mt-1 leading-relaxed">
              {activeToast.message}
            </p>
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className="text-zinc-400 hover:text-zinc-600 flex-shrink-0 self-start"
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
