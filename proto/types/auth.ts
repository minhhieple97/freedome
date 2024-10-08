// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.176.0
//   protoc               v3.6.1
// source: proto/auth.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Empty } from 'google/protobuf/empty';
import { Timestamp } from 'google/protobuf/timestamp';
import { Observable } from 'rxjs';

export const protobufPackage = 'auth';

export interface ResetPasswordRequest {
  userId: number;
  password: string;
}

export interface ResendEmailRequest {
  email: string;
}

export interface ResetPasswordWithTokenRequest {
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface GetUserByIdRequest {
  id: number;
}

export interface CreateUserResponse {
  user: AuthPublic | undefined;
  accessToken: string;
  refreshToken: string;
}

export interface CreateAuthDto {
  /** The username of the user. */
  username: string;
  /** The password of the user. */
  password: string;
  /** The country of the user. */
  country: string;
  /** The email of the user. */
  email: string;
  /** The optional profile picture of the user. */
  profilePicture: string;
  /** The optional name of the browser used by the user. */
  browserName: string;
  /** The optional type of device used by the user. */
  deviceType: string;
}

export interface AuthPublic {
  /** The unique identifier for the user. */
  id: number;
  /** The username of the user. */
  username: string;
  /** The public profile ID of the user, which is optional. */
  profilePublicId: string;
  /** The email of the user. */
  email: string;
  /** The country of the user. */
  country: string;
  /** The name of the browser used by the user. */
  browserName: string;
  /** The type of device used by the user. */
  deviceType: string;
  /** The date and time when the user was created. */
  createdAt: Timestamp | undefined;
  /** The date and time when the user was updated. */
  updatedAt: Timestamp | undefined;
}

export interface LoginAuthRequest {
  /** The email of the user. */
  email: string;
  /** The password of the user. */
  password: string;
  /** The optional name of the browser used by the user. */
  browserName: string;
  /** The optional type of device used by the user. */
  deviceType: string;
}

export interface LoginAuthResponse {
  accessToken: string;
  refreshToken: string;
}

/** The request message containing the access token payload. */
export interface AccessTokenPayload {
  id: number;
  email: string;
  username: string;
}

/** The response message containing the token details. */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

/** The request message containing the token string to decode. */
export interface DecodeTokenRequest {
  token: string;
}

/** The response message containing the decoded token data. */
export interface TokenDataResponse {
  id: number;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

export interface CreateTokenRequest {
  id: number;
  email: string;
  username: string;
}

export interface GigResponse {
  sellerId: string;
  username: string;
  profilePicture: string;
  email: string;
  title: string;
  description: string;
  categories: string;
  tags: string[];
  active: boolean;
  expectedDelivery: string;
  basicTitle: string;
  basicDescription: string;
  ratingsCount: number;
  ratingSum: number;
  price: number;
  sortId: number;
  ratingCategories: GigResponse_RatingCategories | undefined;
  coverImage: string;
  createdAt: string;
  id: string;
}

export interface GigResponse_RatingCategories {
  five: number;
  four: number;
  three: number;
  two: number;
  one: number;
}

export interface SearchGigsResponse {
  gigs: GigResponse[];
  total: number;
}

export interface SearchGigsRequest {
  searchQuery: string;
  deliveryTime: string;
  min: number;
  max: number;
  from: string;
  size: number;
  type: string;
}

export interface SeedUserRequest {
  count: number;
}

export const AUTH_PACKAGE_NAME = 'auth';

export interface AuthServiceClient {
  createUser(request: CreateAuthDto): Observable<CreateUserResponse>;

  getUserByCredential(request: LoginAuthRequest): Observable<AuthPublic>;

  createToken(request: CreateTokenRequest): Observable<TokenResponse>;

  decodeToken(request: DecodeTokenRequest): Observable<TokenDataResponse>;

  getUserById(request: GetUserByIdRequest): Observable<AuthPublic>;

  verifyEmail(request: VerifyEmailRequest): Observable<AuthPublic>;

  forgotPassword(request: ForgotPasswordRequest): Observable<Empty>;

  resetPassword(request: ResetPasswordRequest): Observable<Empty>;

  resetPasswordWithToken(
    request: ResetPasswordWithTokenRequest,
  ): Observable<Empty>;

  resendEmail(request: ResendEmailRequest): Observable<Empty>;

  searchGigs(request: SearchGigsRequest): Observable<SearchGigsResponse>;

  seedUser(request: SeedUserRequest): Observable<Empty>;
}

export interface AuthServiceController {
  createUser(
    request: CreateAuthDto,
  ):
    | Promise<CreateUserResponse>
    | Observable<CreateUserResponse>
    | CreateUserResponse;

  getUserByCredential(
    request: LoginAuthRequest,
  ): Promise<AuthPublic> | Observable<AuthPublic> | AuthPublic;

  createToken(
    request: CreateTokenRequest,
  ): Promise<TokenResponse> | Observable<TokenResponse> | TokenResponse;

  decodeToken(
    request: DecodeTokenRequest,
  ):
    | Promise<TokenDataResponse>
    | Observable<TokenDataResponse>
    | TokenDataResponse;

  getUserById(
    request: GetUserByIdRequest,
  ): Promise<AuthPublic> | Observable<AuthPublic> | AuthPublic;

  verifyEmail(
    request: VerifyEmailRequest,
  ): Promise<AuthPublic> | Observable<AuthPublic> | AuthPublic;

  forgotPassword(request: ForgotPasswordRequest): void;

  resetPassword(request: ResetPasswordRequest): void;

  resetPasswordWithToken(request: ResetPasswordWithTokenRequest): void;

  resendEmail(request: ResendEmailRequest): void;

  searchGigs(
    request: SearchGigsRequest,
  ):
    | Promise<SearchGigsResponse>
    | Observable<SearchGigsResponse>
    | SearchGigsResponse;

  seedUser(request: SeedUserRequest): void;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'createUser',
      'getUserByCredential',
      'createToken',
      'decodeToken',
      'getUserById',
      'verifyEmail',
      'forgotPassword',
      'resetPassword',
      'resetPasswordWithToken',
      'resendEmail',
      'searchGigs',
      'seedUser',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('AuthService', method)(
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
      GrpcStreamMethod('AuthService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const AUTH_SERVICE_NAME = 'AuthService';
