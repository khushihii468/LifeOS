import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { Goal, Category, Priority, GoalStatus } from '../types';
import {
  Plus,
  Filter,
  CheckCircle,
  Clock,
  Briefcase,
  Layers,
  Sparkles,
  Search,
  MoreVertical,
  X,
  PlusCircle,
  Eye,
  Trash,
  ChevronDown,
  ChevronUp,
  Award,
} from 'lucide-react';

export default function Goals() {
  const {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    archiveGoal,
    toggleMilestone,
    addMilestone,
    deleteMilestone,
  } = useAppState();

  // Search, filter, sorting state values
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  
  // Sorting: due_date | progress | creation_date
  const [sortBy, setSortBy] = useState<'targetDate' | 'progress' | 'createdAt'>('targetDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Views layouts: 'grid' | 'list' | 'progress'
  const [viewType, setViewType] = useState<'grid' | 'list' | 'progress'>('grid');

  // New Goal Modal state
  const [openModal, setOpenModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('Career');
  const [newPriority, setNewPriority] = useState<Priority>('High');
  const [newTarget, setNewTarget] = useState('');
  const [newStatus, setNewStatus] = useState<GoalStatus>('In Progress');
  const [newMilesInput, setNewMilesInput] = useState('');
  const [newMilestones, setNewMilestones] = useState<string[]>([]);

  // Expanded goal IDs for viewing detailed mile lists
  const [expandedGoalIds, setExpandedGoalIds] = useState<string[]>([]);

  // Inline new milestone text for specific goal targets
  const [inlineMilestoneTexts, setInlineMilestoneTexts] = useState<{ [goalId: string]: string }>({});

  const toggleExpandGoal = (id: string) => {
    setExpandedGoalIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    
    // Structure initial milestones list
    const preparedMiles = newMilestones.map((title) => ({
      id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      completed: false,
    }));

    addGoal({
      title: newTitle,
      description: newDesc,
      category: newCategory,
      priority: newPriority,
      status: newStatus,
      targetDate: newTarget || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      milestones: preparedMiles,
    });

    // Reset fields
    setNewTitle('');
    setNewDesc('');
    setNewCategory('Career');
    setNewPriority('High');
    setNewTarget('');
    setNewStatus('In Progress');
    setNewMilestones([]);
    setOpenModal(false);
  };

  const handleAddMilestoneChip = () => {
    if (!newMilesInput.trim()) return;
    setNewMilestones((prev) => [...prev, newMilesInput.trim()]);
    setNewMilesInput('');
  };

  const handleAddInlineMilestone = (goalId: string) => {
    const text = inlineMilestoneTexts[goalId];
    if (!text || !text.trim()) return;
    addMilestone(goalId, text.trim());
    setInlineMilestoneTexts((prev) => ({ ...prev, [goalId]: '' }));
  };

  // Run filters & sorts on raw Goals array
  const filteredGoals = goals
    .filter((g) => {
      // 1. Search Query
      const matchesSearch =
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.description.toLowerCase().includes(search.toLowerCase());
      
      // 2. Category Filter
      const matchesCategory = filterCategory === 'All' || g.category === filterCategory;

      // 3. Priority Filter
      const matchesPriority = filterPriority === 'All' || g.priority === filterPriority;

      // 4. Status Filter
      const matchesStatus = filterStatus === 'All' || g.status === filterStatus;

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    })
    .sort((a, b) => {
      // Handle comparative calculations sorting
      let compareA: any = a[sortBy];
      let compareB: any = b[sortBy];

      if (sortBy === 'targetDate' || sortBy === 'createdAt') {
        compareA = new Date(compareA).getTime();
        compareB = new Date(compareB).getTime();
      }

      if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const categories: Category[] = ['Career', 'Health', 'Finance', 'Learning', 'Personal'];
  const priorities: Priority[] = ['Low', 'Medium', 'High'];
  const statuses: GoalStatus[] = ['Not Started', 'In Progress', 'Completed', 'Archived'];

  return (
    <div id="goals_module_root" className="space-y-6">
      
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-1">
        <div>
          <h2 className="text-2xl font-bold font-sans tracking-tight text-gray-900 dark:text-zinc-50">
            Goal Alignments
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Establish long-term aspirations, break them into milestones, and track your metrics.
          </p>
        </div>
        <button
          onClick={() => setOpenModal(true)}
          className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-xl text-xs shadow-md shadow-indigo-100 dark:shadow-none hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer max-w-max self-start sm:self-center"
        >
          <Plus size={15} />
          Create New Goal
        </button>
      </div>

      {/* FILTER & VIEW BAR Controls */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl shadow-sm space-y-3.5">
        
        {/* Row 1: Search and Filter select boxes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          {/* Search bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Search goals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl text-xs text-gray-950 dark:text-gray-150 focus:outline-none focus:ring-1.5 focus:ring-sky-500/40 focus:border-sky-500"
            />
          </div>

          {/* Filtering selectors */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">Cat:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex-1 py-1 px-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl text-xs text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-1.5 focus:ring-sky-500/40"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">Pri:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="flex-1 py-1 px-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl text-xs text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-1.5 focus:ring-sky-500/40"
            >
              <option value="All">All Priorities</option>
              {priorities.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">Stat:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 py-1 px-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl text-xs text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-1.5 focus:ring-sky-500/40"
            >
              <option value="All">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Sorting and View Selection */}
        <div className="pt-2 border-t border-gray-50 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          {/* Sorting controls */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Sort By:</span>
            <button
              onClick={() => {
                setSortBy('targetDate');
                setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
              }}
              className={`px-3 py-1 rounded-lg border text-[11px] transition-all font-medium cursor-pointer ${
                sortBy === 'targetDate'
                  ? 'bg-sky-50 border-sky-200 text-sky-600 dark:bg-sky-950/30'
                  : 'bg-white border-gray-100 dark:bg-zinc-900 border-zinc-800 text-gray-500'
              }`}
            >
              Target Date {sortBy === 'targetDate' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => {
                setSortBy('progress');
                setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
              }}
              className={`px-3 py-1 rounded-lg border text-[11px] transition-all font-medium cursor-pointer ${
                sortBy === 'progress'
                  ? 'bg-sky-50 border-sky-200 text-sky-600 dark:bg-sky-950/30'
                  : 'bg-white border-gray-100 dark:bg-zinc-900 border-zinc-800 text-gray-500'
              }`}
            >
              Progress metric {sortBy === 'progress' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => {
                setSortBy('createdAt');
                setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
              }}
              className={`px-3 py-1 rounded-lg border text-[11px] transition-all font-medium cursor-pointer ${
                sortBy === 'createdAt'
                  ? 'bg-sky-50 border-sky-200 text-sky-600 dark:bg-sky-950/30'
                  : 'bg-white border-gray-100 dark:bg-zinc-900 border-zinc-800 text-gray-500'
              }`}
            >
              Creation Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>

          {/* View switches */}
          <div className="flex items-center gap-1.5 self-end sm:self-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mr-1">Layout:</span>
            <button
              onClick={() => setViewType('grid')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                viewType === 'grid'
                  ? 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-50 font-bold'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewType('list')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                viewType === 'list'
                  ? 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-50 font-bold'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Linear List
            </button>
            <button
              onClick={() => setViewType('progress')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                viewType === 'progress'
                  ? 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-50 font-bold'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Progress Metrics
            </button>
          </div>
        </div>
      </div>

      {/* RENDER VIEW CONFIGURATIONS */}
      {filteredGoals.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
          <Award size={36} className="text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-300">No alignments mapped</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Create goals or refine your filters to check off different categories.
          </p>
        </div>
      ) : viewType === 'grid' ? (
        /* GRID DECORATOR */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredGoals.map((g) => {
            const isExpanded = expandedGoalIds.includes(g.id);
            const daysLeft = Math.round(
              (new Date(g.targetDate).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            );
            return (
              <div
                key={g.id}
                className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/85 rounded-2xl shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Category and priority */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span className="text-[10px] bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-lg border border-sky-100 dark:border-sky-900/30 font-bold">
                      {g.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          g.priority === 'High'
                            ? 'bg-rose-500'
                            : g.priority === 'Medium'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                      />
                      <span className="text-[10px] text-gray-400 font-semibold">{g.priority} Priority</span>
                    </div>
                  </div>

                  {/* Title and details */}
                  <h3 className="font-semibold text-gray-850 dark:text-zinc-150 text-sm tracking-tight leading-tight">
                    {g.title}
                  </h3>
                  <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                    {g.description}
                  </p>

                  {/* Meter graph progress bar */}
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-400">Scope progress:</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-zinc-100">{g.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full transition-all duration-300"
                        style={{ width: `${g.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Inline collapse header for Milestones */}
                  <div className="mt-4 pt-4 border-t border-gray-50 dark:border-zinc-800/80">
                    <button
                      onClick={() => toggleExpandGoal(g.id)}
                      className="w-full flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600"
                    >
                      <span>Milestones ({g.milestones.filter((m) => m.completed).length}/{g.milestones.length})</span>
                      {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3.5 space-y-2.5">
                        {g.milestones.map((milestone) => (
                          <div
                            key={milestone.id}
                            className="flex items-center justify-between text-xs p-1 rounded hover:bg-gray-50/50 dark:hover:bg-zinc-850"
                          >
                            <label className="flex items-center gap-2 cursor-pointer select-none flex-1">
                              <input
                                type="checkbox"
                                checked={milestone.completed}
                                onChange={() => toggleMilestone(g.id, milestone.id)}
                                className="w-3.5 h-3.5 rounded text-sky-500 border-gray-300 focus:ring-sky-500 cursor-pointer"
                              />
                              <span className={`text-[11px] ${milestone.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-zinc-300'}`}>
                                {milestone.title}
                              </span>
                            </label>

                            <button
                              onClick={() => deleteMilestone(g.id, milestone.id)}
                              className="text-gray-300 hover:text-rose-500"
                            >
                              <X size={11} />
                            </button>
                          </div>
                        ))}

                        {/* Inline input to add milestone */}
                        <div className="flex gap-1 pt-1">
                          <input
                            type="text"
                            placeholder="Add milestone..."
                            value={inlineMilestoneTexts[g.id] || ''}
                            onChange={(e) =>
                              setInlineMilestoneTexts((prev) => ({
                                ...prev,
                                [g.id]: e.target.value,
                              }))
                            }
                            className="flex-1 px-2.5 py-1 text-[11px] bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-lg focus:outline-none focus:border-sky-500 text-gray-900 dark:text-gray-100"
                          />
                          <button
                            onClick={() => handleAddInlineMilestone(g.id)}
                            className="bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-zinc-700 p-1 rounded-lg"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer and operations */}
                <div className="mt-5 pt-3.5 border-t border-gray-50 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-gray-400 font-mono text-[10px]">
                    <Clock size={11} />
                    <span>Due: {g.targetDate}</span>
                    <span className={`font-semibold ${daysLeft > 0 ? 'text-gray-400' : 'text-rose-500'}`}>
                      ({daysLeft > 0 ? `${daysLeft}d` : daysLeft === 0 ? 'Due Today' : 'overdue'})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {g.status !== 'Completed' && (
                      <button
                        onClick={() => updateGoal(g.id, { status: 'Completed' })}
                        className="text-[10px] text-emerald-500 font-semibold hover:underline"
                      >
                        Complete
                      </button>
                    )}
                    {g.status !== 'Archived' && (
                      <button
                        onClick={() => archiveGoal(g.id)}
                        className="text-[10px] text-gray-400 hover:text-sky-500"
                        title="Archive goal"
                      >
                        Archive
                      </button>
                    )}
                    <button
                      onClick={() => deleteGoal(g.id)}
                      className="text-gray-300 hover:text-rose-500"
                      title="Delete goal"
                    >
                      <Trash size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : viewType === 'list' ? (
        /* LINEAR HIGH-DENSITY LIST LAYOUT */
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-50 dark:border-zinc-800/80 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-2.5 px-4 font-bold">Goal Name</th>
                <th className="py-2.5 px-4 font-bold">Category</th>
                <th className="py-2.5 px-4 font-bold">Priority</th>
                <th className="py-2.5 px-4 font-bold">Due Date</th>
                <th className="py-2.5 px-4 font-bold">Progress</th>
                <th className="py-2.5 px-4 font-bold">Status</th>
                <th className="py-2.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGoals.map((g) => (
                <tr
                  key={g.id}
                  className="border-b border-gray-50 dark:border-zinc-850/50 hover:bg-gray-50/40 dark:hover:bg-zinc-850 text-xs text-gray-800 dark:text-zinc-200 transition-colors"
                >
                  <td className="py-3 px-4 font-medium max-w-[200px]">
                    <span className="block truncate font-semibold">{g.title}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-sky-50 dark:bg-sky-950/20 text-sky-500 text-[10px] px-2 py-0.5 rounded-lg border border-sky-100 dark:border-sky-900/30">
                      {g.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-500">{g.priority}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-gray-400">
                    {g.targetDate}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 w-24">
                      <div className="flex-1 bg-gray-100 dark:bg-zinc-850 h-1 rounded-full overflow-hidden">
                        <div className="bg-sky-500 h-full" style={{ width: `${g.progress}%` }} />
                      </div>
                      <span className="font-mono text-[10px] text-gray-400 font-semibold">{g.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      g.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20'
                        : g.status === 'In Progress'
                        ? 'bg-sky-50 text-sky-600 dark:bg-sky-950/20'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {g.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => deleteGoal(g.id)}
                      className="text-gray-300 hover:text-rose-500 inline-block align-middle"
                    >
                      <Trash size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* PROGRESS VIEW DETAIL CARDS WITH PROGRESS MAP */
        <div className="space-y-4">
          {filteredGoals.map((g) => (
            <div key={g.id} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1 max-w-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-sky-500 font-mono uppercase bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40 px-1.5 py-0.5 rounded">
                    {g.category}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-[10px] text-gray-400 font-mono">Due Link: {g.targetDate}</span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-zinc-200 text-sm">
                  {g.title}
                </h3>
              </div>
              
              <div className="flex-1 max-w-md space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                  <span>Milestones rate: {g.milestones.filter(m => m.completed).length} of {g.milestones.length} completed</span>
                  <span className="font-bold text-gray-700 dark:text-zinc-300">{g.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-500 h-full" style={{ width: `${g.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NEW GOAL MODAL DIALOG POPUP */}
      {openModal && (
        <div id="new_goal_modal_dim" className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div id="new_goal_modal_card" className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl w-full max-w-lg p-6 relative shadow-2xl">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>

            <h3 className="text-base font-bold font-sans tracking-tight text-gray-900 dark:text-zinc-50 mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              Establish Productivity Goal
            </h3>

            <form onSubmit={handleAddGoalSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 text-[11px] uppercase tracking-wider block">Goal Title</label>
                <input
                  type="text"
                  placeholder="Master Next.js Server Components"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 p-2 text-xs rounded-xl focus:outline-none focus:border-sky-500 text-gray-950 dark:text-zinc-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 text-[11px] uppercase tracking-wider block">Description</label>
                <textarea
                  placeholder="Why is this goal important? Break this into specific measurable actions."
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 p-2 text-xs rounded-xl focus:outline-none focus:border-sky-500 text-gray-950 dark:text-zinc-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider block">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Category)}
                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 p-2 text-xs rounded-xl focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider block">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 p-2 text-xs rounded-xl focus:outline-none"
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider block">Target Due Date</label>
                  <input
                    type="date"
                    required
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 p-2 text-xs rounded-xl focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider block">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as GoalStatus)}
                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 p-2 text-xs rounded-xl focus:outline-none"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Milestones dynamic builder inside model */}
              <div className="space-y-1 pt-2">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">Initial Milestones (Progress metrics)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="E.g. Read draft of chapter 1"
                    value={newMilesInput}
                    onChange={(e) => setNewMilesInput(e.target.value)}
                    className="flex-1 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 p-2 text-xs rounded-xl focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddMilestoneChip}
                    className="bg-gray-100 dark:bg-zinc-800 text-gray-600 hover:text-sky-500 px-3 rounded-xl text-xs hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>

                {newMilestones.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 max-h-[80px] overflow-y-auto">
                    {newMilestones.map((m, i) => (
                      <span key={i} className="bg-gray-100 dark:bg-zinc-850 px-2 py-0.5 rounded border border-gray-200 dark:border-zinc-700/80 text-[10px] text-gray-600 dark:text-zinc-300 flex items-center gap-1">
                        {m}
                        <X size={10} className="cursor-pointer" onClick={() => setNewMilestones(prev => prev.filter((_, idx) => idx !== i))} />
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-zinc-800 text-gray-500 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-4 py-2 rounded-xl"
                >
                  Confirm Alignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
