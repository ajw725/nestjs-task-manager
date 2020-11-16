import { Test } from '@nestjs/testing';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
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
});
