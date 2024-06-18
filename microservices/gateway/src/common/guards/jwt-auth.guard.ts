import { SERVICE_NAME } from '@freedome/common';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { ACCESS_TOKEN_KEY } from '../constants';
import { AUTH_SERVICE_NAME, AuthServiceClient } from 'proto/types/auth';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private authService: AuthServiceClient;
  constructor(@Inject(SERVICE_NAME.AUTH) private clientGrpc: ClientGrpc) {}
  onModuleInit() {
    this.authService =
      this.clientGrpc.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context.switchToHttp().getRequest().cookies?.[ACCESS_TOKEN_KEY];
    if (!jwt) throw new UnauthorizedException();
    return this.authService.decodeToken({ token: jwt }).pipe(
      tap((res) => {
        context.switchToHttp().getRequest().user = res;
      }),
      map(() => true),
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
