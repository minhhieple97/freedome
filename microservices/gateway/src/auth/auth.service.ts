import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import {
  CreateUserDto,
  LoginUserDto,
  ResetPasswordDto,
  SERVICE_NAME,
  convertGrpcTimestampToPrisma,
} from '@freedome/common';
import { IAuthDocument, ITokenResponse } from '@freedome/common/interfaces';
import { Response } from 'express';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_KEY,
} from '@gateway/common/constants';
import { AUTH_SERVICE_NAME, AuthPublic, AuthServiceClient } from 'proto/types';

@Injectable()
export class AuthService {
  private authService: AuthServiceClient;
  constructor(@Inject(SERVICE_NAME.AUTH) private clientGrpc: ClientGrpc) {}
  onModuleInit() {
    this.authService =
      this.clientGrpc.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  async getUserByToken(userId: number): Promise<IAuthDocument> {
    const userInfo = await firstValueFrom(
      this.authService.getUserById({ id: userId }).pipe(
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
    if (!userInfo) {
      throw new NotFoundException('User not found');
    }
    return {
      ...userInfo,
      createdAt: convertGrpcTimestampToPrisma(userInfo.createdAt),
      updatedAt: convertGrpcTimestampToPrisma(userInfo.updatedAt),
    };
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
    const getUserResponse: AuthPublic = await firstValueFrom(
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
    const createTokenResponse: ITokenResponse = await firstValueFrom(
      this.authService
        .createToken({
          id: getUserResponse.id,
          email: getUserResponse.email,
          username: getUserResponse.username,
        })
        .pipe(
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
    return this.authService.verifyEmail({ token }).pipe(
      switchMap((response) => {
        return of({
          ...response,
          createdAt: convertGrpcTimestampToPrisma(response.createdAt),
          updatedAt: convertGrpcTimestampToPrisma(response.updatedAt),
        });
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

  forgotPassword(email: string) {
    return this.authService.forgotPassword({ email }).pipe(
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

  resetPassword(resetPasswordDto: ResetPasswordDto, userId: number) {
    return this.authService.resetPassword({ ...resetPasswordDto, userId }).pipe(
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

  resetPasswordWithToken(resetPasswordDto: ResetPasswordDto, token: string) {
    return this.authService
      .resetPasswordWithToken({ ...resetPasswordDto, token })
      .pipe(
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

  resendEmail(email: string) {
    return this.authService.resendEmail({ email }).pipe(
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
}
