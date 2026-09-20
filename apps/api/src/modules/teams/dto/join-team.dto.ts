import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class JoinTeamDto {
  @ApiProperty({ example: 'ABC12345', description: 'Code d\'invitation de l\'equipe' })
  @IsString()
  @IsNotEmpty({ message: 'Le code d\'invitation est obligatoire' })
  inviteCode: string;

  @ApiPropertyOptional({ example: '+221770000000', description: 'Numero du proprietaire (verification supplementaire)' })
  @IsOptional()
  @IsString()
  @Matches(/^\+\d{10,15}$/, { message: 'Format de numero invalide' })
  ownerPhone?: string;
}
