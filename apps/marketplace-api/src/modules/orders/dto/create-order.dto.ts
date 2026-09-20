import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  priceOptionId?: string;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  customerName: string;

  @ApiProperty()
  @Matches(/^\+221[0-9]{9}$/, { message: 'Numéro invalide' })
  customerPhone: string;

  @ApiProperty()
  @IsString()
  deliveryAddress: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
