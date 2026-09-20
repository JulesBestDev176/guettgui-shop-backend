import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ example: '+221770000000', description: 'Numero de telephone au format international' })
  @IsString()
  @IsNotEmpty({ message: 'Le numero de telephone est obligatoire' })
  @Matches(/^\+\d{10,15}$/, { message: 'Format de numero invalide. Utilisez le format international (ex: +221XXXXXXXXX)' })
  phone: string;
}
