import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from '@prisma/client';

export class PriceOptionDto {
  @ApiProperty()
  @IsString()
  label: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional()
  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;
}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  basePrice: number;

  @ApiPropertyOptional({ default: 'unité' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  badge?: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @ApiPropertyOptional({ enum: ProductStatus })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @ApiPropertyOptional({ type: [PriceOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PriceOptionDto)
  @IsOptional()
  priceOptions?: PriceOptionDto[];
}
