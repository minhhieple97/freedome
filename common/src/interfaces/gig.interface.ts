import { GigDocument } from 'microservices/gig/src/gig.schema';
import { IRatingCategories, IReviewDocument } from './review.interface';
import { ISellerDocument } from './seller.interface';

export type GigType = string | string[] | number | unknown | undefined;

export interface ICreateGig extends Record<string, GigType> {
  title: string;
  categories: string;
  description: string;
  subCategories: string[];
  tags: string[];
  price: number;
  coverImage: string;
  expectedDelivery: string;
  basicTitle: string;
  basicDescription: string;
}

export interface ISellerGig {
  id: string;
  userId: string;
  title: string;
  description: string;
  active?: boolean;
  categories: string;
  subCategories: string[];
  tags: string[];
  ratingsCount?: number; // make sure to add this to elasticsearch as a double
  ratingSum?: number; // make sure to add this to elasticsearch as a double
  ratingCategories?: IRatingCategories;
  expectedDelivery: string;
  basicTitle: string;
  basicDescription: string;
  price: number;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  sortId?: number;
}

export interface IGigContext {
  gig: ISellerGig;
  seller: ISellerDocument;
  isSuccess?: boolean;
  isLoading?: boolean;
}

export interface IGigsProps {
  type?: string;
  gig?: ISellerGig;
}

export interface IGigCardItems {
  gig: ISellerGig;
  linkTarget: boolean;
  showEditIcon: boolean;
}

export interface ISelectedBudget {
  minPrice: string;
  maxPrice: string;
}

export interface IGigViewReviewsProps {
  showRatings: boolean;
  reviews?: IReviewDocument[];
}

export interface IGigInfo {
  total: number | string;
  title: string;
  bgColor: string;
}

export interface IGigTopProps {
  gigs: ISellerGig[];
  title?: string;
  subTitle?: string;
  category?: string;
  width: string;
  type: string;
}

export type SearchQueryGigs =
  | { query_string: { fields: string[]; query: string } }
  | { term: { [key: string]: boolean } }
  | { range: { [key: string]: { gte?: number; lte?: number } } };

export interface GetInactiveGigByUserIdRequest {
  userId: number;
}

export interface GetGigByIdRequest {
  id: string;
}

export interface GetActiveGigByUserIdRequest {
  userId: number;
}

export interface CreateGigRequest {
  title: string;
  description?: string;
  categories?: string;
  subCategories?: string[];
  tags: string[];
  expectedDelivery?: string;
  basicTitle?: string;
  basicDescription?: string;
  price: number;
  coverImage?: string;
  userId: number;
}

export interface DeleteGigRequest {
  id: string;
  userId: number;
}

export interface UpdateGigStatusRequest {
  id: string;
  active: boolean;
  userId: number;
}

export interface UpdateGigRequest {
  title?: string;
  description?: string;
  categories?: string;
  subCategories?: string[];
  tags?: string[];
  price?: number;
  coverImage?: string;
  expectedDelivery?: string;
  basicTitle?: string;
  basicDescription?: string;
  id: string;
  userId: number;
}

export interface IGigElasticSearchDocument
  extends Omit<GigDocument, 'user' | '_id'> {
  user: {
    email: string;
    username: string;
  };
}
