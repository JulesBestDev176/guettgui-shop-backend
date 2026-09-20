import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ example: '+221770000000' })
  @IsString()
  @IsNotEmpty({ message: 'Le numero de telephone est obligatoire' })
  @Matches(/^\+\d{10,15}$/, { message: 'Format de numero invalide' })
  phone: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty({ message: 'Le code OTP est obligatoire' })
  @Length(6, 6, { message: 'Le code OTP doit contenir 6 chiffres' })
  code: string;
}
