import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateSellerApplicationDto {
  @IsString()
  @MinLength(2)
  fullName: string;

  @IsString()
  phone: string;

  @IsString()
  shopName: string;

  @IsString()
  region: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  description?: string;
}
