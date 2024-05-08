import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { TransformDataInterceptor } from '@freedome/common/interceptors';
import { AuthResponseDto } from './common/dtos/auth-response.dto';
import { CreateUserDto, EVENTS_HTTP } from '@freedome/common';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(EVENTS_HTTP.USER_CREATE)
  @UseInterceptors(new TransformDataInterceptor(AuthResponseDto))
  public async createUser(userInfo: CreateUserDto): Promise<any> {
    return this.authService.createUser(userInfo);
  }
}
