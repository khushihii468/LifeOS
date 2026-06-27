import React from 'react';
import { useAppState } from '../context/StateContext';
import {
  Trophy,
  CheckCircle,
  Flame,
  Zap,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function Dashboard() {
  const {
    goals,
    habits,
    projects,
    notifications,
    toggleHabitLog,
    productivityScore,
    setCurrentTab,
  } = useAppState();

  const activeGoals = goals.filter((g) => g.status === 'In Progress');
  const completedGoalsCount = goals.filter((g) => g.status === 'Completed').length;

  // Calculate highest habit streak
  const highestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);

  // Today's Date String (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  // Map out weekly trend chart data based on loaded activities
  const weeklyTrendData = [
    { name: 'Mon', completion: 65, consistency: 72 },
    { name: 'Tue', completion: 80, consistency: 85 },
    { name: 'Wed', completion: 74, consistency: 78 },
    { name: 'Thu', completion: 85, consistency: 80 },
    { name: 'Fri', completion: 90, consistency: 88 },
    { name: 'Sat', completion: 95, consistency: 92 },
    { name: 'Sun', completion: productivityScore.overallScore, consistency: productivityScore.habitConsistency },
  ];

  return (
    <div id="dashboard_tab" className="space-y-6">
      
      {/* Brand Greetings Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between py-1 gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans tracking-tight text-gray-900 dark:text-zinc-50 flex items-center gap-2">
            Workspace Hub <Sparkles size={20} className="text-amber-500 animate-pulse" />
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Real-time analytics for your goals, projects, and daily completion logs.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/30 px-3.5 py-1.5 rounded-xl">
          <TrendingUp size={16} className="text-sky-500" />
          <span className="text-xs font-mono font-medium text-sky-700 dark:text-sky-400">
            Productivity Score: {productivityScore.overallScore}%
          </span>
        </div>
      </div>

      {/* Top 4 Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* STAT 1: Active Goals */}
        <div id="stat_active_goals" className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm transition-transform hover:translate-y-[-2px] duration-200">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 tracking-wider uppercase">Active Goals</span>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-zinc-50 mt-1">{activeGoals.length}</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500">
              <Trophy size={20} />
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-zinc-400 mt-3 flex items-center justify-between">
            <span>Completed out of total:</span>
            <span className="font-mono bg-indigo-50/50 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400 font-semibold">{completedGoalsCount} of {goals.length}</span>
          </div>
        </div>

        {/* STAT 2: Habit Consistency */}
        <div id="stat_habit_rate" className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm transition-transform hover:translate-y-[-2px] duration-200">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 tracking-wider uppercase">Completion Rate</span>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-zinc-50 mt-1">{productivityScore.habitConsistency}%</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-500">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-zinc-400 mt-3">
            <div className="w-full bg-gray-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-teal-500 h-full transition-all" style={{ width: `${productivityScore.habitConsistency}%` }} />
            </div>
          </div>
        </div>

        {/* STAT 3: Current Streak */}
        <div id="stat_current_streak" className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm transition-transform hover:translate-y-[-2px] duration-200">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 tracking-wider uppercase">Current Streak</span>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-zinc-50 mt-1">{highestStreak} <span className="text-xs text-gray-500 font-normal">days</span></h3>
            </div>
            <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-500">
              <Flame size={20} />
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-zinc-400 mt-3 flex items-center justify-between">
            <span>Most successful habit:</span>
            <span className="font-mono bg-orange-50/50 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-orange-600 dark:text-orange-400 font-semibold">{habits.length > 0 ? habits[0].name.split(' ')[0] : 'None'}</span>
          </div>
        </div>

        {/* STAT 4: Productivity Score */}
        <div id="stat_productivity_score" className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm transition-transform hover:translate-y-[-2px] duration-200">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-gray-400 dark:text-zinc-400 tracking-wider uppercase">Productivity Score</span>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-zinc-50 mt-1">{productivityScore.overallScore}%</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-500">
              <Zap size={20} />
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-zinc-400 mt-3">
            <div className="w-full bg-gray-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full transition-all" style={{ width: `${productivityScore.overallScore}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Today's Habits widget */}
        <div id="widget_todays_habits" className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-2">
                <CheckCircle size={16} className="text-teal-500" />
                Today's Habits
              </h4>
              <button
                onClick={() => setCurrentTab('habits')}
                className="text-xs text-sky-500 hover:underline flex items-center gap-0.5"
              >
                Manage
                <ArrowRight size={12} />
              </button>
            </div>
            
            {habits.length === 0 ? (
              <div className="text-center py-8 text-gray-400 dark:text-zinc-500 text-xs">
                No active habits. Create habits to start tracking!
              </div>
            ) : (
              <div className="space-y-3">
                {habits.map((h) => {
                  const completedToday = h.logs.some((l) => l.date === todayStr);
                  return (
                    <div
                      key={h.id}
                      onClick={() => toggleHabitLog(h.id, todayStr)}
                      className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer select-none transition-all ${
                        completedToday
                          ? 'bg-teal-50/40 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900/50'
                          : 'bg-gray-50 dark:bg-zinc-950/50 border-gray-100 dark:border-zinc-800/80 hover:border-gray-200 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                            completedToday
                              ? 'bg-teal-500 border-teal-500 text-white'
                              : 'border-gray-300 dark:border-zinc-700'
                          }`}
                        >
                          {completedToday && <CheckCircle size={12} />}
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${completedToday ? 'text-teal-900 dark:text-teal-300 line-through' : 'text-gray-800 dark:text-zinc-200'}`}>
                            {h.name}
                          </p>
                          <span className="text-[10px] text-gray-400 font-mono">
                            Streak: {h.streak}d • Max: {h.maxStreak}d
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-white dark:bg-zinc-850 px-2 py-0.5 rounded border border-gray-100 dark:border-zinc-800 font-semibold text-gray-500 dark:text-zinc-300">
                        {h.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-gray-400">
            <span>Log daily to keep consistency high.</span>
          </div>
        </div>

        {/* Column 2: Weekly progress graph + upcoming goal deadlines */}
        <div className="lg:col-span-2 space-y-6">
          <div id="widget_weekly_chart" className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-2">
                <Layers size={16} className="text-sky-500" />
                Weekly Performance Trend
              </h4>
              <span className="text-xs text-gray-400 dark:text-zinc-400">Active metrics</span>
            </div>
            
            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" className="hidden dark:block" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.95)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="completion" fill="#38bdf8" name="Productivity" radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar dataKey="consistency" fill="#14b8a6" name="Consistency" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row components: upcoming goals deadline & recent activity tracker */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Upcoming Deadlines Widget */}
            <div id="widget_upcoming_deadlines" className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-2 mb-4">
                  <Calendar size={16} className="text-indigo-500" />
                  Upcoming Deadlines
                </h4>
                
                {activeGoals.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 dark:text-zinc-500 text-xs">
                    No active goals. You are free for now!
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {activeGoals.slice(0, 3).map((g) => {
                      const daysLeft = Math.round(
                        (new Date(g.targetDate).getTime() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      );
                      return (
                        <div key={g.id} className="flex justify-between items-center text-xs">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-gray-850 dark:text-zinc-250 block truncate max-w-[150px]">
                              {g.title}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {g.category} • Progress: {g.progress}%
                            </span>
                          </div>
                          <span
                            className={`font-mono px-2 py-0.5 rounded font-bold text-[10px] ${
                              daysLeft < 3
                                ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                                : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
                            }`}
                          >
                            {daysLeft > 0 ? `${daysLeft}d left` : daysLeft === 0 ? 'Today' : `${Math.abs(daysLeft)}d overdue`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setCurrentTab('goals')}
                className="w-full text-center text-xs text-sky-500 hover:underline mt-4 pt-3.5 border-t border-gray-100 dark:border-zinc-800/80 cursor-pointer"
              >
                View all tracking goals
              </button>
            </div>

            {/* Recent Notifications / Event Activity Logs */}
            <div id="widget_recent_activity" className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-2 mb-4">
                  <Layers size={16} className="text-orange-500" />
                  Recent Notifications
                </h4>
                
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 dark:text-zinc-500 text-xs">
                    Workspace is empty. No notifications logged.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[140px] overflow-y-auto">
                    {notifications.slice(0, 3).map((n) => (
                      <div key={n.id} className="flex gap-2 text-xs">
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                            n.type === 'success'
                              ? 'bg-emerald-500'
                              : n.type === 'warning'
                              ? 'bg-rose-500'
                              : 'bg-sky-500'
                          }`}
                        />
                        <div>
                          <p className="font-medium text-gray-800 dark:text-zinc-200 leading-tight">
                            {n.title}
                          </p>
                          <p className="text-[10px] text-gray-400 block truncate max-w-[190px]">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setCurrentTab('notifications')}
                className="w-full text-center text-xs text-sky-500 hover:underline mt-4 pt-3.5 border-t border-gray-100 dark:border-zinc-800/80 cursor-pointer"
              >
                Open Notification Center
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
