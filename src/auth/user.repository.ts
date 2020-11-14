import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDTO } from './dtos/auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(userDTO: AuthCredentialsDTO): Promise<void> {
    const { username, password } = userDTO;

    const user = new User();
    user.username = username;
    user.password = password;
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
}
