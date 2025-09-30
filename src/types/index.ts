export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'todo' | 'in-progress' | 'review' | 'done';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'member';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  assigneeId?: string;
  assignee?: User;
  createdById: string;
  createdBy?: User;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  tags: string[];
  comments: Comment[];
  attachments: Attachment[];
  estimatedHours?: number;
  actualHours?: number;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author?: User;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedById: string;
  uploadedBy?: User;
  uploadedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  ownerId: string;
  owner?: User;
  members: User[];
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  title: string;
  status: Status;
  color: string;
  order: number;
  tasks: Task[];
}

export interface Board {
  id: string;
  name: string;
  projectId: string;
  columns: Column[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFilters {
  status?: Status[];
  priority?: Priority[];
  assigneeId?: string[];
  tags?: string[];
  search?: string;
  dueDateFrom?: Date;
  dueDateTo?: Date;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  projects: Project[];
  currentProject: Project | null;
  currentBoard: Board | null;
  tasks: Task[];
  filters: TaskFilters;
  isLoading: boolean;
  error: string | null;
}