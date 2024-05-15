export interface IAuthPayload {
  id: number;
  username: string;
  email: string;
  iat?: number;
}

export interface IAuth {
  username?: string;
  password?: string;
  email?: string;
  country?: string;
  profilePicture?: string;
}

export interface IServiceUserCreateResponse {
  status: number;
  message: string;
  user: IAuthDocument | null;
  token: string | null;
  errors: { [key: string]: any };
}

export interface IAuthorizedRequest extends Request {
  user?: IAuthDocument;
}

export interface IAuthDocument {
  id?: number;
  profilePublicId?: string;
  username?: string;
  email?: string;
  password?: string;
  country?: string;
  profilePicture?: string;
  emailVerified?: boolean;
  emailVerificationToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

export interface IAuthBuyerMessageDetails {
  username?: string;
  profilePublicId?: string;
  email?: string;
  country?: string;
  createdAt?: Date;
  type?: string;
}

export interface IEmailMessageDetails {
  receiverEmail?: string;
  template?: string;
  verifyLink?: string;
  resetLink?: string;
  username?: string;
}

export interface ISignUpPayload {
  [key: string]: string;
  username: string;
  password: string;
  email: string;
  country: string;
  profilePicture: string;
}

export interface ISignInPayload {
  [key: string]: string;
  username: string;
  password: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IResetPassword {
  [key: string]: string;
  password: string;
  confirmPassword: string;
}

export interface IReduxAuthPayload {
  authInfo?: IAuthDocument;
}

export interface IReduxAddAuthUser {
  type: string;
  payload: IReduxAuthPayload;
}

export interface IReduxLogout {
  type: string;
  payload: boolean;
}

export interface IAuthResponse {
  message: string;
}

export interface IAuthUser {
  profilePublicId: string | null;
  country: string | null;
  createdAt: Date | null;
  email: string | null;
  emailVerificationToken: string | null;
  emailVerified: boolean | null;
  id: number | null;
  passwordResetExpires: Date | null;
  passwordResetToken: null | null;
  profilePicture: string | null;
  updatedAt: Date | null;
  username: string | null;
}

export interface IServiceUserSearchResponse {
  status: number;
  message: string;
  user: IAuthDocument | null;
}

export interface IServiveTokenCreateResponse {
  status: number;
  accessToken: string | null;
  refreshToken: string | null;
  message: string;
  errors: { [key: string]: any };
}

export interface ITokenResponse {
  status: number;
  accessToken: string | null;
  refreshToken: string | null;
  message: string;
}

export interface IAccessTokenPayload {
  id: number;
  email: string;
  username: string;
}

export interface ITokenDataResponse {
  status: number;
  message: string;
  data: IAccessTokenPayload | null;
}
