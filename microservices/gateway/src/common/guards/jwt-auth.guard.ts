import {
  Injectable,
  Inject,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICE_NAME } from '@freedome/common';

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
    if (!request.headers.authorization) {
      throw new UnauthorizedException();
    }
    const userTokenInfo = await firstValueFrom(
      this.authServiceClient.send('token_decode', {
        token: request.headers.authorization.split(' ')[1],
      }),
    );

    if (!userTokenInfo || !userTokenInfo.data) {
      throw new UnauthorizedException(
        {
          message: userTokenInfo.message,
          data: null,
          errors: null,
        },
        userTokenInfo.status,
      );
    }

    const userInfo = await firstValueFrom(
      this.authServiceClient.send('user_get_by_id', userTokenInfo.data.userId),
    );

    request.user = userInfo.user;
    return true;
  }
}
