import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Inject,
  HttpStatus,
  HttpException,
  Res,
  UseGuards,
  Param,
  BadRequestException,
  Put,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, catchError, firstValueFrom, of, switchMap } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreateUserDto,
  CreateUserResponseDto,
  EVENTS_HTTP,
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  GetUserByTokenResponseDto,
  LoginUserDto,
  LoginUserResponseDto,
  ResendEmailDto,
  ResetPasswordDto,
  ResetPasswrdResponseDto,
  SERVICE_NAME,
  VerifyAuthEmailResponseDto,
  VerifyRequestDto,
} from '@freedome/common';
import {
  IAuthDocument,
  IAuthorizedRequest,
  IServiceUserCreateResponse,
  IServiceUserSearchResponse,
  IServiveTokenCreateResponse,
} from '@freedome/common/interfaces';
import { Response } from 'express';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_KEY,
} from '@gateway/common/constants';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@ApiBearerAuth('authorization')
@Controller('auth')
@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    @Inject(SERVICE_NAME.AUTH) private readonly authServiceClient: ClientProxy,
  ) {}

  @Get('/current-user')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: GetUserByTokenResponseDto,
  })
  public async getUserByToken(
    @Req() request: IAuthorizedRequest,
  ): Promise<IAuthDocument | null> {
    const userTokenPayload = request.user;
    const userInfo = await firstValueFrom(
      this.authServiceClient.send(
        EVENTS_HTTP.USER_GET_BY_ID,
        userTokenPayload.id,
      ),
    );
    return userInfo;
  }

  @Post('/signup')
  @ApiCreatedResponse({
    type: CreateUserResponseDto,
  })
  public createUser(
    @Body() userRequest: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Observable<IServiceUserCreateResponse> {
    return this.authServiceClient
      .send(EVENTS_HTTP.USER_CREATE, userRequest)
      .pipe(
        switchMap((result: IServiceUserCreateResponse) => {
          const { accessToken, refreshToken } = result;
          res.cookie(ACCESS_TOKEN_KEY, accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRES_IN),
          });
          res.cookie(ACCESS_TOKEN_KEY, refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN),
          });
          return of(result);
        }),
        catchError((err) => {
          console.log({ err });
          if (err instanceof InternalServerErrorException) {
            throw err;
          }
          throw new BadRequestException('Email already in use');
        }),
      );
  }

  @Post('/login')
  @ApiCreatedResponse({
    type: LoginUserResponseDto,
  })
  public async loginUser(
    @Body() loginRequest: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginUserResponseDto> {
    const getUserResponse: IServiceUserSearchResponse = await firstValueFrom(
      this.authServiceClient.send(
        EVENTS_HTTP.USER_SEARCH_BY_CREDENTIALS,
        loginRequest,
      ),
    );
    if (getUserResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getUserResponse.message,
          data: null,
          errors: null,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const createTokenResponse: IServiveTokenCreateResponse =
      await firstValueFrom(
        this.authServiceClient.send(EVENTS_HTTP.AT_RF_CREATE, {
          id: getUserResponse.user.id,
          email: getUserResponse.user.email,
          username: getUserResponse.user.username,
        }),
      );
    if (createTokenResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: createTokenResponse.message,
          data: null,
          errors: null,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const { accessToken, refreshToken } = createTokenResponse;
    res.cookie(ACCESS_TOKEN_KEY, accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRES_IN),
    });
    res.cookie(REFRESH_TOKEN_KEY, refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN),
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  @Put('/verify-email/:token')
  @ApiCreatedResponse({
    type: VerifyAuthEmailResponseDto,
  })
  verifyEmail(
    @Param() verifyRequest: VerifyRequestDto,
  ): Observable<IAuthDocument> {
    const { token } = verifyRequest;
    return this.authServiceClient.send(EVENTS_HTTP.VERYFY_EMAIL, token).pipe(
      switchMap((response) => {
        return of(response);
      }),
      catchError((err) => {
        if (err instanceof BadRequestException) {
          throw err;
        }
        throw new BadRequestException();
      }),
    );
  }

  @Put('/forgot-password')
  @ApiCreatedResponse({
    type: ForgotPasswordResponseDto,
  })
  forgotPassword(
    @Body() forgotPassword: ForgotPasswordDto,
  ): Observable<{ message: string }> {
    const { email } = forgotPassword;
    return this.authServiceClient.send(EVENTS_HTTP.FORGOT_PASSWORD, email).pipe(
      switchMap((res) => {
        return of(res);
      }),
      catchError((err) => {
        if (err instanceof BadRequestException) {
          throw err;
        }
        throw new BadRequestException();
      }),
    );
  }

  @Post('/reset-password')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ResetPasswrdResponseDto,
  })
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Req() req: IAuthorizedRequest,
  ): Observable<{ message: string }> {
    const user = req.user;
    return this.authServiceClient
      .send(EVENTS_HTTP.RESET_PASSWORD, {
        ...resetPasswordDto,
        userId: user.id,
      })
      .pipe(
        switchMap((res) => {
          return of(res);
        }),
        catchError((err) => {
          if (err instanceof BadRequestException) {
            throw err;
          }
          throw new BadRequestException();
        }),
      );
  }

  @Post('/reset-password-token/:token')
  @ApiOkResponse({
    type: ResetPasswrdResponseDto,
  })
  resetPasswordWithToken(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('token') token: string,
  ): Observable<{ message: string }> {
    return this.authServiceClient
      .send(EVENTS_HTTP.RESET_PASSWORD_TOKEN, {
        ...resetPasswordDto,
        token,
      })
      .pipe(
        switchMap((res) => {
          return of(res);
        }),
        catchError((err) => {
          if (err instanceof HttpException) {
            throw err;
          }
          throw new BadRequestException();
        }),
      );
  }

  @Post('/resend-email')
  @ApiOkResponse({
    type: ResetPasswrdResponseDto,
  })
  resendEmail(
    @Body() resendEmail: ResendEmailDto,
  ): Observable<{ message: string }> {
    return this.authServiceClient
      .send(EVENTS_HTTP.RESEND_EMAIL, resendEmail.email)
      .pipe(
        switchMap((res) => {
          return of(res);
        }),
        catchError((err) => {
          if (err instanceof HttpException) {
            throw err;
          }
          throw new BadRequestException();
        }),
      );
  }
}
