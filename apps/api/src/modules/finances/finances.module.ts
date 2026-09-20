import { Module } from '@nestjs/common';
import { FinancesController } from './finances.controller';
import { FinancesService } from './finances.service';
import { StocksModule } from '../stocks/stocks.module';

@Module({
  imports: [StocksModule],
  controllers: [FinancesController],
  providers: [FinancesService],
  exports: [FinancesService],
})
export class FinancesModule {}
