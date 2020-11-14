import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
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
