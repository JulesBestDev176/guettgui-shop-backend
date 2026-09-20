import { IsOptional, IsDateString, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MarkDoneDto {
  @ApiPropertyOptional({ example: '2026-08-30' })
  @IsOptional()
  @IsDateString()
  actualDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  doseGiven?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
