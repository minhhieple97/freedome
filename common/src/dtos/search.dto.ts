import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
export class PaginateDtoParam {
  @IsString()
  @IsOptional()
  from: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  size: number;

  @IsString()
  @IsOptional()
  type: string;
}

export class SearchGigsDtoParam {
  @IsString()
  @IsOptional()
  searchQuery: string;

  @IsOptional()
  @IsString()
  deliveryTime: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  min: number;

  @IsInt()
  @Max(100)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  max: number;

  @IsString()
  @IsOptional()
  from: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  size: number;

  @IsString()
  @IsOptional()
  type: string;
}
