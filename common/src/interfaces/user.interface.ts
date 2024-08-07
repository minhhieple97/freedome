import { User } from 'proto/types/user';

export interface ICreateUser {
  userId: number;
  username: string;
  email: string;
  profilePublicId: string;
  emailVerified: boolean;
  country?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IUpdateUser {
  userId: number;
  username?: string;
  email?: string;
  profilePublicId?: string;
  emailVerified?: boolean;
  country?: string;
  updatedAt?: Date;
}

export type UserTemporary = User;
