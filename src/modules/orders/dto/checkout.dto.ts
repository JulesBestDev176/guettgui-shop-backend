import { IsArray, IsInt, IsPhoneNumber, IsString, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class CheckoutItemDto {
  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CheckoutDto {
  @IsString()
  customerName: string;

  @IsPhoneNumber("SN")
  customerPhone: string;

  @IsString()
  deliveryAddress: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items: CheckoutItemDto[];
}
