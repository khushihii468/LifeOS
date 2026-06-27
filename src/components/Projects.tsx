import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { Project, Task, Priority, TaskStatus } from '../types';
import {
  FolderKanban,
  Plus,
  Trash,
  MoveRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  FolderPlus,
  X,
  MoreVertical,
  Check,
  Briefcase,
  Flag,
  Leaf,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Projects() {
  const {
    projects,
    addProject,
    deleteProject,
    addProjectTask,
    updateProjectTask,
    deleteProjectTask,
  } = useAppState();

  const [activeBoardId, setActiveBoardId] = useState<string>('');
  
  // Board Creator Drawer state
  const [showProjectCreator, setShowProjectCreator] = useState(false);
  const [pName, setPName] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pPriority, setPPriority] = useState<Priority>('Medium');
  const [pDue, setPDue] = useState('');

  // Task Creator Drawer state
  const [showTaskCreator, setShowTaskCreator] = useState(false);
  const [tName, setTName] = useState('');
  const [tDesc, setTDesc] = useState('');
  const [tPriority, setTPriority] = useState<Priority>('Medium');

  // If no board is active, auto-activate the first board
  React.useEffect(() => {
    if (projects.length > 0 && !activeBoardId) {
      setActiveBoardId(projects[0].id);
    }
  }, [projects, activeBoardId]);

  const activeProject = projects.find((p) => p.id === activeBoardId);

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim()) return;

    addProject({
      name: pName.trim(),
      description: pDesc.trim(),
      priority: pPriority,
      dueDate: pDue || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tasks: [],
    });

    setPName('');
    setPDesc('');
    setPPriority('Medium');
    setPDue('');
    setShowProjectCreator(false);
  };

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim() || !activeBoardId) return;

    addProjectTask(activeBoardId, {
      title: tName.trim(),
      description: tDesc.trim(),
      priority: tPriority,
      status: 'Todo',
    });

    setTName('');
    setTDesc('');
    setTPriority('Medium');
    setShowTaskCreator(false);
  };

  const shiftTaskStatus = (taskId: string, currentStatus: TaskStatus) => {
    if (!activeBoardId) return;
    const nextStatus: TaskStatus = 
      currentStatus === 'Todo' ? 'In Progress' :
      currentStatus === 'In Progress' ? 'Completed' : 'Todo';
    
    updateProjectTask(activeBoardId, taskId, { status: nextStatus });
  };

  const columns: { id: TaskStatus; label: string; stroke: string; bg: string }[] = [
    { id: 'Todo', label: 'Todo catalog', stroke: 'border-zinc-300', bg: 'bg-zinc-50' },
    { id: 'In Progress', label: 'Underway execution', stroke: 'border-[#C47A5A]/30', bg: 'bg-[#C47A5A]/3' },
    { id: 'Completed', label: 'Ticked archive', stroke: 'border-[#5C7C5A]/30', bg: 'bg-[#5C7C5A]/3' },
  ];

  return (
    <div id="projects_kanban_environment" className="space-y-8 text-[#1D1D1F] animate-fade-in select-none">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between py-1 gap-4 pb-2 border-b border-[#E5E1DA]">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-[#5C7C5A] uppercase tracking-widest font-mono font-bold mb-1">
            <Leaf size={12} />
            <span>Section 04 — TASK BOARDS</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-[#1D1D1F]">
            Sprint Checklists
          </h2>
          <p className="text-xs text-zinc-500 font-serif italic mt-1 font-sans">
            Categorize focused sprint cards into Todo, Underway, and Completed columns. Log subtasks clearly.
          </p>
        </div>
        
        <div className="flex gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowProjectCreator(true)}
            className="border border-[#E5E1DA] hover:bg-[#F7F5F2] text-[#1D1D1F] font-semibold py-1.5 px-3.5 rounded text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <FolderPlus size={13} className="text-[#5C7C5A]" />
            New Folder board
          </button>
          
          {activeProject && (
            <button
              onClick={() => setShowTaskCreator(true)}
              className="bg-[#5C7C5A] hover:bg-[#5C7C5A]/90 text-white font-medium py-1.5 px-4 rounded text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <Plus size={13} />
              Add Task card
            </button>
          )}
        </div>
      </div>

      {/* 2. BOARDS SELECTION SHEETS (Muji Folder Indexes) */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#E5E1DA]/40 select-none">
        {projects.length === 0 ? (
          <span className="text-[11.5px] text-zinc-400 italic">No folder cards mapped. Set up a board folder card above.</span>
        ) : (
          projects.map((p) => {
            const isSelected = p.id === activeBoardId;
            const completedCount = p.tasks.filter((t) => t.status === 'Completed').length;
            const totalCount = p.tasks.length;
            return (
              <button
                key={p.id}
                onClick={() => setActiveBoardId(p.id)}
                className={`px-4 py-2.5 rounded-t-lg border-t border-x cursor-pointer text-left transition-colors whitespace-nowrap shrink-0 flex items-center gap-4 ${
                  isSelected
                    ? 'bg-white border-[#E5E1DA] text-[#1D1D1F] font-bold z-10 -mb-2.5 pb-3'
                    : 'bg-[#F7F5F2] border-transparent text-zinc-500 hover:text-[#1D1D1F] hover:bg-[#E5E1DA]/40'
                }`}
              >
                <div className="overflow-hidden">
                  <span className="text-xs block tracking-tight truncate max-w-[140px]">{p.name}</span>
                  <span className="text-[9.5px] text-zinc-400 font-mono block mt-0.5 leading-none">
                    {completedCount}/{totalCount} cards complete
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {activeProject ? (
        <div className="space-y-6 pt-2">
          
          {/* Active board metadata specs summary label */}
          <div className="bg-[#F7F5F2] border border-[#E5E1DA] p-4.5 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif font-bold text-[#1D1D1F]">
                  Folder specifications: {activeProject.name}
                </span>
                <span className="text-[9px] font-mono border border-[#C47A5A]/30 text-[#C47A5A] bg-[#C47A5A]/5 px-2 py-0.2 rounded font-bold uppercase tracking-wider">
                  Impact: {activeProject.priority}
                </span>
              </div>
              {activeProject.description && (
                <p className="text-xs text-zinc-500 font-serif leading-snug">
                  {activeProject.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 shrink-0 font-mono">
              <span className="text-[11px] text-zinc-450 flex items-center gap-1">
                <Clock size={11} className="text-[#5C7C5A]" />
                Target date: {activeProject.dueDate}
              </span>
              
              <button
                onClick={() => {
                  deleteProject(activeProject.id);
                  setActiveBoardId('');
                }}
                className="text-zinc-400 hover:text-rose-600 p-1.5 hover:bg-[#E5E1DA]/30 rounded transition-all text-xs flex items-center gap-1 font-sans font-bold"
                title="Delete this entire folder"
              >
                <Trash size={12} />
                <span>Discard Board</span>
              </button>
            </div>
          </div>

          {/* 3. MULTI-COLUMN STATIONERY TASKS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start text-left">
            {columns.map((col) => {
              const colTasks = activeProject.tasks.filter((t) => t.status === col.id);
              return (
                <div key={col.id} className="space-y-3.5">
                  
                  {/* Column Label */}
                  <div className={`p-2.5 rounded-lg border bg-white ${col.stroke} flex justify-between items-center select-none`}>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#1D1D1F] font-mono leading-none">
                      {col.label}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-[#F7F5F2] border border-[#E5E1DA] px-2 py-0.2 rounded text-zinc-500">
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Cards stack */}
                  <div className="space-y-2.5">
                    {colTasks.length === 0 ? (
                      <div className="h-24 rounded-lg bg-[#F7F5F2]/45 border border-[#E5E1DA] border-dashed flex items-center justify-center text-zinc-400 text-[11px] italic font-serif select-none">
                        Empty column ledger.
                      </div>
                    ) : (
                      colTasks.map((task) => (
                        <div
                          key={task.id}
                          className="bg-white border border-[#E5E1DA] p-4 rounded-lg hover:border-[#5C7C5A] hover:bg-[#F7F5F2]/10 transition-all space-y-2.5 relative group"
                        >
                          <div className="flex items-start justify-between gap-2 text-left">
                            <span className="text-xs font-semibold leading-relaxed text-[#1D1D1F] block pr-1.5">
                              {task.title}
                            </span>
                            
                            <button
                              onClick={() => deleteProjectTask(activeProject.id, task.id)}
                              className="text-zinc-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 shrink-0"
                              title="Discard card"
                            >
                              <X size={11} />
                            </button>
                          </div>

                          {task.description && (
                            <p className="text-[11px] text-zinc-500 leading-normal font-serif">
                              {task.description}
                            </p>
                          )}

                          {/* Controls bar */}
                          <div className="pt-2 border-t border-[#E5E1DA]/50 flex items-center justify-between select-none">
                            <span className="text-[9px] font-mono font-bold uppercase bg-[#F7F5F2] border border-[#E5E1DA]/75 text-zinc-500 px-1.5 py-0.2 rounded">
                              {task.priority || 'Medium'}
                            </span>

                            <button
                              onClick={() => shiftTaskStatus(task.id, task.status)}
                              className="text-[9.5px] font-bold text-[#5C7C5A] hover:text-[#C47A5A] flex items-center gap-1 cursor-pointer transition-colors"
                              title="Advance Status"
                            >
                              <span>Next status</span>
                              <MoveRight size={10} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      ) : (
        <div className="py-20 text-center text-zinc-400 font-serif italic text-xs">
          Initial Board missing. Initialize your first notebook folder card using the "New Folder board" button above.
        </div>
      )}

      {/* 4. DRAWER CREATOR MODALS */}
      {/* Board creator panel */}
      {showProjectCreator && (
        <div className="fixed inset-0 bg-[#343434]/25 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E1DA] p-6 rounded-xl shadow-lg w-full max-w-sm text-left relative text-[#1D1D1F]">
            <button
              onClick={() => setShowProjectCreator(false)}
              className="absolute top-4 right-4 text-zinc-450 hover:text-zinc-650"
            >
              <X size={14} />
            </button>

            <h3 className="font-serif font-bold text-sm text-[#1D1D1F] uppercase tracking-widest pb-2 border-b border-[#E5E1DA]">
              New folder Board card
            </h3>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block">Folder Name</label>
                <input
                  type="text"
                  placeholder="e.g. Master thesis revision"
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F5F2] border border-[#E5E1DA] rounded text-xs text-[#1D1D1F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block font-sans">Objective details</label>
                <input
                  type="text"
                  placeholder="e.g. Logbooks for standard outline edits"
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F5F2] border border-[#E5E1DA] rounded text-xs text-[#1D1D1F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block">Focus weight</label>
                <select
                  value={pPriority}
                  onChange={(e) => setPPriority(e.target.value as Priority)}
                  className="w-full bg-[#F7F5F2] border border-[#E5E1DA] rounded p-2 text-xs text-[#1D1D1F]"
                >
                  <option value="High">High weight</option>
                  <option value="Medium">Medium weight</option>
                  <option value="Low">Low weight</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block">Target Due</label>
                <input
                  type="date"
                  value={pDue}
                  onChange={(e) => setPDue(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F5F2] border border-[#E5E1DA] rounded text-xs text-[#1D1D1F]"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-[#5C7C5A] hover:bg-[#5C7C5A]/90 text-white font-medium py-2 px-4 rounded text-xs transition shadow-sm flex items-center justify-center gap-2"
              >
                Confirm Board Folder
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Task creator panel */}
      {showTaskCreator && (
        <div className="fixed inset-0 bg-[#343434]/25 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E1DA] p-6 rounded-xl shadow-lg w-full max-w-sm text-left relative text-[#1D1D1F]">
            <button
              onClick={() => setShowTaskCreator(false)}
              className="absolute top-4 right-4 text-zinc-450 hover:text-zinc-650"
            >
              <X size={14} />
            </button>

            <h3 className="font-serif font-bold text-sm text-[#1D1D1F] uppercase tracking-widest pb-2 border-b border-[#E5E1DA]">
              Add Sprint Task Card
            </h3>

            <form onSubmit={handleCreateTaskSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block font-sans">Task Name</label>
                <input
                  type="text"
                  placeholder="e.g. Write structural drafts"
                  required
                  value={tName}
                  onChange={(e) => setTName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F5F2] border border-[#E5E1DA] rounded text-xs text-[#1D1D1F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block text-left">Card Description</label>
                <textarea
                  placeholder="Log any required parameters..."
                  rows={2}
                  value={tDesc}
                  onChange={(e) => setTDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F5F2] border border-[#E5E1DA] rounded text-xs text-[#1D1D1F]"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest block text-left">Task Priority</label>
                <select
                  value={tPriority}
                  onChange={(e) => setTPriority(e.target.value as Priority)}
                  className="w-full bg-[#F7F5F2] border border-[#E5E1DA] rounded p-2 text-xs text-[#1D1D1F]"
                >
                  <option value="High">High impact</option>
                  <option value="Medium">Medium impact</option>
                  <option value="Low">Low impact</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-[#5C7C5A] hover:bg-[#5C7C5A]/90 text-white font-medium py-2 px-4 rounded text-xs transition shadow-sm flex items-center justify-center gap-2"
              >
                Add Sprint Card
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
