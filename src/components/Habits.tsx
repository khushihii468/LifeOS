import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { Habit, Category, Frequency } from '../types';
import {
  Flame,
  Calendar,
  BarChart,
  Plus,
  Trash,
  Check,
  CheckCircle,
  HelpCircle,
  Info,
  Leaf,
  X,
  TrendingUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Get past date strings
const getPastDateStr = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

export default function Habits() {
  const { habits, addHabit, deleteHabit, toggleHabitLog } = useAppState();

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('Daily');
  const [category, setCategory] = useState<Category>('Health');
  const [targetPerDay, setTargetPerDay] = useState(1);
  const [showCreator, setShowCreator] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

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

  const longestStreak = habits.reduce((max, h) => Math.max(max, h.maxStreak), 0);
  const totalCurrentStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);

  // Completion calculation
  let overallCompletionPercentage = 0;
  if (habits.length > 0) {
    let checkedCount = 0;
    const past7Days = Array.from({ length: 7 }, (_, i) => getPastDateStr(i));

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

  // Find most successful habit
  const mostSuccessfulHabit = habits.length > 0
    ? [...habits].sort((a, b) => b.streak - a.streak)[0]
    : null;

  // Past 7 days chronological list for our paper matrix index
  const past7DaysChronological = Array.from({ length: 7 }, (_, i) => {
    return getPastDateStr(6 - i);
  });

  return (
    <div id="habits_fitness_hub" className="space-y-8 text-[#1D1D1F] animate-fade-in select-none">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between py-1 gap-4 pb-2 border-b border-[#E5E1DA]">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-[#5C7C5A] uppercase tracking-widest font-mono font-bold mb-1">
            <Leaf size={12} />
            <span>Section 03 — ROUTINES MATRIX</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-[#1D1D1F]">
            Habit Consistency
          </h2>
          <p className="text-xs text-zinc-500 font-serif italic mt-1">
            Establish healthy daily rituals and tick off sequential streaks on physical planner card grids.
          </p>
        </div>
        <button
          onClick={() => setShowCreator(!showCreator)}
          className="bg-[#5C7C5A] hover:bg-[#5C7C5A]/90 text-white font-medium py-1.5 px-4 rounded text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus size={13} />
          Track New Habit
        </button>
      </div>

      {/* 2. CREATOR MODAL */}
      <AnimatePresence>
        {showCreator && (
          <div className="fixed inset-0 bg-[#343434]/25 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="bg-white border border-[#E5E1DA] p-6 rounded-xl shadow-lg w-full max-w-md space-y-4 text-left relative text-[#1D1D1F]"
            >
              <button
                onClick={() => setShowCreator(false)}
                className="absolute top-4 right-4 text-zinc-450 hover:text-zinc-650"
              >
                <X size={14} />
              </button>

              <h3 className="font-serif font-bold text-sm text-[#1D1D1F] uppercase tracking-widest pb-2 border-b border-[#E5E1DA]">
                Track New Routine
              </h3>

              <form onSubmit={handleCreateHabitSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block">Routine Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Diaphragmatic Deep Breathing"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F5F2] border border-[#E5E1DA] rounded text-xs text-[#1D1D1F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block">Intent & Details</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 minutes at sunrise for clarity"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F5F2] border border-[#E5E1DA] rounded text-xs text-[#1D1D1F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block font-sans">Cadence</label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as Frequency)}
                      className="w-full bg-[#F7F5F2] border border-[#E5E1DA] rounded p-2 text-xs text-[#1D1D1F]"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block">Segment area</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                      className="w-full bg-[#F7F5F2] border border-[#E5E1DA] rounded p-2 text-xs text-[#1D1D1F]"
                    >
                      <option value="Health">Health</option>
                      <option value="Career">Career</option>
                      <option value="Finance">Finance</option>
                      <option value="Learning">Learning</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block">Logs target per day</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={targetPerDay}
                    onChange={(e) => setTargetPerDay(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F5F2] border border-[#E5E1DA] rounded text-xs text-[#1D1D1F]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 bg-[#5C7C5A] hover:bg-[#5C7C5A]/90 text-white font-medium py-2 px-4 rounded text-xs transition shadow-sm flex items-center justify-center gap-2"
                >
                  Confirm Diary Routine
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. PHYSICAL PLANS SUMMARY PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        
        <div className="bg-white border border-[#E5E1DA] p-5 rounded-lg text-left">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block leading-none">Weekly continuity</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold font-mono text-[#5C7C5A]">{overallCompletionPercentage}%</span>
            <span className="text-xs text-zinc-450">Ticked parameters</span>
          </div>
          <p className="text-[11px] text-zinc-405 font-serif italic mt-2.5">Summing completion counts across all weekly diary pages.</p>
        </div>

        <div className="bg-white border border-[#E5E1DA] p-5 rounded-lg text-left">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block leading-none">Aggregate max streak</span>
          <div className="flex items-baseline gap-2 mt-2 font-mono">
            <span className="text-3xl font-extrabold text-[#C47A5A]">{longestStreak} days</span>
            <span className="text-xs text-zinc-450">Peak continuity</span>
          </div>
          <p className="text-[11px] text-zinc-405 font-serif italic mt-2.5">Your record continuous execution of focus variables.</p>
        </div>

        <div className="bg-white border border-[#E5E1DA] p-5 rounded-lg text-left">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block leading-none font-sans">Best Routine streak</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xs font-bold text-[#1D1D1F] truncate max-w-[130px]">
              {mostSuccessfulHabit ? mostSuccessfulHabit.name : 'None listed'}
            </span>
            <span className="text-xs text-zinc-450 font-mono">({totalCurrentStreak}d streak)</span>
          </div>
          <p className="text-[11px] text-zinc-405 font-serif italic mt-2.5">Lead focus variable maintaining ideal alignment parameters.</p>
        </div>

      </div>

      {/* 4. EXQUISITE CHRONOLOGICAL CALENDAR TICK MATRIX */}
      <div className="bg-white border border-[#E5E1DA] rounded-lg">
        
        <div className="p-4 bg-[#F7F5F2]/45 border-b border-[#E5E1DA] flex justify-between items-center">
          <h3 className="font-serif font-bold text-sm text-[#1D1D1F]">
            Routine Weekly Matrix Ledger
          </h3>
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Trailing 7-Day ledger sheet</span>
        </div>

        {habits.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 font-serif italic text-xs">
            No routines logged. Initialize using the button above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E5E1DA] bg-[#F7F5F2]/20 font-mono text-[10px] text-zinc-455">
                  <th className="py-3 px-4 font-bold max-w-[180px] truncate uppercase tracking-widest">HABIT chapter</th>
                  {past7DaysChronological.map((dateStr, idx) => {
                    const dateObj = new Date(dateStr + 'T00:00:00');
                    const dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                    const dayNum = dateObj.getDate();
                    const isToday = dateStr === todayStr;
                    return (
                      <th key={idx} className="py-2 px-2.5 text-center font-bold">
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] uppercase font-mono">{dayLabel}</span>
                          <span className={`text-[11px] px-1.5 rounded-sm mt-0.5 leading-tight font-bold ${isToday ? 'bg-[#5C7C5A] text-white' : 'text-zinc-605'}`}>
                            {dayNum}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                  <th className="py-3 px-4 text-center font-bold uppercase tracking-widest text-[9px]">Streak</th>
                  <th className="py-3 px-4 text-center font-bold uppercase tracking-widest text-[9px]">Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E1DA]/60">
                {habits.map((habit) => (
                  <tr key={habit.id} className="hover:bg-[#F7F5F2]/30 transition-colors">
                    
                    {/* Prefix name and category */}
                    <td className="py-3.5 px-4 max-w-[180px] text-left">
                      <div className="space-y-1">
                        <span className="font-semibold text-[#1D1D1F] block text-sm leading-tight truncate">
                          {habit.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] bg-[#5C7C5A]/10 text-[#5C7C5A] border border-[#5C7C5A]/15 font-mono px-1 py-0.2 rounded leading-none uppercase font-bold tracking-wide">
                            {habit.category}
                          </span>
                          {habit.description && (
                            <span className="text-[10px] text-zinc-400 truncate max-w-[120px] font-serif italic">
                              {habit.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Check matrix days column ticks */}
                    {past7DaysChronological.map((dateStr, idx) => {
                      const completedOnDay = habit.logs.some(l => l.date === dateStr);
                      return (
                        <td key={idx} className="py-3 px-1 text-center">
                          <button
                            onClick={() => toggleHabitLog(habit.id, dateStr)}
                            className={`w-6 h-6 mx-auto rounded-sm border flex items-center justify-center cursor-pointer transition-all ${
                              completedOnDay
                                ? 'bg-[#5C7C5A] border-[#5C7C5A] text-white shadow-xs'
                                : 'border-[#E5E1DA] hover:border-[#5C7C5A] bg-white text-transparent hover:text-zinc-300'
                            }`}
                          >
                            <Check size={13} strokeWidth={completedOnDay ? 3.5 : 1} />
                          </button>
                        </td>
                      );
                    })}

                    {/* Streaks */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#C47A5A] bg-[#C47A5A]/5 border border-[#C47A5A]/20 px-2 py-0.5 rounded">
                        <Flame size={12} strokeWidth={2.5} />
                        <span>{habit.streak}d</span>
                      </div>
                    </td>

                    {/* Delete */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="text-zinc-300 hover:text-rose-600 p-1 rounded transition-colors"
                        title="Delete Routine"
                      >
                        <Trash size={12} />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. STATIONERY HEALTH NOTEBOX INSTRUCTION */}
      <div className="p-4 bg-[#F7F5F2] border border-[#E5E1DA] rounded-lg text-left font-serif text-[12px] italic text-zinc-550 leading-relaxed max-w-2xl">
        <span className="font-sans not-italic font-bold text-[9.5px] uppercase tracking-widest text-[#5C7C5A] block mb-1">Routines Handbook Note</span>
        "Our digital planner logs are offline persistent arrays cached securely to local storage layers. Ensure log inputs are marked chronologically before midnight to maintain valid streak calculators across consecutive planner cycles."
      </div>

    </div>
  );
}
