import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinTeamDto {
  @ApiProperty({ example: 'abc123', description: 'Code d\'invitation de l\'equipe' })
  @IsString()
  @IsNotEmpty({ message: 'Le code d\'invitation est obligatoire' })
  inviteCode: string;
}
