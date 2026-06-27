import React from 'react';
import { useAppState } from '../context/StateContext';
import {
  TrendingUp,
  Flame,
  CheckCircle,
  Lightbulb,
  Compass,
  Heart,
  Activity,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  CartesianGrid,
} from 'recharts';

export default function Analytics() {
  const { goals, habits, projects, productivityScore } = useAppState();

  const totalGoalsCount = goals.length;
  const completedGoalsCount = goals.filter((g) => g.status === 'Completed').length;
  const goalCompletionRate = totalGoalsCount > 0 ? Math.round((completedGoalsCount / totalGoalsCount) * 100) : 100;

  const completedTasksCount = projects.reduce(
    (sum, p) => sum + p.tasks.filter((t) => t.status === 'Completed').length,
    0
  );

  // Compile Categories chart data
  const categoriesList = ['Career', 'Health', 'Finance', 'Learning', 'Personal'];
  const categoryAllocations = categoriesList.map((cat) => {
    const goalsCount = goals.filter((g) => g.category === cat).length;
    const habitsCount = habits.filter((h) => h.category === cat).length;
    return {
      name: cat,
      Objectives: goalsCount,
      Routines: habitsCount,
      Total: goalsCount + habitsCount,
    };
  });

  // Monthly trends status
  const monthlyTrends = [
    { month: 'Jan', Score: 55, Habits: 62 },
    { month: 'Feb', Score: 68, Habits: 70 },
    { month: 'Mar', Score: 72, Habits: 65 },
    { month: 'Apr', Score: 78, Habits: 82 },
    { month: 'May', Score: 85, Habits: 80 },
    { month: 'Jun', Score: productivityScore.overallScore ?? 80, Habits: productivityScore.habitConsistency ?? 85 },
  ];

  // Rule-Based elegant recommendations list
  const generateDynamicInsights = () => {
    const insights = [];

    if (productivityScore.habitConsistency >= 80) {
      insights.push({
        type: 'success',
        text: 'Your daily routine execution is exceptionally stable (above 80% this week). Line logs show ideal consistency indicators!',
      });
    } else if (productivityScore.habitConsistency < 60) {
      insights.push({
        type: 'warning',
        text: 'Habit execution rate has slipped below 60%. Try scheduling slots to restore calm consistency levels.',
      });
    } else {
      insights.push({
        type: 'info',
        text: 'Self-improvement Maintenance: Your habit completion rate improved over the trailing 7 days.',
      });
    }

    if (completedGoalsCount > 0) {
      insights.push({
        type: 'success',
        text: `Goal momentum established! You successfully mapped and completed ${completedGoalsCount} master objectives as completed this period.`,
      });
    } else {
      insights.push({
        type: 'info',
        text: 'Objective Calibration: Active goal alignments are in play. Try mapping a small milestone parameter to unlock progress.',
      });
    }

    if (completedTasksCount > 2) {
      insights.push({
        type: 'success',
        text: `Velocity High: Completed ${completedTasksCount} cards from your active sprint boards. The task list is moving steadily!`,
      });
    } else {
      insights.push({
        type: 'info',
        text: 'Task Board Velocity: Try shifting at least one catalog card to "In Progress" today to increase completion rate.',
      });
    }

    insights.push({
      type: 'info',
      text: 'Diagnostics indicate your optimal productivity triggers on Tuesdays and Wednesdays between 09:00 and 11:30 AM.',
    });

    return insights;
  };

  const activeInsights = generateDynamicInsights();

  return (
    <div id="analytics_health_dashboard" className="space-y-10 select-none animate-fade-in text-[#1D1D1F]">
      
      {/* 1. HEADER */}
      <div className="border-b border-[#E5E1DA] pb-6">
        <div className="flex items-center gap-2 text-[10px] text-[#5C7C5A] uppercase tracking-widest font-mono font-bold mb-1.5">
          <TrendingUp size={12} />
          <span>Section 05 — Progress Journal</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-[#1D1D1F]">
          Retrospective & KPI Logs
        </h2>
        <p className="text-xs text-zinc-500 font-serif italic mt-1">
          Historical calculations mapping habit retention, goal completion, and objective milestones in a beautiful tactile ledger format.
        </p>
      </div>

      {/* 2. NUMERICAL INDICATOR BOXES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        
        {/* Core Heart Rate / Health index */}
        <div className="bg-white border border-[#E5E1DA] p-5.5 rounded-xl flex flex-col justify-between">
          <div className="flex items-start justify-between w-full">
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C7C5A] flex items-center gap-1.5 font-mono">
                <Heart size={11} className="text-[#C47A5A] fill-[#C47A5A]/10" />
                Routine consistency
              </span>
              <h3 className="text-4xl font-extrabold text-[#1D1D1F] font-mono tracking-tight mt-1">
                {productivityScore.habitConsistency}%
              </h3>
            </div>
            <span className="text-[9px] font-mono border border-[#5C7C5A]/30 text-[#5C7C5A] bg-[#5C7C5A]/5 px-2 py-0.5 rounded font-semibold">
              Steady
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5E1DA]/50 text-left text-[11px] text-zinc-500 font-serif italic">
            Based on trailing 7-day logs of active habits.
          </div>
        </div>

        {/* Goal completion velocity */}
        <div className="bg-white border border-[#E5E1DA] p-5.5 rounded-xl flex flex-col justify-between">
          <div className="flex items-start justify-between w-full">
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C7C5A] flex items-center gap-1.5 font-mono">
                <Activity size={11} className="text-[#5C7C5A]" />
                Objective Velocity
              </span>
              <h3 className="text-4xl font-extrabold text-[#1D1D1F] font-mono tracking-tight mt-1">
                {productivityScore.goalProgress}%
              </h3>
            </div>
            <span className="text-[9px] font-mono border border-[#C47A5A]/30 text-[#C47A5A] bg-[#C47A5A]/5 px-2 py-0.5 rounded font-semibold">
              {goalCompletionRate >= 70 ? 'Optimal' : 'Active'}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5E1DA]/50 text-left text-[11px] text-zinc-500 font-serif italic">
            Calculated across milestones of currently active goals.
          </div>
        </div>

        {/* Projects checklist board completeness */}
        <div className="bg-white border border-[#E5E1DA] p-5.5 rounded-xl flex flex-col justify-between">
          <div className="flex items-start justify-between w-full">
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C7C5A] flex items-center gap-1.5 font-mono">
                <Zap size={11} className="text-[#C47A5A]" />
                Sprint completion
              </span>
              <h3 className="text-4xl font-extrabold text-[#1D1D1F] font-mono tracking-tight mt-1">
                {productivityScore.projectCompletion}%
              </h3>
            </div>
            <span className="text-[9px] font-mono border border-[#E5E1DA] text-zinc-650 bg-[#F7F5F2] px-2 py-0.5 rounded font-semibold">
              {completedTasksCount} Done
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5E1DA]/50 text-left text-[11px] text-zinc-500 font-serif italic">
            Assesses completed sprint cards on your planner dashboard.
          </div>
        </div>

      </div>

      {/* 3. CHARTS CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Line Graph for monthly trends */}
        <div className="bg-white border border-[#E5E1DA] p-5 rounded-xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#E5E1DA]/60">
            <h3 className="text-[11px] uppercase tracking-widest font-mono font-bold text-zinc-450 flex items-center gap-1.5">
              <Activity size={12} className="text-[#C47A5A]" />
              Month Trailing Continuity Trend
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono">Index Score</span>
          </div>

          <div className="w-full h-52 font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#E5E1DA" />
                <XAxis dataKey="month" stroke="#A8A29E" fontSize={10} tickLine={false} />
                <YAxis stroke="#A8A29E" fontSize={10} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: '4px', fontClassName: 'font-mono' }} />
                <Line type="monotone" dataKey="Score" stroke="#5C7C5A" strokeWidth={2.5} name="Productivity Index" dot={{ stroke: '#5C7C5A', strokeWidth: 1.5, r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="Habits" stroke="#C47A5A" strokeWidth={1} strokeDasharray="3 3" name="Routines Complete" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories allocation chart */}
        <div className="bg-white border border-[#E5E1DA] p-5 rounded-xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#E5E1DA]/60">
            <h3 className="text-[11px] uppercase tracking-widest font-mono font-bold text-zinc-450 flex items-center gap-1.5">
              <Compass size={12} className="text-[#5C7C5A]" />
              Category Allocations Weighted
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono">Weight Allocation</span>
          </div>

          <div className="w-full h-52 font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryAllocations} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#E5E1DA" />
                <XAxis dataKey="name" stroke="#A8A29E" fontSize={10} tickLine={false} />
                <YAxis stroke="#A8A29E" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: '4px' }} />
                <Legend iconType="square" wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                <Bar dataKey="Objectives" fill="#5C7C5A" name="Roadmap Projects" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Routines" fill="#C47A5A" name="Routines Logged" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 4. PAPER DIAGNOSTICS & SYSTEM RECOMMENDATIONS (Insights) */}
      <div className="bg-[#F7F5F2] p-6 rounded-lg border border-[#E5E1DA] space-y-4">
        <div className="text-left select-none pb-2 border-b border-[#E5E1DA]">
          <h3 className="font-serif font-bold text-sm text-[#1D1D1F] flex items-center gap-1.5">
            <Lightbulb size={13} className="text-[#C47A5A]" />
            Planner Retrospective Insights
          </h3>
          <p className="text-[11px] text-zinc-550 leading-tight">
            Historical analysis logs evaluated against simple checklists for daily improvement:
          </p>
        </div>

        {/* Dynamic rule box list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeInsights.map((ins, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded bg-white border border-[#E5E1DA] flex items-start gap-3 text-[11.5px] leading-relaxed`}
            >
              <span className="mt-0.5 shrink-0">
                {ins.type === 'success' ? (
                  <CheckCircle size={13} className="text-[#5C7C5A]" />
                ) : (
                  <Activity size={13} className="text-[#C47A5A]" />
                )}
              </span>
              <p className="text-left text-zinc-700">{ins.text}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
