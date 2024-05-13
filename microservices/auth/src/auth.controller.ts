import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto, EVENTS_HTTP, LoginUserDto } from '@freedome/common';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(EVENTS_HTTP.USER_CREATE)
  public async createUser(userInfo: CreateUserDto) {
    return this.authService.createUser(userInfo);
  }

  @MessagePattern(EVENTS_HTTP.USER_SEARCH_BY_CREDENTIALS)
  public async getUserByConditional(loginUserDto: LoginUserDto) {
    return this.authService.getUserByCredential(loginUserDto);
  }
}
