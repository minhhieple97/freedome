import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  IAccessTokenPayload,
  ITokenResponse,
  ResetPasswordDtoWithTokenDto,
  ResetPasswordDtoWithUserIdDto,
} from '@freedome/common';
import {
  AuthServiceControllerMethods,
  DecodeTokenRequest,
  ForgotPasswordRequest,
  GetUserByIdRequest,
  LoginAuthRequest,
  ResendEmailRequest,
  VerifyEmailRequest,
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

  async verifyEmail({ token }: VerifyEmailRequest) {
    const user = await this.authService.getUserByEmailToken(token);
    return this.authService.verifyEmail(user.id, true);
  }

  forgotPassword({ email }: ForgotPasswordRequest) {
    return this.authService.forgotPassword(email);
  }

  resetPassword(resetPasswordDtoWithUserId: ResetPasswordDtoWithUserIdDto) {
    return this.authService.resetPassword(resetPasswordDtoWithUserId);
  }

  resetPasswordWithToken(
    resetPasswordDtoWithUserId: ResetPasswordDtoWithTokenDto,
  ) {
    return this.authService.resetPasswordWithToken(resetPasswordDtoWithUserId);
  }

  resendEmail({ email }: ResendEmailRequest) {
    return this.authService.resendEmail(email);
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
