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
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { UpdateTaskDTO } from './dtos/update-task.dto';
import { GetTasksFilterDTO } from './dtos/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDTO: GetTasksFilterDTO): Task[] {
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
  createTask(@Body() createTaskDTO: CreateTaskDTO): Task {
    return this.tasksService.createTask(createTaskDTO);
  }

  @Patch('/:id')
  updateTask(
    @Param('id') taskId: string,
    @Body() updateTaskDTO: UpdateTaskDTO,
  ): Task {
    return this.tasksService.updateTask(taskId, updateTaskDTO);
  }

  @Delete('/:id')
  @HttpCode(204)
  deleteTask(@Param('id') taskId: string): void {
    this.tasksService.deleteTask(taskId);
  }
}
