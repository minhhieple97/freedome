import { IAccessTokenPayload } from '@freedome/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

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
  async decodeToken(token: string) {
    const tokenData = this.jwtService.decode(token);
    if (!tokenData) throw new UnauthorizedException();
    return tokenData;
  }
}
