import { IsString, IsNotEmpty, IsInt, Min, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FlockType, VaccinationRoute } from '@prisma/client';

export class CreateProtocolDto {
  @ApiProperty({ example: 'Newcastle' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ enum: FlockType })
  @IsEnum(FlockType)
  flockType: FlockType;

  @ApiProperty({ example: 7, description: 'Jour d\'administration' })
  @IsInt()
  @Min(0)
  dayOfAdmin: number;

  @ApiProperty({ enum: VaccinationRoute })
  @IsEnum(VaccinationRoute)
  route: VaccinationRoute;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
