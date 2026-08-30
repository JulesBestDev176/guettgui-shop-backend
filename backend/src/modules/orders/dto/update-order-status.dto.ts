import { IsEnum, IsOptional, IsEnum as IsEnumV, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, PaymentMethod } from '@prisma/client';

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus, { message: 'Statut invalide' })
  status: OrderStatus;

  @ApiPropertyOptional({ enum: PaymentMethod, description: 'Methode de paiement si livraison' })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({ description: 'Prix unitaire pour la vente auto' })
  @IsOptional()
  @IsInt()
  @Min(0)
  unitPrice?: number;
}
