import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.interface';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    { description: 'learn NestJS', status: TaskStatus.pending },
  ];

  getAllTasks(): Task[] {
    return this.tasks;
  }
}
