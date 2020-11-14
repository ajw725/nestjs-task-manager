import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { GetTasksFilterDTO } from './dtos/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterDTO: GetTasksFilterDTO): Promise<Task[]> {
    const { status, q } = filterDTO;
    let query = this.createQueryBuilder('tasks');

    if (status) {
      query = query.andWhere('tasks.status = :status', { status: status });
    }

    if (q) {
      query = query.andWhere('tasks.title ILIKE :q', { q: `%${q}%` });
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(taskDTO: CreateTaskDTO): Promise<Task> {
    const { title, description } = taskDTO;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.TODO;
    await task.save();

    return task;
  }
}
