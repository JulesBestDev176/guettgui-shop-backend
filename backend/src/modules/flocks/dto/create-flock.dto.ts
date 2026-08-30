import {
  IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString,
  IsInt, Min, MaxLength, IsNumber, Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FlockType } from '@prisma/client';

export class CreateFlockDto {
  @ApiProperty({ example: 'Goliath - Noyau 1' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom du lot est obligatoire' })
  @MaxLength(100)
  name: string;

  @ApiProperty({ enum: FlockType })
  @IsEnum(FlockType, { message: 'Type de lot invalide' })
  type: FlockType;

  @ApiPropertyOptional({ example: 'Goliath' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  breed?: string;

  @ApiProperty({ example: '2026-08-01' })
  @IsDateString({}, { message: 'Date de demarrage invalide' })
  startDate: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  initialMales?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  initialFemales?: number;

  @ApiPropertyOptional({ default: 0, description: 'Pour les lots chair (pas de distinction M/F)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  initialTotal?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  targetLayingRate?: number;

  @ApiPropertyOptional({ default: 45 })
  @IsOptional()
  @IsInt()
  @Min(1)
  broilerDurationDays?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  incubationDays?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photoUrl?: string;
}
