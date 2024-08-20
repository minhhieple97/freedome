import {
  CreateGigDto,
  CreateGigRequest,
  DeleteGigRequest,
  EVENTS_HTTP,
  IAuthDocument,
  SearchGigsParamDto,
  SERVICE_NAME,
  UpdateGigDto,
  UpdateGigRequest,
  UpdateGigStatusDto,
  UpdateGigStatusRequest,
} from '@freedome/common';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, of, switchMap, throwError } from 'rxjs';

@Injectable()
export class GigService {
  constructor(
    @Inject(SERVICE_NAME.GIG) private readonly gigClientHttp: ClientProxy,
  ) {}

  createGig(data: CreateGigDto, user: IAuthDocument) {
    const gigData: CreateGigRequest = {
      ...data,
      userId: user.id,
    };
    return this.gigClientHttp
      .send(EVENTS_HTTP.MORE_LIKE_THIS, {
        gigData,
      })
      .pipe(
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

  getGigById(gigId: string) {
    return this.gigClientHttp
      .send(EVENTS_HTTP.MORE_LIKE_THIS, { id: gigId })
      .pipe(
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

  getActiveGigByUserId(userId: number) {
    return this.gigClientHttp
      .send(EVENTS_HTTP.MORE_LIKE_THIS, {
        userId,
      })
      .pipe(
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

  getInactiveGigByUserId(userId: number) {
    return this.gigClientHttp
      .send(EVENTS_HTTP.GET_INACTIVE_GIG_BY_USER_ID, {
        userId,
      })
      .pipe(
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

  updateGig(data: UpdateGigDto, gigId: string, userId: number) {
    const gigData: UpdateGigRequest = {
      ...data,
      id: gigId,
      userId,
    };
    return this.gigClientHttp.send(EVENTS_HTTP.UPDATE_GIG, gigData).pipe(
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

  updateStatusGig(data: UpdateGigStatusDto, gigId: string, userId: number) {
    const gigData: UpdateGigStatusRequest = {
      ...data,
      id: gigId,
      userId,
    };
    return this.gigClientHttp.send(EVENTS_HTTP.UPDATE_GIG_STATUS, gigData).pipe(
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

  deleteGig(gigId: string, userId: number) {
    const gigData: DeleteGigRequest = {
      id: gigId,
      userId,
    };
    return this.gigClientHttp.send(EVENTS_HTTP.DELETE_GIG, gigData).pipe(
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
