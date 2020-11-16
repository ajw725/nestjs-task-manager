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
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { GetTasksFilterDTO } from './dtos/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDTO: GetTasksFilterDTO,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User ${user.username} getting all tasks. Filters: ${JSON.stringify(
        filterDTO,
      )}`,
    );
    return this.tasksService.getTasks(user, filterDTO);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) taskId: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(user, taskId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDTO: CreateTaskDTO,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} creating task. Data: ${JSON.stringify(
        createTaskDTO,
      )}`,
    );
    return this.tasksService.createTask(user, createTaskDTO);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id', ParseIntPipe) taskId: number,
    @Body('status', TaskStatusValidationPipe) newStatus: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTask(user, taskId, newStatus);
  }

  @Delete('/:id')
  @HttpCode(204)
  deleteTask(
    @Param('id', ParseIntPipe) taskId: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.deleteTask(user, taskId);
  }
}
