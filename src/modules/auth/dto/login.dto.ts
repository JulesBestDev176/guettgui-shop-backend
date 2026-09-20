import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '+221771234567' })
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  password: string;
}
