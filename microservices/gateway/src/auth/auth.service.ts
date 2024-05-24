import {
  Injectable,
  Inject,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientGrpc, ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import {
  CreateUserDto,
  LoginUserDto,
  ResetPasswordDto,
  EVENTS_HTTP,
  SERVICE_NAME,
} from '@freedome/common';
import {
  IAuthDocument,
  IServiveTokenCreateResponse,
} from '@freedome/common/interfaces';
import { Response } from 'express';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_KEY,
} from '@gateway/common/constants';
import { AUTH_SERVICE_NAME, Auth, AuthServiceClient } from 'proto';

@Injectable()
export class AuthService {
  private authService: AuthServiceClient;
  constructor(
    @Inject(SERVICE_NAME.AUTH) private readonly authServiceClient: ClientProxy,
    @Inject(SERVICE_NAME.AUTH) private clientGrpc: ClientGrpc,
  ) {}
  onModuleInit() {
    this.authService =
      this.clientGrpc.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  async getUserByToken(userId: number): Promise<IAuthDocument | null> {
    const userInfo = await firstValueFrom(
      this.authServiceClient.send(EVENTS_HTTP.USER_GET_BY_ID, userId),
    );
    return userInfo;
  }

  createUser(userRequest: CreateUserDto, res: Response): Observable<any> {
    return this.authService.createUser(userRequest).pipe(
      switchMap((result) => {
        const { accessToken, refreshToken } = result;
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
        return of(result);
      }),
      catchError((error) =>
        throwError(
          () =>
            new RpcException({
              code: error.code,
              message: error.details,
            }),
        ),
      ),
    );
  }

  async loginUser(
    loginRequest: LoginUserDto,
    res: Response,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    console.log({ loginRequest });
    const getUserResponse: Auth = await firstValueFrom(
      this.authService.getUserByCredential(loginRequest).pipe(
        catchError((error) =>
          throwError(
            () =>
              new RpcException({
                code: error.code,
                message: error.details,
              }),
          ),
        ),
      ),
    );
    const createTokenResponse: IServiveTokenCreateResponse =
      await firstValueFrom(
        this.authServiceClient.send(EVENTS_HTTP.AT_RF_CREATE, {
          id: getUserResponse.id,
          email: getUserResponse.email,
          username: getUserResponse.username,
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
    return { accessToken, refreshToken };
  }

  verifyEmail(token: string): Observable<IAuthDocument> {
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

  forgotPassword(email: string): Observable<{ message: string }> {
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

  resetPassword(
    resetPasswordDto: ResetPasswordDto,
    userId: number,
  ): Observable<{ message: string }> {
    return this.authServiceClient
      .send(EVENTS_HTTP.RESET_PASSWORD, { ...resetPasswordDto, userId })
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

  resetPasswordWithToken(
    resetPasswordDto: ResetPasswordDto,
    token: string,
  ): Observable<{ message: string }> {
    return this.authServiceClient
      .send(EVENTS_HTTP.RESET_PASSWORD_TOKEN, { ...resetPasswordDto, token })
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

  resendEmail(email: string): Observable<{ message: string }> {
    return this.authServiceClient.send(EVENTS_HTTP.RESEND_EMAIL, email).pipe(
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
