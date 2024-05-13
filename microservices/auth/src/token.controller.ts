import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TokenService } from './services/token.service';
import {
  EVENTS_HTTP,
  IAccessTokenPayload,
  ITokenResponse,
} from '@freedome/common';
@Controller()
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @MessagePattern(EVENTS_HTTP.AT_RF_CREATE)
  public async createToken(data: IAccessTokenPayload): Promise<ITokenResponse> {
    const { id, email, username } = data;
    let result: ITokenResponse;
    if (data && data.id) {
      try {
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
        result = {
          status: HttpStatus.CREATED,
          message: 'token_create_success',
          accessToken,
          refreshToken,
        };
      } catch (e) {
        result = {
          status: HttpStatus.BAD_REQUEST,
          message: 'token_create_bad_request',
          accessToken: null,
          refreshToken: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'token_create_bad_request',
        accessToken: null,
        refreshToken: null,
      };
    }
    console.log({ result });
    return result;
  }
}
