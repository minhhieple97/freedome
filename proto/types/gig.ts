// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.176.0
//   protoc               v3.6.1
// source: proto/gig.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Timestamp } from 'google/protobuf/timestamp';
import { Observable } from 'rxjs';

export const protobufPackage = 'gig';

export interface RatingCategoryItem {
  value: number;
  count: number;
}

export interface RatingCategories {
  five: RatingCategoryItem | undefined;
  four: RatingCategoryItem | undefined;
  three: RatingCategoryItem | undefined;
  two: RatingCategoryItem | undefined;
  one: RatingCategoryItem | undefined;
}

export interface CreateGigRequest {
  title: string;
  description: string;
  categories: string;
  subCategories: string[];
  tags: string[];
  expectedDelivery: string;
  basicTitle: string;
  basicDescription: string;
  price: number;
  coverImage: string;
  userId: number;
}

export interface CreateGigResponse {
  id: string;
  userId: string;
  title: string;
  username: string;
  profilePicture: string;
  email: string;
  description: string;
  active: boolean;
  categories: string;
  subCategories: string[];
  tags: string[];
  ratingsCount: number;
  ratingSum: number;
  ratingCategories: RatingCategories | undefined;
  expectedDelivery: string;
  basicTitle: string;
  basicDescription: string;
  price: number;
  coverImage: string;
  createdAt: Timestamp | undefined;
  updatedAt: Timestamp | undefined;
  sortId: number;
}

export interface UpdateGigRequest {
  title: string;
  description: string;
  categories: string;
  subCategories: string[];
  tags: string[];
  price: number;
  coverImage: string;
  expectedDelivery: string;
  basicTitle: string;
  basicDescription: string;
  id: string;
  userId: number;
}

export interface DeleteGigRequest {
  id: string;
  userId: number;
}

export interface DeleteGigResponse {
  success: boolean;
}

export interface UpdateActiveGigPropRequest {
  id: string;
  active: boolean;
  userId: number;
}

export const GIG_PACKAGE_NAME = 'gig';

export interface GigServiceClient {
  createGig(request: CreateGigRequest): Observable<CreateGigResponse>;

  updateGig(request: UpdateGigRequest): Observable<CreateGigResponse>;

  deleteGig(request: DeleteGigRequest): Observable<DeleteGigResponse>;

  updateActiveGigProp(
    request: UpdateActiveGigPropRequest,
  ): Observable<CreateGigResponse>;
}

export interface GigServiceController {
  createGig(
    request: CreateGigRequest,
  ):
    | Promise<CreateGigResponse>
    | Observable<CreateGigResponse>
    | CreateGigResponse;

  updateGig(
    request: UpdateGigRequest,
  ):
    | Promise<CreateGigResponse>
    | Observable<CreateGigResponse>
    | CreateGigResponse;

  deleteGig(
    request: DeleteGigRequest,
  ):
    | Promise<DeleteGigResponse>
    | Observable<DeleteGigResponse>
    | DeleteGigResponse;

  updateActiveGigProp(
    request: UpdateActiveGigPropRequest,
  ):
    | Promise<CreateGigResponse>
    | Observable<CreateGigResponse>
    | CreateGigResponse;
}

export function GigServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'createGig',
      'updateGig',
      'deleteGig',
      'updateActiveGigProp',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('GigService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('GigService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const GIG_SERVICE_NAME = 'GigService';
