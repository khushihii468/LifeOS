import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { Habit, Category, Frequency } from '../types';
import {
  Flame,
  Calendar,
  Sparkles,
  BarChart,
  Grid,
  Plus,
  Trash,
  Check,
  CheckCircle,
  HelpCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export default function Habits() {
  const { habits, addHabit, deleteHabit, toggleHabitLog } = useAppState();

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('Daily');
  const [category, setCategory] = useState<Category>('Health');
  const [targetPerDay, setTargetPerDay] = useState(1);
  const [showCreator, setShowCreator] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper: Get past date strings for heatmap (14 weeks = 98 days)
  const totalHeatmapDays = 98;
  const heatmapDates: string[] = [];
  for (let i = totalHeatmapDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    heatmapDates.push(d.toISOString().split('T')[0]);
  }

  // Group heatmapDates into weeks (7 days each) for columns
  const heatmapWeeks: string[][] = [];
  for (let i = 0; i < heatmapDates.length; i += 7) {
    heatmapWeeks.push(heatmapDates.slice(i, i + 7));
  }

  const handleCreateHabitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addHabit({
      name: name.trim(),
      description: desc.trim(),
      frequency,
      category,
      targetPerDay: Number(targetPerDay) || 1,
    });

    setName('');
    setDesc('');
    setFrequency('Daily');
    setCategory('Health');
    setTargetPerDay(1);
    setShowCreator(false);
  };

  // 1. Calculate general habit stats
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.maxStreak), 0);
  const totalCurrentStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);

  // Completion Percentage across previous week
  let overallCompletionPercentage = 0;
  if (habits.length > 0) {
    let checkedCount = 0;
    const past7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    });

    habits.forEach((h) => {
      past7Days.forEach((dateStr) => {
        if (h.logs.some((l) => l.date === dateStr)) {
          checkedCount++;
        }
      });
    });

    const totalPossibleChecks = habits.length * 7;
    overallCompletionPercentage = Math.round((checkedCount / totalPossibleChecks) * 100);
  }

  // Find most successful habit (highest current streak if any)
  const mostSuccessfulHabit = habits.length > 0
    ? [...habits].sort((a, b) => b.streak - a.streak)[0]
    : null;

  // Generate weekly completions summary chart data
  const weeklyCompletionData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const weekdayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

    // count how many habits checked on this date
    let loggedNum = 0;
    habits.forEach((h) => {
      if (h.logs.some((l) => l.date === dateStr)) {
        loggedNum++;
      }
    });

    return {
      day: weekdayLabel,
      completed: loggedNum,
    };
  });

  return (
    <div id="habits_module_root" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1 gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans tracking-tight text-gray-900 dark:text-zinc-50">
            Habit Consistency
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Build consistency through positive actions. Log daily marks to feed your streaks.
          </p>
        </div>
        <button
          onClick={() => setShowCreator(!showCreator)}
          className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-xl text-xs shadow-md shadow-indigo-100 dark:shadow-none hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer max-w-max self-start sm:self-center"
        >
          <Plus size={15} />
          Track New Habit
        </button>
      </div>

      {/* Creator Form block */}
      {showCreator && (
        <div className="bg-white dark:bg-zinc-900 border border-sky-100 dark:border-zinc-800 p-6 rounded-2xl shadow-md space-y-4 max-w-xl animate-fade-in">
          <h3 className="font-bold text-gray-900 dark:text-zinc-50 text-sm flex items-center gap-1.5">
            <Sparkles size={16} className="text-amber-500" />
            Define Good Habit
          </h3>

          <form onSubmit={handleCreateHabitSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Habit Name</label>
                <input
                  type="text"
                  placeholder="LeetCode Daily Problem"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-900 dark:text-zinc-50 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Description</label>
                <input
                  type="text"
                  placeholder="15 minutes of algorithmic problem solving"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-900 dark:text-gray-150 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as Frequency)}
                  className="w-full py-2.5 px-3 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl text-xs text-gray-700 dark:text-zinc-300"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full py-2.5 px-3 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl text-xs text-gray-700 dark:text-zinc-300"
                >
                  <option value="Career">Career</option>
                  <option value="Health">Health</option>
                  <option value="Finance">Finance</option>
                  <option value="Learning">Learning</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">Target Per Day</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={targetPerDay}
                  onChange={(e) => setTargetPerDay(Number(e.target.value))}
                  className="w-full py-2.5 px-3 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl text-xs text-gray-705"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setShowCreator(false)}
                className="px-4 py-2 border border-gray-100 dark:border-zinc-850 rounded-xl text-gray-500 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-4 py-2 rounded-xl shadow"
              >
                Track Habit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Analytics top info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Current Max Streak</span>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <Flame size={20} className="text-orange-500 fill-orange-500/10" />
            <span className="text-2xl font-bold font-sans text-gray-900 dark:text-zinc-100">{totalCurrentStreak} <span className="text-xs text-gray-450 font-normal">days</span></span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">All-Time Max Streak</span>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <Flame size={20} className="text-indigo-500" />
            <span className="text-2xl font-bold font-sans text-gray-900 dark:text-zinc-100">{longestStreak} <span className="text-xs text-gray-450 font-normal">days</span></span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Weekly Consistency</span>
          <div className="flex items-center justify-center mt-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{overallCompletionPercentage}%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Most Consistent</span>
          <div className="flex items-center justify-center mt-1">
            <span className="text-sm font-bold font-sans text-teal-600 dark:text-teal-400 max-w-[150px] truncate">
              {mostSuccessfulHabit ? mostSuccessfulHabit.name : 'N/A'}
            </span>
          </div>
        </div>

      </div>

      {/* CORE HEATMAP BLOCK VISUALIZATION (GitHub style) */}
      <div id="habit_heatmap_card" className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <h3 className="font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-2 text-sm">
            <Grid size={16} className="text-sky-500" />
            GitHub-Style Habit Heatmap
          </h3>
          <div className="flex items-center gap-4 text-[10px] font-mono text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-gray-100 dark:bg-zinc-800 rounded" /> Less</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-teal-500 rounded" /> More completions</span>
          </div>
        </div>

        {/* Heatmap Grid map container (responsive scroll) */}
        <div className="overflow-x-auto pb-2">
          {habits.length === 0 ? (
            <div className="text-center py-6 text-xs text-gray-400 font-mono">
              Establish habits to compile heatmap grid cells.
            </div>
          ) : (
            <div className="flex gap-1 min-w-[580px] justify-between">
              {heatmapWeeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1">
                  {week.map((dateStr) => {
                    // Check if any habit has checked on this exact dateStr
                    let checkedHabitsOnDate = 0;
                    habits.forEach((h) => {
                      if (h.logs.some((l) => l.date === dateStr)) {
                        checkedHabitsOnDate++;
                      }
                    });

                    // Determine grade intensity level color
                    let cellColor = 'bg-gray-100 dark:bg-zinc-800/80';
                    if (checkedHabitsOnDate > 0) {
                      if (checkedHabitsOnDate === 1) {
                        cellColor = 'bg-teal-200 dark:bg-teal-900/40 text-white';
                      } else if (checkedHabitsOnDate <= 2) {
                        cellColor = 'bg-teal-400 dark:bg-teal-700';
                      } else {
                        cellColor = 'bg-teal-600 dark:bg-teal-500';
                      }
                    }

                    const formattedDate = new Date(dateStr).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });

                    return (
                      <div
                        key={dateStr}
                        className={`w-3.5 h-3.5 rounded transition-colors group cursor-pointer ${cellColor}`}
                        title={`${formattedDate}: Completed ${checkedHabitsOnDate} habits`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
        <p className="text-[10px] text-gray-400 font-sans leading-none">
          * Heatmap traces completions over the previous 98 days chronologically. Hover blocks to check completions count.
        </p>
      </div>

      {/* SPLIT SCREEN WIDGETS: Weekly Chart / Interactive check logger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly recharts graph completion indicator */}
        <div id="habit_bar_chart_card" className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-2 mb-4 text-sm">
            <BarChart size={16} className="text-teal-500" />
            7-Day Completion Volume
          </h3>
          <div className="w-full h-48">
            <ResponsiveContainer width="105%" height="100%">
              <RechartsBarChart data={weeklyCompletionData} margin={{ top: 5, right: 10, left: -40, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="completed" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Interactive List */}
        <div id="habits_list_container" className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-2 text-sm">
            <CheckCircle size={16} className="text-indigo-500" />
            Track Habits Progress
          </h3>

          {habits.length === 0 ? (
            <div className="text-center py-6 text-gray-400 dark:text-zinc-500 text-xs font-mono">
              No habits cataloged. Establish habits using the "Track New Habit" button.
            </div>
          ) : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {habits.map((h) => {
                const logsToday = h.logs.some((l) => l.date === todayStr);

                // Compile previous 5 days check boxes for micro logging
                const pastDatesRow = Array.from({ length: 6 }, (_, idx) => {
                  return getPastDateStr(5 - idx);
                });

                return (
                  <div
                    key={h.id}
                    className="p-3.5 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900 px-1.5 py-0.5 rounded font-mono">
                          {h.category}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">({h.frequency})</span>
                      </div>
                      <h4 className="font-semibold text-gray-800 dark:text-zinc-200 text-sm mt-1">
                        {h.name}
                      </h4>
                      <p className="text-[11px] text-gray-400 max-w-[280px] mt-0.5 leading-relaxed truncate">
                        {h.description}
                      </p>
                    </div>

                    {/* Interactive Days Row & Controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-5">
                      <div className="text-center space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold">Past 6 Days Logs</span>
                        <div className="flex gap-1.5">
                          {pastDatesRow.map((day) => {
                            const isLogged = h.logs.some((l) => l.date === day);
                            const labelStr = new Date(day).toLocaleDateString('en-US', { weekday: 'narrow' });
                            return (
                              <button
                                key={day}
                                onClick={() => toggleHabitLog(h.id, day)}
                                className={`w-5 h-5 rounded-md text-[10px] text-center font-bold font-mono transition-all border ${
                                  isLogged
                                    ? 'bg-teal-500 border-teal-500 text-white shadow-xs'
                                    : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 hover:bg-gray-100/50 dark:hover:bg-zinc-900 text-gray-400'
                                }`}
                                title={`Toggle completed logs for ${day}`}
                              >
                                {labelStr}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Delete controller */}
                      <button
                        onClick={() => deleteHabit(h.id)}
                        className="text-gray-300 hover:text-rose-500 p-1 rounded-lg"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
