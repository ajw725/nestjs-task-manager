import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dtos/auth-credentials.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async signUp(userDTO: AuthCredentialsDTO): Promise<void> {
    return await this.userRepository.signUp(userDTO);
  }

  async signIn(userDTO: AuthCredentialsDTO): Promise<string> {
    const user = await this.userRepository.signIn(userDTO);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return user;
  }
}
