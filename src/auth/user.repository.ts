import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
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

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await hash(password, salt);
  }
}
