import { IsBoolean, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateDeliveryZoneDto {
  @IsString()
  name: string;

  @IsString()
  region: string;

  @IsString()
  city: string;

  @IsInt()
  @Min(0)
  fee: number;

  @IsString()
  estimatedTime: string;

  @IsInt()
  @Min(0)
  minimumOrderAmount: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
