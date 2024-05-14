import {
  Injectable,
  Inject,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { EVENTS_HTTP, SERVICE_NAME } from '@freedome/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(SERVICE_NAME.AUTH) private readonly authServiceClient: ClientProxy,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const secured = this.reflector.get<string[]>(
      'secured',
      context.getHandler(),
    );

    if (!secured) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userTokenInfo = await firstValueFrom(
      this.authServiceClient.send(EVENTS_HTTP.TOKEN_DECODE, {
        token: request.headers.authorization,
      }),
    );

    if (!userTokenInfo || !userTokenInfo.data) {
      throw new HttpException(
        {
          message: userTokenInfo.message,
          data: null,
          errors: null,
        },
        userTokenInfo.status,
      );
    }
    console.log({ userTokenInfo });
    const userInfo = await firstValueFrom(
      this.authServiceClient.send(
        EVENTS_HTTP.USER_GET_BY_ID,
        userTokenInfo.data.id,
      ),
    );
    console.log({ userInfo });
    request.user = userInfo.user;
    return true;
  }
}
