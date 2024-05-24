import { Controller } from '@nestjs/common';
import { TokenService } from './services/token.service';
import { IAccessTokenPayload, ITokenResponse } from '@freedome/common';
@Controller()
// @AuthServiceControllerMethods()
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  async createToken(data: IAccessTokenPayload): Promise<ITokenResponse> {
    const { id, email, username } = data;
    const accessToken = this.tokenService.createAccessToken({
      id,
      email,
      username,
    });
    const refreshToken = this.tokenService.createRefreshToken({
      id,
      email,
      username,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  public async decodeToken(token: string): Promise<IAccessTokenPayload> {
    const tokenData = await this.tokenService.decodeToken(token);
    return tokenData;
  }
}
