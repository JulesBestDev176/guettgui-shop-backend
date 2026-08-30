import { PartialType } from '@nestjs/swagger';
import { CreateFlockDto } from './create-flock.dto';

export class UpdateFlockDto extends PartialType(CreateFlockDto) {}
