import { convertGrpcTimestampToPrisma, SERVICE_NAME } from '@freedome/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { USER_SERVICE_NAME, UserServiceClient } from 'proto/types/user';
import { catchError, of, switchMap, throwError } from 'rxjs';

@Injectable()
export class BuyerService {
  private userService: UserServiceClient;
  constructor(@Inject(SERVICE_NAME.USER) private clientGrpc: ClientGrpc) {}
  onModuleInit() {
    this.userService =
      this.clientGrpc.getService<UserServiceClient>(USER_SERVICE_NAME);
  }
  getUserBuyerWithEmail(email: string) {
    return this.userService.getUserBuyerWithEmail({ email }).pipe(
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
  getUserBuyerWithUsername(username: string) {
    return this.userService.getUserBuyerWithUsername({ username }).pipe(
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
}
