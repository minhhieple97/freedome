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
  AUTH_SERVICE_NAME,
  DecodeTokenRequest,
  ForgotPasswordRequest,
  GetUserByIdRequest,
  LoginAuthRequest,
  ResendEmailRequest,
  SeedUserRequest,
  VerifyEmailRequest,
} from 'proto/types/auth';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod(AUTH_SERVICE_NAME, 'createUser')
  public createUser(userInfo: CreateUserDto) {
    return this.authService.createUser(userInfo);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'getUserById')
  getUserById({ id }: GetUserByIdRequest) {
    return this.authService.getAuthUserById(id);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'verifyEmail')
  async verifyEmail({ token }: VerifyEmailRequest) {
    const user = await this.authService.getUserByEmailToken(token);
    return this.authService.verifyEmail(user.id, true);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'forgotPassword')
  forgotPassword({ email }: ForgotPasswordRequest) {
    return this.authService.forgotPassword(email);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'resetPassword')
  resetPassword(resetPasswordDtoWithUserId: ResetPasswordDtoWithUserIdDto) {
    return this.authService.resetPassword(resetPasswordDtoWithUserId);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'resetPasswordWithToken')
  resetPasswordWithToken(
    resetPasswordDtoWithUserId: ResetPasswordDtoWithTokenDto,
  ) {
    return this.authService.resetPasswordWithToken(resetPasswordDtoWithUserId);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'resendEmail')
  resendEmail({ email }: ResendEmailRequest) {
    return this.authService.resendEmail(email);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'getUserByCredential')
  getUserByCredential(loginUserRequest: LoginAuthRequest) {
    return this.authService.getUserByCredential(loginUserRequest);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'createToken')
  async createToken(data: IAccessTokenPayload): Promise<ITokenResponse> {
    return this.authService.createToken(data);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'decodeToken')
  public async decodeToken(
    tokenValue: DecodeTokenRequest,
  ): Promise<IAccessTokenPayload> {
    const tokenData = await this.authService.decodeToken(tokenValue);
    return tokenData;
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'seedUser')
  public seedUser(seedUserRequest: SeedUserRequest): Promise<void> {
    return this.authService.seedUser(seedUserRequest);
  }
}
