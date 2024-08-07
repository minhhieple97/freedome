import { ObjectId } from 'mongoose';

export interface IBuyerDocument {
  _id?: string | ObjectId;
  userId: string;
  isSeller?: boolean;
  purchasedGigs: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IReduxBuyer {
  type?: string;
  payload: IBuyerDocument;
}
