import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateDailyRecordDto } from './create-daily-record.dto';

export class UpdateDailyRecordDto extends PartialType(
  OmitType(CreateDailyRecordDto, ['flockId', 'date'] as const),
) {}
