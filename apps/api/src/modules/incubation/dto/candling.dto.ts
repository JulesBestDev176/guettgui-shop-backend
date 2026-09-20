import { IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Candling1Dto {
  @ApiProperty({ description: 'Oeufs fertiles' })
  @IsInt()
  @Min(0)
  eggsFertile: number;

  @ApiProperty({ description: 'Oeufs clairs (retires)' })
  @IsInt()
  @Min(0)
  eggsClear: number;

  @ApiPropertyOptional({ description: 'Embryons morts J7' })
  @IsOptional()
  @IsInt()
  @Min(0)
  eggsDeadJ7?: number;
}

export class Candling2Dto {
  @ApiProperty({ description: 'Oeufs vivants J14' })
  @IsInt()
  @Min(0)
  eggsAliveJ14: number;

  @ApiPropertyOptional({ description: 'Embryons morts J14' })
  @IsOptional()
  @IsInt()
  @Min(0)
  eggsDeadJ14?: number;
}
