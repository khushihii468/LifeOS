import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Goal,
  Habit,
  Project,
  Task,
  Notification,
  ProductivityKPIs,
  Category,
  Priority,
  GoalStatus,
  ProjectStatus,
} from '../types';

interface StateContextType {
  user: UserProfile | null;
  goals: Goal[];
  habits: Habit[];
  projects: Project[];
  notifications: Notification[];
  theme: 'light' | 'dark';
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  // Auth actions
  login: (email: string, name: string) => void;
  logout: () => void;
  updateUser: (profile: Partial<UserProfile>) => void;
  // Goal actions
  addGoal: (goal: Omit<Goal, 'id' | 'progress' | 'createdAt'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  archiveGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  addMilestone: (goalId: string, title: string) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;
  // Habit actions
  addHabit: (habit: Omit<Habit, 'id' | 'logs' | 'streak' | 'maxStreak' | 'createdAt'>) => void;
  updateHabit: (id: string, habit: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitLog: (id: string, dateStr: string) => void;
  // Project actions
  addProject: (project: Omit<Project, 'id' | 'tasks' | 'createdAt'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  // Task actions
  addTask: (projectId: string, task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (projectId: string, taskId: string, task: Partial<Task>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  moveTask: (projectId: string, taskId: string, newStatus: ProjectStatus) => void;
  // Notification actions
  addNotification: (title: string, message: string, type: 'info' | 'warning' | 'success') => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  // Theme Toggle
  toggleTheme: () => void;
  // Calculation helpers
  productivityScore: ProductivityKPIs;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

// Helper function to get dates from last X days for initial logging
const getPastDateStr = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

const INITIAL_USER: UserProfile = {
  email: 'khushinayak96@gmail.com',
  name: 'Khushi Nayak',
  joinDate: '2026-06-01',
  bio: 'Productivity enthusiast building elegant SaaS products. Obsessed with goal alignment and high consistency.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
};

const INITIAL_GOALS: Goal[] = [
  {
    id: 'g-1',
    title: 'Launch LifeOS SaaS Product',
    description: 'Design, build, and ship a high-fidelity productivity hub applet for target users.',
    category: 'Career',
    targetDate: getPastDateStr(-14), // 2 weeks in future
    priority: 'High',
    status: 'In Progress',
    milestones: [
      { id: 'm-1-1', title: 'Complete Figma UI layouts', completed: true },
      { id: 'm-1-2', title: 'Develop React + Tailwind structures', completed: true },
      { id: 'm-1-3', title: 'Integrate robust LocalStorage store', completed: true },
      { id: 'm-1-4', title: 'Perform stress tests & deploy', completed: false },
    ],
    progress: 75,
    createdAt: getPastDateStr(20),
  },
  {
    id: 'g-2',
    title: 'Achieve Half Marathon Fitness',
    description: 'Steadily build running mileage to comfortably race 21.1 kilometers.',
    category: 'Health',
    targetDate: getPastDateStr(-90), // 3 months in future
    priority: 'Medium',
    status: 'In Progress',
    milestones: [
      { id: 'm-2-1', title: 'Run a continuous 5K', completed: true },
      { id: 'm-2-2', title: 'Run 10K without rest stops', completed: true },
      { id: 'm-2-3', title: 'Complete a 15K trial trail run', completed: false },
      { id: 'm-2-4', title: 'Main 21.1K run challenge', completed: false },
    ],
    progress: 50,
    createdAt: getPastDateStr(30),
  },
  {
    id: 'g-3',
    title: 'Master Advanced Advanced TypeScript',
    description: 'Fully master complex conditional mappings, template levels, and utility writing.',
    category: 'Learning',
    targetDate: getPastDateStr(2), // completed 2 days ago
    priority: 'High',
    status: 'Completed',
    milestones: [
      { id: 'm-3-1', title: 'Understand covariance & contravariance', completed: true },
      { id: 'm-3-2', title: 'Solve 15 utility type challenges', completed: true },
    ],
    progress: 100,
    createdAt: getPastDateStr(10),
  },
];

const INITIAL_HABITS: Habit[] = [
  {
    id: 'h-1',
    name: 'Diaphragmatic Meditation Flow',
    description: 'Deep breathing for stress relief and focus. Standard morning routine.',
    frequency: 'Daily',
    category: 'Health',
    targetPerDay: 1,
    logs: [
      { date: getPastDateStr(6), count: 1 },
      { date: getPastDateStr(5), count: 1 },
      { date: getPastDateStr(4), count: 1 },
      { date: getPastDateStr(3), count: 1 },
      { date: getPastDateStr(2), count: 1 },
      { date: getPastDateStr(1), count: 1 },
      { date: getPastDateStr(0), count: 1 }, // Completed today
    ],
    streak: 7,
    maxStreak: 12,
    createdAt: getPastDateStr(25),
  },
  {
    id: 'h-2',
    name: 'Advanced Coding Challenge',
    description: 'Solve at least one advanced coding puzzle or algorithmic optimization.',
    frequency: 'Daily',
    category: 'Learning',
    targetPerDay: 1,
    logs: [
      { date: getPastDateStr(6), count: 1 },
      { date: getPastDateStr(5), count: 1 },
      { date: getPastDateStr(4), count: 1 },
      { date: getPastDateStr(2), count: 1 },
      { date: getPastDateStr(1), count: 1 }, // Missed today
    ],
    streak: 2,
    maxStreak: 15,
    createdAt: getPastDateStr(25),
  },
  {
    id: 'h-3',
    name: 'Weekly Personal Finance Audit',
    description: 'Track budget vs spending, and review investment allocation.',
    frequency: 'Weekly',
    category: 'Finance',
    targetPerDay: 1,
    logs: [
      { date: getPastDateStr(14), count: 1 },
      { date: getPastDateStr(7), count: 1 },
    ],
    streak: 2,
    maxStreak: 4,
    createdAt: getPastDateStr(25),
  },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p-1',
    name: 'LifeOS Core Infrastructure',
    description: 'Architecting the frontend framework, drag boards, and data visualizers.',
    status: 'In Progress',
    priority: 'High',
    dueDate: getPastDateStr(-5),
    createdAt: getPastDateStr(12),
    tasks: [
      { id: 't-1-1', title: 'Establish global state with LocalStorage syncing', description: 'Persist state data securely across sessions', status: 'Completed', priority: 'High', dueDate: getPastDateStr(4), createdAt: getPastDateStr(12) },
      { id: 't-1-2', title: 'Design modular bento widgets layout', description: 'Clean layout framing stats & charts', status: 'Completed', priority: 'Medium', dueDate: getPastDateStr(2), createdAt: getPastDateStr(12) },
      { id: 't-1-3', title: 'Build interactive GitHub habit completion heatmap', description: 'Display past logs in micro-grid elements', status: 'In Progress', priority: 'High', dueDate: getPastDateStr(-1), createdAt: getPastDateStr(12) },
      { id: 't-1-4', title: 'Integrate dynamic rule-based advice insights', description: 'Generate human suggestions based on completion rates', status: 'Backlog', priority: 'Low', dueDate: getPastDateStr(-6), createdAt: getPastDateStr(12) },
    ],
  },
  {
    id: 'p-2',
    name: 'Design Language & Icons',
    description: 'Harmonize spacing, shadows, typography, and light/dark mode variations.',
    status: 'Review',
    priority: 'Medium',
    dueDate: getPastDateStr(-2),
    createdAt: getPastDateStr(10),
    tasks: [
      { id: 't-2-1', title: 'Integrate custom font family variables', description: 'Inter paired with JetBrains Mono', status: 'Completed', priority: 'Medium', dueDate: getPastDateStr(1), createdAt: getPastDateStr(10) },
      { id: 't-2-2', title: 'Verify WCAG AA color accessibility contrasts', description: 'Ensure text stays legible across light/dark styles', status: 'Completed', priority: 'High', dueDate: getPastDateStr(0), createdAt: getPastDateStr(10) },
    ],
  },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-1',
    title: 'Welcome to LifeOS',
    message: 'Hello Khushi! Plan your goals, log your morning habits, and build out your Kanban tasks.',
    type: 'success',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'n-2',
    title: 'Weekly Finance Review is due!',
    message: 'Your habit "Weekly Personal Finance Audit" is approaching its weekly recurring target date.',
    type: 'info',
    read: false,
    createdAt: getPastDateStr(1) + 'T12:00:00.000Z',
  },
];

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('lifeos_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('lifeos_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('lifeos_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('lifeos_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('lifeos_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('lifeos_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    // Default to light as requested: "Default to a clean, high-contrast light theme"
    return 'light';
  });

  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Sync to database / localStorage
  useEffect(() => {
    localStorage.setItem('lifeos_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('lifeos_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('lifeos_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('lifeos_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('lifeos_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('lifeos_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Auth Operations
  const login = (email: string, name: string) => {
    const updated = {
      email,
      name,
      joinDate: new Date().toISOString().split('T')[0],
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop`,
      bio: 'Ready to crush my personal targets and habits with LifeOS!',
    };
    setUser(updated);
    addNotification('Logged In Successfully', `Welcome back, ${name}! Your workspace is fully synchronized.`, 'success');
  };

  const logout = () => {
    setUser(null);
    setCurrentTab('dashboard');
  };

  const updateUser = (profile: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...profile });
      addNotification('Profile Sync', 'Your user details have been updated successfully.', 'success');
    }
  };

  // Helper: auto calculate goal progress matching guidelines
  const recalculateGoalProgress = (milestones: Goal['milestones']): number => {
    if (milestones.length === 0) return 0;
    const completed = milestones.filter((m) => m.completed).length;
    return Math.round((completed / milestones.length) * 100);
  };

  // Goal Operations
  const addGoal = (goalData: Omit<Goal, 'id' | 'progress' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: `g-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      progress: recalculateGoalProgress(goalData.milestones),
    };
    setGoals((prev) => [newGoal, ...prev]);
    addNotification('Goal Created', `"${newGoal.title}" has been successfully added to your tracker.`, 'success');
  };

  const updateGoal = (id: string, updatedFields: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const mergedMilestones = updatedFields.milestones !== undefined ? updatedFields.milestones : g.milestones;
        const progress = recalculateGoalProgress(mergedMilestones);
        return {
          ...g,
          ...updatedFields,
          progress,
        };
      })
    );
  };

  const deleteGoal = (id: string) => {
    const g = goals.find((item) => item.id === id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
    if (g) addNotification('Goal Deleted', `"${g.title}" was removed.`, 'warning');
  };

  const archiveGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: 'Archived' as GoalStatus } : g))
    );
    addNotification('Goal Archived', 'Goal was added to your archive list.', 'info');
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedMilestones = g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const progress = recalculateGoalProgress(updatedMilestones);
        return {
          ...g,
          milestones: updatedMilestones,
          progress,
        };
      })
    );
  };

  const addMilestone = (goalId: string, title: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedMilestones = [...g.milestones, { id: `m-${Date.now()}`, title, completed: false }];
        const progress = recalculateGoalProgress(updatedMilestones);
        return {
          ...g,
          milestones: updatedMilestones,
          progress,
        };
      })
    );
  };

  const deleteMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedMilestones = g.milestones.filter((m) => m.id !== milestoneId);
        const progress = recalculateGoalProgress(updatedMilestones);
        return {
          ...g,
          milestones: updatedMilestones,
          progress,
        };
      })
    );
  };

  // Helper habit streak algorithm
  const recalculateHabitStreaks = (logs: Habit['logs']): { streak: number; maxStreak: number } => {
    if (logs.length === 0) return { streak: 0, maxStreak: 0 };

    // Unique dates sorted in descending order
    const loggedDates = Array.from(new Set(logs.map((log) => log.date))).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = getPastDateStr(1);

    // If neither today nor yesterday is logged, current streak is broken
    const hasToday = loggedDates.includes(todayStr);
    const hasYesterday = loggedDates.includes(yesterdayStr);

    let streak = 0;
    if (hasToday || hasYesterday) {
      // Calculate active continuous streak starting from the most recent mark
      let expectedDate = new Date(loggedDates[0]);
      let continuousCount = 0;

      for (let i = 0; i < loggedDates.length; i++) {
        const currentDate = new Date(loggedDates[i]);
        // Difference in days between expected log date and current logged coordinate
        const diffMs = expectedDate.getTime() - currentDate.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) {
          continuousCount++;
          expectedDate = currentDate;
        } else {
          break;
        }
      }
      streak = continuousCount;
    }

    // Now calculate historically maximum streak
    let maxStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    // Sort ascending for forward historical check
    const sortedDatesAsc = [...loggedDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    for (let i = 0; i < sortedDatesAsc.length; i++) {
      const currentDate = new Date(sortedDatesAsc[i]);
      if (!lastDate) {
        tempStreak = 1;
      } else {
        const diffMs = currentDate.getTime() - lastDate.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) {
          tempStreak++;
        } else {
          maxStreak = Math.max(maxStreak, tempStreak);
          tempStreak = 1;
        }
      }
      lastDate = currentDate;
    }
    maxStreak = Math.max(maxStreak, tempStreak);

    return {
      streak,
      maxStreak: Math.max(streak, maxStreak),
    };
  };

  // Habit Operations
  const addHabit = (habitData: Omit<Habit, 'id' | 'logs' | 'streak' | 'maxStreak' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: `h-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      logs: [],
      streak: 0,
      maxStreak: 0,
    };
    setHabits((prev) => [newHabit, ...prev]);
    addNotification('Habit Tracked', `"${newHabit.name}" successfully created. Stay consistent!`, 'success');
  };

  const updateHabit = (id: string, updatedFields: Partial<Habit>) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updatedFields } : h))
    );
  };

  const deleteHabit = (id: string) => {
    const h = habits.find((item) => item.id === id);
    setHabits((prev) => prev.filter((item) => item.id !== id));
    if (h) addNotification('Habit Deleted', `"${h.name}" was deleted.`, 'warning');
  };

  const toggleHabitLog = (id: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const exists = h.logs.find((log) => log.date === dateStr);
        let updatedLogs = [];
        if (exists) {
          updatedLogs = h.logs.filter((log) => log.date !== dateStr);
        } else {
          updatedLogs = [...h.logs, { date: dateStr, count: 1 }];
        }

        const { streak, maxStreak } = recalculateHabitStreaks(updatedLogs);
        return {
          ...h,
          logs: updatedLogs,
          streak,
          maxStreak,
        };
      })
    );
  };

  // Project Operations
  const addProject = (projectData: Omit<Project, 'id' | 'tasks' | 'createdAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      tasks: [],
    };
    setProjects((prev) => [newProject, ...prev]);
    addNotification('Project Created', `Project "${newProject.name}" has been started.`, 'success');
  };

  const updateProject = (id: string, updatedFields: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProject = (id: string) => {
    const p = projects.find((item) => item.id === id);
    setProjects((prev) => prev.filter((item) => item.id !== id));
    if (p) addNotification('Project Removed', `"${p.name}" has been deleted. All active assignments cleared.`, 'warning');
  };

  // Task Operations
  const addTask = (projectId: string, taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          tasks: [newTask, ...p.tasks],
        };
      })
    );
  };

  const updateTask = (projectId: string, taskId: string, taskFields: Partial<Task>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, ...taskFields } : t)),
        };
      })
    );
  };

  const deleteTask = (projectId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          tasks: p.tasks.filter((t) => t.id !== taskId),
        };
      })
    );
  };

  const moveTask = (projectId: string, taskId: string, newStatus: ProjectStatus) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
        };
      })
    );
  };

  // Notification Operations
  const addNotification = (title: string, message: string, type: 'info' | 'warning' | 'success') => {
    const newNotif: Notification = {
      id: `n-${Date.now()}`,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev].slice(0, 30)); // Cap at 30 items
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Theme Management
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Real-Time Productivity KPIs Scoring Algorithm
  // Productivity Score = 40% Habit Consistency, 30% Goal Progress, 30% Project/Task Completion
  const calculateKPIs = (): ProductivityKPIs => {
    // 1. Habit Consistency: Average logs as percentage of active targets over the last 7 days
    let habitConsistency = 0;
    if (habits.length > 0) {
      let totalAssessed = 0;
      let totalLogged = 0;
      // Evaluate actual hits over previous 7 days
      habits.forEach((h) => {
        const daysToAssess = h.frequency === 'Daily' ? 7 : 1;
        totalAssessed += daysToAssess;
        
        let logsInPeriod = 0;
        for (let i = 0; i < 7; i++) {
          const checkDate = getPastDateStr(i);
          const loggedThisDay = h.logs.some((l) => l.date === checkDate);
          if (loggedThisDay) {
            logsInPeriod++;
          }
        }
        
        if (h.frequency === 'Weekly') {
          // Weekly check check logs in last 7 days
          totalLogged += Math.min(1, logsInPeriod);
        } else {
          totalLogged += logsInPeriod;
        }
      });
      habitConsistency = totalAssessed > 0 ? Math.round((totalLogged / totalAssessed) * 100) : 100;
    } else {
      habitConsistency = 100; // neutral starting bias
    }

    // 2. Goal Progress: Average progress rate of all active (In Progress) goals
    const activeGoals = goals.filter((g) => g.status === 'In Progress');
    const goalProgress =
      activeGoals.length > 0
        ? Math.round(activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length)
        : goals.length > 0
        ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
        : 100;

    // 3. Project / Task completion rate
    let projectCompletion = 0;
    let totalTasksCount = 0;
    let completedTasksCount = 0;

    projects.forEach((p) => {
      p.tasks.forEach((t) => {
        totalTasksCount++;
        if (t.status === 'Completed') {
          completedTasksCount++;
        }
      });
    });

    if (totalTasksCount > 0) {
      projectCompletion = Math.round((completedTasksCount / totalTasksCount) * 100);
    } else {
      projectCompletion = 100;
    }

    // Overall Score Weighted Equation
    const overallScore = Math.min(
      100,
      Math.max(
        0,
        Math.round(
          habitConsistency * 0.4 + goalProgress * 0.3 + projectCompletion * 0.3
        )
      )
    );

    return {
      habitConsistency,
      goalProgress,
      projectCompletion,
      overallScore,
    };
  };

  const productivityScore = calculateKPIs();

  return (
    <StateContext.Provider
      value={{
        user,
        goals,
        habits,
        projects,
        notifications,
        theme,
        currentTab,
        setCurrentTab,
        login,
        logout,
        updateUser,
        addGoal,
        updateGoal,
        deleteGoal,
        archiveGoal,
        toggleMilestone,
        addMilestone,
        deleteMilestone,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitLog,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        addNotification,
        markNotificationRead,
        clearNotifications,
        toggleTheme,
        productivityScore,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
};
