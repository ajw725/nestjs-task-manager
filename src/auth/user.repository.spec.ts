import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash, genSalt } from 'bcryptjs';
import { AuthCredentialsDTO } from './dtos/auth-credentials.dto';
import { UserRepository } from './user.repository';

const userDTO: AuthCredentialsDTO = {
  username: 'testuser',
  password: 'abcdef',
};

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let save: jest.Mock;

    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('saves new user without error', async () => {
      save.mockResolvedValue(undefined);
      await userRepository.signUp(userDTO);
      expect(save).toHaveBeenCalledTimes(1);
    });

    it('generates a salt from bcrypt', async () => {
      save.mockResolvedValue(undefined);
      await userRepository.signUp(userDTO);
      expect(genSalt as jest.Mock).toHaveBeenCalledTimes(1);
    });

    it('hashes the password', async () => {
      save.mockResolvedValue(undefined);
      await userRepository.signUp(userDTO);
      expect(hash as jest.Mock).toHaveBeenCalledWith(userDTO.password, 'salt');
    });

    it('throws exception when user already exists', async () => {
      save.mockRejectedValue({ code: '23505' });
      await expect(userRepository.signUp(userDTO)).rejects.toThrow(
        ConflictException,
      );
    });

    it('throws generic error for anything else', async () => {
      save.mockRejectedValue({ code: 'whatever' });
      await expect(userRepository.signUp(userDTO)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('signIn', () => {
    const mockUser = {
      ...userDTO,
      validatePassword: jest.fn().mockResolvedValue(true),
    };

    it('returns username if validation is successful', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      const username = await userRepository.signIn(userDTO);
      expect(username).toEqual(userDTO.username);
    });

    it('returns null if user not found', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);
      const username = await userRepository.signIn(userDTO);
      expect(username).toBeNull();
    });

    it('returns null if password is invalid', async () => {
      mockUser.validatePassword.mockClear().mockResolvedValue(false);
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      const username = await userRepository.signIn(userDTO);
      expect(username).toBeNull();
    });
  });
});
