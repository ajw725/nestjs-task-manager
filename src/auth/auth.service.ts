import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dtos/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { JwtResponse } from './jwt-response.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(userDTO: AuthCredentialsDTO): Promise<void> {
    return await this.userRepository.signUp(userDTO);
  }

  async signIn(userDTO: AuthCredentialsDTO): Promise<JwtResponse> {
    const username = await this.userRepository.signIn(userDTO);

    if (!username) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
