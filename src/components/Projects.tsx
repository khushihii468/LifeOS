import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { Project, Task, ProjectStatus, Priority } from '../types';
import {
  FolderKanban,
  Plus,
  Trash,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  CheckSquare,
  AlertTriangle,
  X,
  Edit2,
  ChevronLeft,
  Briefcase,
} from 'lucide-react';

export default function Projects() {
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  } = useAppState();

  const [activeProjectId, setActiveProjectId] = useState<string>(
    projects.length > 0 ? projects[0].id : ''
  );

  // Project Creater Drawer Toggle
  const [showProjectCreator, setShowProjectCreator] = useState(false);
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projPriority, setProjPriority] = useState<Priority>('Medium');
  const [projTarget, setProjTarget] = useState('');

  // Task Creator Modal state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskColumn, setTaskColumn] = useState<ProjectStatus>('Backlog');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('High');
  const [taskDue, setTaskDue] = useState('');

  const activeProject = projects.find((p) => p.id === activeProjectId);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim()) return;

    addProject({
      name: projName.trim(),
      description: projDesc.trim(),
      priority: projPriority,
      status: 'In Progress',
      dueDate: projTarget || new Date(Date.now() + 15 * 24 * 60 * 60 * 1050).toISOString().split('T')[0],
    });

    setProjName('');
    setProjDesc('');
    setProjPriority('Medium');
    setProjTarget('');
    setShowProjectCreator(false);
    
    // Auto shift active focus to the newly created project board
    if (projects.length === 0) {
      setTimeout(() => {
        const latest = localStorage.getItem('lifeos_projects');
        if (latest) {
          const parsed = JSON.parse(latest);
          if (parsed.length > 0) setActiveProjectId(parsed[0].id);
        }
      }, 50);
    }
  };

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !activeProjectId) return;

    addTask(activeProjectId, {
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      status: taskColumn,
      priority: taskPriority,
      dueDate: taskDue || new Date(Date.now() + 7 * 24 * 60 * 60 * 1020).toISOString().split('T')[0],
    });

    setTaskTitle('');
    setTaskDesc('');
    setTaskPriority('High');
    setTaskDue('');
    setShowTaskModal(false);
  };

  // Drag and Drop Event Handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ProjectStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (activeProjectId && taskId) {
      moveTask(activeProjectId, taskId, targetStatus);
    }
  };

  const columns: { label: string; status: ProjectStatus; color: string }[] = [
    { label: 'Backlog', status: 'Backlog', color: 'border-t-zinc-400' },
    { label: 'In Progress', status: 'In Progress', color: 'border-t-sky-400' },
    { label: 'Review', status: 'Review', color: 'border-t-indigo-400' },
    { label: 'Completed', status: 'Completed', color: 'border-t-emerald-400' },
  ];

  return (
    <div id="projects_module_root" className="space-y-6">
      
      {/* Horizontal Tab Project Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between py-1 gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans tracking-tight text-gray-900 dark:text-zinc-50 flex items-center gap-2">
            Kanban Boards
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Create high-level projects, break tasks into sprint columns, and swipe status parameters.
          </p>
        </div>

        <button
          onClick={() => setShowProjectCreator(!showProjectCreator)}
          className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-medium py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer max-w-max"
        >
          <FolderKanban size={14} />
          Launch Project Board
        </button>
      </div>

      {/* Project Creator Slide block */}
      {showProjectCreator && (
        <div className="bg-white dark:bg-zinc-900 border border-indigo-100 dark:border-zinc-850 p-5 rounded-2xl shadow-sm max-w-lg space-y-4">
          <h3 className="font-bold text-gray-950 dark:text-zinc-50 text-xs flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles size={14} className="text-amber-500" />
            Initialize Project Theme
          </h3>

          <form onSubmit={handleCreateProject} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Project Name</label>
              <input
                type="text"
                placeholder="E.g. Workspace Figma Guidelines"
                required
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Core objective</label>
              <input
                type="text"
                placeholder="Briefly state target milestones for board"
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Priority Badge</label>
                <select
                  value={projPriority}
                  onChange={(e) => setProjPriority(e.target.value as Priority)}
                  className="w-full py-2.5 px-3 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl text-xs"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Due Date</label>
                <input
                  type="date"
                  value={projTarget}
                  onChange={(e) => setProjTarget(e.target.value)}
                  className="w-full py-2.5 px-3 bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs font-semibold pt-1">
              <button
                type="button"
                onClick={() => setShowProjectCreator(false)}
                className="px-4 py-2 border border-gray-100 rounded-xl text-gray-500 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl"
              >
                Establish Board
              </button>
            </div>
          </form>
        </div>
      )}

      {/* HORIZONTAL BOARD SWITCH SELECTORS */}
      {projects.length > 0 && (
        <div className="flex gap-2 pb-1 border-b border-gray-100 dark:border-zinc-800/80 overflow-x-auto">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setActiveProjectId(p.id);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 cursor-pointer ${
                activeProjectId === p.id
                  ? 'bg-gradient-to-r from-sky-400 to-indigo-500 border-transparent text-white shadow-sm font-bold'
                  : 'bg-white dark:bg-zinc-900 border-gray-105 dark:border-zinc-800 hover:border-gray-200 text-gray-500 dark:text-zinc-400'
              }`}
            >
              <Briefcase size={12} />
              {p.name}
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${activeProjectId === p.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 dark:bg-zinc-805'}`}>
                {p.tasks.length}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* RENDER ACTIVE PROJECT BOARD */}
      {!activeProject ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-gray-101 dark:border-zinc-800 rounded-3xl p-6">
          <FolderKanban size={36} className="text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-350">No active boards</h3>
          <p className="text-xs text-gray-450 mt-1 max-w-sm mx-auto">
            Establish a collaborative project workspace using the drawer button above.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Active project card details */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-sky-50 dark:bg-sky-950/20 text-sky-500 text-[10px] px-2 py-0.5 rounded border border-sky-100 dark:border-sky-900/40 font-bold">
                  Active Sprint
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-[10px] text-gray-400 font-mono">End deadline: {activeProject.dueDate}</span>
              </div>
              <h3 className="font-bold text-gray-850 dark:text-zinc-150 text-base">{activeProject.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5 max-w-xl">{activeProject.description}</p>
            </div>

            {/* Overall completeness rating */}
            <div className="flex items-center gap-6 self-start md:self-center">
              <div className="text-center">
                <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold">All tasks completed</span>
                <span className="text-lg font-bold text-gray-800 dark:text-zinc-200">
                  {activeProject.tasks.filter((t) => t.status === 'Completed').length}/{activeProject.tasks.length}
                </span>
              </div>

              <button
                onClick={() => deleteProject(activeProject.id)}
                className="p-2 border border-gray-100 dark:border-zinc-800 hover:text-rose-500 rounded-xl transition-colors hover:bg-rose-50/50"
                title="Delete project board"
              >
                <Trash size={14} />
              </button>
            </div>
          </div>

          {/* KANBAN BOARD WRAPPER */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
            {columns.map((col) => {
              const taskList = activeProject.tasks.filter((t) => t.status === col.status);
              return (
                <div
                  key={col.status}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, col.status)}
                  className={`bg-gray-50/65 dark:bg-zinc-950/30 border border-gray-100 dark:border-zinc-850 rounded-2xl p-4 space-y-3 border-t-2 ${col.color}`}
                >
                  {/* Column Header */}
                  <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-zinc-855">
                    <span className="font-semibold text-xs text-gray-800 dark:text-zinc-200">{col.label}</span>
                    <span className="bg-gray-100 dark:bg-zinc-850 px-2 py-0.5 rounded text-[10px] font-mono text-gray-400 font-bold">
                      {taskList.length}
                    </span>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-3 min-h-[180px]">
                    {taskList.length === 0 ? (
                      <div className="text-center py-8 text-[11px] text-gray-400 italic">
                        Empty column. Drop task units.
                      </div>
                    ) : (
                      taskList.map((task) => (
                        <div
                          key={task.id}
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-xl shadow-xs space-y-3 cursor-grab hover:shadow active:cursor-grabbing transition-shadow group"
                        >
                          {/* Task Priority */}
                          <div className="flex justify-between items-center">
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                                task.priority === 'High'
                                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
                                  : task.priority === 'Medium'
                                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20'
                                  : 'bg-emerald-55 text-emerald-600/80'
                              }`}
                            >
                              {task.priority} Priority
                            </span>
                            
                            {/* Option deletes */}
                            <button
                              onClick={() => deleteTask(activeProject.id, task.id)}
                              className="text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={11} />
                            </button>
                          </div>

                          {/* Task Title / Details */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-800 dark:text-zinc-200 leading-snug">
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                          </div>

                          {/* Task due and fallback swipe operations */}
                          <div className="pt-2 border-t border-gray-50 dark:border-zinc-850/80 flex justify-between items-center text-[10px]">
                            <span className="text-gray-400 flex items-center gap-1">
                              <Calendar size={10} />
                              {task.dueDate}
                            </span>

                            {/* Clicks fallback buttons to slide columns instantly */}
                            <div className="flex gap-1">
                              {col.status !== 'Backlog' && (
                                <button
                                  onClick={() => {
                                    const sourceIdx = columns.findIndex((c) => c.status === col.status);
                                    moveTask(activeProject.id, task.id, columns[sourceIdx - 1].status);
                                  }}
                                  className="p-0.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-500 dark:bg-zinc-800"
                                  title="Shift left"
                                >
                                  <ChevronLeft size={10} />
                                </button>
                              )}
                              {col.status !== 'Completed' && (
                                <button
                                  onClick={() => {
                                    const sourceIdx = columns.findIndex((c) => c.status === col.status);
                                    moveTask(activeProject.id, task.id, columns[sourceIdx + 1].status);
                                  }}
                                  className="p-0.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-500 dark:bg-zinc-800"
                                  title="Shift right"
                                >
                                  <ChevronRight size={10} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Task Trigger button */}
                  <button
                    onClick={() => {
                      setTaskColumn(col.status);
                      setShowTaskModal(true);
                    }}
                    className="w-full text-center py-1.5 border border-dashed border-gray-200 dark:border-zinc-800 hover:border-gray-300 rounded-xl text-[11px] text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-0.5 cursor-pointer mt-2"
                  >
                    <Plus size={12} />
                    Add Task Card
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CREATE TASK INNER MODAL POPUP */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowTaskModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>

            <h3 className="font-bold text-sm text-gray-900 dark:text-zinc-50 flex items-center gap-1.5 mb-4">
              <CheckSquare size={16} className="text-indigo-500" />
              Establish Task Card • {taskColumn}
            </h3>

            <form onSubmit={handleCreateTaskSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">Task Title</label>
                <input
                  type="text"
                  placeholder="Review brand logo grid variants"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 p-2 text-xs rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">Task Objective / details</label>
                <textarea
                  placeholder="What specifically needs to be completed for this task sprint?"
                  rows={2}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-100 p-2 text-xs rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="w-full py-2 px-3 bg-gray-50 dark:bg-zinc-950 border border-gray-100 rounded-xl text-xs"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">Due Date</label>
                  <input
                    type="date"
                    required
                    value={taskDue}
                    onChange={(e) => setTaskDue(e.target.value)}
                    className="w-full py-2 px-3 bg-gray-50 dark:bg-zinc-950 border border-gray-100 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 border rounded-xl text-gray-550 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl"
                >
                  Publish Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
