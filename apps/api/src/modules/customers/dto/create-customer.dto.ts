import { IsString, IsNotEmpty, IsOptional, IsEnum, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CustomerType } from '@prisma/client';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Mamadou' })
  @IsString()
  @IsNotEmpty({ message: 'Le prenom est obligatoire' })
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Diallo' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  @MaxLength(100)
  lastName: string;

  @ApiPropertyOptional({ example: '+221771234567' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?\d{9,15}$/, { message: 'Format de telephone invalide' })
  phone?: string;

  @ApiPropertyOptional({ example: 'Dakar' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ example: 'Medina' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  district?: string;

  @ApiPropertyOptional({ enum: CustomerType, default: 'INDIVIDUAL' })
  @IsOptional()
  @IsEnum(CustomerType)
  type?: CustomerType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
