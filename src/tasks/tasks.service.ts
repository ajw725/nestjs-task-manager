import { v1 as uuid } from 'uuid';
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

  createTask(title: string, description?: string): Task {
    const newTask = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.todo,
    };
    this.tasks = [...this.tasks, newTask];
    return newTask;
  }
}
