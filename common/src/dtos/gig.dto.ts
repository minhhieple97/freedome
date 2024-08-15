import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsNumber,
  Min,
  IsBoolean,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateGigDto {
  @IsString({ message: 'Please add a gig title' })
  @IsNotEmpty({ message: 'Gig title is required' })
  title: string;

  @IsString({ message: 'Please add a gig description' })
  @IsNotEmpty({ message: 'Gig description is required' })
  description: string;

  @IsString({ message: 'Please select a category' })
  @IsNotEmpty({ message: 'Gig category is required' })
  categories: string;

  @IsArray({ message: 'Please add at least one subcategory' })
  @ArrayMinSize(1, { message: 'Please add at least one subcategory' })
  @IsString({ each: true, message: 'Each subcategory must be a string' })
  subCategories: string[];

  @IsArray({ message: 'Please add at least one tag' })
  @ArrayMinSize(1, { message: 'Please add at least one tag' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  tags: string[];

  @IsNumber({}, { message: 'Please add a gig price' })
  @Min(5, { message: 'Gig price must be greater than $4.99' })
  price: number;

  @IsString({ message: 'Please add a cover image' })
  @IsNotEmpty({ message: 'Gig cover image is required' })
  coverImage: string;

  @IsString({ message: 'Please add expected delivery' })
  @IsNotEmpty({ message: 'Gig expected delivery is required' })
  expectedDelivery: string;

  @IsString({ message: 'Please add basic title' })
  @IsNotEmpty({ message: 'Gig basic title is required' })
  basicTitle: string;

  @IsString({ message: 'Please add basic description' })
  @IsNotEmpty({ message: 'Gig basic description is required' })
  basicDescription: string;
}

export class UpdateGigDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string.' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Categories must be a string.' })
  categories?: string;

  @IsOptional()
  @IsArray({ message: 'SubCategories must be an array.' })
  @IsString({ each: true, message: 'Each subcategory must be a string.' })
  subCategories?: string[];

  @IsOptional()
  @IsArray({ message: 'Tags must be an array.' })
  @IsString({ each: true, message: 'Each tag must be a string.' })
  tags?: string[];

  @IsOptional()
  @IsNumber({}, { message: 'Price must be a number.' })
  @IsPositive({ message: 'Price must be a positive number.' })
  price?: number;

  @IsOptional()
  @IsString({ message: 'Cover image must be a string.' })
  coverImage?: string;

  @IsOptional()
  @IsString({ message: 'Expected delivery must be a string.' })
  expectedDelivery?: string;

  @IsOptional()
  @IsString({ message: 'Basic title must be a string.' })
  basicTitle?: string;

  @IsOptional()
  @IsString({ message: 'Basic description must be a string.' })
  basicDescription?: string;
}

export class UpdateGigStatusDto {
  @IsBoolean({ message: 'Please add gig status' })
  @IsNotEmpty({ message: 'Gig stauts is required' })
  active: boolean;
}
