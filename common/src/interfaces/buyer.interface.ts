import { ObjectId } from 'mongoose';
import { UserTemporary } from './user.interface';

export interface IBuyerDocument {
  _id: ObjectId;
  user: UserTemporary;
  isSeller: boolean;
  purchasedGigs: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IReduxBuyer {
  type?: string;
  payload: IBuyerDocument;
}
