import { IsPhoneNumber, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsPhoneNumber("SN")
  phone: string;

  @IsString()
  @MinLength(8)
  password: string;
}
