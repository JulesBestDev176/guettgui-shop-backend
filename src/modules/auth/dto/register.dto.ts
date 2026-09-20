import { IsEmail, IsIn, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Mamadou Diallo' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '+221771234567' })
  @Matches(/^\+?[0-9]{8,15}$/, { message: 'Numéro de téléphone invalide' })
  phone: string;

  @ApiPropertyOptional({ example: 'mamadou@example.com' })
  @IsEmail({}, { message: 'Email invalide' })
  @IsOptional()
  email?: string;

  @ApiProperty({ minLength: 6 })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;

  @ApiPropertyOptional({ example: 'Ferme Diallo' })
  @IsString()
  @IsOptional()
  shopName?: string;

  @ApiPropertyOptional({ example: 'Dakar' })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiPropertyOptional({ example: 'Yeumbeul' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ enum: ['BUYER', 'SELLER'] })
  @IsIn(['BUYER', 'SELLER'])
  @IsOptional()
  role?: string;
}
