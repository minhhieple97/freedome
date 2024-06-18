import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  IsNumber,
  Min,
  IsArray,
  ValidateNested,
  IsOptional,
  IsBoolean,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

class Language {
  @IsOptional()
  _id?: string;

  @IsString()
  language: string;

  @IsString()
  level: string;
}

class Experience {
  @IsOptional()
  _id?: string;

  @IsString()
  company: string;

  @IsString()
  title: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsString()
  description: string;

  @IsBoolean()
  currentlyWorkingHere: boolean;
}

class Education {
  @IsOptional()
  _id?: string;

  @IsString()
  country: string;

  @IsString()
  university: string;

  @IsString()
  title: string;

  @IsString()
  major: string;

  @IsString()
  year: string;
}

class Certificate {
  @IsOptional()
  _id?: string;

  @IsString()
  name: string;

  @IsString()
  from: string;

  @IsNumber()
  year: number;
}

class RatingCategory {
  @IsNumber()
  value: number;

  @IsNumber()
  count: number;
}

export class SellerDto {
  @IsOptional()
  _id?: string;

  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  profilePublicId?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  oneliner: string;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { message: 'Please add at least one skill' })
  skills: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Language)
  @MinLength(1, { message: 'Please add at least one language' })
  languages: Language[];

  @IsNumber()
  @Min(0, { message: 'Response time must be greater than zero' })
  responseTime: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Experience)
  @MinLength(1, { message: 'Please add at least one work experience' })
  experience: Experience[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Education)
  @MinLength(1, { message: 'Please add at least one education' })
  education: Education[];

  @IsArray()
  @IsOptional()
  @IsUrl({}, { each: true })
  socialLinks?: string[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Certificate)
  certificates?: Certificate[];

  @IsNumber()
  @IsOptional()
  ratingsCount?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => RatingCategory)
  ratingCategories?: {
    five: RatingCategory;
    four: RatingCategory;
    three: RatingCategory;
    two: RatingCategory;
    one: RatingCategory;
  };

  @IsNumber()
  @IsOptional()
  ratingSum?: number;

  @IsString()
  @IsOptional()
  recentDelivery?: string;

  @IsNumber()
  @IsOptional()
  ongoingJobs?: number;

  @IsNumber()
  @IsOptional()
  completedJobs?: number;

  @IsNumber()
  @IsOptional()
  cancelledJobs?: number;

  @IsNumber()
  @IsOptional()
  totalEarnings?: number;

  @IsNumber()
  @IsOptional()
  totalGigs?: number;

  @IsString()
  @IsOptional()
  createdAt?: string;
}
