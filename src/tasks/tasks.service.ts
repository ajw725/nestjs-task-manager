import { v1 as uuid } from 'uuid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { UpdateTaskDTO } from './dtos/update-task.dto';
import { GetTasksFilterDTO } from './dtos/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    { id: '1', title: 'learn NestJS', status: TaskStatus.todo },
    { id: '2', title: 'second task', status: TaskStatus.in_progress },
    { id: '3', title: 'task three', status: TaskStatus.todo },
  ];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getFilteredTasks(filterDTO: GetTasksFilterDTO): Task[] {
    const { status, q } = filterDTO;
    let tasks = [...this.tasks];
    if (status) {
      tasks = tasks.filter((t) => t.status === status);
    }
    if (q) {
      tasks = tasks.filter((t) => t.title.includes(q));
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }

    return task;
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

  updateTask(id: string, updateTaskDTO: UpdateTaskDTO): Task {
    const { status } = updateTaskDTO;
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  deleteTask(id: string): void {
    const task = this.getTaskById(id); // for not found handling
    this.tasks = this.tasks.filter((t) => t.id !== task.id);
  }
}
