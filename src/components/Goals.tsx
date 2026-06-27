import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { Goal, Category, Priority, GoalStatus } from '../types';
import {
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  Trash,
  Calendar,
  Layers,
  Flag,
  CheckCircle,
  Inbox,
  Leaf,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Goals() {
  const {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleMilestone,
    addMilestone,
    deleteMilestone,
  } = useAppState();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activePriorityFilter, setActivePriorityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [expandedGoalIds, setExpandedGoalIds] = useState<string[]>([]);
  const [inlineMilestoneTexts, setInlineMilestoneTexts] = useState<{ [goalId: string]: string }>({});

  const [openModal, setOpenModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('Career');
  const [newPriority, setNewPriority] = useState<Priority>('High');
  const [newTarget, setNewTarget] = useState('');
  const [newStatus, setNewStatus] = useState<GoalStatus>('In Progress');
  const [newMilesInput, setNewMilesInput] = useState('');
  const [newMilestones, setNewMilestones] = useState<string[]>([]);

  const toggleExpandGoal = (id: string) => {
    setExpandedGoalIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const preparedMiles = newMilestones.map((title) => ({
      id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      completed: false,
    }));

    addGoal({
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      priority: newPriority,
      status: newStatus,
      targetDate: newTarget || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      milestones: preparedMiles,
    });

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
    setExpandedGoalIds(prev => prev.includes(goalId) ? prev : [...prev, goalId]);
    setInlineMilestoneTexts((prev) => ({ ...prev, [goalId]: '' }));
  };

  // Totals calculations
  const countScheduled = goals.filter(g => g.targetDate && g.status !== 'Completed').length;
  const countAll = goals.filter(g => g.status !== 'Archived').length;
  const countFlagged = goals.filter(g => g.priority === 'High' && g.status !== 'Completed').length;
  const countCompleted = goals.filter(g => g.status === 'Completed').length;

  const categories: Category[] = ['Career', 'Health', 'Finance', 'Learning', 'Personal'];

  const filteredGoals = goals
    .filter((g) => {
      const matchesSearch =
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === 'All' || g.category === activeCategory;
      const matchesPriority = activePriorityFilter === 'All' || g.priority === activePriorityFilter;

      return matchesSearch && matchesCategory && matchesPriority;
    })
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());

  return (
    <div id="goals_reminder_structure" className="space-y-8 text-[#1D1D1F] animate-fade-in">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-2 border-b border-[#E5E1DA]">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-[#5C7C5A] uppercase tracking-widest font-mono font-bold mb-1">
            <Leaf size={12} />
            <span>Section 02 — ROADMAP TARGETS</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-[#1D1D1F]">
            Goal Alignments
          </h2>
          <p className="text-xs text-zinc-500 font-serif italic mt-1">
            Establish overarching, multi-milestone lifepath parameters. Add goals and trace subtask completions.
          </p>
        </div>
        <button
          onClick={() => setOpenModal(true)}
          className="bg-[#5C7C5A] hover:bg-[#5C7C5A]/90 text-white font-medium py-1.5 px-4 rounded text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus size={13} />
          Create New Goal
        </button>
      </div>

      {/* 2. STATIONERY SMART METRIC CARD TILES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Active Targets */}
        <div 
          onClick={() => { setActiveCategory('All'); setActivePriorityFilter('All'); }}
          className="bg-white p-4 rounded-lg border border-[#E5E1DA] cursor-pointer flex flex-col justify-between h-20 hover:bg-[#F7F5F2] transition-colors"
        >
          <div className="flex justify-between items-center w-full">
            <span className="w-7 h-7 rounded bg-[#5C7C5A]/10 text-[#5C7C5A] flex items-center justify-center">
              <Calendar size={13} />
            </span>
            <span className="text-xl font-bold font-mono text-[#1D1D1F]">{countScheduled}</span>
          </div>
          <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block text-left">Active targets</span>
        </div>

        {/* High Priority */}
        <div 
          onClick={() => { setActivePriorityFilter('High'); }}
          className="bg-white p-4 rounded-lg border border-[#E5E1DA] cursor-pointer flex flex-col justify-between h-20 hover:bg-[#F7F5F2] transition-colors"
        >
          <div className="flex justify-between items-center w-full">
            <span className="w-7 h-7 rounded bg-[#C47A5A]/10 text-[#C47A5A] flex items-center justify-center">
              <Flag size={13} />
            </span>
            <span className="text-xl font-bold font-mono text-[#1D1D1F]">{countFlagged}</span>
          </div>
          <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block text-left">High Priority</span>
        </div>

        {/* All Goals */}
        <div 
          onClick={() => { setActiveCategory('All'); setActivePriorityFilter('All'); }}
          className="bg-white p-4 rounded-lg border border-[#E5E1DA] cursor-pointer flex flex-col justify-between h-20 hover:bg-[#F7F5F2] transition-colors"
        >
          <div className="flex justify-between items-center w-full">
            <span className="w-7 h-7 rounded bg-zinc-100 text-zinc-500 flex items-center justify-center border border-[#E5E1DA]/60">
              <Inbox size={13} />
            </span>
            <span className="text-xl font-bold font-mono text-[#1D1D1F]">{countAll}</span>
          </div>
          <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block text-left">All goals map</span>
        </div>

        {/* Completed list */}
        <div 
          onClick={() => { setActiveCategory('All'); setActivePriorityFilter('All'); }}
          className="bg-white p-4 rounded-lg border border-[#E5E1DA] cursor-pointer flex flex-col justify-between h-20 hover:bg-[#F7F5F2] transition-colors"
        >
          <div className="flex justify-between items-center w-full">
            <span className="w-7 h-7 rounded bg-[#5C7C5A]/10 text-[#5C7C5A] flex items-center justify-center">
              <CheckCircle size={13} />
            </span>
            <span className="text-xl font-bold font-mono text-[#1D1D1F]">{countCompleted}</span>
          </div>
          <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block text-left">Completed</span>
        </div>

      </div>

      {/* 3. SEARCH & CATEGORY FILTER LEDGER */}
      <div className="bg-white p-3.5 rounded-lg border border-[#E5E1DA] flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Input Box */}
        <div className="relative w-full md:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
            <Search size={12} />
          </span>
          <input
            type="text"
            placeholder="Search objectives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#F7F5F2] border border-[#E5E1DA] rounded text-xs text-[#1D1D1F] placeholder-zinc-400 focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        {/* Categories tags list */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => { setActiveCategory('All'); setActivePriorityFilter('All'); }}
            className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              activeCategory === 'All' && activePriorityFilter === 'All'
                ? 'bg-[#5C7C5A] text-white'
                : 'text-zinc-500 hover:text-[#1D1D1F] hover:bg-[#F7F5F2]'
            }`}
          >
            All Areas
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => { setActiveCategory(c); }}
              className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeCategory === c
                  ? 'bg-[#5C7C5A] text-white'
                  : 'text-zinc-500 hover:text-[#1D1D1F] hover:bg-[#F7F5F2]'
              }`}
            >
              {c}
            </button>
          ))}
          {activePriorityFilter !== 'All' && (
            <button
              onClick={() => setActivePriorityFilter('All')}
              className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C47A5A] text-white uppercase tracking-wider cursor-pointer"
            >
              Clear High Filter [x]
            </button>
          )}
        </div>
      </div>

      {/* 4. MAIN REMINDERS SHEET */}
      <div className="bg-white border border-[#E5E1DA] rounded-lg overflow-hidden">
        
        {/* Ledger header */}
        <div className="p-4 border-b border-[#E5E1DA] bg-[#F7F5F2]/45 flex justify-between items-center select-none">
          <h3 className="font-serif font-bold text-sm text-[#1D1D1F] flex items-center gap-2">
            <span>{activeCategory === 'All' ? 'Roadmap Alignments' : `${activeCategory} Chapter`}</span>
            {activePriorityFilter !== 'All' && (
              <span className="text-[9px] font-mono border border-[#C47A5A]/30 text-[#C47A5A] bg-[#C47A5A]/5 px-2 py-0.5 rounded uppercase font-semibold">
                High Priority
              </span>
            )}
          </h3>
          <span className="text-[10px] font-mono text-zinc-400">{filteredGoals.length} aligned objectives</span>
        </div>

        {filteredGoals.length === 0 ? (
          <div className="text-center py-12 p-6">
            <Inbox size={32} className="mx-auto mb-2 text-zinc-300" />
            <h4 className="font-serif font-bold text-xs text-zinc-500">Folder is empty</h4>
            <p className="text-[11px] text-zinc-400 mt-1 max-w-sm mx-auto">
              Create an overarching target alignment above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E5E1DA]/60">
            {filteredGoals.map((g) => {
              const isExpanded = expandedGoalIds.includes(g.id);
              const daysLeft = Math.round(
                (new Date(g.targetDate).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              const totalM = g.milestones.length;
              const completedM = g.milestones.filter(m => m.completed).length;

              return (
                <div key={g.id} className="p-4 hover:bg-[#F7F5F2]/20 transition-all">
                  
                  {/* Goal Row Main line */}
                  <div className="flex items-start justify-between gap-3">
                    
                    <div className="flex items-start gap-3.5 flex-1 overflow-hidden">
                      {/* Quiet physical tick indicator */}
                      <button
                        onClick={() => updateGoal(g.id, { status: g.status === 'Completed' ? 'In Progress' : 'Completed' })}
                        className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 cursor-pointer hover:bg-[#F7F5F2] transition-colors ${
                          g.status === 'Completed'
                            ? 'bg-[#5C7C5A] border-[#5C7C5A] text-white'
                            : 'border-zinc-350 bg-white'
                        }`}
                      >
                        {g.status === 'Completed' && <Check size={11} strokeWidth={3.5} />}
                      </button>

                      <div className="space-y-1 overflow-hidden text-left">
                        <span className={`block font-semibold text-sm tracking-tight leading-snug ${
                          g.status === 'Completed' ? 'text-zinc-450 line-through' : 'text-[#1D1D1F]'
                        }`}>
                          {g.title}
                        </span>

                        {g.description && (
                          <p className={`text-xs block ${g.status === 'Completed' ? 'opacity-40' : 'text-zinc-500'}`}>
                            {g.description}
                          </p>
                        )}

                        {/* Quiet metadata line */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 pb-0.5 text-[10.5px] font-mono text-zinc-400 select-none">
                          <span className="text-[#5C7C5A] bg-[#5C7C5A]/10 px-1.5 py-0.2 rounded font-sans font-bold uppercase text-[9px] tracking-wider">
                            {g.category}
                          </span>
                          <span>•</span>
                          <span className={daysLeft < 3 && g.status !== 'Completed' ? 'text-[#C47A5A] font-bold' : ''}>
                            Due: {g.targetDate} ({daysLeft > 0 ? `${daysLeft}d left` : daysLeft === 0 ? 'Today' : 'overdue'})
                          </span>
                          <span>•</span>
                          <span className="text-[#5C7C5A] font-bold">
                            Milestones: {completedM}/{totalM}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expand and Delete tools */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleExpandGoal(g.id)}
                        className="p-1 hover:bg-[#F7F5F2] rounded text-zinc-500 transition-colors"
                        title="Toggle Milestones"
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      
                      <button
                        onClick={() => deleteGoal(g.id)}
                        className="p-1 hover:text-rose-600 text-zinc-300 transition-colors"
                        title="Delete Alignment"
                      >
                        <Trash size={12} />
                      </button>
                    </div>

                  </div>

                  {/* 5. EXPANDABLE MILESTONES CHECKLIST */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pl-8 mt-3.5 space-y-3.5 border-l-2 border-[#E5E1DA] mr-4 text-left"
                      >
                        <span className="text-[9.5px] font-bold uppercase tracking-widest text-zinc-400 block">Milestones Matrix List:</span>
                        
                        {g.milestones.length === 0 ? (
                          <div className="text-[11px] text-zinc-400 italic">No sub-milestones listed. Schedule notes below.</div>
                        ) : (
                          <div className="space-y-2.5 max-w-lg">
                            {g.milestones.map((milestone) => (
                              <div
                                key={milestone.id}
                                className="flex items-center justify-between text-xs group"
                              >
                                <label className="flex items-center gap-2.5 cursor-pointer flex-1 select-none text-left">
                                  <input
                                    type="checkbox"
                                    checked={milestone.completed}
                                    onChange={() => toggleMilestone(g.id, milestone.id)}
                                    className="w-3.5 h-3.5 rounded-sm text-[#5C7C5A] border-zinc-350 focus:ring-0 cursor-pointer"
                                  />
                                  <span className={`text-[12px] ${milestone.completed ? 'text-zinc-400 line-through' : 'text-zinc-700'}`}>
                                    {milestone.title}
                                  </span>
                                </label>

                                <button
                                  onClick={() => deleteMilestone(g.id, milestone.id)}
                                  className="text-zinc-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={11} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Direct milestone insert field */}
                        <div className="flex gap-2 pt-1 max-w-sm">
                          <input
                            type="text"
                            placeholder="Add subtask reminder..."
                            value={inlineMilestoneTexts[g.id] || ''}
                            onChange={(e) =>
                              setInlineMilestoneTexts((prev) => ({
                                ...prev,
                                [g.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => e.key === 'Enter' && handleAddInlineMilestone(g.id)}
                            className="flex-1 px-2.5 py-1 text-[11.5px] bg-[#F7F5F2] border border-[#E5E1DA] rounded focus:bg-white focus:outline-none text-[#1D1D1F]"
                          />
                          <button
                            onClick={() => handleAddInlineMilestone(g.id)}
                            className="bg-white border border-[#E5E1DA] hover:bg-[#F7F5F2] text-[#5C7C5A] p-1 rounded font-bold"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. MODAL CREATION PANEL */}
      {openModal && (
        <div id="new_goal_modal_dim" className="fixed inset-0 bg-[#343434]/25 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E1DA] rounded-xl w-full max-w-md p-6 relative shadow-lg text-left select-none text-[#1D1D1F]">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-4 text-zinc-450 hover:text-zinc-650"
            >
              <X size={14} />
            </button>

            <h3 className="font-serif font-bold text-sm text-[#1D1D1F] mb-4 uppercase tracking-widest pb-2 border-b border-[#E5E1DA]">
              New Goal Alignment
            </h3>

            <form onSubmit={handleAddGoalSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block">Objective Name</label>
                <input
                  type="text"
                  placeholder="e.g. Master Classical Piano scales"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F5F2] border border-[#E5E1DA] rounded text-xs text-[#1D1D1F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block">Aesthetic Description</label>
                <textarea
                  placeholder="Log the purpose/intent of this journey..."
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F5F2] border border-[#E5E1DA] rounded text-xs text-[#1D1D1F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block">Area Segment</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Category)}
                    className="w-full bg-[#F7F5F2] border border-[#E5E1DA] rounded p-2 text-xs text-[#1D1D1F]"
                  >
                    <option value="Career">Career</option>
                    <option value="Health">Health</option>
                    <option value="Finance">Finance</option>
                    <option value="Learning">Learning</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block">Target Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full bg-[#F7F5F2] border border-[#E5E1DA] rounded p-2 text-xs text-[#1D1D1F]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block">Target Deadline</label>
                <input
                  type="date"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F5F2] border border-[#E5E1DA] rounded text-xs text-[#1D1D1F]"
                />
              </div>

              <div className="space-y-2 pb-1">
                <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block">Initial Milestones Index</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Practice 30 mins, complete chord study..."
                    value={newMilesInput}
                    onChange={(e) => setNewMilesInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMilestoneChip())}
                    className="flex-1 px-3 py-1.5 bg-[#F7F5F2] border border-[#E5E1DA] rounded text-xs text-[#1D1D1F]"
                  />
                  <button
                    type="button"
                    onClick={handleAddMilestoneChip}
                    className="bg-white border border-[#E5E1DA] hover:bg-[#F7F5F2] text-[#5C7C5A] px-3.5 py-1.5 rounded text-xs font-bold"
                  >
                    Add
                  </button>
                </div>

                {newMilestones.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {newMilestones.map((milestone, idx) => (
                      <span
                        key={idx}
                        className="bg-[#F7F5F2] border border-[#E5E1DA] text-zinc-700 px-2 py-0.5 rounded text-[10.5px] flex items-center gap-1"
                      >
                        <span className="truncate max-w-[120px]">{milestone}</span>
                        <X
                          size={10}
                          className="text-zinc-400 hover:text-rose-600 cursor-pointer"
                          onClick={() => setNewMilestones((prev) => prev.filter((_, i) => i !== idx))}
                        />
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-[#5C7C5A] hover:bg-[#5C7C5A]/90 text-white font-medium py-2 px-4 rounded text-xs transition shadow-sm flex items-center justify-center gap-2"
              >
                Establish Objective Alignment
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
