import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { GetTasksFilterDTO } from './dtos/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  async getTasks(user: User, filterDTO: GetTasksFilterDTO): Promise<Task[]> {
    const { status, q } = filterDTO;
    let query = this.createQueryBuilder('tasks').where({ user_id: user.id });

    if (status) {
      query = query.andWhere('tasks.status = :status', { status: status });
    }

    if (q) {
      query = query.andWhere('tasks.title ILIKE :q', { q: `%${q}%` });
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user ${user.username}. Filters: ${filterDTO}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(user: User, taskDTO: CreateTaskDTO): Promise<Task> {
    const { title, description } = taskDTO;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    try {
      await task.save();
    } catch (error) {
      this.logger.error(
        `Failed to create task for user ${user.username}. Data: ${taskDTO}`,
        error.trace,
      );
      throw new InternalServerErrorException();
    }

    delete task.user; // remove user data from returned object

    return task;
  }
}
