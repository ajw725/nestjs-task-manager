import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    { id: '1', title: 'learn NestJS', status: TaskStatus.todo },
  ];

  getAllTasks(): Task[] {
    return this.tasks;
  }
}
