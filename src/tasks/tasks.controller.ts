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
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { GetTasksFilterDTO } from './dtos/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDTO: GetTasksFilterDTO,
  ): Promise<Task[]> {
    return this.tasksService.getTasks(filterDTO);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) taskId: number): Promise<Task> {
    return this.tasksService.getTaskById(taskId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.tasksService.createTask(createTaskDTO);
  }

  @Patch('/:id')
  updateTask(
    @Param('id', ParseIntPipe) taskId: number,
    @Body('status', TaskStatusValidationPipe) newStatus: TaskStatus,
  ): Promise<Task> {
    return this.tasksService.updateTask(taskId, newStatus);
  }

  @Delete('/:id')
  @HttpCode(204)
  deleteTask(@Param('id', ParseIntPipe) taskId: number): Promise<void> {
    return this.tasksService.deleteTask(taskId);
  }
}
