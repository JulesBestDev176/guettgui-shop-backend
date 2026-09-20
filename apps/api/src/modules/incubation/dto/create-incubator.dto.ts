import { IsString, IsNotEmpty, IsInt, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIncubatorDto {
  @ApiProperty({ example: 'Couveuse 1' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom de la couveuse est obligatoire' })
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 56, description: 'Capacite en oeufs' })
  @IsInt()
  @Min(1, { message: 'La capacite doit etre au moins 1' })
  capacity: number;
}
