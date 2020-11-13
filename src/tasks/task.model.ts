export enum TaskStatus {
  todo = 'todo',
  in_progress = 'in progress',
  completed = 'completed',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
}
