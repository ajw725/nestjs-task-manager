import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { GetTasksFilterDTO } from './dtos/get-tasks-filter.dto';
import { Task } from './task.entity';
import { DeleteResult } from 'typeorm';

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

  async updateTask(id: number, newStatus: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = newStatus;
    await task.save();
    return task;
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }
}
