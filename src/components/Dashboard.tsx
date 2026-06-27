import React from 'react';
import { useAppState } from '../context/StateContext';
import {
  Trophy,
  CheckCircle,
  Flame,
  Calendar,
  Layers,
  ArrowRight,
  Clock,
  PlusCircle,
  Leaf,
  Check,
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const {
    user,
    goals,
    habits,
    projects,
    toggleHabitLog,
    productivityScore,
    setCurrentTab,
  } = useAppState();

  const activeGoals = goals.filter((g) => g.status === 'In Progress');
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate stats
  const habitsCompletedToday = habits.filter(h => h.logs.some(l => l.date === todayStr)).length;
  const habitsRate = habits.length > 0 ? Math.round((habitsCompletedToday / habits.length) * 105) : 0;
  
  const totalTasks = projects.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = projects.reduce((acc, p) => acc + p.tasks.filter(t => t.status === 'Completed').length, 0);
  const tasksRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Pretty current date readable format for Physical Planner Cover
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div id="dashboard_panel" className="space-y-12 animate-fade-in text-[#1D1D1F]">
      
      {/* 1. SERENE HANDCRAFTED GREETING */}
      <div className="border-b border-[#E5E1DA] pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] text-[#5C7C5A] uppercase tracking-widest font-mono font-bold">
            <Leaf size={12} />
            <span>Daily Logbook Opened</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-[#1D1D1F]">
            Welcome, {user?.name.split(' ')[0]}.
          </h1>
          <p className="text-xs text-zinc-500 font-serif italic max-w-xl">
            "Simple in layout, rich in execution. Here is your current life outline and routine checklist for {formattedDate}."
          </p>
        </div>

        {/* Elegant Minimalist Date Tile */}
        <div className="bg-[#F7F5F2] border border-[#E5E1DA] px-4 py-2.5 rounded-lg text-right font-mono self-start md:self-auto">
          <span className="text-[10px] uppercase text-zinc-400 block tracking-wider leading-none">Planner Edition</span>
          <span className="text-xs font-semibold text-[#1D1D1F]">
            Universal LifeOS v1.1
          </span>
        </div>
      </div>

      {/* 2. CORE BRIEFING LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: THE DAILY BRIEFING (8 columns) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* DAILY ROUTINES CHRONICLE */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#E5E1DA]/60">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-mono font-bold text-zinc-500">
                <Flame size={13} className="text-[#C47A5A]" />
                <span>Routines Logbook</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                Today Checkmarks ({habitsCompletedToday}/{habits.length})
              </span>
            </div>

            {habits.length === 0 ? (
              <div className="text-center py-6 text-xs text-zinc-400 border border-dashed border-[#E5E1DA] rounded-lg">
                No routines scheduled. Track new routines in the Daily Routines drawer.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {habits.map((habit) => {
                  const completedToday = habit.logs.some(l => l.date === todayStr);
                  return (
                    <div
                      key={habit.id}
                      onClick={() => toggleHabitLog(habit.id, todayStr)}
                      className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer select-none transition-all ${
                        completedToday
                          ? 'bg-[#5C7C5A]/5 border-[#5C7C5A]/30 text-zinc-800'
                          : 'bg-white border-[#E5E1DA] hover:bg-[#F7F5F2]'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
                          completedToday ? 'bg-[#5C7C5A] border-[#5C7C5A] text-white' : 'border-zinc-350 bg-white'
                        }`}>
                          {completedToday && <Check size={10} strokeWidth={3} />}
                        </div>
                        <span className={`text-[12.5px] font-medium truncate ${completedToday ? 'text-zinc-400 line-through' : 'text-[#1D1D1F]'}`}>
                          {habit.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 bg-[#F7F5F2] px-2 py-0.5 rounded border border-[#E5E1DA]/40">
                        {habit.streak}d streak
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* FOCUS OBJECTIVES & PROJECT BOARD TIMELINE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* GOALS GRID CARD */}
            <div className="border border-[#E5E1DA] p-5 rounded-xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#E5E1DA]/50">
                <h4 className="font-bold text-[11px] uppercase tracking-widest text-[#5C7C5A] flex items-center gap-1.5">
                  <Trophy size={13} />
                  Active Roads
                </h4>
                <button onClick={() => setCurrentTab('goals')} className="text-[10px] text-[#C47A5A] font-bold uppercase tracking-wider hover:underline flex items-center gap-0.5">
                  All <ArrowRight size={10} />
                </button>
              </div>

              {activeGoals.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-400 font-serif italic">
                  No objectives in progress.
                </div>
              ) : (
                <div className="space-y-2">
                  {activeGoals.slice(0, 3).map((g) => {
                    const daysLeft = Math.round(
                      (new Date(g.targetDate).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    return (
                      <div key={g.id} className="p-3 bg-[#F7F5F2] border border-[#E5E1DA] rounded-lg flex items-center justify-between text-xs hover:bg-white transition-colors">
                        <div className="overflow-hidden mr-2">
                          <span className="font-semibold text-[#1D1D1F] block truncate">
                            {g.title}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {g.category} • Progress: {g.progress}%
                          </span>
                        </div>
                        <span className={`font-mono px-2 py-0.5 rounded font-medium text-[9px] shrink-0 border ${
                          daysLeft < 3 
                            ? 'bg-rose-50 text-rose-700 border-rose-100' 
                            : 'bg-white text-zinc-600 border-[#E5E1DA]'
                        }`}>
                          {daysLeft > 0 ? `${daysLeft}d` : daysLeft === 0 ? 'Today' : 'Overdue'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* KANBAN OUTLINE CARD */}
            <div className="border border-[#E5E1DA] p-5 rounded-xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#E5E1DA]/50">
                <h4 className="font-bold text-[11px] uppercase tracking-widest text-[#5C7C5A] flex items-center gap-1.5">
                  <Layers size={13} />
                  Sprint Index
                </h4>
                <button onClick={() => setCurrentTab('projects')} className="text-[10px] text-[#C47A5A] font-bold uppercase tracking-wider hover:underline flex items-center gap-0.5">
                  Tasks <ArrowRight size={10} />
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-450 font-serif italic">
                  No active boards mapped.
                </div>
              ) : (
                <div className="space-y-3.5">
                  {projects.slice(0, 3).map((p) => {
                    const taskList = p.tasks.length;
                    const doneList = p.tasks.filter(t => t.status === 'Completed').length;
                    return (
                      <div key={p.id} className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-[#1D1D1F] truncate pr-2">
                            {p.name}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">
                            {doneList}/{taskList} subtasks
                          </span>
                        </div>
                        <div className="w-full bg-[#F7F5F2] h-1 rounded-full overflow-hidden border border-[#E5E1DA]/60">
                          <div 
                            className="bg-[#5C7C5A] h-full" 
                            style={{ width: `${taskList > 0 ? (doneList / taskList) * 100 : 0}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: THE APPLE FITNESS LIFE METRICS RINGS - REDESIGNED Minimalist Sliders (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* MINIMALIST STATIONERY-STYLE INDEX METRICS */}
          <div className="border border-[#E5E1DA] p-6 rounded-xl space-y-6">
            <div className="pb-3 border-b border-[#E5E1DA] text-left">
              <span className="font-bold text-[11px] uppercase tracking-widest text-zinc-400 block leading-none">Daily Balance Gauge</span>
              <span className="text-lg font-serif font-bold text-[#1D1D1F] mt-1.5 block">Planner Insights</span>
            </div>

            {/* Routine Checklist Progress slider */}
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-end">
                <span className="text-xs font-semibold text-zinc-600 block">Routines Continuity</span>
                <span className="text-xs font-mono font-bold text-[#5C7C5A]">{productivityScore.habitConsistency}%</span>
              </div>
              <div className="w-full bg-[#F7F5F2] h-2.5 rounded-full border border-[#E5E1DA] p-0.5 overflow-hidden">
                <div 
                  className="bg-[#5C7C5A] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${productivityScore.habitConsistency}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-400 italic">Consistency checks mapping your trailing 7 day records.</p>
            </div>

            {/* Projects Velocity progress slider */}
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-end">
                <span className="text-xs font-semibold text-zinc-600 block">Active Tasks Speed</span>
                <span className="text-xs font-mono font-bold text-[#C47A5A]">{tasksRate}%</span>
              </div>
              <div className="w-full bg-[#F7F5F2] h-2.5 rounded-full border border-[#E5E1DA] p-0.5 overflow-hidden">
                <div 
                  className="bg-[#C47A5A] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${tasksRate}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-400 italic">Aggregated complete milestone cards in your sprint boards.</p>
            </div>

            {/* Goal vector paths progress */}
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-end">
                <span className="text-xs font-semibold text-zinc-600 block">Roadmap Alignments</span>
                <span className="text-xs font-mono font-bold text-[#1D1D1F]">{productivityScore.goalProgress}%</span>
              </div>
              <div className="w-full bg-[#F7F5F2] h-2.5 rounded-full border border-[#E5E1DA] p-0.5 overflow-hidden">
                <div 
                  className="bg-zinc-650 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${productivityScore.goalProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-400 italic">Calculation measuring master milestones successfully completed.</p>
            </div>

            <div className="pt-3 border-t border-[#E5E1DA]/60 text-left text-[11px] text-zinc-400 leading-relaxed font-serif italic">
              "Establish daily triggers early in physical slots. Balance focus across active parameters to preserve the overall index."
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
