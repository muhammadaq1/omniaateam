import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Task, User, Project, Board, Column, Priority, Status, TaskFilters, AppState } from '@/types';

interface StoreActions {
  // User actions
  setCurrentUser: (user: User) => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  
  // Project actions
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  
  // Board actions
  setCurrentBoard: (board: Board | null) => void;
  updateBoard: (board: Board) => void;
  
  // Task actions
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, newStatus: Status, newIndex?: number) => void;
  assignTask: (taskId: string, assigneeId: string) => void;
  
  // Filter actions
  setFilters: (filters: Partial<TaskFilters>) => void;
  clearFilters: () => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Initialization
  initializeDemoData: () => void;
}

type Store = AppState & StoreActions;

// Demo data
const demoUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@omniaa.dev',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@omniaa.dev',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=32&h=32&fit=crop&crop=face&auto=format'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@omniaa.dev',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face&auto=format'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@omniaa.dev',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face&auto=format'
  }
];

const demoTasks: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create a modern, responsive landing page for the new product launch. Include hero section, features, and call-to-action.',
    status: 'todo',
    priority: 'high',
    assigneeId: '2',
    createdById: '1',
    createdAt: new Date(2024, 0, 15),
    updatedAt: new Date(2024, 0, 15),
    dueDate: new Date(2024, 1, 1),
    tags: ['design', 'frontend', 'urgent'],
    comments: [],
    attachments: [],
    estimatedHours: 16
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Add login, registration, and password reset functionality using JWT tokens.',
    status: 'in-progress',
    priority: 'medium',
    assigneeId: '3',
    createdById: '1',
    createdAt: new Date(2024, 0, 10),
    updatedAt: new Date(2024, 0, 18),
    dueDate: new Date(2024, 0, 25),
    tags: ['backend', 'security', 'api'],
    comments: [],
    attachments: [],
    estimatedHours: 12,
    actualHours: 8
  },
  {
    id: '3',
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment to staging and production environments.',
    status: 'review',
    priority: 'medium',
    assigneeId: '4',
    createdById: '2',
    createdAt: new Date(2024, 0, 8),
    updatedAt: new Date(2024, 0, 20),
    dueDate: new Date(2024, 0, 22),
    tags: ['devops', 'automation', 'deployment'],
    comments: [],
    attachments: [],
    estimatedHours: 8,
    actualHours: 6
  },
  {
    id: '4',
    title: 'Write API documentation',
    description: 'Create comprehensive API documentation using OpenAPI/Swagger specifications.',
    status: 'done',
    priority: 'low',
    assigneeId: '3',
    createdById: '2',
    createdAt: new Date(2024, 0, 5),
    updatedAt: new Date(2024, 0, 12),
    dueDate: new Date(2024, 0, 15),
    tags: ['documentation', 'api'],
    comments: [],
    attachments: [],
    estimatedHours: 4,
    actualHours: 5
  },
  {
    id: '5',
    title: 'Mobile app optimization',
    description: 'Optimize the mobile application for better performance and user experience on iOS and Android.',
    status: 'todo',
    priority: 'medium',
    assigneeId: '4',
    createdById: '1',
    createdAt: new Date(2024, 0, 20),
    updatedAt: new Date(2024, 0, 20),
    dueDate: new Date(2024, 1, 5),
    tags: ['mobile', 'performance', 'optimization'],
    comments: [],
    attachments: [],
    estimatedHours: 20
  }
];

const demoProject: Project = {
  id: '1',
  name: 'Omniaa Platform V2',
  description: 'Next generation AI platform with enhanced capabilities and user experience',
  color: '#0ea5e9',
  ownerId: '1',
  members: demoUsers,
  tasks: demoTasks,
  createdAt: new Date(2024, 0, 1),
  updatedAt: new Date(2024, 0, 20)
};

const demoColumns: Column[] = [
  {
    id: '1',
    title: 'To Do',
    status: 'todo',
    color: '#6b7280',
    order: 0,
    tasks: demoTasks.filter(task => task.status === 'todo')
  },
  {
    id: '2',
    title: 'In Progress',
    status: 'in-progress',
    color: '#f59e0b',
    order: 1,
    tasks: demoTasks.filter(task => task.status === 'in-progress')
  },
  {
    id: '3',
    title: 'Review',
    status: 'review',
    color: '#8b5cf6',
    order: 2,
    tasks: demoTasks.filter(task => task.status === 'review')
  },
  {
    id: '4',
    title: 'Done',
    status: 'done',
    color: '#22c55e',
    order: 3,
    tasks: demoTasks.filter(task => task.status === 'done')
  }
];

const demoBoard: Board = {
  id: '1',
  name: 'Main Board',
  projectId: '1',
  columns: demoColumns,
  createdAt: new Date(2024, 0, 1),
  updatedAt: new Date(2024, 0, 20)
};

