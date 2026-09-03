import { IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class CreateSellerApplicationDto {
  @IsString()
  @MinLength(2)
  fullName: string;

  @IsPhoneNumber("SN")
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  shopName: string;

  @IsString()
  region: string;

  @IsString()
  city: string;

  @IsString()
  sellerType: string;
}
