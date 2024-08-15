import {
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsBoolean,
  ArrayMinSize,
  IsNotEmpty,
  IsPositive,
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

export class CreateSellerDto {
  @IsString()
  @IsNotEmpty({ message: 'Fullname is required' })
  fullName: string;

  @IsString()
  @IsNotEmpty({ message: 'Seller description is required' })
  description: string;

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
}
