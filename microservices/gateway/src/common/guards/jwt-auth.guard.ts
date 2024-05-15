import { EVENTS_HTTP, IAuthDocument, SERVICE_NAME } from '@freedome/common';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, map, tap } from 'rxjs';
import { ACCESS_TOKEN_KEY } from '../constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(SERVICE_NAME.AUTH) private readonly authClient: ClientProxy,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context.switchToHttp().getRequest().cookies?.[ACCESS_TOKEN_KEY];
    if (!jwt) throw new UnauthorizedException();
    return this.authClient
      .send<IAuthDocument>(EVENTS_HTTP.TOKEN_DECODE, jwt)
      .pipe(
        tap((res) => {
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
        catchError((err) => {
          if (err instanceof UnauthorizedException) {
            throw err;
          }
          throw new UnauthorizedException();
        }),
      );
  }
}
