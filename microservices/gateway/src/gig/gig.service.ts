import {
  CreateGigDto,
  UpdateGigDto,
  UpdateGigStatusDto,
} from './../../../../common/src/dtos/gig.dto';
import {
  convertGrpcTimestampToPrisma,
  EVENTS_HTTP,
  IAuthDocument,
  SearchGigsParamDto,
  SERVICE_NAME,
} from '@freedome/common';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  CreateGigRequest,
  DeleteGigRequest,
  GigServiceClient,
  UpdateActiveGigPropRequest,
  UpdateGigRequest,
} from 'proto/types/gig';
import { catchError, of, switchMap, throwError } from 'rxjs';

@Injectable()
export class GigService {
  private gigService: GigServiceClient;
  constructor(
    @Inject(SERVICE_NAME.GIG) private readonly gigClientHttp: ClientProxy,
  ) {}

  createGig(data: CreateGigDto, user: IAuthDocument) {
    const gigData: CreateGigRequest = {
      ...data,
      userId: user.id,
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

  getGigById(gigId: string) {
    return this.gigService.getGigById({ id: gigId }).pipe(
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

  getActiveGigByUserId(userId: number) {
    return this.gigService.getActiveGigByUserId({ userId }).pipe(
      switchMap((response) => {
        return of(
          response.gigs.map((gig) => ({
            ...response,
            createdAt: convertGrpcTimestampToPrisma(gig.createdAt),
            updatedAt: convertGrpcTimestampToPrisma(gig.updatedAt),
          })),
        );
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

  getInactiveGigByUserId(userId: number) {
    return this.gigService.getActiveGigByUserId({ userId }).pipe(
      switchMap((response) => {
        return of(
          response.gigs.map((gig) => ({
            ...response,
            createdAt: convertGrpcTimestampToPrisma(gig.createdAt),
            updatedAt: convertGrpcTimestampToPrisma(gig.updatedAt),
          })),
        );
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

  updateGig(data: UpdateGigDto, gigId: string, userId: number) {
    const gigData: UpdateGigRequest = {
      ...data,
      id: gigId,
      userId,
    };
    return this.gigService.updateGig(gigData).pipe(
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

  updateStatusGig(data: UpdateGigStatusDto, gigId: string, userId: number) {
    const gigData: UpdateActiveGigPropRequest = {
      ...data,
      id: gigId,
      userId,
    };
    return this.gigService.updateActiveGigProp(gigData).pipe(
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

  deleteGig(gigId: string, userId: number) {
    const gigData: DeleteGigRequest = {
      id: gigId,
      userId,
    };
    return this.gigService.deleteGig(gigData).pipe(
      switchMap((response) => {
        return of(response);
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
  searchGigs(searchGigsParam: SearchGigsParamDto) {
    return this.gigClientHttp
      .send(EVENTS_HTTP.SEARCH_GIGS, {
        searchGigsParam,
      })
      .pipe(
        switchMap((res) => {
          return of(res);
        }),
        catchError((err) => {
          if (err instanceof HttpException) {
            throw err;
          }
          throw new BadRequestException();
        }),
      );
  }
  moreLikeThis(gigId: string) {
    return this.gigClientHttp
      .send(EVENTS_HTTP.MORE_LIKE_THIS, {
        gigId,
      })
      .pipe(
        switchMap((res) => {
          return of(res);
        }),
        catchError((err) => {
          if (err instanceof HttpException) {
            throw err;
          }
          throw new BadRequestException();
        }),
      );
  }
  seedGig() {
    return this.gigClientHttp.send(EVENTS_HTTP.SEED_GIG, {});
  }
}
