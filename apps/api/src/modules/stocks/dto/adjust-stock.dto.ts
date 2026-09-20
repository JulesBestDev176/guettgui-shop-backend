import { IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdjustStockDto {
  @ApiProperty({ description: 'Nouvelle quantite' })
  @IsNumber()
  newQuantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  date?: string;
}
