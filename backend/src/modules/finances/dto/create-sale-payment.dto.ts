import { IsDateString, IsInt, Min, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

export class CreateSalePaymentDto {
  @ApiProperty({ example: '2026-08-30' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 5000 })
  @IsInt()
  @Min(1, { message: 'Le montant doit etre au moins 1' })
  amount: number;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod, { message: 'Methode de paiement invalide' })
  method: PaymentMethod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
