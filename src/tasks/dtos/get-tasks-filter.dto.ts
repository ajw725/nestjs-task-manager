import { TaskStatus } from '../task.model';

export class GetTasksFilterDTO {
  status: TaskStatus;
  q: string;
}
