import { UserTemporary } from './user.interface';

export interface IBuyerDocument {
  id: string;
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
