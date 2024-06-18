import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import {
  DEFAULT_SIZE,
  EMPTY_NUMBER,
  EMPTY_STRING,
  SERVICE_NAME,
} from '@freedome/common';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  SearchGigsRequest,
} from 'proto/types/auth';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class SearchService {
  private authService: AuthServiceClient;
  constructor(@Inject(SERVICE_NAME.AUTH) private clientGrpc: ClientGrpc) {}
  onModuleInit() {
    this.authService =
      this.clientGrpc.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  searchGigs(searchGigsRequest: SearchGigsRequest) {
    const { searchQuery, deliveryTime, min, max, from, size, type } =
      searchGigsRequest;
    const searchGigsRequestPayload = {
      searchQuery: searchQuery || EMPTY_STRING,
      deliveryTime: deliveryTime || EMPTY_STRING,
      min: min || EMPTY_NUMBER,
      max: max || EMPTY_NUMBER,
      from: from || EMPTY_STRING,
      size: size || DEFAULT_SIZE,
      type: type || 'backward',
    };
    return this.authService.searchGigs(searchGigsRequestPayload).pipe(
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
