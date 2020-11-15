import { EntityRepository, Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { genSalt, hash } from 'bcryptjs';
import { AuthCredentialsDTO } from './dtos/auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(userDTO: AuthCredentialsDTO): Promise<void> {
    const { username, password } = userDTO;

    const salt = await genSalt();
    const passwordHash = await this.hashPassword(password, salt);

    const user = new User();
    user.username = username;
    user.password = passwordHash;
    user.salt = salt;

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        // unique key violation
        throw new ConflictException(
          'A user with this username already exists.',
        );
      }
      throw new InternalServerErrorException();
    }
  }

  async signIn(userDTO: AuthCredentialsDTO): Promise<string> {
    const { username, password } = userDTO;
    const user = await this.findUserByUsername(username);

    if (user && (await user.validatePassword(password))) {
      return user.username;
    }

    return null;
  }

  private async findUserByUsername(username: string): Promise<User> {
    const user = await this.findOne({ username: username });
    return user || null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await hash(password, salt);
  }
}
