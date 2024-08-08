import { IRatingCategories } from './review.interface';
import { UserTemporary } from './user.interface';

export type SellerType =
  | string
  | string[]
  | number
  | IRatingCategories
  | Date
  | IExperience
  | IExperience[]
  | IEducation
  | IEducation[]
  | ICertificate
  | ICertificate[]
  | ILanguage
  | ILanguage[]
  | unknown
  | undefined;

export interface ILanguage {
  language: string;
  level: string;
}

export interface IExperience {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  currentlyWorkingHere: boolean | undefined;
}

export interface IEducation {
  country: string;
  university: string;
  title: string;
  major: string;
  year: string;
}

export interface ICertificate {
  _id?: string;
  name: string;
  from: string;
  year: number;
}

export interface ISellerDocument extends Record<string, SellerType> {
  _id?: string;
  user: UserTemporary;
  fullName: string;
  description: string;
  oneliner: string;
  skills: string[];
  ratingsCount?: number;
  ratingSum?: number;
  ratingCategories?: IRatingCategories;
  languages: ILanguage[];
  responseTime: number;
  recentDelivery?: Date | string;
  experience: IExperience[];
  education: IEducation[];
  socialLinks: string[];
  certificates: ICertificate[];
  ongoingJobs?: number;
  completedJobs?: number;
  cancelledJobs?: number;
  totalEarnings?: number;
  totalGigs?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ICreateOrderForSeller {
  sellerId: string;
  ongoingJobs: number;
}

export interface IUpdateTotalGigsCount {
  sellerId: string;
  count: number;
}
