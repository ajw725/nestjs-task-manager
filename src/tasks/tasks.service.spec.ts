import { Test } from '@nestjs/testing';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

const mockUser = {
  id: 1,
  username: 'test user',
  password: 'abc',
  salt: 'def',
  tasks: [],
  validatePassword: jest.fn(),
  hasId: () => true,
  save: jest.fn(),
  remove: jest.fn(),
  softRemove: jest.fn(),
  recover: jest.fn(),
  reload: jest.fn(),
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository: TaskRepository;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useFactory: mockTaskRepository,
        },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('calls getTasks on repository', () => {
      tasksService.getTasks(mockUser, {});
      expect(taskRepository.getTasks).toHaveBeenCalledTimes(1);
    });

    it('returns correct tasks', async () => {
      (taskRepository.getTasks as jest.Mock).mockResolvedValue('someValue');
      const tasks = await tasksService.getTasks(mockUser, {});
      expect(tasks).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls findOne on repository', async () => {
      try {
        await tasksService.getTaskById(mockUser, 1);
      } catch {}
      expect(taskRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('throws exception if not found', async () => {
      let msg = '';
      try {
        await tasksService.getTaskById(mockUser, 1);
      } catch (e) {
        msg = e.message;
      }
      expect(msg).toContain('not found');
    });

    it('returns task if found', async () => {
      (taskRepository.findOne as jest.Mock).mockResolvedValue('foundTask');
      const task = await tasksService.getTaskById(mockUser, 1);
      expect(task).toEqual('foundTask');
    });
  });

  describe('createTask', () => {
    it('calls createTask on repository', () => {
      tasksService.createTask(mockUser, { title: 'some task' });
      expect(taskRepository.createTask).toHaveBeenCalledTimes(1);
    });

    it('returns created task', async () => {
      (taskRepository.createTask as jest.Mock).mockResolvedValue('createdTask');
      const task = await tasksService.createTask(mockUser, {
        title: 'some task',
      });
      expect(task).toEqual('createdTask');
    });
  });

  describe('updateTask', () => {
    const mockTask = {
      save: jest.fn(),
    };

    beforeEach(() => {
      (taskRepository.findOne as jest.Mock).mockResolvedValue(mockTask);
    });

    it('returns modified task', async () => {
      const task = await tasksService.updateTask(
        mockUser,
        1,
        TaskStatus.IN_PROGRESS,
      );
      expect(task.status).toEqual('IN_PROGRESS');
    });

    it('saves task', async () => {
      await tasksService.updateTask(mockUser, 1, TaskStatus.IN_PROGRESS);
      expect(mockTask.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteTask', () => {
    it('calls deleteTask on repository', async () => {
      try {
        await tasksService.deleteTask(mockUser, 1);
      } catch {}
      expect(taskRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('throws exception if task not found', async () => {
      (taskRepository.delete as jest.Mock).mockResolvedValue({ affected: 0 });
      let msg = '';
      try {
        await tasksService.deleteTask(mockUser, 1);
      } catch (e) {
        msg = e.message;
      }
      expect(msg).toContain('not found');
    });

    it('does not throw exception if found', async () => {
      (taskRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });
      await tasksService.deleteTask(mockUser, 1);
    });
  });
});
