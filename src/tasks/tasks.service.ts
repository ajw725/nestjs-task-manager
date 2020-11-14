import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDTO } from './dtos/get-tasks-filter.dto';
import { CreateTaskDTO } from './dtos/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDTO: GetTasksFilterDTO): Promise<Task[]> {
    const { q, status } = filterDTO;
    let query = this.taskRepository.createQueryBuilder('tasks');

    if (q) {
      query = query.andWhere('tasks.title ILIKE :q', { q: `%${q}%` });
    }

    if (status) {
      query = query.andWhere('tasks.status = :status', { status: status });
    }

    return await query.getMany();
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne(id);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found.`);
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
      throw new NotFoundException(`Task with id ${id} not found.`);
    }
  }
}
