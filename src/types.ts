export type Category = 'Career' | 'Health' | 'Finance' | 'Learning' | 'Personal';
export type Priority = 'Low' | 'Medium' | 'High';
export type GoalStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Archived';
export type ProjectStatus = 'Backlog' | 'In Progress' | 'Review' | 'Completed';
export type TaskStatus = 'Todo' | 'In Progress' | 'Completed';
export type Frequency = 'Daily' | 'Weekly';

export interface UserProfile {
  email: string;
  name: string;
  joinDate: string;
  avatarUrl?: string;
  bio?: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: Category;
  targetDate: string;
  priority: Priority;
  status: GoalStatus;
  milestones: Milestone[];
  progress: number; // 0 to 100, auto-calculated from milestones
  createdAt: string;
}

export interface HabitLog {
  date: string; // YYYY-MM-DD
  count: number; // For tracking targets per day
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: Frequency;
  category: Category;
  targetPerDay: number;
  logs: HabitLog[]; // History of completion dates
  streak: number; // Current streak in days
  maxStreak: number; // Longest streak achieved
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  dueDate: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  dueDate: string;
  tasks: Task[];
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
  createdAt: string;
}

export interface ProductivityKPIs {
  habitConsistency: number; // % consistency
  goalProgress: number; // % average goal progress
  projectCompletion: number; // % of tasks completed
  overallScore: number; // custom weighted score
}
