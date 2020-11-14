import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class GetTasksFilterDTO {
  @IsOptional()
  @IsIn([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  q: string;
}
