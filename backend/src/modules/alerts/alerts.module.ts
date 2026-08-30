import { Module } from '@nestjs/common';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { AlertsCronService } from './alerts.cron';

@Module({
  controllers: [AlertsController],
  providers: [AlertsService, AlertsCronService],
  exports: [AlertsService],
})
export class AlertsModule {}
