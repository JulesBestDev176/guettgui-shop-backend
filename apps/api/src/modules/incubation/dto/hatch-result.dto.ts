import { IsInt, Min, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HatchResultDto {
  @ApiProperty({ description: 'Poussins eclos' })
  @IsInt()
  @Min(0)
  chicksHatched: number;

  @ApiPropertyOptional({ description: 'Oeufs non eclos' })
  @IsOptional()
  @IsInt()
  @Min(0)
  eggsUnhatched?: number;

  @ApiPropertyOptional({ description: 'Poussins vivants a J1' })
  @IsOptional()
  @IsInt()
  @Min(0)
  chicksAliveD1?: number;

  @ApiPropertyOptional({ description: 'Mortalite J0' })
  @IsOptional()
  @IsInt()
  @Min(0)
  chicksDeadD0?: number;

  @ApiPropertyOptional({ example: '2026-09-23' })
  @IsOptional()
  @IsDateString()
  actualHatchDate?: string;
}
