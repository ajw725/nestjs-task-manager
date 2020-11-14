import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dtos/auth-credentials.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body(ValidationPipe) userDTO: AuthCredentialsDTO) {
    return this.authService.signUp(userDTO);
  }

  @Post('login')
  signIn(@Body(ValidationPipe) userDTO: AuthCredentialsDTO) {
    return this.authService.signIn(userDTO);
  }

  @Post('test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log('user:', user);
  }
}
