import {
  IsString, IsNotEmpty, IsOptional, IsDateString,
  IsInt, Min, IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDailyRecordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'L\'identifiant du lot est obligatoire' })
  flockId: string;

  @ApiProperty({ example: '2026-08-30' })
  @IsDateString({}, { message: 'Date invalide' })
  date: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  eggsLaid?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  eggsBroken?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  eggsCollected?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  mortalityCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mortalityCause?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  feedConsumedKg?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  waterConsumedL?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  avgWeightKg?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  sampleSize?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  localId?: string;
}
