import { IAccessTokenPayload } from '@freedome/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';
import { DecodeTokenRequest } from 'proto/types';
@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  createAccessToken({ id, email, username }: IAccessTokenPayload): string {
    const token = this.jwtService.sign(
      {
        id,
        email,
        username,
      },
      {
        expiresIn: 1 * 24 * 60 * 60,
      },
    );
    return token;
  }
  createRefreshToken({ id, email, username }: IAccessTokenPayload): string {
    const token = this.jwtService.sign(
      {
        id,
        email,
        username,
      },
      {
        expiresIn: 30 * 24 * 60 * 60,
      },
    );
    return token;
  }
  async decodeToken({ token }: DecodeTokenRequest) {
    const tokenData = this.jwtService.decode(token);
    if (!tokenData) {
      throw new RpcException({
        code: grpc.status.UNAUTHENTICATED,
        message: 'Wrong credentials provided',
      });
    }
    return tokenData;
  }
}
