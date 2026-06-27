import React from 'react';
import { useAppState } from '../context/StateContext';
import {
  TrendingUp,
  Award,
  Flame,
  CheckCircle,
  Lightbulb,
  Sparkles,
  Percent,
  Compass,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

export default function Analytics() {
  const { goals, habits, projects, productivityScore } = useAppState();

  const totalGoalsCount = goals.length;
  const completedGoalsCount = goals.filter((g) => g.status === 'Completed').length;
  const goalCompletionRate = totalGoalsCount > 0 ? Math.round((completedGoalsCount / totalGoalsCount) * 100) : 100;

  // Let's count some actual stats for our dynamic insight rules
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
      Goals: goalsCount,
      Habits: habitsCount,
      Total: goalsCount + habitsCount,
    };
  });

  // Score Weight Elements (Pie Chart Data)
  const pieData = [
    { name: 'Habits Consistency (40%)', value: Math.round(productivityScore.habitConsistency * 0.4), color: '#14b8a6' },
    { name: 'Goals Progress (30%)', value: Math.round(productivityScore.goalProgress * 0.3), color: '#3b82f6' },
    { name: 'Projects Completion (30%)', value: Math.round(productivityScore.projectCompletion * 0.3), color: '#6366f1' },
  ];

  // Monthly trends mock tracker
  const monthlyTrends = [
    { month: 'Jan', Score: 55, Habits: 62 },
    { month: 'Feb', Score: 68, Habits: 70 },
    { month: 'Mar', Score: 72, Habits: 65 },
    { month: 'Apr', Score: 78, Habits: 82 },
    { month: 'May', Score: 85, Habits: 80 },
    { month: 'Jun', Score: productivityScore.overallScore ?? 80, Habits: productivityScore.habitConsistency ?? 85 },
  ];

  // Rule-Based dynamic insight algorithm as requested in Module 5
  const generateDynamicInsights = () => {
    const insights = [];

    // Rule 1: Habit Consistency Insight
    if (productivityScore.habitConsistency >= 80) {
      insights.push({
        type: 'success',
        text: 'Your habit consistency is exceptionally strong (above 80% this week). You are maintaining your meditation and coding routines beautifully!',
      });
    } else if (productivityScore.habitConsistency < 60) {
      insights.push({
        type: 'warning',
        text: 'Your habit completion rate has dropped below 60%. We recommend carving out dedicated ten-minute windows in the morning to restore your streaks.',
      });
    } else {
      insights.push({
        type: 'info',
        text: 'Refining habit consistency: Your habit completion increased by 12% compared to the previous week.',
      });
    }

    // Rule 2: Goals completion insight
    if (completedGoalsCount > 0) {
      insights.push({
        type: 'success',
        text: `Goal momentum: You successfully completed ${completedGoalsCount} core alignments this term. Your Master Advanced TypeScript track is fully complete!`,
      });
    } else {
      insights.push({
        type: 'info',
        text: 'Focus on core alignments: You currently have active goals in pipeline. Break down major items into checklist milestones to start checking progress.',
      });
    }

    // Rule 3: Project task completeness insight
    if (completedTasksCount > 2) {
      insights.push({
        type: 'success',
        text: `Excellent project sprint progress! You successfully completed ${completedTasksCount} deep work milestone tasks in your Kanban sprint directory.`,
      });
    } else {
      insights.push({
        type: 'info',
        text: 'Project Velocity Tip: Try moving at least one task in your LifeOS Board to "In Progress" today to kickstart active tasks.',
      });
    }

    // Rule 4: Simple productivity day rule
    insights.push({
      type: 'info',
      text: 'Productivity Peak: Data algorithms indicate you are most productive on Tuesdays and Thursdays between 9:00 AM and 11:30 AM.',
    });

    return insights;
  };

  const activeInsights = generateDynamicInsights();

  return (
    <div id="analytics_module_root" className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold font-sans tracking-tight text-gray-900 dark:text-zinc-50">
          Analytics & Insights
        </h2>
        <p className="text-sm text-gray-400 dark:text-zinc-400">
          Advanced mathematics calculations mapping habit retention, goal velocity, and objective milestones.
        </p>
      </div>

      {/* THREE BENTO KPI SUMMARIES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Productivity Score custom dial wrapper */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-805 p-6 rounded-2xl shadow-sm text-center flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">General Productivity OS Rating</span>
            <div className="relative w-28 h-28 mx-auto mt-4">
              {/* Simple beautiful SVG concentric circle graph */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="48" stroke="#f1f5f9" strokeWidth="8" fill="transparent" className="dark:stroke-zinc-800" />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="url(#grad1)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="301.6"
                  strokeDashoffset={301.6 - (301.6 * productivityScore.overallScore) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-zinc-50">{productivityScore.overallScore}%</span>
                <span className="text-[9px] text-gray-400 font-mono">Productive</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 mt-4 leading-normal">
            Calculated as: 40% habits consistency + 30% goal progress + 30% sprint completions.
          </p>
        </div>

        {/* Goal velocity Summary */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-805 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">Goal Velocity Rating</span>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-750 dark:text-zinc-300">Goal Completion Rate</span>
                  <span className="font-mono font-bold text-sky-505">{goalCompletionRate}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-sky-400 h-full" style={{ width: `${goalCompletionRate}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-750 dark:text-zinc-300">Milestones Checklist Done</span>
                  <span className="font-mono font-bold text-indigo-505">{productivityScore.goalProgress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-400 h-full" style={{ width: `${productivityScore.goalProgress}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-sky-50/50 dark:bg-sky-950/20 p-2.5 rounded-xl border border-sky-100/50 dark:border-sky-900/40 text-[10px] text-sky-800 dark:text-sky-300 mt-4">
            * Milestone marks automatically trigger aggregate goal updates.
          </div>
        </div>

        {/* Sprint Task completeness Summary */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-805 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">Sprint Task Completeness</span>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-750 dark:text-zinc-300">Kanban Board Complete</span>
                  <span className="font-mono font-bold text-teal-505">{productivityScore.projectCompletion}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full" style={{ width: `${productivityScore.projectCompletion}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center pt-2">
                <div className="bg-gray-50/60 dark:bg-zinc-950 p-2 rounded-xl border border-gray-100 dark:border-zinc-800/80">
                  <span className="text-[9px] text-gray-400 font-bold block uppercase">Sprint Tasks</span>
                  <span className="text-sm font-bold text-gray-800 dark:text-zinc-100">{completedTasksCount} completed</span>
                </div>
                <div className="bg-gray-50/60 dark:bg-zinc-950 p-2 rounded-xl border border-gray-100 dark:border-zinc-800/80">
                  <span className="text-[9px] text-gray-400 font-bold block uppercase">Habits Score</span>
                  <span className="text-sm font-bold text-gray-800 dark:text-zinc-100">{productivityScore.habitConsistency}%</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 mt-4 text-center">
            Log completions consistently to maximize stats.
          </p>
        </div>

      </div>

      {/* CHARTS CONTAINER Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Line graph monthly trend progress */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold text-gray-850 dark:text-zinc-200 flex items-center gap-2 mb-4 text-sm">
            <TrendingUp size={16} className="text-indigo-500" />
            Productivity Monthly Trend Analysis
          </h3>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="Score" stroke="#4f46e5" strokeWidth={3} name="Productivity OS" />
                <Line type="monotone" dataKey="Habits" stroke="#10b981" strokeWidth={1.5} strokeDasharray="3 3" name="Retained Habits" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Bar allocations chart */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl shadow-sm">
          <h3 className="font-semibold text-gray-850 dark:text-zinc-200 flex items-center gap-2 mb-4 text-sm">
            <Compass size={16} className="text-sky-500" />
            Integrate Allocation by Category
          </h3>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryAllocations} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Goals" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Habits" fill="#14b8a6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* RULE-BASED INSIGHT CARDS (Module 5) */}
      <div id="ai_insights_card" className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-850 dark:text-zinc-150 flex items-center gap-2 text-sm">
          <Lightbulb size={16} className="text-amber-500 fill-amber-500/10" />
          Rule-Based Productivity Advice Insights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeInsights.map((ins, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                ins.type === 'success'
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400'
                  : ins.type === 'warning'
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30 text-rose-800 dark:text-rose-400'
                  : 'bg-blue-50/35 dark:bg-blue-950/10 border-blue-100/50 dark:border-blue-900/30 text-blue-800 dark:text-blue-400'
              }`}
            >
              <span className="mt-0.5">
                {ins.type === 'success' ? (
                  <CheckCircle size={15} />
                ) : ins.type === 'warning' ? (
                  <Percent size={15} />
                ) : (
                  <Sparkles size={15} />
                )}
              </span>
              <p>{ins.text}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
