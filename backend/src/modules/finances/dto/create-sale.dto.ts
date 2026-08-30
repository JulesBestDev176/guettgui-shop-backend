import {
  IsString, IsOptional, IsDateString, IsInt, Min, IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType, PaymentStatus, PaymentMethod } from '@prisma/client';

export class CreateSaleDto {
  @ApiProperty({ example: '2026-08-30' })
  @IsDateString()
  date: string;

  @ApiProperty({ enum: ProductType })
  @IsEnum(ProductType, { message: 'Type de produit invalide' })
  productType: ProductType;

  @ApiProperty({ example: 30 })
  @IsInt()
  @Min(1, { message: 'La quantite doit etre au moins 1' })
  quantity: number;

  @ApiProperty({ example: 150, description: 'Prix unitaire en FCFA' })
  @IsInt()
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional({ enum: PaymentStatus, default: 'PAID' })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  amountPaid?: number;

  @ApiPropertyOptional({ enum: PaymentMethod })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  flockId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  localId?: string;
}
