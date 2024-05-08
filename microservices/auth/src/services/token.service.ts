import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  createToken(id: number, email: string, username: string): string {
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
}
