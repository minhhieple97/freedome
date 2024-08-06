import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsNumber,
  Min,
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
