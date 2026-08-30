import { IsString, IsNotEmpty, IsOptional, MaxLength, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({ example: 'Elevage Diallo' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom de l\'elevage est obligatoire' })
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Dakar, Senegal' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @ApiPropertyOptional({ example: 'XOF' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @ApiPropertyOptional({ default: 70 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  targetLayingRate?: number;

  @ApiPropertyOptional({ default: 85 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  targetFertility?: number;

  @ApiPropertyOptional({ default: 82 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  targetHatchRate?: number;
}