export const useStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentUser: demoUsers[0],
        users: [],
        projects: [],
        currentProject: null,
        currentBoard: null,
        tasks: [],
        filters: {},
        isLoading: false,
        error: null,

        // User actions
        setCurrentUser: (user) => set({ currentUser: user }),
        addUser: (user) => set((state) => ({ users: [...state.users, user] })),
        updateUser: (userId, updates) =>
          set((state) => ({
            users: state.users.map((user) =>
              user.id === userId ? { ...user, ...updates } : user
            ),
          })),

        // Project actions
        setCurrentProject: (project) => set({ currentProject: project }),
        addProject: (project) =>
          set((state) => ({ projects: [...state.projects, project] })),
        updateProject: (projectId, updates) =>
          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === projectId ? { ...project, ...updates } : project
            ),
            currentProject:
              state.currentProject?.id === projectId
                ? { ...state.currentProject, ...updates }
                : state.currentProject,
          })),
        deleteProject: (projectId) =>
          set((state) => ({
            projects: state.projects.filter((p) => p.id !== projectId),
            currentProject:
              state.currentProject?.id === projectId ? null : state.currentProject,
          })),

        // Board actions
        setCurrentBoard: (board) => set({ currentBoard: board }),
        updateBoard: (board) => set({ currentBoard: board }),

        // Task actions
        addTask: (task) =>
          set((state) => {
            const newTasks = [...state.tasks, task];
            const updatedBoard = state.currentBoard
              ? {
                  ...state.currentBoard,
                  columns: state.currentBoard.columns.map((col) =>
                    col.status === task.status
                      ? { ...col, tasks: [...col.tasks, task] }
                      : col
                  ),
                }
              : null;
            return { tasks: newTasks, currentBoard: updatedBoard };
          }),

        updateTask: (taskId, updates) =>
          set((state) => {
            const updatedTasks = state.tasks.map((task) =>
              task.id === taskId ? { ...task, ...updates, updatedAt: new Date() } : task
            );
            const updatedBoard = state.currentBoard
              ? {
                  ...state.currentBoard,
                  columns: state.currentBoard.columns.map((col) => ({
                    ...col,
                    tasks: col.tasks.map((task) =>
                      task.id === taskId ? { ...task, ...updates, updatedAt: new Date() } : task
                    ),
                  })),
                }
              : null;
            return { tasks: updatedTasks, currentBoard: updatedBoard };
          }),

        deleteTask: (taskId) =>
          set((state) => {
            const newTasks = state.tasks.filter((t) => t.id !== taskId);
            const updatedBoard = state.currentBoard
              ? {
                  ...state.currentBoard,
                  columns: state.currentBoard.columns.map((col) => ({
                    ...col,
                    tasks: col.tasks.filter((t) => t.id !== taskId),
                  })),
                }
              : null;
            return { tasks: newTasks, currentBoard: updatedBoard };
          }),

        moveTask: (taskId, newStatus, newIndex) =>
          set((state) => {
            const task = state.tasks.find((t) => t.id === taskId);
            if (!task) return state;

            const updatedTask = { ...task, status: newStatus, updatedAt: new Date() };
            const updatedTasks = state.tasks.map((t) =>
              t.id === taskId ? updatedTask : t
            );

            const updatedBoard = state.currentBoard
              ? {
                  ...state.currentBoard,
                  columns: state.currentBoard.columns.map((col) => {
                    if (col.status === task.status) {
                      return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
                    }
                    if (col.status === newStatus) {
                      const newTasks = [...col.tasks, updatedTask];
                      if (newIndex !== undefined) {
                        newTasks.splice(newIndex, 0, newTasks.pop()!);
                      }
                      return { ...col, tasks: newTasks };
                    }
                    return col;
                  }),
                }
              : null;

            return { tasks: updatedTasks, currentBoard: updatedBoard };
          }),

        assignTask: (taskId, assigneeId) =>
          get().updateTask(taskId, { assigneeId }),

        // Filter actions
        setFilters: (filters) =>
          set((state) => ({ filters: { ...state.filters, ...filters } })),
        clearFilters: () => set({ filters: {} }),

        // UI actions
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),

        // Initialization
        initializeDemoData: () =>
          set({
            users: demoUsers,
            projects: [demoProject],
            currentProject: demoProject,
            currentBoard: demoBoard,
            tasks: demoTasks,
          }),
      }),
      {
        name: 'omniaa-task-manager',
        partialize: (state) => ({
          currentUser: state.currentUser,
          users: state.users,
          projects: state.projects,
          tasks: state.tasks,
        }),
      }
    ),
    { name: 'omniaa-task-manager' }
  )
);