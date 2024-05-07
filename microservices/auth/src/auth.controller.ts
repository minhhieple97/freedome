import { Controller, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { TransformDataInterceptor } from '@freedome/common/interceptors';
import { AuthResponseDto } from './common/dtos/auth-response.dto';
import { CreateUserDto } from '@freedome/common';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('user_create')
  @UseInterceptors(new TransformDataInterceptor(AuthResponseDto))
  public async createUser(userInfo: CreateUserDto): Promise<any> {
    return this.authService.createUser(userInfo);
  }
}
