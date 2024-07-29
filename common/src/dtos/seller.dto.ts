import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEmail,
  IsNumber,
  IsBoolean,
  ArrayMinSize,
  IsNotEmpty,
  IsPositive,
  Allow,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LanguageLevel } from '../enums';

class Language {
  @IsString()
  language: string;

  @IsEnum(LanguageLevel, {
    message:
      'Level must be one of: beginner, intermediate, advanced, or expert',
  })
  level: LanguageLevel;
}

class Experience {
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

class RatingCategories {
  @ValidateNested()
  @Type(() => RatingCategory)
  five: RatingCategory;

  @ValidateNested()
  @Type(() => RatingCategory)
  four: RatingCategory;

  @ValidateNested()
  @Type(() => RatingCategory)
  three: RatingCategory;

  @ValidateNested()
  @Type(() => RatingCategory)
  two: RatingCategory;

  @ValidateNested()
  @Type(() => RatingCategory)
  one: RatingCategory;
}

export class CreateSellerDto {
  @IsString()
  @IsNotEmpty({ message: 'Fullname is required' })
  fullName: string;

  @IsString()
  username: string;

  @IsString()
  profilePublicId: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Profile picture is required' })
  profilePicture: string;

  @IsString()
  @IsNotEmpty({ message: 'Seller description is required' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Country field is required' })
  country: string;

  @IsString()
  @IsNotEmpty({ message: 'Oneliner field is required' })
  oneliner: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Please add at least one skill' })
  @IsString({ each: true })
  skills: string[];

  @IsArray()
  @ArrayMinSize(1, { message: 'Please add at least one language' })
  @ValidateNested({ each: true })
  @Type(() => Language)
  languages: Language[];

  @IsNumber()
  @IsPositive({ message: 'Response time must be greater than zero' })
  responseTime: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'Please add at least one work experience' })
  @ValidateNested({ each: true })
  @Type(() => Experience)
  experience: Experience[];

  @IsArray()
  @ArrayMinSize(1, { message: 'Please add at least one education' })
  @ValidateNested({ each: true })
  @Type(() => Education)
  education: Education[];

  @IsArray()
  socialLinks: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Certificate)
  certificates: Certificate[];

  @IsOptional()
  @IsNumber()
  ratingsCount?: number;

  @ValidateNested()
  @Type(() => RatingCategories)
  ratingCategories?: RatingCategories;

  @IsOptional()
  @IsNumber()
  ratingSum?: number;

  @IsOptional()
  @IsString()
  @Allow(null)
  recentDelivery?: string;

  @IsOptional()
  @IsNumber()
  ongoingJobs?: number;

  @IsOptional()
  @IsNumber()
  completedJobs?: number;

  @IsOptional()
  @IsNumber()
  cancelledJobs?: number;

  @IsOptional()
  @IsNumber()
  totalEarnings?: number;

  @IsOptional()
  @IsNumber()
  totalGigs?: number;
}
