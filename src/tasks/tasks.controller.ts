import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { GetTasksFilterDTO } from './dtos/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) filterDTO: GetTasksFilterDTO): Task[] {
    if (Object.keys(filterDTO).length === 0) {
      return this.tasksService.getAllTasks();
    } else {
      return this.tasksService.getFilteredTasks(filterDTO);
    }
  }

  @Get('/:id')
  getTaskById(@Param('id') taskId: string): Task {
    return this.tasksService.getTaskById(taskId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDTO: CreateTaskDTO): Task {
    return this.tasksService.createTask(createTaskDTO);
  }

  @Patch('/:id')
  updateTask(
    @Param('id') taskId: string,
    @Body('status', TaskStatusValidationPipe) newStatus: TaskStatus,
  ): Task {
    return this.tasksService.updateTask(taskId, newStatus);
  }

  @Delete('/:id')
  @HttpCode(204)
  deleteTask(@Param('id') taskId: string): void {
    this.tasksService.deleteTask(taskId);
  }
}
