import { CreateGigDto } from './../../../../common/src/dtos/gig.dto';
import {
  convertGrpcTimestampToPrisma,
  IAuthDocument,
  SERVICE_NAME,
} from '@freedome/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import {
  CreateGigRequest,
  GIG_SERVICE_NAME,
  GigServiceClient,
} from 'proto/types/gig';
import { catchError, of, switchMap, throwError } from 'rxjs';

@Injectable()
export class GigService {
  private gigService: GigServiceClient;
  constructor(@Inject(SERVICE_NAME.GIG) private clientGrpc: ClientGrpc) {}
  onModuleInit() {
    this.gigService =
      this.clientGrpc.getService<GigServiceClient>(GIG_SERVICE_NAME);
  }
  createGig(data: CreateGigDto, user: IAuthDocument) {
    const gigData: CreateGigRequest = {
      ...data,
      username: user.username,
      email: user.email,
    };
    return this.gigService.createGig(gigData).pipe(
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
