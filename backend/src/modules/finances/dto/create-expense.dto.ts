import {
  IsString, IsNotEmpty, IsOptional, IsDateString,
  IsInt, Min, IsEnum, MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExpenseCategory } from '@prisma/client';

export class CreateExpenseDto {
  @ApiProperty({ example: '2026-08-30' })
  @IsDateString()
  date: string;

  @ApiProperty({ enum: ExpenseCategory })
  @IsEnum(ExpenseCategory, { message: 'Categorie invalide' })
  category: ExpenseCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  subCategory?: string;

  @ApiProperty({ example: 'Achat 2 sacs aliment ponte' })
  @IsString()
  @IsNotEmpty({ message: 'La description est obligatoire' })
  @MaxLength(500)
  description: string;

  @ApiProperty({ example: 15000, description: 'Montant en FCFA' })
  @IsInt()
  @Min(0, { message: 'Le montant doit etre positif' })
  amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  flockId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  localId?: string;
}
