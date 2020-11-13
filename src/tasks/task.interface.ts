export enum TaskStatus {
  pending = 'pending',
  completed = 'completed',
}

export interface Task {
  description: string;
  status: TaskStatus;
}
