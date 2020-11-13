import { v1 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDTO } from './dtos/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    { id: '1', title: 'learn NestJS', status: TaskStatus.todo },
  ];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((t) => t.id === id);
  }

  createTask(createTaskDTO: CreateTaskDTO): Task {
    const { title, description } = createTaskDTO;
    const newTask = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.todo,
    };
    this.tasks = [...this.tasks, newTask];
    return newTask;
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }
}
