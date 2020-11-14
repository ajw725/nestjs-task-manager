import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { GetTasksFilterDTO } from './dtos/get-tasks-filter.dto';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  // private tasks: Task[] = [
  //   { id: '1', title: 'learn NestJS', status: TaskStatus.TODO },
  //   { id: '2', title: 'second task', status: TaskStatus.IN_PROGRESS },
  //   { id: '3', title: 'task three', status: TaskStatus.TODO },
  // ];
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  // getFilteredTasks(filterDTO: GetTasksFilterDTO): Task[] {
  //   const { status, q } = filterDTO;
  //   let tasks = [...this.tasks];
  //   if (status) {
  //     tasks = tasks.filter((t) => t.status === status);
  //   }
  //   if (q) {
  //     tasks = tasks.filter((t) => t.title.includes(q));
  //   }
  //   return tasks;
  // }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }

    return task;
  }

  async createTask(taskDTO: CreateTaskDTO): Promise<Task> {
    return this.taskRepository.createTask(taskDTO);
  }

  // updateTask(id: string, newStatus: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   task.status = newStatus;
  //   return task;
  // }
  // deleteTask(id: string): void {
  //   const task = this.getTaskById(id); // for not found handling
  //   this.tasks = this.tasks.filter((t) => t.id !== task.id);
  // }
}
