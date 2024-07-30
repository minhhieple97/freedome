import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreateUserDto,
  CreateUserResponseDto,
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  GetUserByTokenResponseDto,
  LoginUserDto,
  LoginUserResponseDto,
  ResendEmailDto,
  ResetPasswordDto,
  ResetPasswrdResponseDto,
  SeedUserDtoParams,
  VerifyAuthEmailResponseDto,
  VerifyRequestDto,
} from '@freedome/common';
import {
  IAuthDocument,
  IAuthorizedRequest,
  IServiceUserCreateResponse,
} from '@freedome/common/interfaces';
import { Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { Empty } from 'google/protobuf/empty';

@ApiBearerAuth('authorization')
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/current-user')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: GetUserByTokenResponseDto,
  })
  public async getUserByToken(
    @Req() request: IAuthorizedRequest,
  ): Promise<IAuthDocument> {
    const userTokenPayload = request.user;
    const user = await this.authService.getUserByToken(userTokenPayload.id);
    return user;
  }

  @Post('/signup')
  @ApiCreatedResponse({
    type: CreateUserResponseDto,
  })
  public createUser(
    @Body() userRequest: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Observable<IServiceUserCreateResponse> {
    return this.authService.createUser(userRequest, res);
  }

  @Post('/login')
  @ApiCreatedResponse({
    type: LoginUserResponseDto,
  })
  public async loginUser(
    @Body() loginRequest: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginUserResponseDto> {
    return this.authService.loginUser(loginRequest, res);
  }

  @Put('/verify-email/:token')
  @ApiCreatedResponse({
    type: VerifyAuthEmailResponseDto,
  })
  public verifyEmail(
    @Param() verifyRequest: VerifyRequestDto,
  ): Observable<IAuthDocument> {
    const { token } = verifyRequest;
    return this.authService.verifyEmail(token);
  }

  @Put('/forgot-password')
  @ApiCreatedResponse({
    type: ForgotPasswordResponseDto,
  })
  public forgotPassword(@Body() forgotPassword: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPassword.email);
  }

  @Post('/reset-password')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResetPasswrdResponseDto,
  })
  public resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Req() req: IAuthorizedRequest,
  ) {
    const user = req.user;
    return this.authService.resetPassword(resetPasswordDto, user.id);
  }

  @Post('/reset-password-token/:token')
  @ApiOkResponse({
    type: ResetPasswrdResponseDto,
  })
  public resetPasswordWithToken(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('token') token: string,
  ) {
    return this.authService.resetPasswordWithToken(resetPasswordDto, token);
  }

  @Post('/resend-email')
  @ApiOkResponse({
    type: ResetPasswrdResponseDto,
  })
  public resendEmail(@Body() resendEmail: ResendEmailDto) {
    return this.authService.resendEmail(resendEmail.email);
  }
  @Post('seed')
  @UseGuards(JwtAuthGuard)
  seedUser(@Query() seedUserDtoParams: SeedUserDtoParams): Observable<Empty> {
    return this.authService.seedUser(seedUserDtoParams);
  }
}
