import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  private readonly allowedStatuses: string[] = [
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.COMPLETED,
  ];

  transform(value: string) {
    const val = value.toUpperCase();
    if (!this.isValid(val)) {
      throw new BadRequestException(`"${value}" is not a valid task status`);
    }

    return value;
  }

  private isValid(status: string) {
    return this.allowedStatuses.includes(status);
  }
}
