import { Module } from '@nestjs/common';
import { DailyRecordsController } from './daily-records.controller';
import { DailyRecordsService } from './daily-records.service';
import { StocksModule } from '../stocks/stocks.module';

@Module({
  imports: [StocksModule],
  controllers: [DailyRecordsController],
  providers: [DailyRecordsService],
  exports: [DailyRecordsService],
})
export class DailyRecordsModule {}
