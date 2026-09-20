import { Module } from '@nestjs/common';
import { IncubationController } from './incubation.controller';
import { IncubationService } from './incubation.service';
import { StocksModule } from '../stocks/stocks.module';

@Module({
  imports: [StocksModule],
  controllers: [IncubationController],
  providers: [IncubationService],
  exports: [IncubationService],
})
export class IncubationModule {}
