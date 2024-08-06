export interface ICreateUser {
  userId: number;
  username: string;
  email: string;
  profilePublicId: string;
  emailVerified: boolean;
}
export interface IUpdateUser {
  userId: number;
  username?: string;
  email?: string;
  profilePublicId?: string;
  emailVerified?: boolean;
}
