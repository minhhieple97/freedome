import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { GigType } from '../enums';
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

export class SearchGigsParamDto {
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

  @IsEnum(GigType)
  @IsOptional()
  type: GigType;
}

export class SeedUserDtoParams {
  @IsInt()
  @Max(20)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  count: number;
}
