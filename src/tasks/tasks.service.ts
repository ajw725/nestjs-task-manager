import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDTO } from './dtos/get-tasks-filter.dto';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  async getTasks(user: User, filterDTO: GetTasksFilterDTO): Promise<Task[]> {
    return await this.taskRepository.getTasks(user, filterDTO);
  }

  async getTaskById(user: User, taskId: number): Promise<Task> {
    const task = await this.taskRepository.findOne(taskId);

    if (!task || task.user_id !== user.id) {
      throw new NotFoundException(`Task with id ${taskId} not found.`);
    }

    return task;
  }

  async createTask(user: User, taskDTO: CreateTaskDTO): Promise<Task> {
    return this.taskRepository.createTask(user, taskDTO);
  }

  async updateTask(
    user: User,
    id: number,
    newStatus: TaskStatus,
  ): Promise<Task> {
    const task = await this.getTaskById(user, id);
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
