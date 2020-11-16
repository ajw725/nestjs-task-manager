import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class GetTasksFilterDTO {
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status?: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  q?: string;
}
