import { IsString, IsNotEmpty, IsInt, Min, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBatchDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  incubatorId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sourceFlockId: string;

  @ApiProperty({ example: '2026-08-30' })
  @IsDateString()
  loadDate: string;

  @ApiProperty({ example: 56 })
  @IsInt()
  @Min(1, { message: 'Le nombre d\'oeufs doit etre au moins 1' })
  eggsLoaded: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
