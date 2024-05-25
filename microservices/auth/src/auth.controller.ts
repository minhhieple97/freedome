import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import {
  CreateUserDto,
  EVENTS_HTTP,
  IAccessTokenPayload,
  ITokenResponse,
  ResetPasswordDtoWithTokenDto,
  ResetPasswordDtoWithUserIdDto,
} from '@freedome/common';
import {
  AuthServiceControllerMethods,
  DecodeTokenRequest,
  GetUserByIdRequest,
  LoginAuthRequest,
} from 'proto/types';

@Controller()
@AuthServiceControllerMethods()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public createUser(userInfo: CreateUserDto) {
    return this.authService.createUser(userInfo);
  }

  getUserById({ id }: GetUserByIdRequest) {
    return this.authService.getAuthUserById(id);
  }

  @MessagePattern(EVENTS_HTTP.VERYFY_EMAIL)
  async verifyEmail(token: string) {
    const user = await this.authService.getUserByEmailToken(token);
    return this.authService.verifyEmail(user.id, true);
  }

  @MessagePattern(EVENTS_HTTP.FORGOT_PASSWORD)
  async forgotPasswod(email: string) {
    await this.authService.forgotPassword(email);
    return { message: 'success' };
  }

  @MessagePattern(EVENTS_HTTP.RESET_PASSWORD)
  async resetPassword(
    resetPasswordDtoWithUserId: ResetPasswordDtoWithUserIdDto,
  ) {
    await this.authService.resetPassword(resetPasswordDtoWithUserId);
    return { message: 'success' };
  }

  @MessagePattern(EVENTS_HTTP.RESET_PASSWORD_TOKEN)
  async resetPasswordWithToken(
    resetPasswordDtoWithUserId: ResetPasswordDtoWithTokenDto,
  ) {
    await this.authService.resetPasswordWithToken(resetPasswordDtoWithUserId);
    return { message: 'success' };
  }

  @MessagePattern(EVENTS_HTTP.RESEND_EMAIL)
  async resendEmail(email: string) {
    await this.authService.resendEmail(email);
    return { message: 'success' };
  }
  getUserByCredential(loginUserRequest: LoginAuthRequest) {
    return this.authService.getUserByCredential(loginUserRequest);
  }

  async createToken(data: IAccessTokenPayload): Promise<ITokenResponse> {
    return this.authService.createToken(data);
  }
  public async decodeToken(
    tokenValue: DecodeTokenRequest,
  ): Promise<IAccessTokenPayload> {
    const tokenData = await this.authService.decodeToken(tokenValue);
    return tokenData;
  }
}
