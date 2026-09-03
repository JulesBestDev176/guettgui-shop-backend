import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, MinLength } from "class-validator";
import { UserRole } from "../../../common/types/auth-user";

export class RegisterDto {
  @IsString()
  @MinLength(2)
  fullName: string;

  @IsPhoneNumber("SN")
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsEnum(["CLIENT", "SELLER", "DELIVERY"])
  role?: Exclude<UserRole, "ADMIN">;
}
